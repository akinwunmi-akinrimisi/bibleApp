// Monitoring and health check service for production deployment
export class MonitoringService {
  private static metrics = {
    apiRequests: 0,
    websocketConnections: 0,
    audioProcessingTime: [] as number[],
    verseMatchingTime: [] as number[],
    errors: [] as { type: string; timestamp: Date; message: string }[]
  };

  // Record API request metrics
  static recordApiRequest(endpoint: string, duration: number, status: number) {
    this.metrics.apiRequests++;
    
    if (status >= 400) {
      this.metrics.errors.push({
        type: 'API_ERROR',
        timestamp: new Date(),
        message: `${endpoint} returned ${status} in ${duration}ms`
      });
    }

    // Log slow requests (>200ms as per requirements)
    if (duration > 200) {
      console.warn(`Slow API request: ${endpoint} took ${duration}ms`);
    }
  }

  // Record WebSocket metrics
  static recordWebSocketConnection(connected: boolean) {
    if (connected) {
      this.metrics.websocketConnections++;
    } else {
      this.metrics.websocketConnections--;
    }
  }

  // Record audio processing performance
  static recordAudioProcessing(duration: number) {
    this.metrics.audioProcessingTime.push(duration);
    
    // Keep only last 100 measurements
    if (this.metrics.audioProcessingTime.length > 100) {
      this.metrics.audioProcessingTime.shift();
    }

    // Log if exceeding 1 second (excluding AI pipeline)
    if (duration > 1000) {
      console.warn(`Slow audio processing: ${duration}ms`);
    }
  }

  // Record verse matching performance
  static recordVerseMatching(duration: number) {
    this.metrics.verseMatchingTime.push(duration);
    
    // Keep only last 100 measurements
    if (this.metrics.verseMatchingTime.length > 100) {
      this.metrics.verseMatchingTime.shift();
    }
  }

  // Get current metrics for health check
  static getMetrics() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Filter recent errors (last hour)
    const recentErrors = this.metrics.errors.filter(
      error => error.timestamp.getTime() > oneHourAgo
    );

    // Calculate average processing times
    const avgAudioProcessing = this.metrics.audioProcessingTime.length > 0
      ? this.metrics.audioProcessingTime.reduce((a, b) => a + b, 0) / this.metrics.audioProcessingTime.length
      : 0;

    const avgVerseMatching = this.metrics.verseMatchingTime.length > 0
      ? this.metrics.verseMatchingTime.reduce((a, b) => a + b, 0) / this.metrics.verseMatchingTime.length
      : 0;

    return {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      apiRequests: this.metrics.apiRequests,
      websocketConnections: this.metrics.websocketConnections,
      recentErrors: recentErrors.length,
      averageAudioProcessingTime: Math.round(avgAudioProcessing),
      averageVerseMatchingTime: Math.round(avgVerseMatching),
      memoryUsage: process.memoryUsage(),
      performance: {
        apiLatencyOk: avgAudioProcessing < 1000, // <1s excluding AI
        websocketLatencyOk: true, // We'll track this separately
        errorRateOk: recentErrors.length < 10 // <1% error rate approximation
      }
    };
  }

  // Health check endpoint response
  static getHealthStatus() {
    const metrics = this.getMetrics();
    const isHealthy = metrics.performance.apiLatencyOk && 
                     metrics.performance.websocketLatencyOk && 
                     metrics.performance.errorRateOk;

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: metrics.timestamp,
      uptime: metrics.uptime,
      checks: {
        database: true, // We'll implement DB health check
        memory: metrics.memoryUsage.heapUsed < (1024 * 1024 * 1024), // <1GB
        api: metrics.performance.apiLatencyOk,
        websocket: metrics.performance.websocketLatencyOk,
        errorRate: metrics.performance.errorRateOk
      },
      metrics: {
        connections: metrics.websocketConnections,
        avgProcessingTime: metrics.averageAudioProcessingTime,
        recentErrors: metrics.recentErrors
      }
    };
  }

  // Clear old metrics to prevent memory leaks
  static cleanup() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.metrics.errors = this.metrics.errors.filter(
      error => error.timestamp.getTime() > oneHourAgo
    );
  }
}

// Middleware to track API performance
export function trackApiPerformance(req: any, res: any, next: any) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    MonitoringService.recordApiRequest(req.path, duration, res.statusCode);
  });
  
  next();
}

// Cleanup old metrics every hour
setInterval(() => {
  MonitoringService.cleanup();
}, 60 * 60 * 1000);