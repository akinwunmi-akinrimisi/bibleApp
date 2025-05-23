import React, { memo, useMemo, useCallback, lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Lazy load heavy components for better initial load performance
const LazyProjectionWindow = lazy(() => 
  import("@/components/enhanced-projection-window").then(module => ({
    default: module.EnhancedProjectionWindow
  }))
);

const LazySettingsPanel = lazy(() => 
  import("@/components/settings-panel").then(module => ({
    default: module.SettingsPanel
  }))
);

const LazyAudioManagement = lazy(() => 
  import("@/components/audio-management").then(module => ({
    default: module.AudioManagement
  }))
);

// Loading fallback component
function ComponentLoader({ name }: { name: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading {name}...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Memoized components for performance optimization
export const MemoizedVerseMatch = memo(({ 
  verse, 
  onSelect, 
  isSelected 
}: {
  verse: any;
  onSelect: (verse: any) => void;
  isSelected: boolean;
}) => {
  const handleClick = useCallback(() => {
    onSelect(verse);
  }, [verse, onSelect]);

  const confidence = useMemo(() => {
    return Math.round(verse.confidence);
  }, [verse.confidence]);

  const truncatedText = useMemo(() => {
    return verse.text.length > 150 
      ? `${verse.text.substring(0, 150)}...`
      : verse.text;
  }, [verse.text]);

  return (
    <div
      onClick={handleClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {verse.reference}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {verse.version}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {truncatedText}
          </p>
        </div>
        <div className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
          confidence > 80 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : confidence > 60
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {confidence}%
        </div>
      </div>
    </div>
  );
});

MemoizedVerseMatch.displayName = 'MemoizedVerseMatch';

// Virtualized list for handling large datasets efficiently
export const VirtualizedVerseList = memo(({ 
  verses, 
  onSelectVerse, 
  selectedVerseRef,
  maxHeight = 400
}: {
  verses: any[];
  onSelectVerse: (verse: any) => void;
  selectedVerseRef?: string;
  maxHeight?: number;
}) => {
  const itemHeight = 120; // Approximate height per item
  const visibleItems = Math.ceil(maxHeight / itemHeight);
  
  const [startIndex, setStartIndex] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);

  const endIndex = Math.min(startIndex + visibleItems + 2, verses.length);
  const visibleVerses = verses.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    
    const newStartIndex = Math.floor(newScrollTop / itemHeight);
    setStartIndex(Math.max(0, newStartIndex - 1));
  }, [itemHeight]);

  const totalHeight = verses.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div 
      className="overflow-auto custom-scrollbar"
      style={{ height: maxHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleVerses.map((verse, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              <MemoizedVerseMatch
                verse={verse}
                onSelect={onSelectVerse}
                isSelected={verse.reference === selectedVerseRef}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualizedVerseList.displayName = 'VirtualizedVerseList';

// Debounced search hook for performance
export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

// Optimized image loader with lazy loading and caching
export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = "",
  placeholder = "blur"
}: {
  src: string;
  alt: string;
  className?: string;
  placeholder?: "blur" | "empty";
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && placeholder === "blur" && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading="lazy"
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    componentCount: 0,
    memoryUsage: 0
  });

  React.useEffect(() => {
    const startTime = performance.now();
    
    // Monitor render performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    // Monitor memory usage (if available)
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
        }));
      }
    };

    const interval = setInterval(updateMemoryUsage, 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      
      const endTime = performance.now();
      performance.mark('component-unmount');
      performance.measure('component-lifecycle', 'component-mount', 'component-unmount');
    };
  }, []);

  return metrics;
}

// Lazy loading wrapper components
export function LazyProjectionWindow(props: any) {
  return (
    <Suspense fallback={<ComponentLoader name="Projection Window" />}>
      <LazyProjectionWindow {...props} />
    </Suspense>
  );
}

export function LazySettings(props: any) {
  return (
    <Suspense fallback={<ComponentLoader name="Settings Panel" />}>
      <LazySettingsPanel {...props} />
    </Suspense>
  );
}

export function LazyAudio(props: any) {
  return (
    <Suspense fallback={<ComponentLoader name="Audio Management" />}>
      <LazyAudioManagement {...props} />
    </Suspense>
  );
}

// Bundle size optimization utilities
export function preloadComponent(componentName: string) {
  switch (componentName) {
    case 'projection':
      return import("@/components/enhanced-projection-window");
    case 'settings':
      return import("@/components/settings-panel");
    case 'audio':
      return import("@/components/audio-management");
    default:
      return Promise.resolve();
  }
}

// Cache management for API responses
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const apiCache = new APICache();

// Optimized data fetching hook
export function useOptimizedQuery(key: string, fetcher: () => Promise<any>, options: {
  ttl?: number;
  staleWhileRevalidate?: boolean;
} = {}) {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;

  const fetchData = useCallback(async () => {
    try {
      const cachedData = apiCache.get(key);
      
      if (cachedData && !staleWhileRevalidate) {
        setData(cachedData);
        setIsLoading(false);
        return;
      }

      if (cachedData && staleWhileRevalidate) {
        setData(cachedData);
        setIsLoading(false);
      }

      const freshData = await fetcher();
      apiCache.set(key, freshData, ttl);
      setData(freshData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, ttl, staleWhileRevalidate]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}