import { storage } from '../storage';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface BibleBook {
  name: string;
  chapters: number;
  abbreviation: string;
}

// List of all Bible books with their chapter counts
const bibleBooks: BibleBook[] = [
  // Old Testament
  { name: 'Genesis', abbreviation: 'gen', chapters: 50 },
  { name: 'Exodus', abbreviation: 'exo', chapters: 40 },
  { name: 'Leviticus', abbreviation: 'lev', chapters: 27 },
  { name: 'Numbers', abbreviation: 'num', chapters: 36 },
  { name: 'Deuteronomy', abbreviation: 'deu', chapters: 34 },
  { name: 'Joshua', abbreviation: 'jos', chapters: 24 },
  { name: 'Judges', abbreviation: 'jdg', chapters: 21 },
  { name: 'Ruth', abbreviation: 'rut', chapters: 4 },
  { name: '1 Samuel', abbreviation: '1sa', chapters: 31 },
  { name: '2 Samuel', abbreviation: '2sa', chapters: 24 },
  { name: '1 Kings', abbreviation: '1ki', chapters: 22 },
  { name: '2 Kings', abbreviation: '2ki', chapters: 25 },
  { name: '1 Chronicles', abbreviation: '1ch', chapters: 29 },
  { name: '2 Chronicles', abbreviation: '2ch', chapters: 36 },
  { name: 'Ezra', abbreviation: 'ezr', chapters: 10 },
  { name: 'Nehemiah', abbreviation: 'neh', chapters: 13 },
  { name: 'Esther', abbreviation: 'est', chapters: 10 },
  { name: 'Job', abbreviation: 'job', chapters: 42 },
  { name: 'Psalms', abbreviation: 'psa', chapters: 150 },
  { name: 'Proverbs', abbreviation: 'pro', chapters: 31 },
  { name: 'Ecclesiastes', abbreviation: 'ecc', chapters: 12 },
  { name: 'Song of Solomon', abbreviation: 'sng', chapters: 8 },
  { name: 'Isaiah', abbreviation: 'isa', chapters: 66 },
  { name: 'Jeremiah', abbreviation: 'jer', chapters: 52 },
  { name: 'Lamentations', abbreviation: 'lam', chapters: 5 },
  { name: 'Ezekiel', abbreviation: 'ezk', chapters: 48 },
  { name: 'Daniel', abbreviation: 'dan', chapters: 12 },
  { name: 'Hosea', abbreviation: 'hos', chapters: 14 },
  { name: 'Joel', abbreviation: 'jol', chapters: 3 },
  { name: 'Amos', abbreviation: 'amo', chapters: 9 },
  { name: 'Obadiah', abbreviation: 'oba', chapters: 1 },
  { name: 'Jonah', abbreviation: 'jon', chapters: 4 },
  { name: 'Micah', abbreviation: 'mic', chapters: 7 },
  { name: 'Nahum', abbreviation: 'nam', chapters: 3 },
  { name: 'Habakkuk', abbreviation: 'hab', chapters: 3 },
  { name: 'Zephaniah', abbreviation: 'zep', chapters: 3 },
  { name: 'Haggai', abbreviation: 'hag', chapters: 2 },
  { name: 'Zechariah', abbreviation: 'zec', chapters: 14 },
  { name: 'Malachi', abbreviation: 'mal', chapters: 4 },
  
  // New Testament
  { name: 'Matthew', abbreviation: 'mat', chapters: 28 },
  { name: 'Mark', abbreviation: 'mrk', chapters: 16 },
  { name: 'Luke', abbreviation: 'luk', chapters: 24 },
  { name: 'John', abbreviation: 'jhn', chapters: 21 },
  { name: 'Acts', abbreviation: 'act', chapters: 28 },
  { name: 'Romans', abbreviation: 'rom', chapters: 16 },
  { name: '1 Corinthians', abbreviation: '1co', chapters: 16 },
  { name: '2 Corinthians', abbreviation: '2co', chapters: 13 },
  { name: 'Galatians', abbreviation: 'gal', chapters: 6 },
  { name: 'Ephesians', abbreviation: 'eph', chapters: 6 },
  { name: 'Philippians', abbreviation: 'php', chapters: 4 },
  { name: 'Colossians', abbreviation: 'col', chapters: 4 },
  { name: '1 Thessalonians', abbreviation: '1th', chapters: 5 },
  { name: '2 Thessalonians', abbreviation: '2th', chapters: 3 },
  { name: '1 Timothy', abbreviation: '1ti', chapters: 6 },
  { name: '2 Timothy', abbreviation: '2ti', chapters: 4 },
  { name: 'Titus', abbreviation: 'tit', chapters: 3 },
  { name: 'Philemon', abbreviation: 'phm', chapters: 1 },
  { name: 'Hebrews', abbreviation: 'heb', chapters: 13 },
  { name: 'James', abbreviation: 'jas', chapters: 5 },
  { name: '1 Peter', abbreviation: '1pe', chapters: 5 },
  { name: '2 Peter', abbreviation: '2pe', chapters: 3 },
  { name: '1 John', abbreviation: '1jn', chapters: 5 },
  { name: '2 John', abbreviation: '2jn', chapters: 1 },
  { name: '3 John', abbreviation: '3jn', chapters: 1 },
  { name: 'Jude', abbreviation: 'jud', chapters: 1 },
  { name: 'Revelation', abbreviation: 'rev', chapters: 22 }
];

