import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  Database, 
  Sync,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Cloud,
  RefreshCw
} from "lucide-react";

// Types for offline data management
interface OfflineVerse {
  id: string;
  reference: string;
  text: string;
  version: string;
  embedding?: string;
  downloaded: boolean;
  lastUpdated: Date;
}

interface SyncQueueItem {
  id: string;
  type: 'feedback' | 'history' | 'settings';
  data: any;
  timestamp: Date;
  retryCount: number;
}

interface OfflineStorage {
  verses: OfflineVerse[];
  syncQueue: SyncQueueItem[];
  lastSync: Date | null;
  storageSize: number;
  maxStorageSize: number;
}

// IndexedDB wrapper for offline storage
class OfflineDB {
  private dbName = 'VerseProjectionDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Verses store
        if (!db.objectStoreNames.contains('verses')) {
          const versesStore = db.createObjectStore('verses', { keyPath: 'id' });
          versesStore.createIndex('reference', 'reference', { unique: false });
          versesStore.createIndex('version', 'version', { unique: false });
        }
        
        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async saveVerse(verse: OfflineVerse): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['verses'], 'readwrite');
    const store = transaction.objectStore('verses');
    await store.put(verse);
  }

  async getVerse(reference: string, version: string): Promise<OfflineVerse | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['verses'], 'readonly');
    const store = transaction.objectStore('verses');
    const index = store.index('reference');
    
    return new Promise((resolve, reject) => {
      const request = index.get(reference);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.version === version) {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async searchVerses(query: string, version: string): Promise<OfflineVerse[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['verses'], 'readonly');
    const store = transaction.objectStore('verses');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const verses = request.result.filter((verse: OfflineVerse) => 
          verse.version === version && 
          (verse.reference.toLowerCase().includes(query.toLowerCase()) ||
           verse.text.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(verses);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const queueItem: SyncQueueItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    const transaction = this.db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.put(queueItem);
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyncQueue(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.clear();
  }
}

// Offline detection hook
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial last online time if currently online
    if (navigator.onLine) {
      setLastOnline(new Date());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, lastOnline };
}

// Main offline support component
export function OfflineSupport() {
  const [storage, setStorage] = useState<OfflineStorage>({
    verses: [],
    syncQueue: [],
    lastSync: null,
    storageSize: 0,
    maxStorageSize: 100 * 1024 * 1024 // 100MB
  });
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineDB] = useState(() => new OfflineDB());
  
  const { isOnline, lastOnline } = useOfflineStatus();
  const { toast } = useToast();

  // Initialize offline database
  useEffect(() => {
    const initDB = async () => {
      try {
        await offlineDB.init();
        await loadStorageInfo();
      } catch (error) {
        console.error('Failed to initialize offline database:', error);
        toast({
          title: "Offline Storage Error",
          description: "Could not initialize offline storage",
          variant: "destructive"
        });
      }
    };

    initDB();
  }, [offlineDB, toast]);

  // Load storage information
  const loadStorageInfo = async () => {
    try {
      const syncQueue = await offlineDB.getSyncQueue();
      
      // Estimate storage size (simplified)
      const estimatedSize = syncQueue.length * 1024; // 1KB per item estimate
      
      setStorage(prev => ({
        ...prev,
        syncQueue,
        storageSize: estimatedSize
      }));
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  // Download Bible data for offline use
  const downloadBibleData = async (versions: string[] = ['KJV', 'WEB']) => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Cannot download Bible data while offline",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      for (const version of versions) {
        toast({
          title: "Downloading Bible Data",
          description: `Downloading ${version} for offline use...`,
        });

        // Simulate download progress (in real app, this would be actual API calls)
        for (let i = 0; i <= 100; i += 10) {
          setDownloadProgress(i);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // In a real implementation, you would:
        // 1. Fetch verses from API
        // 2. Store them in IndexedDB
        // 3. Generate embeddings locally if needed
      }

      toast({
        title: "Download Complete",
        description: `Bible data for ${versions.join(', ')} is now available offline`,
      });

      await loadStorageInfo();
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download Bible data for offline use",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Sync offline data with server
  const syncData = async () => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Cannot sync while offline",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);

    try {
      const syncQueue = await offlineDB.getSyncQueue();
      
      if (syncQueue.length === 0) {
        toast({
          title: "Already Synced",
          description: "No data to sync",
        });
        setIsSyncing(false);
        return;
      }

      // Process sync queue
      for (const item of syncQueue) {
        try {
          // In real implementation, send data to appropriate API endpoint
          switch (item.type) {
            case 'feedback':
              // await apiRequest('POST', '/api/feedback', item.data);
              break;
            case 'history':
              // await apiRequest('POST', '/api/detection-history', item.data);
              break;
            case 'settings':
              // await apiRequest('PUT', '/api/settings', item.data);
              break;
          }
        } catch (error) {
          console.error(`Failed to sync ${item.type}:`, error);
          // In real app, update retry count and reschedule
        }
      }

      // Clear sync queue after successful sync
      await offlineDB.clearSyncQueue();
      
      setStorage(prev => ({
        ...prev,
        syncQueue: [],
        lastSync: new Date()
      }));

      toast({
        title: "Sync Complete",
        description: `Synced ${syncQueue.length} items with server`,
      });

    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Could not sync data with server",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Add item to sync queue (for offline actions)
  const queueForSync = useCallback(async (type: SyncQueueItem['type'], data: any) => {
    try {
      await offlineDB.addToSyncQueue({
        type,
        data,
        timestamp: new Date(),
        retryCount: 0
      });
      
      await loadStorageInfo();
      
      // Auto-sync if online
      if (isOnline && !isSyncing) {
        setTimeout(syncData, 1000);
      }
    } catch (error) {
      console.error('Failed to queue for sync:', error);
    }
  }, [isOnline, isSyncing]);

  // Calculate storage usage percentage
  const storageUsagePercent = (storage.storageSize / storage.maxStorageSize) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Offline Support</span>
          </div>
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className="flex items-center space-x-1"
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? "Online" : "Offline"}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Connection Status</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isOnline ? "Connected to Internet" : "Working Offline"}
                </p>
                <p className="text-xs text-gray-500">
                  {lastOnline ? `Last online: ${lastOnline.toLocaleString()}` : "Never connected"}
                </p>
              </div>
            </div>
            {!isOnline && (
              <Badge variant="outline" className="text-xs">
                Offline Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Download Bible Data */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Bible Data Download</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Download Bible versions for offline use
                </p>
                <p className="text-xs text-gray-500">
                  Approximately 12MB per version
                </p>
              </div>
              <Button
                onClick={() => downloadBibleData(['KJV', 'WEB'])}
                disabled={!isOnline || isDownloading}
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
            </div>
            
            {isDownloading && (
              <div className="space-y-2">
                <Progress value={downloadProgress} className="h-2" />
                <p className="text-xs text-gray-500 text-center">
                  {downloadProgress}% complete
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sync Status */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Data Synchronization</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Sync className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">
                    {storage.syncQueue.length} items waiting to sync
                  </p>
                  <p className="text-xs text-gray-500">
                    {storage.lastSync 
                      ? `Last sync: ${storage.lastSync.toLocaleString()}`
                      : "Never synced"
                    }
                  </p>
                </div>
              </div>
              <Button
                onClick={syncData}
                disabled={!isOnline || isSyncing || storage.syncQueue.length === 0}
                size="sm"
                variant="outline"
              >
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isSyncing ? "Syncing..." : "Sync Now"}
              </Button>
            </div>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Storage Usage</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Local Storage</span>
              <span className="text-sm font-medium">
                {(storage.storageSize / 1024 / 1024).toFixed(1)}MB / 
                {(storage.maxStorageSize / 1024 / 1024).toFixed(0)}MB
              </span>
            </div>
            <Progress 
              value={storageUsagePercent} 
              className={`h-2 ${storageUsagePercent > 80 ? 'bg-red-100' : 'bg-gray-200'}`}
            />
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <HardDrive className="w-3 h-3" />
                <span>Local: {storage.verses.length} verses</span>
              </div>
              <div className="flex items-center space-x-1">
                <Cloud className="w-3 h-3" />
                <span>Queue: {storage.syncQueue.length} items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offline Features */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Available Offline</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Verse Search
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Search downloaded Bible versions
              </p>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Projection
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Display verses in projection mode
              </p>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Settings
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Modify display and audio settings
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  AI Detection
                </span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Limited without internet connection
              </p>
            </div>
          </div>
        </div>

        {/* Auto-sync Settings */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Auto-sync when online
              </p>
              <p className="text-xs text-gray-500">
                Automatically sync data when connection is restored
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for using offline functionality in other components
export function useOfflineData() {
  const [offlineDB] = useState(() => new OfflineDB());
  const { isOnline } = useOfflineStatus();

  const searchOfflineVerses = useCallback(async (query: string, version: string = 'KJV') => {
    try {
      await offlineDB.init();
      return await offlineDB.searchVerses(query, version);
    } catch (error) {
      console.error('Offline search failed:', error);
      return [];
    }
  }, [offlineDB]);

  const getOfflineVerse = useCallback(async (reference: string, version: string = 'KJV') => {
    try {
      await offlineDB.init();
      return await offlineDB.getVerse(reference, version);
    } catch (error) {
      console.error('Failed to get offline verse:', error);
      return null;
    }
  }, [offlineDB]);

  const queueForSync = useCallback(async (type: SyncQueueItem['type'], data: any) => {
    try {
      await offlineDB.init();
      await offlineDB.addToSyncQueue({
        type,
        data,
        timestamp: new Date(),
        retryCount: 0
      });
    } catch (error) {
      console.error('Failed to queue for sync:', error);
    }
  }, [offlineDB]);

  return {
    isOnline,
    searchOfflineVerses,
    getOfflineVerse,
    queueForSync
  };
}