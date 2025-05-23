import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  X, 
  Wifi, 
  WifiOff, 
  Mic, 
  MicOff,
  Search,
  Settings,
  RefreshCw,
  Volume2,
  Server,
  Clock
} from "lucide-react";

export interface ErrorNotification {
  id: string;
  type: "audio" | "connection" | "detection" | "api" | "permission";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  autoDismiss?: boolean;
  dismissAfter?: number; // seconds
  actions?: {
    primary?: { label: string; action: () => void; icon?: any };
    secondary?: { label: string; action: () => void; icon?: any };
  };
}

interface ErrorNotificationsProps {
  onNavigateToAudio?: () => void;
  onNavigateToSettings?: () => void;
  onOpenSearch?: () => void;
  onRetryConnection?: () => void;
}

export function ErrorNotifications({
  onNavigateToAudio,
  onNavigateToSettings,
  onOpenSearch,
  onRetryConnection
}: ErrorNotificationsProps) {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);

  // Auto-dismiss notifications
  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};

    notifications.forEach(notification => {
      if (notification.autoDismiss && notification.dismissAfter) {
        timers[notification.id] = setTimeout(() => {
          dismissNotification(notification.id);
        }, notification.dismissAfter * 1000);
      }
    });

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, [notifications]);

  // Listen for global error events
  useEffect(() => {
    const handleWebSocketError = () => {
      addNotification({
        type: "connection",
        title: "Connection Lost",
        message: "Lost connection to VerseProjection server. Real-time features may not work.",
        severity: "high",
        autoDismiss: false,
        actions: {
          primary: {
            label: "Retry Connection",
            action: onRetryConnection || (() => window.location.reload()),
            icon: RefreshCw
          }
        }
      });
    };

    const handleAudioError = () => {
      addNotification({
        type: "audio",
        title: "Microphone Issue",
        message: "Audio input is not working properly. Check your microphone settings.",
        severity: "high",
        autoDismiss: false,
        actions: {
          primary: {
            label: "Check Audio",
            action: onNavigateToAudio || (() => {}),
            icon: Mic
          },
          secondary: {
            label: "Open Search",
            action: onOpenSearch || (() => {}),
            icon: Search
          }
        }
      });
    };

    const handlePermissionError = () => {
      addNotification({
        type: "permission",
        title: "Permission Required",
        message: "Microphone access is required for verse detection to work.",
        severity: "critical",
        autoDismiss: false,
        actions: {
          primary: {
            label: "Check Settings",
            action: onNavigateToSettings || (() => {}),
            icon: Settings
          }
        }
      });
    };

    // Listen for custom events
    window.addEventListener('websocket-error', handleWebSocketError);
    window.addEventListener('audio-error', handleAudioError);
    window.addEventListener('permission-error', handlePermissionError);

    return () => {
      window.removeEventListener('websocket-error', handleWebSocketError);
      window.removeEventListener('audio-error', handleAudioError);
      window.removeEventListener('permission-error', handlePermissionError);
    };
  }, [onNavigateToAudio, onNavigateToSettings, onOpenSearch, onRetryConnection]);

  const addNotification = (notification: Omit<ErrorNotification, 'id' | 'timestamp'>) => {
    const newNotification: ErrorNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    setNotifications(prev => {
      // Remove duplicates of same type
      const filtered = prev.filter(n => n.type !== notification.type);
      return [...filtered, newNotification];
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getSeverityColor = (severity: ErrorNotification['severity']) => {
    switch (severity) {
      case "low": return "border-blue-200 bg-blue-50 dark:bg-blue-900/20";
      case "medium": return "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20";
      case "high": return "border-orange-200 bg-orange-50 dark:bg-orange-900/20";
      case "critical": return "border-red-200 bg-red-50 dark:bg-red-900/20";
      default: return "border-gray-200 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getTypeIcon = (type: ErrorNotification['type']) => {
    switch (type) {
      case "audio": return <MicOff className="w-5 h-5" />;
      case "connection": return <WifiOff className="w-5 h-5" />;
      case "detection": return <Search className="w-5 h-5" />;
      case "api": return <Server className="w-5 h-5" />;
      case "permission": return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: ErrorNotification['type']) => {
    switch (type) {
      case "audio": return "text-orange-600";
      case "connection": return "text-red-600";
      case "detection": return "text-yellow-600";
      case "api": return "text-purple-600";
      case "permission": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full">
      {notifications.map((notification) => (
        <Card 
          key={notification.id}
          className={`border-l-4 ${getSeverityColor(notification.severity)} shadow-lg animate-in slide-in-from-right-full duration-300`}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`${getTypeColor(notification.type)} mt-0.5`}>
                {getTypeIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                  </div>

                  {/* Dismiss button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions */}
                {notification.actions && (
                  <div className="flex items-center space-x-2 mt-3">
                    {notification.actions.primary && (
                      <Button
                        size="sm"
                        onClick={() => {
                          notification.actions?.primary?.action();
                          dismissNotification(notification.id);
                        }}
                        className="text-xs h-7"
                      >
                        {notification.actions.primary.icon && (
                          <notification.actions.primary.icon className="w-3 h-3 mr-1" />
                        )}
                        {notification.actions.primary.label}
                      </Button>
                    )}
                    
                    {notification.actions.secondary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          notification.actions?.secondary?.action();
                          dismissNotification(notification.id);
                        }}
                        className="text-xs h-7"
                      >
                        {notification.actions.secondary.icon && (
                          <notification.actions.secondary.icon className="w-3 h-3 mr-1" />
                        )}
                        {notification.actions.secondary.label}
                      </Button>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Badge variant="outline" className="text-xs">
                    {notification.type}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {/* Auto-dismiss indicator */}
                {notification.autoDismiss && notification.dismissAfter && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 animate-pulse"
                        style={{
                          animation: `shrink ${notification.dismissAfter}s linear`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper functions to trigger notifications from other components
export const triggerErrorNotification = (type: ErrorNotification['type'], details?: any) => {
  const event = new CustomEvent(`${type}-error`, { detail: details });
  window.dispatchEvent(event);
};

// Predefined notification types for common errors
export const ErrorTypes = {
  AUDIO_PERMISSION_DENIED: () => triggerErrorNotification('permission'),
  AUDIO_DEVICE_ERROR: () => triggerErrorNotification('audio'),
  WEBSOCKET_CONNECTION_LOST: () => triggerErrorNotification('connection'),
  API_REQUEST_FAILED: (details: any) => triggerErrorNotification('api', details),
  VERSE_DETECTION_FAILED: () => triggerErrorNotification('detection')
};

// CSS for auto-dismiss animation
const styles = `
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}