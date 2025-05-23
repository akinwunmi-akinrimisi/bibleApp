import { storage } from './storage';
import { generateVerseEmbeddings } from './verse-matcher';

// AI/ML Dashboard for monitoring and management
export class AIDashboard {
  
  // Get AI pipeline statistics
  static async getStats() {
    try {
      const totalVerses = await storage.getVersesCount();
      const versesWithoutEmbeddings = await storage.getVersesWithoutEmbeddings();
      const versionStats = await storage.getVersesCountByVersion();
      
      return {
        totalVerses,
        versesWithEmbeddings: totalVerses - versesWithoutEmbeddings.length,
        versesWithoutEmbeddings: versesWithoutEmbeddings.length,
        embeddingProgress: Math.round(((totalVerses - versesWithoutEmbeddings.length) / totalVerses) * 100),
        versionBreakdown: versionStats,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting AI stats:', error);
      throw error;
    }
  }
  
  // Initialize embedding generation
  static async startEmbeddingGeneration(batchSize: number = 50) {
    try {
      console.log('Starting AI embedding generation...');
      await generateVerseEmbeddings(batchSize);
      return { success: true, message: 'Embedding generation completed' };
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw error;
    }
  }
  
  // Check AI pipeline health
  static async healthCheck() {
    try {
      const stats = await this.getStats();
      
      return {
        status: 'healthy',
        whisperEnabled: !!process.env.OPENAI_API_KEY,
        embeddingsEnabled: stats.embeddingProgress > 0,
        databaseConnected: true,
        totalVerses: stats.totalVerses,
        embeddingProgress: stats.embeddingProgress
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        whisperEnabled: !!process.env.OPENAI_API_KEY,
        embeddingsEnabled: false,
        databaseConnected: false
      };
    }
  }
}