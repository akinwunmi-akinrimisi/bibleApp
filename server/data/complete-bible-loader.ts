import { storage } from '../storage';
import axios from 'axios';

// Complete Bible structure with all 66 books
const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis', chapters: 50, id: 'genesis' },
  { name: 'Exodus', chapters: 40, id: 'exodus' },
  { name: 'Leviticus', chapters: 27, id: 'leviticus' },
  { name: 'Numbers', chapters: 36, id: 'numbers' },
  { name: 'Deuteronomy', chapters: 34, id: 'deuteronomy' },
  { name: 'Joshua', chapters: 24, id: 'joshua' },
  { name: 'Judges', chapters: 21, id: 'judges' },
  { name: 'Ruth', chapters: 4, id: 'ruth' },
  { name: '1 Samuel', chapters: 31, id: '1samuel' },
  { name: '2 Samuel', chapters: 24, id: '2samuel' },
  { name: '1 Kings', chapters: 22, id: '1kings' },
  { name: '2 Kings', chapters: 25, id: '2kings' },
  { name: '1 Chronicles', chapters: 29, id: '1chronicles' },
  { name: '2 Chronicles', chapters: 36, id: '2chronicles' },
  { name: 'Ezra', chapters: 10, id: 'ezra' },
  { name: 'Nehemiah', chapters: 13, id: 'nehemiah' },
  { name: 'Esther', chapters: 10, id: 'esther' },
  { name: 'Job', chapters: 42, id: 'job' },
  { name: 'Psalms', chapters: 150, id: 'psalms' },
  { name: 'Proverbs', chapters: 31, id: 'proverbs' },
  { name: 'Ecclesiastes', chapters: 12, id: 'ecclesiastes' },
  { name: 'Song of Solomon', chapters: 8, id: 'songofsolomon' },
  { name: 'Isaiah', chapters: 66, id: 'isaiah' },
  { name: 'Jeremiah', chapters: 52, id: 'jeremiah' },
  { name: 'Lamentations', chapters: 5, id: 'lamentations' },
  { name: 'Ezekiel', chapters: 48, id: 'ezekiel' },
  { name: 'Daniel', chapters: 12, id: 'daniel' },
  { name: 'Hosea', chapters: 14, id: 'hosea' },
  { name: 'Joel', chapters: 3, id: 'joel' },
  { name: 'Amos', chapters: 9, id: 'amos' },
  { name: 'Obadiah', chapters: 1, id: 'obadiah' },
  { name: 'Jonah', chapters: 4, id: 'jonah' },
  { name: 'Micah', chapters: 7, id: 'micah' },
  { name: 'Nahum', chapters: 3, id: 'nahum' },
  { name: 'Habakkuk', chapters: 3, id: 'habakkuk' },
  { name: 'Zephaniah', chapters: 3, id: 'zephaniah' },
  { name: 'Haggai', chapters: 2, id: 'haggai' },
  { name: 'Zechariah', chapters: 14, id: 'zechariah' },
  { name: 'Malachi', chapters: 4, id: 'malachi' },
  
  // New Testament
  { name: 'Matthew', chapters: 28, id: 'matthew' },
  { name: 'Mark', chapters: 16, id: 'mark' },
  { name: 'Luke', chapters: 24, id: 'luke' },
  { name: 'John', chapters: 21, id: 'john' },
  { name: 'Acts', chapters: 28, id: 'acts' },
  { name: 'Romans', chapters: 16, id: 'romans' },
  { name: '1 Corinthians', chapters: 16, id: '1corinthians' },
  { name: '2 Corinthians', chapters: 13, id: '2corinthians' },
  { name: 'Galatians', chapters: 6, id: 'galatians' },
  { name: 'Ephesians', chapters: 6, id: 'ephesians' },
  { name: 'Philippians', chapters: 4, id: 'philippians' },
  { name: 'Colossians', chapters: 4, id: 'colossians' },
  { name: '1 Thessalonians', chapters: 5, id: '1thessalonians' },
  { name: '2 Thessalonians', chapters: 3, id: '2thessalonians' },
  { name: '1 Timothy', chapters: 6, id: '1timothy' },
  { name: '2 Timothy', chapters: 4, id: '2timothy' },
  { name: 'Titus', chapters: 3, id: 'titus' },
  { name: 'Philemon', chapters: 1, id: 'philemon' },
  { name: 'Hebrews', chapters: 13, id: 'hebrews' },
  { name: 'James', chapters: 5, id: 'james' },
  { name: '1 Peter', chapters: 5, id: '1peter' },
  { name: '2 Peter', chapters: 3, id: '2peter' },
  { name: '1 John', chapters: 5, id: '1john' },
  { name: '2 John', chapters: 1, id: '2john' },
  { name: '3 John', chapters: 1, id: '3john' },
  { name: 'Jude', chapters: 1, id: 'jude' },
  { name: 'Revelation', chapters: 22, id: 'revelation' }
];

interface BibleAPIResponse {
  verses?: Array<{
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text?: string;
}

// Load a single chapter from Bible API
async function loadChapter(bookId: string, bookName: string, chapter: number, version: string): Promise<number> {
  try {
    const url = `https://bible-api.com/${bookId}+${chapter}?translation=${version.toLowerCase()}`;
    
    const response = await axios.get<BibleAPIResponse>(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'VerseProjection/1.0'
      }
    });
    
    if (!response.data || !response.data.verses) {
      console.warn(`No verses found for ${bookName} ${chapter} (${version})`);
      return 0;
    }
    
    let versesAdded = 0;
    
