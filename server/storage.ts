import {
  users,
  settings,
  detectionHistory,
  feedbackData,
  bibleVerses,
  type User,
  type InsertUser,
  type Settings,
  type InsertSettings,
  type DetectionHistory,
  type InsertDetectionHistory,
  type FeedbackData,
  type InsertFeedbackData
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, sql, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: InsertUser): Promise<User>;
  updateUserEmailVerification(userId: number, verified: boolean): Promise<User>;
  updateUserSubscription(userId: number, subscriptionData: Partial<User>): Promise<User>;
  updateUserOnboarding(userId: number, completed: boolean): Promise<User>;
  
  // Settings operations
  getSettingsByUserId(userId: number): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(userId: number, settings: Partial<InsertSettings>): Promise<Settings>;
  
  // Detection history operations
  getDetectionHistory(userId: number): Promise<DetectionHistory[]>;
  addDetectionHistory(history: InsertDetectionHistory): Promise<DetectionHistory>;
  
  // Feedback data operations
  addFeedbackData(feedback: InsertFeedbackData): Promise<FeedbackData>;
  
  // Bible verse operations
  getVerseByReference(reference: string, version: string): Promise<any | undefined>;
  searchVersesByText(text: string, version: string): Promise<any[]>;
  searchVersesByEmbedding(embedding: number[], version: string): Promise<any[]>;
  addVerse(verse: { reference: string, text: string, version: string }): Promise<void>;
  getVersesCount(): Promise<number>;
  getVersesCountByVersion(): Promise<Record<string, number>>;
  getVersesWithoutEmbeddings(): Promise<{id: number, reference: string, text: string}[]>;
  updateVerseEmbedding(id: number, embedding: string): Promise<void>;
  
  // Additional methods for sync and offline support
  getFeedbackByTimestamp(userId: number, timestamp: Date): Promise<FeedbackData | undefined>;
  getRecentFeedbackCount(userId: number, days: number): Promise<number>;
  getPopularVerses(version: string, limit: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      createdAt: new Date()
    }).returning();
    return user;
  }
  
  async upsertUser(userData: InsertUser): Promise<User> {
    // If user exists with this email, update their info
    if (userData.email) {
      const existingUser = await this.getUserByEmail(userData.email);
      
      if (existingUser) {
        // Update the user record
        const [updated] = await db
          .update(users)
          .set({
            ...userData,
            // Don't update these fields if they exist
            id: existingUser.id,
            username: userData.username || existingUser.username,
            password: userData.password || existingUser.password
          })
          .where(eq(users.id, existingUser.id))
          .returning();
        return updated;
      }
    }
    
    // Otherwise create a new user
    return this.createUser(userData);
  }

  async updateUserEmailVerification(userId: number, verified: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        emailVerified: verified,
        emailVerificationToken: null,
        emailVerificationExpires: null
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscription(userId: number, subscriptionData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(subscriptionData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserOnboarding(userId: number, completed: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ onboardingCompleted: completed })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  // Settings operations
  async getSettingsByUserId(userId: number): Promise<Settings | undefined> {
    const [userSettings] = await db.select().from(settings).where(eq(settings.userId, userId));
    return userSettings;
  }
  
  async createSettings(insertSettings: InsertSettings): Promise<Settings> {
    const [userSettings] = await db.insert(settings).values(insertSettings).returning();
    return userSettings;
  }
  
  async updateSettings(userId: number, updateData: Partial<InsertSettings>): Promise<Settings> {
    const [userSettings] = await db
      .update(settings)
      .set(updateData)
      .where(eq(settings.userId, userId))
      .returning();
    return userSettings;
  }
  
  // Detection history operations
  async getDetectionHistory(userId: number): Promise<DetectionHistory[]> {
    return await db
      .select()
      .from(detectionHistory)
      .where(eq(detectionHistory.userId, userId))
      .orderBy(desc(detectionHistory.timestamp))
      .limit(20);
  }
  
  async addDetectionHistory(insertHistory: InsertDetectionHistory): Promise<DetectionHistory> {
    const [history] = await db.insert(detectionHistory).values({
      ...insertHistory,
      timestamp: new Date()
    }).returning();
    return history;
  }
  
  // Feedback data operations
  async addFeedbackData(insertFeedback: InsertFeedbackData): Promise<FeedbackData> {
    const [feedback] = await db.insert(feedbackData).values({
      ...insertFeedback,
      timestamp: new Date()
    }).returning();
    return feedback;
  }
  
  // Bible verse operations
  async getVerseByReference(reference: string, version: string): Promise<any | undefined> {
    const [verse] = await db
      .select()
      .from(bibleVerses)
      .where(and(
        eq(bibleVerses.reference, reference),
        eq(bibleVerses.version, version)
      ));
      
    if (!verse) return undefined;
    
    return {
      reference: verse.reference,
      text: verse.text,
      version: verse.version,
      confidence: 100 // Exact match has 100% confidence
    };
  }
  
  async searchVersesByText(text: string, version: string): Promise<any[]> {
    // Simple LIKE search - in a real app, this would use full-text search or vector similarity
    const verses = await db
      .select()
      .from(bibleVerses)
      .where(and(
        eq(bibleVerses.version, version),
        sql`${bibleVerses.text} ILIKE ${`%${text}%`}`
      ))
      .limit(10);
      
    return verses.map(verse => ({
      reference: verse.reference,
      text: verse.text,
      version: verse.version,
      confidence: 85 // Simplified confidence score
    }));
  }
  
  async addVerse(verse: { reference: string, text: string, version: string }): Promise<void> {
    await db.insert(bibleVerses).values(verse).onConflictDoNothing();
  }
  
  async getVersesCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(bibleVerses);
    return result?.count || 0;
  }
  
  async getVersesCountByVersion(): Promise<Record<string, number>> {
    try {
      const results = await db
        .select({
          version: bibleVerses.version,
          count: sql<number>`count(*)`
        })
        .from(bibleVerses)
        .groupBy(bibleVerses.version);
      
      // Convert array of results to a record object
      return results.reduce((acc, curr) => {
        acc[curr.version] = curr.count;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error('Failed to get verses count by version:', error);
      return {};
    }
  }
}

// Helper function for cosine similarity calculation
function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const storage = new DatabaseStorage();
