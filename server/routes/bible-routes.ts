import { Router } from 'express';
import { storage } from '../storage';
import { requireAuth } from '../auth';
import { searchVerses, getBibleVerses } from '../bible-service';
import { loadRealBibleData } from '../data/real-bible-data';

const router = Router();

// Get Bible verse database status
router.get('/status', async (req, res) => {
  try {
    const versesCount = await storage.getVersesCount();
    const versesPerVersion = await storage.getVersesCountByVersion();
    
    res.json({
      totalVerses: versesCount,
      byVersion: versesPerVersion,
      status: versesCount > 500 ? 'Complete' : 
              versesCount > 100 ? 'Partial' : 'Minimal'
    });
  } catch (error) {
    console.error('Failed to get Bible database status:', error);
    res.status(500).json({ message: 'Failed to get Bible database status' });
  }
});

// Search for Bible verses (authenticated)
router.get('/search', requireAuth, async (req, res) => {
  try {
    const { query, version = 'KJV' } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    const verses = await searchVerses(query, version as string);
    res.json(verses);
  } catch (error) {
    console.error('Failed to search verses:', error);
    res.status(500).json({ message: 'Failed to search verses' });
  }
});

// Get specific Bible verse by reference (authenticated)
router.get('/verse/:reference', requireAuth, async (req, res) => {
  try {
    const { reference } = req.params;
    const { version = 'KJV' } = req.query;
    
    if (!reference) {
      return res.status(400).json({ message: 'Reference parameter is required' });
    }
    
    const verse = await getBibleVerses(reference, version as string);
    
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    res.json(verse);
  } catch (error) {
    console.error('Failed to get verse:', error);
    res.status(500).json({ message: 'Failed to get verse' });
  }
});

// Manually trigger Bible data loading (admin only)
router.post('/load', requireAuth, async (req, res) => {
  try {
    // In a real app, you'd check if the user is an admin
    const user = await storage.getUser((req as any).user.id);
    
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Start the loading process
    res.json({ message: 'Bible data loading process started' });
    
    // Run this asynchronously so we don't block the response
    loadRealBibleData().catch(error => {
      console.error('Failed to load Bible data:', error);
    });
  } catch (error) {
    console.error('Failed to start Bible data loading:', error);
    res.status(500).json({ message: 'Failed to start Bible data loading' });
  }
});

export default router;