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
    
    // Step 2: Use OpenAI to help identify potential Bible verses in the text
    // This improves detection of paraphrased or non-explicitly referenced verses
    const aiDetection = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a Bible scholar expert at identifying Bible verses. Given a transcription of spoken text, identify any potential Bible verses mentioned, either as direct quotes or paraphrased. For each potential verse, provide the reference and confidence level (0-100)."
        },
        {
          role: "user",
          content: `Identify Bible verses in this transcription: "${transcriptionText}"`
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
    
    // If no explicit references or AI matches, do semantic search
    if (matches.length < 5) {
      const semanticMatches = await storage.searchVersesByText(transcriptionText, settings.bibleVersion);
      
      // Add confidence scores and filter by threshold
      const confidenceMatches = semanticMatches
        .map((verse, index) => ({
          ...verse,
          confidence: Math.round(Math.max(92 - (index * 3), 50)) // Simple confidence scoring based on position
        }))
        .filter(verse => verse.confidence >= settings.confidenceThreshold);
      
      // Combine matches, removing duplicates
      const existingRefs = new Set(matches.map(m => m.reference));
      
      for (const match of confidenceMatches) {
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