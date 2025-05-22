import { storage } from '../storage';
import axios from 'axios';

// Interface for Bible API response
interface BibleAPIVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

// Function to format book name from API to readable format
function formatBookName(bookId: string): string {
  // Handle special cases for books with numbers
  if (bookId.startsWith('1')) {
    return '1 ' + bookId.substring(1);
  } else if (bookId.startsWith('2')) {
    return '2 ' + bookId.substring(1);
  } else if (bookId.startsWith('3')) {
    return '3 ' + bookId.substring(1);
  }
  
  // Convert camelCase or snake_case to readable format
  return bookId
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

// Function to load verses from a chapter using a Bible API
export async function loadBibleChapter(
  bookId: string, 
  chapter: number, 
  version: string = 'kjv'
): Promise<void> {
  try {
    console.log(`Loading ${formatBookName(bookId)} chapter ${chapter} (${version})...`);
    
    // Use a free Bible API to get chapter text
    // Note: In a production app, you'd want to use a more reliable API with proper authentication
    const url = `https://bible-api.com/${bookId}+${chapter}?translation=${version.toLowerCase()}`;
    
    const response = await axios.get(url);
    
    if (!response.data || !response.data.verses) {
      console.error(`Failed to get verses for ${bookId} ${chapter}`);
      return;
    }
    
    const verses: BibleAPIVerse[] = response.data.verses;
    
    // Add each verse to the database
    for (const verse of verses) {
      const reference = `${formatBookName(verse.book_name)} ${verse.chapter}:${verse.verse}`;
      
      await storage.addVerse({
        reference,
        text: verse.text.trim(),
        version: version.toUpperCase()
      });
    }
    
    console.log(`Successfully loaded ${verses.length} verses from ${formatBookName(bookId)} ${chapter}`);
  } catch (error) {
    console.error(`Error loading ${bookId} ${chapter}:`, error);
  }
}

// Function to load important chapters from both Bible versions
export async function loadRealBibleData(): Promise<void> {
  // Check if we already have a substantial number of verses
  const versesCount = await storage.getVersesCount();
  
  if (versesCount > 500) {
    console.log(`Already have ${versesCount} verses loaded, skipping real Bible data import`);
    return;
  }
  
  console.log('Starting to load real Bible data...');
  
  // Priority books and chapters to load
  const chaptersToLoad = [
    { book: 'john', chapter: 3 }, // John 3 (includes John 3:16)
    { book: 'john', chapter: 1 }, // John 1 (In the beginning was the Word)
    { book: 'genesis', chapter: 1 }, // Genesis 1 (Creation)
    { book: 'psalms', chapter: 23 }, // Psalm 23 (The Lord is my shepherd)
    { book: 'matthew', chapter: 5 }, // Matthew 5 (Beatitudes)
    { book: 'romans', chapter: 8 }, // Romans 8 (More than conquerors)
    { book: 'ephesians', chapter: 2 }, // Ephesians 2 (Saved by grace)
    { book: 'philippians', chapter: 4 }, // Philippians 4 (Rejoice in the Lord)
    { book: 'revelation', chapter: 21 }, // Revelation 21 (New heaven and earth)
    { book: 'isaiah', chapter: 53 }, // Isaiah 53 (Suffering servant)
  ];
  
  // Load each chapter for both KJV and WEB versions
  for (const { book, chapter } of chaptersToLoad) {
    // Load KJV version
    await loadBibleChapter(book, chapter, 'kjv');
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Load WEB version
    await loadBibleChapter(book, chapter, 'web');
    
    // Add a small delay between chapters
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Get the final count
  const finalCount = await storage.getVersesCount();
  console.log(`Finished loading real Bible data. Total verses: ${finalCount}`);
}