// Function to download Bible verses from local JSON files
async function loadBibleDataFromJson(version: string): Promise<void> {
  try {
    console.log(`Loading ${version} Bible data from JSON files...`);
    
    // Create the data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'bible-json');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Download Bible data for the specified version
    for (const book of bibleBooks) {
      console.log(`Processing ${book.name} (${version})...`);
      
      // Process each chapter in the book
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        await processChapter(book, chapter, version);
        
        // Add a small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Completed loading ${version} Bible data`);
  } catch (error) {
    console.error(`Error loading ${version} Bible data:`, error);
  }
}

// Process a single chapter
async function processChapter(book: BibleBook, chapter: number, version: string): Promise<void> {
  try {
    // Use a public domain Bible API to get chapter text
    const url = `https://bible-api.com/${book.abbreviation}+${chapter}?translation=${version.toLowerCase()}`;
    
    const response = await axios.get(url);
    
    if (!response.data || !response.data.verses) {
      console.error(`Failed to get verses for ${book.name} ${chapter} (${version})`);
      return;
    }
    
    const verses = response.data.verses;
    
    // Add each verse to the database
    for (const verse of verses) {
      const reference = `${book.name} ${chapter}:${verse.verse}`;
      
      await storage.addVerse({
        reference,
        text: verse.text.trim(),
        version: version.toUpperCase()
      });
    }
    
    console.log(`Added ${verses.length} verses from ${book.name} ${chapter} (${version})`);
  } catch (error) {
    console.error(`Error processing ${book.name} ${chapter} (${version}):`, error);
  }
}

// Function to load all Bible data
export async function loadFullBibleData(): Promise<void> {
  // Check if we already have a substantial number of verses
  const versesCount = await storage.getVersesCount();
  
  if (versesCount > 30000) {
    console.log(`Already have ${versesCount} verses loaded, skipping full Bible data import`);
    return;
  }
  
  console.log('Starting full Bible data import...');
  
  // Define Bible versions to load (KJV and WEB)
  const versions = ['kjv', 'web'];
  
  // Process each version
  for (const version of versions) {
    await loadBibleDataFromJson(version);
    
    // Add a delay between versions to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  // Get final count
  const finalCount = await storage.getVersesCount();
  console.log(`Finished loading full Bible data. Total verses: ${finalCount}`);
}

// Alternative function that loads smaller portions of the Bible
// (use this if the full Bible is too much data for your application)
export async function loadPartialBibleData(): Promise<void> {
  // Check if we already have a substantial number of verses
  const versesCount = await storage.getVersesCount();
  
  if (versesCount > 5000) {
    console.log(`Already have ${versesCount} verses loaded, skipping partial Bible data import`);
    return;
  }
  
  console.log('Starting partial Bible data import...');
  
  // Priority books to load
  const priorityBooks = [
    // New Testament
    { name: 'Matthew', abbreviation: 'mat', chapters: 28 },
    { name: 'Mark', abbreviation: 'mrk', chapters: 16 },
    { name: 'Luke', abbreviation: 'luk', chapters: 24 },
    { name: 'John', abbreviation: 'jhn', chapters: 21 },
    { name: 'Romans', abbreviation: 'rom', chapters: 16 },
    { name: 'Psalms', abbreviation: 'psa', chapters: 150 },
    { name: 'Genesis', abbreviation: 'gen', chapters: 50 },
    { name: 'Revelation', abbreviation: 'rev', chapters: 22 }
  ];
  
  // Define Bible versions to load (KJV and WEB)
  const versions = ['kjv', 'web'];
  
  // Process each version
  for (const version of versions) {
    console.log(`Loading ${version} priority Bible data...`);
    
    // Process each priority book
    for (const book of priorityBooks) {
      console.log(`Processing ${book.name} (${version})...`);
      
      // Process each chapter in the book (max 10 chapters per book to avoid too much data)
      const chaptersToLoad = Math.min(book.chapters, 10);
      
      for (let chapter = 1; chapter <= chaptersToLoad; chapter++) {
        await processChapter(book, chapter, version);
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Add a delay between versions to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  // Get final count
  const finalCount = await storage.getVersesCount();
  console.log(`Finished loading partial Bible data. Total verses: ${finalCount}`);
}