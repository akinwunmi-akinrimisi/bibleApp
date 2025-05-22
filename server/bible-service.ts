import { storage } from './storage';
import type { VerseMatch } from '@shared/schema';
import { loadCompleteBible, loadEssentialBible } from './data/complete-bible-loader';

// Handle bible verse retrieval and search
export async function searchVerses(query: string, version: string = 'KJV'): Promise<VerseMatch[]> {
  try {
    // Check if it's a reference search (e.g., "John 3:16")
    const referenceRegex = /^([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/;
    const isReference = referenceRegex.test(query.trim());
    
    let verses: VerseMatch[] = [];
    
    if (isReference) {
      // Search by reference
      const verse = await storage.getVerseByReference(query.trim(), version);
      
      if (verse) {
        verses = [{
          reference: verse.reference,
          text: verse.text,
          version: verse.version,
          confidence: 100
        }];
      }
    } else {
      // Search by text content
      verses = await storage.searchVersesByText(query, version);
      
      // Add confidence scores based on relevance
      verses = verses.map((verse, index) => ({
        ...verse,
        confidence: Math.max(95 - (index * 5), 50) // Simple confidence scoring, decreasing by position
      }));
    }
    
    return verses;
  } catch (error) {
    console.error('Verse search error:', error);
    return [];
  }
}

// Get specific Bible verse by reference
export async function getBibleVerses(reference: string, version: string = 'KJV'): Promise<VerseMatch | null> {
  try {
    const verse = await storage.getVerseByReference(reference, version);
    
    if (!verse) {
      return null;
    }
    
    return {
      reference: verse.reference,
      text: verse.text,
      version: verse.version,
      confidence: 100
    };
  } catch (error) {
    console.error('Get verse error:', error);
    return null;
  }
}

// Load Bible texts (KJV and WEB)
export async function loadBibleTexts(): Promise<void> {
  console.log('Loading Bible texts...');
  try {
    // Check if verses are already loaded
    const versesCount = await storage.getVersesCount();
    
    if (versesCount > 20000) {
      console.log(`Bible texts already loaded (${versesCount} verses)`);
      return;
    }
    
    if (versesCount > 1000) {
      console.log(`Bible partially loaded (${versesCount} verses). Checking if complete download is needed...`);
      
      // Start complete Bible download in background if we don't have enough verses
      setTimeout(() => {
        loadCompleteBible().catch(err => {
          console.error('Error loading complete Bible:', err);
        });
      }, 10000);
      
      return;
    }
    
    // If we have very few verses, start with essential books for immediate use
    if (versesCount < 500) {
      console.log('Loading essential Bible books first...');
      await loadEssentialBible();
    }
    
    // Start complete Bible download in the background
    setTimeout(() => {
      console.log('Starting complete Bible download in background...');
      loadCompleteBible().catch(err => {
        console.error('Error loading complete Bible:', err);
      });
    }, 15000); // Give the server time to initialize
    
  } catch (error) {
    console.error('Failed to load Bible texts:', error);
  }
}


