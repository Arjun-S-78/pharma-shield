// Utility to generate mobile-scannable QR URLs for cold-chain consignments

const DEFAULT_LAN_IP = '10.24.247.46';
const DEFAULT_PORT = '3000';
const STORAGE_KEY = 'pharmashield_mobile_host';

export const getDefaultHost = () => {
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // If user is already browsing on a LAN IP or public domain, use that origin
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return window.location.host;
    }
  }
  return `${DEFAULT_LAN_IP}:${DEFAULT_PORT}`;
};

export const getConfiguredHost = () => {
  if (typeof window === 'undefined') return `${DEFAULT_LAN_IP}:${DEFAULT_PORT}`;
  
  // If user is accessing via non-localhost, always prioritize that host
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return window.location.host;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored.trim()) {
    return stored.trim();
  }
  return `${DEFAULT_LAN_IP}:${DEFAULT_PORT}`;
};

export const setConfiguredHost = (host) => {
  if (typeof window !== 'undefined') {
    if (!host || host.trim() === '') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      // Remove any http:// or https:// prefix and trailing slashes
      const cleaned = host.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
      localStorage.setItem(STORAGE_KEY, cleaned);
    }
  }
};

export const resetConfiguredHost = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Returns the exact public URL encoded in the QR code for mobile scanning.
 * When scanned by iPhone / Android camera, it opens directly to the complete journey pass.
 */
export const getPublicJourneyUrl = (shipmentId = 'PHARMA-001') => {
  const host = getConfiguredHost();
  const protocol = (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'https:' : 'http:';
  return `${protocol}//${host}/journey/${shipmentId}`;
};

export const getAlternativeVerifyUrl = (shipmentId = 'PHARMA-001') => {
  const host = getConfiguredHost();
  const protocol = (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'https:' : 'http:';
  return `${protocol}//${host}/qr-verification?shipment=${shipmentId}`;
};
