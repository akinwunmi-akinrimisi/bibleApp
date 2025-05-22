import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocket } from "./websocket";
import { authenticateUser, validatePassword, generatePasswordHash, requireAuth } from "./auth";
import { searchVerses, getBibleVerses } from "./bible-service";
import { emailService } from "./email-service";
import express from "express";
import bibleRoutes from "./routes/bible-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSocket for real-time communication
  setupWebSocket(httpServer);
  
  // API routes - all prefixed with /api
  const apiRouter = express.Router();
  
  // Register Bible routes
  apiRouter.use('/bible', bibleRoutes);
  
  // Auth routes
  apiRouter.post('/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isPasswordValid = await validatePassword(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Set user session
      req.session.userId = user.id;
      
      return res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  apiRouter.post('/auth/register', async (req, res) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // Hash password
      const hashedPassword = await generatePasswordHash(password);
      
      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email
      });
      
      // Create default settings for user
      await storage.createSettings({
        userId: user.id,
        bibleVersion: 'KJV',
        fontSize: 24,
        textColor: '#FFFFFF',
        backgroundColor: '#000000',
        fontFamily: 'Roboto',
        confidenceThreshold: 70,
        audioInput: 'default'
      });
      
      // Set user session
      req.session.userId = user.id;
      
      return res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  apiRouter.post('/auth/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Logged out successfully' });
    });
  });
  
  apiRouter.get('/auth/me', authenticateUser, (req, res) => {
    return res.json(req.user);
  });
  
  // Settings routes
  apiRouter.get('/settings', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const settings = await storage.getSettingsByUserId(userId);
      
      if (!settings) {
        // Create default settings if none exist
        const defaultSettings = await storage.createSettings({
          userId,
          bibleVersion: 'KJV',
          fontSize: 24,
          textColor: '#FFFFFF',
          backgroundColor: '#000000',
          fontFamily: 'Roboto',
          confidenceThreshold: 70,
          audioInput: 'default'
        });
        
        return res.json(defaultSettings);
      }
      
      return res.json(settings);
    } catch (error) {
      console.error('Get settings error:', error);
      return res.status(500).json({ message: 'Failed to fetch settings' });
    }
  });
  
  apiRouter.put('/settings', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const {
        bibleVersion,
        fontSize,
        textColor,
        backgroundColor,
        fontFamily,
        confidenceThreshold,
        audioInput
      } = req.body;
      
      // Update settings
      const updatedSettings = await storage.updateSettings(userId, {
        bibleVersion,
        fontSize,
        textColor,
        backgroundColor,
        fontFamily,
        confidenceThreshold,
        audioInput
      });
      
      return res.json(updatedSettings);
    } catch (error) {
      console.error('Update settings error:', error);
      return res.status(500).json({ message: 'Failed to update settings' });
    }
  });
  
  // Bible verse routes
  apiRouter.get('/verses/search', requireAuth, async (req, res) => {
    try {
      const query = req.query.q as string;
      const version = req.query.version as string || 'KJV';
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const verses = await searchVerses(query, version);
      return res.json(verses);
    } catch (error) {
      console.error('Verse search error:', error);
      return res.status(500).json({ message: 'Failed to search verses' });
    }
  });
  
  apiRouter.get('/verses/:reference', requireAuth, async (req, res) => {
    try {
      const reference = req.params.reference;
      const version = req.query.version as string || 'KJV';
      
      if (!reference) {
        return res.status(400).json({ message: 'Verse reference is required' });
      }
      
      const verse = await getBibleVerses(reference, version);
      
      if (!verse) {
        return res.status(404).json({ message: 'Verse not found' });
      }
      
      return res.json(verse);
    } catch (error) {
      console.error('Get verse error:', error);
      return res.status(500).json({ message: 'Failed to fetch verse' });
    }
  });
  
  // Detection history routes
  apiRouter.get('/detection-history', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const history = await storage.getDetectionHistory(userId);
      return res.json(history);
    } catch (error) {
      console.error('Get history error:', error);
      return res.status(500).json({ message: 'Failed to fetch detection history' });
    }
  });
  
  apiRouter.post('/detection-history', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { reference, text, version, confidence } = req.body;
      
      if (!reference || !text || !version) {
        return res.status(400).json({ message: 'Reference, text, and version are required' });
      }
      
      const historyItem = await storage.addDetectionHistory({
        userId,
        reference,
        text,
        version,
        confidence: confidence || null
      });
      
      return res.status(201).json(historyItem);
    } catch (error) {
      console.error('Add history error:', error);
      return res.status(500).json({ message: 'Failed to add detection history' });
    }
  });
  
  // Feedback data for model learning
  apiRouter.post('/feedback', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { transcription, selectedVerse, confidenceScores } = req.body;
      
      if (!transcription || !selectedVerse) {
        return res.status(400).json({ message: 'Transcription and selected verse are required' });
      }
      
      const feedback = await storage.addFeedbackData({
        userId,
        transcription,
        selectedVerse,
        confidenceScores
      });
      
      return res.status(201).json(feedback);
    } catch (error) {
      console.error('Add feedback error:', error);
      return res.status(500).json({ message: 'Failed to add feedback data' });
    }
  });
  
  // Register API routes
  app.use('/api', apiRouter);

  return httpServer;
}
