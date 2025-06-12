/**
 * Formats a date into a human-readable string
 * @param date The date to format
 * @param options Optional formatting options
 * @returns A formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  options: {
    format?: 'short' | 'long' | 'relative';
    includeTime?: boolean;
  } = {}
): string => {
  const { format = 'short', includeTime = false } = options;
  
  // Convert to Date object if string or number
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  // For relative time formatting
  if (format === 'relative') {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  // Default formatting options
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  };
  
  // Add time if requested
  if (includeTime) {
    dateFormatOptions.hour = '2-digit';
    dateFormatOptions.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('en-US', dateFormatOptions).format(dateObj);
};