    for (const verse of response.data.verses) {
      const reference = `${bookName} ${verse.chapter}:${verse.verse}`;
      
      try {
        await storage.addVerse({
          reference,
          text: verse.text.trim(),
          version: version.toUpperCase()
        });
        versesAdded++;
      } catch (error) {
        // Skip duplicates or other storage errors
        continue;
      }
    }
    
    return versesAdded;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.warn(`Network error loading ${bookName} ${chapter}: ${error.message}`);
      } else if (error.response?.status === 404) {
        console.warn(`Chapter not found: ${bookName} ${chapter} (${version})`);
      } else {
        console.warn(`API error loading ${bookName} ${chapter}: ${error.response?.status} ${error.response?.statusText}`);
      }
    } else {
      console.warn(`Error loading ${bookName} ${chapter}:`, error);
    }
    return 0;
  }
}

// Load priority books first (most commonly used in church services)
const PRIORITY_BOOKS = [
  'john', 'matthew', 'luke', 'mark', 'acts', 'romans', 'psalms', 
  '1corinthians', 'ephesians', 'philippians', 'genesis', 'exodus',
  'isaiah', 'jeremiah', 'proverbs', 'hebrews', 'james', 'revelation'
];

export async function loadCompleteBible(): Promise<void> {
  console.log('Starting complete Bible download...');
  
  const startTime = Date.now();
  let totalVersesAdded = 0;
  
  try {
    // First, check current verse count
    const initialCount = await storage.getVersesCount();
    console.log(`Starting with ${initialCount} verses in database`);
    
    // If we already have a substantial amount, skip the download
    if (initialCount > 20000) {
      console.log('Bible already appears to be fully loaded. Skipping download.');
      return;
    }
    
    // Load priority books first for both versions
    console.log('Loading priority books first...');
    const priorityBooks = BIBLE_BOOKS.filter(book => 
      PRIORITY_BOOKS.includes(book.id)
    );
    
    for (const book of priorityBooks) {
      console.log(`Loading priority book: ${book.name} (${book.chapters} chapters)`);
      
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        // Load KJV
        const kjvVerses = await loadChapter(book.id, book.name, chapter, 'kjv');
        totalVersesAdded += kjvVerses;
        
        // Small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load WEB
        const webVerses = await loadChapter(book.id, book.name, chapter, 'web');
        totalVersesAdded += webVerses;
        
        // Progress update every 10 chapters
        if (chapter % 10 === 0) {
          const currentCount = await storage.getVersesCount();
          console.log(`Progress: ${book.name} ${chapter}/${book.chapters} - Total verses: ${currentCount}`);
        }
        
        // Delay between chapters
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Longer delay between books
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('Priority books loaded. Loading remaining books...');
    
    // Load remaining books
    const remainingBooks = BIBLE_BOOKS.filter(book => 
      !PRIORITY_BOOKS.includes(book.id)
    );
    
    for (const book of remainingBooks) {
      console.log(`Loading: ${book.name} (${book.chapters} chapters)`);
      
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        // Load KJV
        const kjvVerses = await loadChapter(book.id, book.name, chapter, 'kjv');
        totalVersesAdded += kjvVerses;
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load WEB
        const webVerses = await loadChapter(book.id, book.name, chapter, 'web');
        totalVersesAdded += webVerses;
        
        // Progress update every 5 chapters for remaining books
        if (chapter % 5 === 0) {
          const currentCount = await storage.getVersesCount();
          console.log(`Progress: ${book.name} ${chapter}/${book.chapters} - Total verses: ${currentCount}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Delay between books
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const finalCount = await storage.getVersesCount();
    const duration = (Date.now() - startTime) / 1000 / 60; // minutes
    
    console.log(`✅ Complete Bible download finished!`);
    console.log(`📖 Total verses in database: ${finalCount}`);
    console.log(`⏱️  Download time: ${duration.toFixed(1)} minutes`);
    console.log(`📊 Verses added this session: ${totalVersesAdded}`);
    
    // Show version breakdown
    const versionCounts = await storage.getVersesCountByVersion();
    console.log('📋 Verses by version:', versionCounts);
    
  } catch (error) {
    console.error('Error during complete Bible download:', error);
    const currentCount = await storage.getVersesCount();
    console.log(`Current verses in database: ${currentCount}`);
  }
}

// Load essential books quickly for immediate use
export async function loadEssentialBible(): Promise<void> {
  console.log('Loading essential Bible books for immediate use...');
  
  const essentialBooks = [
    { book: 'john', chapters: [1, 3, 14, 15, 16] },
    { book: 'matthew', chapters: [5, 6, 7, 28] },
    { book: 'psalms', chapters: [23, 51, 91, 139] },
    { book: 'romans', chapters: [8, 12] },
    { book: '1corinthians', chapters: [13, 15] },
    { book: 'ephesians', chapters: [2, 6] },
    { book: 'philippians', chapters: [4] },
    { book: 'genesis', chapters: [1, 3] },
    { book: 'exodus', chapters: [20] },
    { book: 'isaiah', chapters: [40, 53] },
    { book: 'revelation', chapters: [21, 22] }
  ];
  
  let versesAdded = 0;
  
  for (const { book, chapters } of essentialBooks) {
    const bookInfo = BIBLE_BOOKS.find(b => b.id === book);
    if (!bookInfo) continue;
    
    for (const chapter of chapters) {
      // Load KJV
      const kjvVerses = await loadChapter(book, bookInfo.name, chapter, 'kjv');
      versesAdded += kjvVerses;
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Load WEB  
      const webVerses = await loadChapter(book, bookInfo.name, chapter, 'web');
      versesAdded += webVerses;
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`✅ Essential Bible books loaded: ${versesAdded} verses added`);
}