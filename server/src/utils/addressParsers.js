// Address parsing utilities for different countries

/**
 * Parse US address format: "Street, City, State ZIP"
 * Example: "4900 Meridian Street, Normal, Alabama 35762"
 */
const parseUSAAddress = (addressString) => {
  if (!addressString || typeof addressString !== 'string') {
    return { address: '', city: '', state: '', zipCode: '' };
  }

  // Pattern: "Street Address, City, State ZIP" or "Street Address, City, State ZIP-XXXX"
  const pattern = /^([^,]+),\s*([^,]+),\s*([A-Za-z\s]+?)\s+(\d{5}(?:-\d{4})?)$/;
  const match = addressString.trim().match(pattern);

  if (match) {
    return {
      address: match[1].trim(),
      city: match[2].trim(),
      state: match[3].trim(),
      zipCode: match[4].trim()
    };
  }

  // Fallback: If parsing fails, store entire address string in address field
  return {
    address: addressString.trim(),
    city: '',
    state: '',
    zipCode: ''
  };
};

/**
 * Parse Canadian address format (future implementation)
 * Example: "123 Main St, Toronto, Ontario M5H 2N2"
 */
const parseCanadaAddress = (addressString) => {
  if (!addressString || typeof addressString !== 'string') {
    return { address: '', city: '', state: '', zipCode: '' };
  }

  // TODO: Implement Canada-specific address parsing
  // For now, use simple parsing similar to USA
  const pattern = /^([^,]+),\s*([^,]+),\s*([A-Za-z\s]+?)\s+([A-Z]\d[A-Z]\s?\d[A-Z]\d)$/i;
  const match = addressString.trim().match(pattern);

  if (match) {
    return {
      address: match[1].trim(),
      city: match[2].trim(),
      state: match[3].trim(), // Province in Canada
      zipCode: match[4].trim() // Postal code
    };
  }

  // Fallback
  return {
    address: addressString.trim(),
    city: '',
    state: '',
    zipCode: ''
  };
};

/**
 * Parse UK address format (future implementation)
 * Example: "10 Downing Street, London, SW1A 2AA"
 */
const parseUKAddress = (addressString) => {
  if (!addressString || typeof addressString !== 'string') {
    return { address: '', city: '', state: '', zipCode: '' };
  }

  // TODO: Implement UK-specific address parsing
  // UK doesn't have states, so we'll leave state empty
  // Fallback for now
  return {
    address: addressString.trim(),
    city: '',
    state: '',
    zipCode: ''
  };
};

// Country-specific parsers
export const addressParsers = {
  USA: parseUSAAddress,
  Canada: parseCanadaAddress,
  UK: parseUKAddress,
  // Add more countries as needed
};

/**
 * Main address parsing function
 * @param {string} addressString - The full address string to parse
 * @param {string} country - The country code (e.g., 'USA', 'Canada', 'UK')
 * @returns {Object} Parsed address components: { address, city, state, zipCode }
 */
export const parseAddress = (addressString, country) => {
  // Get the appropriate parser for the country
  const parser = addressParsers[country];

  if (!parser) {
    // No parser for this country, return fallback
    return {
      address: addressString ? addressString.trim() : '',
      city: '',
      state: '',
      zipCode: ''
    };
  }

  return parser(addressString);
};

export default parseAddress;
