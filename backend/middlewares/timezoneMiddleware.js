/**
 * Timezone Middleware for UTC handling
 * Extracts user's timezone from request headers and validates it
 * All timestamps are stored in UTC in database
 */

/**
 * Comprehensive timezone list supporting IANA timezone database
 */
const VALID_TIMEZONES = [
  // UTC
  'UTC', 'GMT',
  
  // Americas - North America
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Canada/Eastern',
  'Canada/Central',
  'Canada/Mountain',
  'Canada/Pacific',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  'America/Bogota',
  'America/Lima',
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  
  // Europe
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Rome',
  'Europe/Vienna',
  'Europe/Prague',
  'Europe/Warsaw',
  'Europe/Athens',
  'Europe/Dublin',
  'Europe/Lisbon',
  
  // Asia
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Singapore',
  'Asia/Manila',
  'Asia/Jakarta',
  'Asia/Karachi',
  'Asia/Katmandu',
  
  // Africa
  'Africa/Johannesburg',
  'Africa/Cairo',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Casablanca',
  
  // Australia & Pacific
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Perth',
  'Australia/Adelaide',
  'Pacific/Auckland',
  'Pacific/Fiji',
  'Pacific/Honolulu'
];

/**
 * Timezone validation middleware
 * Validates and attaches timezone to request object
 */
export const timezoneMiddleware = (req, res, next) => {
  try {
    // Get timezone from header or default to UTC
    let timezone = req.headers['x-timezone'] || 'UTC';

    // Validate timezone
    if (!VALID_TIMEZONES.includes(timezone)) {
      console.warn(`Invalid timezone: ${timezone}, defaulting to UTC`);
      timezone = 'UTC';
    }

    // Attach timezone to request
    req.timezone = timezone;
    req.utcTimestamp = new Date().toISOString();

    next();
  } catch (error) {
    console.error('Timezone middleware error:', error);
    req.timezone = 'UTC';
    next();
  }
};

/**
 * Get UTC timestamp
 * @returns {string} ISO 8601 UTC timestamp
 */
export const getUTCTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Get UTC date object
 * @returns {Date} UTC date
 */
export const getUTCDate = () => {
  return new Date();
};

/**
 * Convert any date to UTC ISO string
 * @param {Date|string|number} date - Date to convert
 * @returns {string} ISO 8601 UTC timestamp
 */
export const toUTC = (date) => {
  if (!date) return getUTCTimestamp();
  
  const d = new Date(date);
  return isNaN(d.getTime()) ? getUTCTimestamp() : d.toISOString();
};

/**
 * Get current timestamp in UTC format for database storage
 * @returns {Date} UTC date object for MongoDB
 */
export const dbTimestamp = () => {
  return new Date(Date.now());
};
