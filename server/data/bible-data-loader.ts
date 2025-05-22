import { storage } from '../storage';
import fs from 'fs';
import path from 'path';
import { loadBibleTexts } from '../bible-service';

// Structure for Bible data
interface BibleBook {
  book: string;
  chapters: {
    chapter: number;
    verses: {
      verse: number;
      text: string;
    }[];
  }[];
}

interface Bible {
  version: string;
  books: BibleBook[];
}

// Function to load Bible data from JSON files
export async function loadFullBibleData() {
  console.log('Loading full Bible data...');
  
  try {
    // Check if verses are already loaded
    const versesCount = await storage.getVersesCount();
    
    // Only proceed if we have less than 100 verses (our initial sample data)
    if (versesCount > 100) {
      console.log(`Bible texts already loaded (${versesCount} verses)`);
      return;
    }
    
    // Load KJV Bible data
    await loadBibleVersion('KJV');
    
    // Load WEB Bible data
    await loadBibleVersion('WEB');
    
    // Get updated count
    const newCount = await storage.getVersesCount();
    console.log(`Successfully loaded ${newCount} Bible verses`);
  } catch (error) {
    console.error('Failed to load full Bible data:', error);
  }
}

// Helper function to load a specific Bible version
async function loadBibleVersion(version: string) {
  console.log(`Loading ${version} Bible...`);
  
  // Common books to include in our initial implementation
  const priorityBooks = [
    'Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 
    'Mark', 'Luke', 'John', 'Romans', 'Corinthians1', 'Corinthians2', 
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', 'Thessalonians1', 
    'Thessalonians2', 'Timothy1', 'Timothy2', 'Titus', 'Hebrews', 
    'James', 'Peter1', 'Peter2', 'John1', 'John2', 'John3', 'Revelation'
  ];
  
  // Common chapters to prioritize (based on frequently quoted passages)
  const priorityChapters = {
    'Genesis': [1, 2, 3], // Creation, Fall
    'Psalms': [1, 23, 91, 119], // Popular Psalms
    'Isaiah': [53, 55], // Messianic prophecies
    'Matthew': [5, 6, 7, 28], // Sermon on the Mount, Great Commission
    'John': [1, 3, 14, 15], // Key theological chapters
    'Romans': [3, 5, 8, 12], // Key doctrine chapters
    'Corinthians1': [13, 15], // Love chapter, Resurrection
    'Ephesians': [2, 6], // Salvation by grace, Armor of God
    'Philippians': [2, 4], // Christ's humility, Rejoicing
    'Hebrews': [11], // Faith chapter
    'Revelation': [21, 22] // New Heaven and Earth
  };
  
  // Since we're simulating the data for this demo, we'll create a structured set of verses
  // In a real implementation, you'd load this from JSON files or an API
  
  // For each priority book
  for (const book of priorityBooks) {
    // Format book name for reference (e.g., "Corinthians1" to "1 Corinthians")
    let formattedBook = book;
    if (book.endsWith('1')) {
      formattedBook = '1 ' + book.slice(0, -1);
    } else if (book.endsWith('2')) {
      formattedBook = '2 ' + book.slice(0, -1);
    } else if (book.endsWith('3')) {
      formattedBook = '3 ' + book.slice(0, -1);
    }
    
    // Determine which chapters to include
    const chaptersToInclude = priorityChapters[book as keyof typeof priorityChapters] || [1];
    
    // For each priority chapter
    for (const chapter of chaptersToInclude) {
      // Generate 10-30 verses per chapter
      const verseCount = book === 'Psalms' && chapter === 119 ? 176 : Math.floor(Math.random() * 20) + 10;
      
      for (let verse = 1; verse <= verseCount; verse++) {
        // Create a reference (e.g., "John 3:16")
        const reference = `${formattedBook} ${chapter}:${verse}`;
        
        // In a real implementation, you'd use actual Bible text
        // For this demo, we'll use placeholder text based on the reference
        let text = '';
        
        // Special case for well-known verses
        if (reference === 'John 3:16' && version === 'KJV') {
          text = 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.';
        } else if (reference === 'John 3:16' && version === 'WEB') {
          text = 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.';
        } else if (reference === 'Psalm 23:1' && version === 'KJV') {
          text = 'The LORD is my shepherd; I shall not want.';
        } else if (reference === 'Psalm 23:1' && version === 'WEB') {
          text = 'Yahweh is my shepherd; I shall lack nothing.';
        } else {
          // Generate a placeholder verse text
          text = `This is a placeholder for ${reference} in the ${version} Bible. In a real implementation, this would contain the actual Bible text.`;
        }
        
        // Add verse to database
        await storage.addVerse({
          reference,
          text,
          version
        });
        
        // Log progress occasionally
        if (verse % 50 === 0) {
          console.log(`Added ${verse} verses for ${formattedBook} ${chapter}`);
        }
      }
    }
    
    console.log(`Completed loading ${formattedBook} for ${version}`);
  }
  
  console.log(`Finished loading ${version} Bible data`);
}