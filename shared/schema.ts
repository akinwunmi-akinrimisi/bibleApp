import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  organizationName: text("organization_name").notNull(),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  subscriptionStatus: text("subscription_status").default("trial"),
  subscriptionPlan: text("subscription_plan"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  trialEnabled: boolean("trial_enabled").default(true),
  trialStartDate: timestamp("trial_start_date").defaultNow(),
  trialEndDate: timestamp("trial_end_date"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Settings table for user preferences
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bibleVersion: text("bible_version").default("KJV"),
  fontSize: integer("font_size").default(24),
  textColor: text("text_color").default("#FFFFFF"),
  backgroundColor: text("background_color").default("#000000"),
  fontFamily: text("font_family").default("Roboto"),
  confidenceThreshold: integer("confidence_threshold").default(70),
  audioInput: text("audio_input").default("default"),
});

// Detection history
export const detectionHistory = pgTable("detection_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reference: text("reference").notNull(),
  text: text("text").notNull(),
  version: text("version").notNull(),
  confidence: integer("confidence"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Bible verses
export const bibleVerses = pgTable("bible_verses", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull(),
  text: text("text").notNull(),
  version: text("version").notNull(),
});

// Feedback data for model training
export const feedbackData = pgTable("feedback_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  transcription: text("transcription").notNull(),
  selectedVerse: text("selected_verse").notNull(),
  confidenceScores: jsonb("confidence_scores"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schema for user insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  provider: true,
  providerId: true,
  profileImageUrl: true,
  firstName: true,
  lastName: true,
});

// Schema for settings insertion
export const insertSettingsSchema = createInsertSchema(settings).pick({
  userId: true,
  bibleVersion: true,
  fontSize: true,
  textColor: true,
  backgroundColor: true,
  fontFamily: true,
  confidenceThreshold: true,
  audioInput: true,
});

// Schema for detection history insertion
export const insertDetectionHistorySchema = createInsertSchema(detectionHistory).pick({
  userId: true,
  reference: true,
  text: true,
  version: true,
  confidence: true,
});

// Schema for feedback data insertion
export const insertFeedbackDataSchema = createInsertSchema(feedbackData).pick({
  userId: true,
  transcription: true,
  selectedVerse: true,
  confidenceScores: true,
});

// Types for ORM
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type InsertDetectionHistory = z.infer<typeof insertDetectionHistorySchema>;
export type DetectionHistory = typeof detectionHistory.$inferSelect;

export type InsertFeedbackData = z.infer<typeof insertFeedbackDataSchema>;
export type FeedbackData = typeof feedbackData.$inferSelect;

// For API responses
export type VerseMatch = {
  reference: string;
  text: string;
  version: string;
  confidence: number;
};

export type TranscriptionResult = {
  text: string;
  matches: VerseMatch[];
};
