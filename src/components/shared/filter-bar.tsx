import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Card } from "../ui/card";
import {
  Plus,
  X,
  ChevronDown,
  MapPin,
  GraduationCap,
  Users,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "../ui/utils";

export interface FilterConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: string[];
}

export interface ActiveFilter {
  id: string;
  key: string;
  label: string;
  values: string[];
}

interface FilterBarProps {
  filterConfigs: FilterConfig[];
  activeFilters: ActiveFilter[];
  onAddFilter: (filterKey: string) => void;
  onToggleFilterValue: (filterId: string, value: string) => void;
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
  className?: string;
}

export default function FilterBar({
  filterConfigs,
  activeFilters,
  onAddFilter,
  onToggleFilterValue,
  onRemoveFilter,
  onClearAll,
  className = "",
}: FilterBarProps) {
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  const addedFilterKeys = activeFilters.map(filter => filter.key);
  const availableFilters = filterConfigs.filter(
    config => !addedFilterKeys.includes(config.key)
  );

  const handleAddFilter = (filterKey: string) => {
    onAddFilter(filterKey);
    setTimeout(() => {
      const newFilter = activeFilters.find(f => f.key === filterKey);
      if (newFilter) {
        setOpenFilterId(newFilter.id);
      }
    }, 0);
  };

  const getDisplayText = (filter: ActiveFilter) => {
    if (filter.values.length === 0) {
      return filter.label;
    } else if (filter.values.length === 1) {
      return `${filter.label}: ${filter.values[0]}`;
    } else {
      return `${filter.label}: ${filter.values.length} selected`;
    }
  };

  const getFilterConfig = (filterKey: string) => {
    return filterConfigs.find(config => config.key === filterKey);
  };

  const hasActiveFilters = activeFilters.some(filter => filter.values.length > 0);

  const handleSearchChange = (filterId: string, searchTerm: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterId]: searchTerm
    }));
  };

  const getFilteredOptions = (filter: ActiveFilter) => {
    const config = getFilterConfig(filter.key);
    if (!config) return [];
    
    const searchTerm = searchTerms[filter.id] || '';
    if (!searchTerm) return config.options;
    
    return config.options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const clearAllFilterValues = (filterId: string) => {
    const filter = activeFilters.find(f => f.id === filterId);
    if (filter) {
      // Clear all selected values for this filter
      filter.values.forEach(value => onToggleFilterValue(filterId, value));
    }
  };

  return (
    <div className={cn(
      "p-4 bg-background",
      className
    )} role="region" aria-label="Filters">
      <div className="flex items-center gap-2 flex-wrap">
        {availableFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                aria-label="Add filter"
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-50">
              {availableFilters.map((config) => {
                const Icon = config.icon;
                return (
                  <DropdownMenuItem 
                    key={config.key} 
                    onClick={() => handleAddFilter(config.key)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {config.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {activeFilters.map((filter) => {
          const config = getFilterConfig(filter.key);
          if (!config) return null;
          
          const Icon = config.icon;
          const hasValues = filter.values.length > 0;
          const showSearch = config.options.length > 10;
          const filteredOptions = getFilteredOptions(filter);
          
          return (
            <div key={filter.id} className="flex items-center gap-1">
              <DropdownMenu 
                open={openFilterId === filter.id} 
                onOpenChange={(open) => {
                  setOpenFilterId(open ? filter.id : null);
                  if (!open) {
                    // Clear search term when closing
                    setSearchTerms(prev => ({
                      ...prev,
                      [filter.id]: ''
                    }));
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "max-w-[200px] gap-1 justify-start",
                      hasValues && "border-chart-1 bg-chart-1/10 text-chart-1 font-medium"
                    )}
                    aria-label={`Filter by ${getDisplayText(filter)}`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{getDisplayText(filter)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 z-50">
                  <div className="px-2 py-1.5 text-sm font-semibold border-b border-border">
                    {filter.label} is
                  </div>
                  
                  {showSearch && (
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search options..."
                          value={searchTerms[filter.id] || ''}
                          onChange={(e) => handleSearchChange(filter.id, e.target.value)}
                          className="pl-8 h-8 text-sm"
                          autoFocus
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="max-h-48 overflow-y-auto" role="listbox">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <div 
                          key={option}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-accent cursor-pointer rounded-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            onToggleFilterValue(filter.id, option);
                          }}
                          role="option"
                          aria-selected={filter.values.includes(option)}
                        >
                          <Checkbox 
                            checked={filter.values.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked !== filter.values.includes(option)) {
                                onToggleFilterValue(filter.id, option);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Toggle ${option}`}
                          />
                          <span className="text-sm flex-1 select-none">{option}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No options found
                      </div>
                    )}
                  </div>
                  
                  {filter.values.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => clearAllFilterValues(filter.id)}
                        className="text-sm text-muted-foreground"
                      >
                        Clear all selections
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFilter(filter.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}

        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll} 
            className="h-7"
            aria-label="Clear all filters"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
