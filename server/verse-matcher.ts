import { storage } from './storage';
import type { TranscriptionResult, VerseMatch } from '@shared/schema';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Advanced Bible verse detection using OpenAI Whisper for transcription
// and semantic matching for Bible verse identification
export async function processAudio(audioBuffer: Buffer, settings: { bibleVersion: string, confidenceThreshold: number }): Promise<TranscriptionResult> {
  console.log('Processing audio with OpenAI Whisper...');
  
  let transcriptionText = '';
  
  try {
    // Create a temporary file to store the audio buffer
    const tempDir = path.join(process.cwd(), 'temp');
    
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempFilePath = path.join(tempDir, `audio-${Date.now()}.wav`);
    fs.writeFileSync(tempFilePath, audioBuffer);
    
    // Use OpenAI's Whisper model to transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
      language: "en",
    });
    
    transcriptionText = transcription.text;
    console.log('Transcription complete:', transcriptionText);
    
    // Delete temporary file
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please check your OpenAI API key and try again.');
  }
  
  // Find matching Bible verses
  let matches: VerseMatch[] = [];
  
  try {
    // Step 1: Check for explicit references (e.g., "John 3:16")
    const referenceRegex = /([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?/g;
    const references = transcriptionText.match(referenceRegex);
    
    // Step 2: Enhanced GPT-4o detection for paraphrased content (PRD requirement)
    const aiDetection = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a Bible verse detection expert for sermon analysis. Identify Bible verses that are quoted, paraphrased, or referenced in spoken text. Focus on ${settings.bibleVersion} version. Provide confidence scores 0-100 and only include matches >= ${settings.confidenceThreshold}.`
        },
        {
          role: "user",
          content: `Analyze this sermon text and identify any Bible verses (explicit references, direct quotes, or paraphrases): "${transcriptionText}"`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse AI detection results
    let aiMatches: Array<{reference: string, confidence: number}> = [];
    try {
      const content = aiDetection.choices[0].message.content;
      const aiResponse = content ? JSON.parse(content) : {};
      if (aiResponse.verses && Array.isArray(aiResponse.verses)) {
        aiMatches = aiResponse.verses;
      }
    } catch (error) {
      console.error('Error parsing AI detection results:', error);
    }
    
    // Process explicit references if found
    if (references && references.length > 0) {
      // Handle explicit references
      for (const reference of references) {
        const verse = await storage.getVerseByReference(reference, settings.bibleVersion);
        
        if (verse) {
          matches.push({
            reference: verse.reference,
            text: verse.text,
            version: verse.version,
            confidence: 95
          });
        }
      }
    }
    
    // Add AI-detected verses
    for (const match of aiMatches) {
      const verse = await storage.getVerseByReference(match.reference, settings.bibleVersion);
      
      if (verse) {
        // Check if this verse is already in matches
        const existingMatch = matches.find(m => m.reference === verse.reference);
        
        if (!existingMatch) {
          matches.push({
            reference: verse.reference,
            text: verse.text,
            version: verse.version,
            confidence: match.confidence
          });
        }
      }
    }
    
    // If no explicit references or AI matches, do semantic search using embeddings
    if (matches.length < 5) {
      const semanticMatches = await performSemanticSearch(transcriptionText, settings.bibleVersion, settings.confidenceThreshold);
      
      // Combine matches, removing duplicates
      const existingRefs = new Set(matches.map(m => m.reference));
      
      for (const match of semanticMatches) {
        if (!existingRefs.has(match.reference)) {
          matches.push(match);
          existingRefs.add(match.reference);
        }
        
        // Limit to top 10 matches
        if (matches.length >= 10) break;
      }
    }
    
    // Sort by confidence
    matches.sort((a, b) => b.confidence - a.confidence);
    
  } catch (error) {
    console.error('Error in verse detection:', error);
  }
  
  return {
    text: transcriptionText,
    matches: matches.slice(0, 10) // Return top 10 matches
  };
}

// Advanced semantic search using OpenAI embeddings for better verse matching
async function performSemanticSearch(transcriptionText: string, bibleVersion: string, confidenceThreshold: number): Promise<any[]> {
  try {
    // Generate embedding for the transcription text
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small", // Latest and most cost-effective embedding model
      input: transcriptionText,
    });
    
    const transcriptionEmbedding = embeddingResponse.data[0].embedding;
    
    // Search for verses with pre-computed embeddings using cosine similarity
    const semanticMatches = await storage.searchVersesByEmbedding(transcriptionEmbedding, bibleVersion);
    
    // Filter by confidence threshold and ensure we return the top 10
    return semanticMatches
      .filter(match => match.confidence >= confidenceThreshold)
      .slice(0, 10);
      
  } catch (error) {
    console.error('Error in semantic search:', error);
    // Fallback to text-based search
    const fallbackMatches = await storage.searchVersesByText(transcriptionText, bibleVersion);
    return fallbackMatches
      .map((verse, index) => ({
        ...verse,
        confidence: Math.round(Math.max(85 - (index * 5), 50))
      }))
      .filter(verse => verse.confidence >= confidenceThreshold)
      .slice(0, 10);
  }
}

// Generate embeddings for Bible verses (run once during setup)
export async function generateVerseEmbeddings(batchSize: number = 100): Promise<void> {
  console.log('Generating embeddings for Bible verses...');
  
  try {
    const versesWithoutEmbeddings = await storage.getVersesWithoutEmbeddings();
    console.log(`Found ${versesWithoutEmbeddings.length} verses without embeddings`);
    
    // Process in batches to respect OpenAI rate limits
    for (let i = 0; i < versesWithoutEmbeddings.length; i += batchSize) {
      const batch = versesWithoutEmbeddings.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(versesWithoutEmbeddings.length/batchSize)}`);
      
      // Generate embeddings for batch
      const texts = batch.map(verse => `${verse.reference}: ${verse.text}`);
      
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
      });
      
      // Update verses with embeddings
      for (let j = 0; j < batch.length; j++) {
        const verse = batch[j];
        const embedding = embeddingResponse.data[j].embedding;
        
        await storage.updateVerseEmbedding(verse.id, JSON.stringify(embedding));
      }
      
      // Rate limiting: wait 1 second between batches
      if (i + batchSize < versesWithoutEmbeddings.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('Embedding generation complete!');
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}