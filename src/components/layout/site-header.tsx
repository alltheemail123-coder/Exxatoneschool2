"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import Leo from "../../imports/Leo-68-134";
import { Search, X } from "lucide-react";

// Animated placeholder phrases highlighting Leo AI capabilities
const PLACEHOLDER_PHRASES = [
  "Search students, placements, or sites...",
  "Ask Leo to summarize compliance status",
  "Find students missing requirements",
];

function AnimatedPlaceholder({ isFocused }: { isFocused: boolean }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = React.useState(0);
  const [wordCount, setWordCount] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);
  const [hasCompletedCycle, setHasCompletedCycle] = React.useState(false);

  const currentPhrase = PLACEHOLDER_PHRASES[currentPhraseIndex];
  const words = React.useMemo(() => currentPhrase.split(" "), [currentPhrase]);
  const displayedText = words.slice(0, wordCount).join(" ");

  React.useEffect(() => {
    if (isFocused || hasCompletedCycle) return;

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (isTyping) {
      if (wordCount < words.length) {
        const typeTimer = setTimeout(() => {
          setWordCount((prev) => prev + 1);
        }, 120 + Math.random() * 60);
        return () => clearTimeout(typeTimer);
      } else {
        setIsPaused(true);
      }
    } else {
      if (wordCount > 0) {
        const eraseTimer = setTimeout(() => {
          setWordCount((prev) => prev - 1);
        }, 80);
        return () => clearTimeout(eraseTimer);
      } else {
        const nextIndex = currentPhraseIndex + 1;
        if (nextIndex >= PLACEHOLDER_PHRASES.length) {
          // Completed full cycle, show first phrase permanently
          setCurrentPhraseIndex(0);
          setWordCount(PLACEHOLDER_PHRASES[0].split(" ").length);
          setHasCompletedCycle(true);
        } else {
          setCurrentPhraseIndex(nextIndex);
          setIsTyping(true);
        }
      }
    }
  }, [wordCount, isTyping, isPaused, currentPhraseIndex, isFocused, hasCompletedCycle, words.length]);

  React.useEffect(() => {
    if (!isFocused) {
      setWordCount(0);
      setIsTyping(true);
      setIsPaused(false);
    }
  }, [isFocused]);

  if (isFocused) return null;

  return (
    <span className="pointer-events-none absolute inset-0 flex items-center pl-10 pr-28 text-sm text-muted-foreground truncate select-none">
      {displayedText}
      {!hasCompletedCycle && (
        <span className="inline-block w-[2px] h-4 bg-muted-foreground/40 ml-[1px] animate-[blink_1s_step-end_infinite]" />
      )}
    </span>
  );
}

export interface BreadcrumbItemType {
  label: string;
  onClick?: () => void;
}

interface SiteHeaderProps {
  currentPage: string;
  breadcrumbs?: BreadcrumbItemType[];
  onLeoToggle?: () => void;
  onLeoSearch?: (query: string) => void;
  showLeoPanel?: boolean;
}

export function SiteHeader({ currentPage, breadcrumbs = [], onLeoToggle, onLeoSearch, showLeoPanel = false }: SiteHeaderProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      if (onLeoSearch) {
        onLeoSearch(searchValue.trim());
      } else if (onLeoToggle) {
        onLeoToggle();
      }
      setSearchValue("");
      inputRef.current?.blur();
    }
  };

  const handleAskLeo = () => {
    if (searchValue.trim()) {
      if (onLeoSearch) {
        onLeoSearch(searchValue.trim());
      } else if (onLeoToggle) {
        onLeoToggle();
      }
      setSearchValue("");
      inputRef.current?.blur();
    } else if (onLeoToggle) {
      onLeoToggle();
    }
  };

  const handleClear = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchValue("");
      inputRef.current?.blur();
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1 flex-shrink-0" />
        
        <div className="header-separator flex-shrink-0" />
        
        <Breadcrumb className="flex-shrink-0">
          <BreadcrumbList className="text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem className="hidden md:block">
                  {breadcrumb.onClick ? (
                    <BreadcrumbLink 
                      onClick={breadcrumb.onClick}
                      className="cursor-pointer text-chart-1 hover:text-chart-1 hover:opacity-80 transition-colors text-sm"
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <span className="text-foreground text-sm">{breadcrumb.label}</span>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-sm" />
              </React.Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium text-sm">
                {currentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Leo AI Global Search Bar */}
      {onLeoToggle && (
        <div className="flex items-center px-4 flex-shrink-0">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-96 lg:w-[32rem] xl:w-[36rem]"
          >
            {/* Search icon */}
            <div className="absolute left-3 z-10 flex items-center justify-center text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>

            {/* Search input — outline style */}
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full h-9 rounded-md pl-10 pr-28 text-sm bg-background text-foreground",
                "border outline-none transition-colors",
                isFocused && "ring-2 ring-ring/30"
              )}
              style={{ borderColor: '#8C8C92' }}
              placeholder={isFocused ? "Ask Leo anything..." : ""}
              aria-label="Leo AI global search"
            />

            {/* Animated placeholder overlay */}
            <AnimatedPlaceholder isFocused={isFocused || searchValue.length > 0} />

            {/* Right side: clear button + Ask Leo button inside the input */}
            <div className="absolute right-1.5 flex items-center gap-1.5">
              {searchValue && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                  className="p-0.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <Button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleAskLeo}
                className="h-6 px-2.5 rounded-sm flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Ask Leo AI Assistant"
              >
                <span>Ask Leo</span>
                <div className="h-3.5 w-3.5 flex items-center justify-center text-primary-foreground">
                  <Leo />
                </div>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Blink cursor keyframe */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </header>
  );
}
