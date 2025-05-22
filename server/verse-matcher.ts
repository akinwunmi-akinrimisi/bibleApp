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
  
  // Check for explicit references (e.g., "John 3:16")
  const referenceRegex = /([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?/g;
  const references = transcriptionText.match(referenceRegex);
  
  if (references && references.length > 0) {
    // Handle explicit reference
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
  
  // If no explicit references or not enough matches, do semantic search
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
  
  return {
    text: transcriptionText,
    matches: matches.slice(0, 10) // Return top 10 matches
  };
}
