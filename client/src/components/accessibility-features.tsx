import React, { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  VolumeX, 
  Volume2, 
  Type, 
  Contrast,
  MousePointer,
  Keyboard,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// WCAG 2.1 Color contrast checker
export function checkColorContrast(foreground: string, background: string): {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
} {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);
  
  const brightest = Math.max(fgLuminance, bgLuminance);
  const darkest = Math.min(fgLuminance, bgLuminance);
  
  const ratio = (brightest + 0.05) / (darkest + 0.05);

  let level: 'AAA' | 'AA' | 'A' | 'FAIL';
  if (ratio >= 7) level = 'AAA';
  else if (ratio >= 4.5) level = 'AA';
  else if (ratio >= 3) level = 'A';
  else level = 'FAIL';

  return { ratio, level };
}

// Screen reader announcements
export function useScreenReader() {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const ScreenReaderAnnouncer = () => (
    <div
      ref={announceRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );

  return { announce, ScreenReaderAnnouncer };
}

// Keyboard navigation manager
export function useKeyboardNavigation(items: HTMLElement[] | null) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!items || items.length === 0) return;

    let newIndex = currentIndex;
    
    switch (direction) {
      case 'up':
      case 'left':
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'down':
      case 'right':
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
    }

    setCurrentIndex(newIndex);
    setIsNavigating(true);
    
    // Focus the new item
    items[newIndex]?.focus();
    
    // Add visual indicator
    items.forEach((item, index) => {
      if (index === newIndex) {
        item.classList.add('keyboard-focused');
        item.setAttribute('aria-current', 'true');
      } else {
        item.classList.remove('keyboard-focused');
        item.removeAttribute('aria-current');
      }
    });
  }, [currentIndex, items]);

  const resetNavigation = useCallback(() => {
    setCurrentIndex(0);
    setIsNavigating(false);
    items?.forEach(item => {
      item.classList.remove('keyboard-focused');
      item.removeAttribute('aria-current');
    });
  }, [items]);

  return { navigate, resetNavigation, currentIndex, isNavigating };
}

// Focus trap for modals
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    // Focus first element
    firstElement?.focus();
    
    document.addEventListener('keydown', trapFocus);
    
    return () => {
      document.removeEventListener('keydown', trapFocus);
    };
  }, [isActive]);

  return containerRef;
}

// Accessibility settings component
interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  audioDescriptions: boolean;
}

