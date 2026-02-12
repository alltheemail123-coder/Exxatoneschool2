/**
 * Date formatting utilities for consistent date display across the application
 * All dates should use MM/DD/YYYY format as per design guidelines
 */

/**
 * Formats a date to MM/DD/YYYY format
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date string in MM/DD/YYYY format
 */
export const formatDate = (date: string | Date | number): string => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    });
  } catch (error) {
    console.warn('Invalid date provided to formatDate:', date);
    return '';
  }
};

/**
 * Formats a date range with consistent MM/DD/YYYY format
 * @param startDate - Start date string, Date object, or timestamp
 * @param endDate - End date string, Date object, or timestamp
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: string | Date | number, 
  endDate: string | Date | number
): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (!start || !end) return '';
  
  return `${start} - ${end}`;
};

/**
 * Formats a date to short format (MMM DD, YYYY) for space-constrained areas
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date string in short format
 */
export const formatDateShort = (date: string | Date | number): string => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch (error) {
    console.warn('Invalid date provided to formatDateShort:', date);
    return '';
  }
};

/**
 * Formats a date range with short format for tables and compact displays
 * @param startDate - Start date string, Date object, or timestamp
 * @param endDate - End date string, Date object, or timestamp
 * @returns Formatted short date range string
 */
export const formatDateRangeShort = (
  startDate: string | Date | number, 
  endDate: string | Date | number
): string => {
  const start = formatDateShort(startDate);
  const end = formatDateShort(endDate);
  
  if (!start || !end) return '';
  
  // If same year, show "Mar 15 - May 10, 2024"
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  
  if (startYear === endYear) {
    const startShort = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
    return `${startShort} - ${end}`;
  }
  
  return `${start} - ${end}`;
};

/**
 * Formats a date to relative format (e.g., "2 days ago", "1 week ago")
 * @param date - Date string, Date object, or timestamp
 * @returns Relative time string
 */
export const formatDateRelative = (date: string | Date | number): string => {
  if (!date) return '';
  
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
      }
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else {
      return formatDate(date); // Fall back to standard format for older dates
    }
  } catch (error) {
    console.warn('Invalid date provided to formatDateRelative:', date);
    return '';
  }
};

/**
 * Checks if a date is valid
 * @param date - Date string, Date object, or timestamp
 * @returns True if date is valid, false otherwise
 */
export const isValidDate = (date: string | Date | number): boolean => {
  try {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  } catch {
    return false;
  }
};

/**
 * Gets current date in MM/DD/YYYY format
 * @returns Current date formatted as MM/DD/YYYY
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

/**
 * Parses a MM/DD/YYYY date string to Date object
 * @param dateString - Date string in MM/DD/YYYY format
 * @returns Date object or null if invalid
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  try {
    // Handle MM/DD/YYYY format specifically
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      const date = new Date(year, month, day);
      return isValidDate(date) ? date : null;
    }
    
    // Fallback to standard Date parsing
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
  } catch {
    return null;
  }
};

/**
 * Formats days until a future date in human-readable format
 * @param days - Number of days until the date
 * @returns Formatted string like "30 days", "1 month", "1m 14d", "1 year"
 */
export const formatDaysUntil = (days: number): string => {
  if (days < 0) return '0 days';
  
  // Less than 60 days: show as days
  if (days < 60) {
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  
  // 60 days to 1 year: show as months and days
  if (days < 365) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    
    if (remainingDays === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    
    return `${months}m ${remainingDays}d`;
  }
  
  // 1 year or more
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  
  if (remainingDays < 30) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  
  const months = Math.floor(remainingDays / 30);
  return `${years}y ${months}m`;
};