import express from 'express';
import { jwtAuth, AuthenticatedRequest } from '../middleware/auth';
import { storage } from '../storage';

const router = express.Router();

// Offline sync endpoint for Electron app
router.post('/feedback', 
  jwtAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { feedback } = req.body;
      const userId = req.userId!;
      
      if (!Array.isArray(feedback)) {
        return res.status(400).json({
          error: { code: 400, message: 'Feedback array is required' }
        });
      }

      let syncedCount = 0;
      
      for (const item of feedback) {
        try {
          await storage.addFeedbackData({
            userId,
            transcription: item.transcription,
            selectedVerseId: item.selectedVerseId,
            topMatches: JSON.stringify(item.topMatches || []),
            confidence: item.confidence || 0,
            userAction: 'selected'
          });
          syncedCount++;
        } catch (error) {
          console.error('Error syncing feedback item:', error);
        }
      }

      res.json({
        status: 'success',
        synced: syncedCount,
        total: feedback.length
      });

    } catch (error) {
      console.error('Sync feedback error:', error);
      res.status(500).json({
        error: { code: 500, message: 'Failed to sync feedback data' }
      });
    }
  }
);

export default router;