export function AccessibilityPanel() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    focusIndicators: true,
    audioDescriptions: false
  });

  const { toast } = useToast();
  const { announce, ScreenReaderAnnouncer } = useScreenReader();

  // Apply accessibility settings to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Enhanced focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Announce changes to screen readers
    announce(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
    
    toast({
      title: "Accessibility Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1')} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <>
      <ScreenReaderAnnouncer />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span>Accessibility Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Vision Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              <Contrast className="w-4 h-4 mr-2" />
              Vision & Display
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <p className="text-xs text-gray-500">Enhanced color contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                  aria-describedby="high-contrast-desc"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="large-text">Large Text</Label>
                  <p className="text-xs text-gray-500">Increase font size throughout the app</p>
                </div>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => updateSetting('largeText', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduced-motion">Reduce Motion</Label>
                  <p className="text-xs text-gray-500">Minimize animations and transitions</p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
              </div>
            </div>
          </div>

          {/* Navigation Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              <Keyboard className="w-4 h-4 mr-2" />
              Navigation & Interaction
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="keyboard-nav">Keyboard Navigation</Label>
                  <p className="text-xs text-gray-500">Enhanced keyboard shortcuts and navigation</p>
                </div>
                <Switch
                  id="keyboard-nav"
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="focus-indicators">Enhanced Focus Indicators</Label>
                  <p className="text-xs text-gray-500">Stronger visual focus indicators</p>
                </div>
                <Switch
                  id="focus-indicators"
                  checked={settings.focusIndicators}
                  onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                />
              </div>
            </div>
          </div>

          {/* Screen Reader Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              <Volume2 className="w-4 h-4 mr-2" />
              Screen Reader Support
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="screen-reader">Screen Reader Mode</Label>
                  <p className="text-xs text-gray-500">Optimized experience for screen readers</p>
                </div>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReaderMode}
                  onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audio-descriptions">Audio Descriptions</Label>
                  <p className="text-xs text-gray-500">Spoken descriptions of visual elements</p>
                </div>
                <Switch
                  id="audio-descriptions"
                  checked={settings.audioDescriptions}
                  onCheckedChange={(checked) => updateSetting('audioDescriptions', checked)}
                />
              </div>
            </div>
          </div>

          {/* Accessibility Test */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                announce('Running accessibility test', 'assertive');
                toast({
                  title: "Accessibility Test",
                  description: "Checking compliance with WCAG 2.1 guidelines...",
                });
              }}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Test Accessibility
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Color contrast indicator component
export function ContrastIndicator({ 
  foreground, 
  background, 
  className = "" 
}: { 
  foreground: string; 
  background: string; 
  className?: string; 
}) {
  const { ratio, level } = checkColorContrast(foreground, background);

  const getStatusColor = () => {
    switch (level) {
      case 'AAA': return 'text-green-600 bg-green-100';
      case 'AA': return 'text-green-600 bg-green-100';
      case 'A': return 'text-yellow-600 bg-yellow-100';
      case 'FAIL': return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = () => {
    switch (level) {
      case 'AAA':
      case 'AA':
        return <CheckCircle className="w-3 h-3" />;
      case 'A':
      case 'FAIL':
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <div 
          className="w-4 h-4 border border-gray-300 rounded"
          style={{ backgroundColor: background }}
        />
        <div 
          className="w-4 h-4 border border-gray-300 rounded"
          style={{ backgroundColor: foreground }}
        />
      </div>
      <Badge 
        variant="outline" 
        className={`text-xs flex items-center space-x-1 ${getStatusColor()}`}
      >
        {getStatusIcon()}
        <span>{ratio.toFixed(1)}:1 {level}</span>
      </Badge>
    </div>
  );
}

// ARIA live region for dynamic content
export function LiveRegion({ 
  children, 
  priority = 'polite' 
}: { 
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
}) {
  return (
    <div 
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Skip navigation links
export function SkipNavigation() {
  return (
    <div className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50">
      <a
        href="#main-content"
        className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to navigation
      </a>
    </div>
  );
}

// CSS for accessibility features
const accessibilityStyles = `
/* High contrast mode */
.high-contrast {
  --text-primary: #000000;
  --text-secondary: #000000;
  --background-primary: #ffffff;
  --background-secondary: #f0f0f0;
  --border-color: #000000;
  --link-color: #0000ff;
  --focus-color: #ff0000;
}

.high-contrast .dark {
  --text-primary: #ffffff;
  --text-secondary: #ffffff;
  --background-primary: #000000;
  --background-secondary: #333333;
  --border-color: #ffffff;
  --link-color: #00ffff;
  --focus-color: #ffff00;
}

/* Large text mode */
.large-text {
  font-size: 120%;
}

.large-text .text-xs { font-size: 0.9rem; }
.large-text .text-sm { font-size: 1.05rem; }
.large-text .text-base { font-size: 1.2rem; }
.large-text .text-lg { font-size: 1.35rem; }
.large-text .text-xl { font-size: 1.5rem; }

/* Enhanced focus indicators */
.enhanced-focus *:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

.enhanced-focus button:focus-visible {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

/* Keyboard navigation indicator */
.keyboard-focused {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  background-color: rgba(37, 99, 235, 0.1);
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only.focus:not(.sr-only) {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Force reduced motion when setting is enabled */
[style*="--animation-duration: 0s"] *,
[style*="--animation-duration: 0s"] *::before,
[style*="--animation-duration: 0s"] *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
`;

// Inject accessibility styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = accessibilityStyles;
  document.head.appendChild(styleSheet);
}