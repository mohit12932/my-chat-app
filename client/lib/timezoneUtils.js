// Timezone Utilities for UTC handling

/**
 * Get current UTC timestamp
 * @returns {string} ISO 8601 UTC timestamp
 */
export const getCurrentUTCTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Get timezone headers for API requests
 * @returns {Object} Headers with timezone
 */
export const getTimezoneHeaders = () => {
  return {
    'X-Timezone': getUserTimezone()
  };
};

/**
 * Convert any date to UTC ISO string
 * @param {Date|string|number} date - Date to convert
 * @returns {string} ISO 8601 UTC timestamp
 */
export const toUTC = (date) => {
  if (!date) return getCurrentUTCTimestamp();
  
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return getCurrentUTCTimestamp();
  }
  
  return d.toISOString();
};

/**
 * Format UTC date for display
 * @param {Date|string} date - Date to format
 * @param {string} timeZone - User's timezone (e.g., 'America/New_York')
 * @returns {string} Formatted date string
 */
export const formatUTCDate = (date, timeZone = 'UTC') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short'
  };

  return new Intl.DateTimeFormat('en-US', options).format(d);
};

/**
 * Get time ago from a UTC timestamp (e.g., "5 minutes ago")
 * @param {Date|string} date - UTC date
 * @returns {string} Relative time string
 */
export const getTimeAgo = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const secondsAgo = Math.floor((now - d) / 1000);

  if (secondsAgo < 60) return 'just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;

  return formatUTCDate(date);
};

/**
 * Format UTC date as HH:MM
 * @param {Date|string} date - UTC date
 * @returns {string} Time string (HH:MM)
 */
export const formatTime = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

/**
 * Format UTC date as simple date (MMM DD, YYYY)
 * @param {Date|string} date - UTC date
 * @returns {string} Date string
 */
export const formatSimpleDate = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(d);
};

/**
 * Check if two UTC dates are on the same day
 * @param {Date|string} date1 - First UTC date
 * @param {Date|string} date2 - Second UTC date
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;

  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};

/**
 * Get user's local timezone offset
 * @returns {number} Offset in minutes
 */
export const getTimezoneOffset = () => {
  return new Date().getTimezoneOffset();
};

/**
 * Get user's timezone identifier (e.g., 'America/New_York')
 * @returns {string} Timezone identifier
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert UTC date to user's local timezone
 * @param {Date|string} utcDate - UTC date
 * @param {string} timeZone - Target timezone
 * @returns {Date} Date object in local timezone
 */
export const convertUTCToTimezone = (utcDate, timeZone = getUserTimezone()) => {
  const d = new Date(utcDate);
  if (isNaN(d.getTime())) return new Date();

  return d;
};

/**
 * Get difference in minutes between now and a UTC timestamp
 * @param {Date|string} date - UTC date
 * @returns {number} Difference in minutes
 */
export const getMinutesDiff = (date) => {
  if (!date) return 0;

  const d = new Date(date);
  if (isNaN(d.getTime())) return 0;

  const now = new Date();
  return Math.floor((now - d) / 60000);
};
