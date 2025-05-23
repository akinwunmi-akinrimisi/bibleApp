import { useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface InteractiveFeaturesProps {
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
  onNavigateLeft?: () => void;
  onNavigateRight?: () => void;
  onSelect?: () => void;
  onEscape?: () => void;
  onSearch?: () => void;
  onSettings?: () => void;
  onToggleProjection?: () => void;
}

export function useKeyboardNavigation({
  onNavigateUp,
  onNavigateDown,
  onNavigateLeft,
  onNavigateRight,
  onSelect,
  onEscape,
  onSearch,
  onSettings,
  onToggleProjection
}: InteractiveFeaturesProps) {
  const { toast } = useToast();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't intercept keys when user is typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onNavigateUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onNavigateDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onNavigateLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onNavigateRight?.();
        break;
      case 'Enter':
        event.preventDefault();
        onSelect?.();
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
      case '/':
        event.preventDefault();
        onSearch?.();
        toast({
          title: "Search Activated",
          description: "Use the search box to find verses",
        });
        break;
      case ',':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onSettings?.();
          toast({
            title: "Settings Opened",
            description: "Configure your projection preferences",
          });
        }
        break;
      case ' ':
        event.preventDefault();
        onToggleProjection?.();
        break;
      case '?':
        event.preventDefault();
        showKeyboardShortcuts();
        break;
    }
  }, [onNavigateUp, onNavigateDown, onNavigateLeft, onNavigateRight, onSelect, onEscape, onSearch, onSettings, onToggleProjection, toast]);

  const showKeyboardShortcuts = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: (
        <div className="text-sm space-y-1">
          <div><kbd className="px-1 py-0.5 text-xs bg-gray-200 rounded">↑↓</kbd> Navigate table</div>
          <div><kbd className="px-1 py-0.5 text-xs bg-gray-200 rounded">Enter</kbd> Select verse</div>
          <div><kbd className="px-1 py-0.5 text-xs bg-gray-200 rounded">/</kbd> Search</div>
          <div><kbd className="px-1 py-0.5 text-xs bg-gray-200 rounded">Space</kbd> Toggle projection</div>
          <div><kbd className="px-1 py-0.5 text-xs bg-gray-200 rounded">Esc</kbd> Cancel/Close</div>
        </div>
      ) as any,
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showKeyboardShortcuts };
}

interface FocusTrapProps {
  isActive: boolean;
  children: React.ReactNode;
  onEscape?: () => void;
}

export function FocusTrap({ isActive, children, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    firstFocusableRef.current = focusableElements[0] as HTMLElement;
    lastFocusableRef.current = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstFocusableRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableRef.current) {
            e.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableRef.current) {
            e.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEscape]);

  return (
    <div ref={containerRef} className={isActive ? 'focus-trap-active' : ''}>
      {children}
    </div>
  );
}

interface VisualFeedbackProps {
  isActive?: boolean;
  isSelected?: boolean;
  isHoverable?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function VisualFeedback({ 
  isActive = false, 
  isSelected = false, 
  isHoverable = true, 
  children, 
  onClick,
  className = ""
}: VisualFeedbackProps) {
  const baseClasses = "transition-all duration-200 ease-in-out";
  const hoverClasses = isHoverable ? "hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-gray-800" : "";
  const activeClasses = isActive ? "ring-2 ring-blue-500 ring-opacity-50" : "";
  const selectedClasses = isSelected ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500" : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const combinedClasses = `${baseClasses} ${hoverClasses} ${activeClasses} ${selectedClasses} ${clickableClasses} ${className}`;

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}

export function LoadingState({ isLoading, children, skeleton }: LoadingStateProps) {
  if (isLoading && skeleton) {
    return <>{skeleton}</>;
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return <>{children}</>;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative group">
      {children}
      <div className={`
        absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 
        group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
        ${positionClasses[position]}
      `}>
        {content}
        <div className={`
          absolute w-2 h-2 bg-gray-900 transform rotate-45
          ${position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 -mt-1' : ''}
          ${position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1' : ''}
          ${position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 -ml-1' : ''}
          ${position === 'right' ? 'right-full top-1/2 transform -translate-y-1/2 -mr-1' : ''}
        `}></div>
      </div>
    </div>
  );
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
}

export function AnimatedCounter({ value, duration = 1000, format = (v) => v.toString() }: AnimatedCounterProps) {
  const countRef = useRef<HTMLSpanElement>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (!countRef.current) return;

    const startValue = startValueRef.current;
    const endValue = value;
    const startTime = Date.now();

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      if (countRef.current) {
        countRef.current.textContent = format(currentValue);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    updateCount();
    startValueRef.current = value;
  }, [value, duration, format]);

  return <span ref={countRef}>{format(0)}</span>;
}

// CSS for enhanced animations and focus indicators
const enhancedStyles = `
/* Enhanced focus indicators */
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth scrolling for better UX */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbars */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Improved button interactions */
button:focus-visible {
  transform: scale(1.02);
}

/* Enhanced card hover effects */
.card-hover {
  transition: all 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Loading shimmer effect */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* Pulse animation for live indicators */
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
`;

// Inject enhanced styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = enhancedStyles;
  document.head.appendChild(styleSheet);
}