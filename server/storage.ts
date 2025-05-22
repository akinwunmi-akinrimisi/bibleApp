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
import { eq, desc, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  addVerse(verse: { reference: string, text: string, version: string }): Promise<void>;
  getVersesCount(): Promise<number>;
  getVersesCountByVersion(): Promise<Record<string, number>>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      createdAt: new Date()
    }).returning();
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
      .where(eq(bibleVerses.reference, reference))
      .where(eq(bibleVerses.version, version));
      
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
      .where(eq(bibleVerses.version, version))
      .where(sql`${bibleVerses.text} ILIKE ${`%${text}%`}`)
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
}

export const storage = new DatabaseStorage();
