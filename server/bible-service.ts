import { storage } from './storage';
import type { VerseMatch } from '@shared/schema';

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
    
    if (versesCount > 0) {
      console.log(`Bible texts already loaded (${versesCount} verses)`);
      return;
    }
    
    // In a real implementation, this would load from JSON files or a database
    // For demo purposes, we'll add commonly referenced verses
    
    // Load KJV verses
    const kjvVerses = [
      { reference: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', version: 'KJV' },
      { reference: 'John 3:17', text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.', version: 'KJV' },
      { reference: 'Romans 5:8', text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.', version: 'KJV' },
      { reference: '1 John 4:9', text: 'In this was manifested the love of God toward us, because that God sent his only begotten Son into the world, that we might live through him.', version: 'KJV' },
      { reference: '1 John 4:10', text: 'Herein is love, not that we loved God, but that he loved us, and sent his Son to be the propitiation for our sins.', version: 'KJV' },
      { reference: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.', version: 'KJV' },
      { reference: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', version: 'KJV' },
      { reference: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.', version: 'KJV' },
      { reference: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', version: 'KJV' },
      { reference: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', version: 'KJV' },
      { reference: 'Isaiah 40:31', text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', version: 'KJV' },
      { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', version: 'KJV' },
    ];
    
    // Load WEB verses
    const webVerses = [
      { reference: 'John 3:16', text: 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.', version: 'WEB' },
      { reference: 'John 3:17', text: 'For God didn\'t send his Son into the world to judge the world, but that the world should be saved through him.', version: 'WEB' },
      { reference: 'Romans 5:8', text: 'But God commends his own love toward us, in that while we were yet sinners, Christ died for us.', version: 'WEB' },
      { reference: '1 John 4:9', text: 'By this God\'s love was revealed in us, that God has sent his one and only Son into the world that we might live through him.', version: 'WEB' },
      { reference: '1 John 4:10', text: 'In this is love, not that we loved God, but that he loved us, and sent his Son as the atoning sacrifice for our sins.', version: 'WEB' },
      { reference: 'Psalm 23:1', text: 'Yahweh is my shepherd; I shall lack nothing.', version: 'WEB' },
      { reference: 'Matthew 11:28', text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.', version: 'WEB' },
      { reference: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.', version: 'WEB' },
      { reference: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, says Yahweh, thoughts of peace, and not of evil, to give you hope and a future.', version: 'WEB' },
      { reference: 'Romans 8:28', text: 'We know that all things work together for good for those who love God, for those who are called according to his purpose.', version: 'WEB' },
      { reference: 'Isaiah 40:31', text: 'But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.', version: 'WEB' },
      { reference: 'Proverbs 3:5-6', text: 'Trust in Yahweh with all your heart, and don\'t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.', version: 'WEB' },
    ];
    
    // Add verses to database
    for (const verse of [...kjvVerses, ...webVerses]) {
      await storage.addVerse(verse);
    }
    
    console.log(`Loaded ${kjvVerses.length + webVerses.length} verses`);
  } catch (error) {
    console.error('Failed to load Bible texts:', error);
  }
}
