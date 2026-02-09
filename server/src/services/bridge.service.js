import crypto from 'crypto';
import BridgeLink from '../models/BridgeLink.js';

const EXCHANGE_API_URL = process.env.EXCHANGE_API_URL || 'http://localhost:8000';
const EXCHANGE_BRIDGE_SECRET = process.env.EXCHANGE_BRIDGE_SECRET || '';
const CFC_SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';
const STATE_TOKEN_EXPIRY_MINUTES = 15;

/**
 * Make an authenticated request to the Exchange bridge API.
 * Uses X-Bridge-Secret header for server-to-server auth.
 */
const exchangeRequest = async (path, method = 'GET', body = null) => {
  const url = `${EXCHANGE_API_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Bridge-Secret': EXCHANGE_BRIDGE_SECRET
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || `Exchange API error: ${response.status}`);
    error.statusCode = response.status;
    error.exchangeResponse = data;
    throw error;
  }

  return data;
};

/**
 * Generate a crypto-random state token and store it in BridgeLink.
 * Returns the BridgeLink document.
 */
export const generateStateToken = async (userId) => {
  const stateToken = crypto.randomBytes(32).toString('hex');
  const stateTokenExpiresAt = new Date(Date.now() + STATE_TOKEN_EXPIRY_MINUTES * 60 * 1000);

  // Upsert: create or update the pending link for this user
  const bridgeLink = await BridgeLink.findOneAndUpdate(
    { user: userId, status: 'pending' },
    {
      stateToken,
      stateTokenExpiresAt,
      status: 'pending'
    },
    { upsert: true, new: true }
  );

  return bridgeLink;
};

/**
 * Build the Exchange authorize URL that the user will visit.
 */
export const getExchangeAuthorizeUrl = (stateToken, cfcEmail = '') => {
  const callbackUrl = `${CFC_SERVER_URL}/api/bridge/callback`;
  let url = `${EXCHANGE_API_URL}/api/bridge/authorize?state=${stateToken}&callback=${encodeURIComponent(callbackUrl)}`;
  if (cfcEmail) {
    url += `&cfcEmail=${encodeURIComponent(cfcEmail)}`;
  }
  return url;
};

/**
 * Exchange an auth code (from Exchange callback) for link data.
 * Calls Exchange API: POST /api/bridge/exchange-code
 * Expected response: { success: true, data: { exchangeUserId, email } }
 */
export const exchangeCodeForLink = async (code, stateToken) => {
  const data = await exchangeRequest('/api/bridge/exchange-code', 'POST', {
    code,
    state: stateToken
  });

  return data.data; // { exchangeUserId, email }
};

/**
 * Revoke a bridge link on the Exchange side.
 * Calls Exchange API: POST /api/bridge/revoke
 */
export const revokeExchangeLink = async (exchangeUserId) => {
  await exchangeRequest('/api/bridge/revoke', 'POST', {
    cfcUserId: exchangeUserId
  });
};

/**
 * Migrate wallet balances to the Exchange.
 * Calls Exchange API: POST /api/bridge/migrate
 * Expected response: { success: true, data: { transactionId } }
 */
export const migrateBalancesToExchange = async (exchangeUserId, walletSnapshots) => {
  const data = await exchangeRequest('/api/bridge/migrate', 'POST', {
    cfcUserId: exchangeUserId,
    wallets: walletSnapshots.map(ws => ({
      cfcWalletId: ws._id.toString(),
      collegeCfcId: ws.college.toString(),
      tokenSymbol: ws.collegeTicker || ws.collegeName,
      amount: ws.balance
    }))
  });

  return data.data; // { transactionId }
};

/**
 * Check if a bridge link is still active on the Exchange side.
 * Calls Exchange API: GET /api/bridge/check-link/:exchangeUserId
 */
export const checkExchangeLinkStatus = async (exchangeUserId) => {
  const data = await exchangeRequest(`/api/bridge/check-link/${exchangeUserId}`);
  return data.data; // { active: true/false }
};
