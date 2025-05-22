import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LocalStrategy } from 'passport-local';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { validatePassword } from './auth';
import { storage } from './storage';
import { generatePasswordHash } from './auth';

// Check for required environment variables
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'verse-projection-secret-key';

// Define user serialization for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Local strategy for username/password login
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return done(null, false, { message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await validatePassword(password, user.password);
    
    if (!isPasswordValid) {
      return done(null, false, { message: 'Invalid credentials' });
    }
    
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Configure OAuth providers if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await storage.getUserByEmail(profile.emails?.[0]?.value);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: profile.displayName || `google-${profile.id}`,
          email: profile.emails?.[0]?.value,
          password: await generatePasswordHash(Math.random().toString(36).slice(-10)),
          provider: 'google',
          providerId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value
        });
        
        // Create default settings
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
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'displayName', 'photos']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await storage.getUserByEmail(profile.emails?.[0]?.value);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: profile.displayName || `facebook-${profile.id}`,
          email: profile.emails?.[0]?.value,
          password: await generatePasswordHash(Math.random().toString(36).slice(-10)),
          provider: 'facebook',
          providerId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value
        });
        
        // Create default settings
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
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback',
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists (GitHub might not provide email)
      const email = profile.emails?.[0]?.value;
      let user = email ? await storage.getUserByEmail(email) : null;
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: profile.username || `github-${profile.id}`,
          email: email,
          password: await generatePasswordHash(Math.random().toString(36).slice(-10)),
          provider: 'github',
          providerId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value
        });
        
        // Create default settings
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
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/api/auth/twitter/callback',
    includeEmail: true
  }, async (token, tokenSecret, profile, done) => {
    try {
      // Check if user exists
      const email = profile.emails?.[0]?.value;
      let user = email ? await storage.getUserByEmail(email) : null;
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: profile.username || `twitter-${profile.id}`,
          email: email,
          password: await generatePasswordHash(Math.random().toString(36).slice(-10)),
          provider: 'twitter',
          providerId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value
        });
        
        // Create default settings
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
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

export function setupOAuth(app: express.Express) {
  // Set up session
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  }));
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Local auth routes
  app.post('/api/auth/login', 
    passport.authenticate('local'),
    (req, res) => {
      res.json(req.user);
    }
  );
  
  // Google auth routes
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );
  
  // Facebook auth routes
  app.get('/api/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
  );
  
  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );
  
  // GitHub auth routes
  app.get('/api/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );
  
  app.get('/api/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );
  
  // Twitter auth routes
  app.get('/api/auth/twitter',
    passport.authenticate('twitter')
  );
  
  app.get('/api/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );
  
  // Logout route
  app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.redirect('/');
    });
  });
  
  // User info route
  app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}