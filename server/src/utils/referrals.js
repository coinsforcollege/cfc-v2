/**
 * Referral utility functions
 */

// Maximum number of referrals that count toward bonus rate per college
export const REFERRAL_LIMIT_PER_COLLEGE = 10;

/**
 * Get the capped referral count for bonus calculation
 * Only the first REFERRAL_LIMIT_PER_COLLEGE referrals count toward bonus rates
 * @param {Array} referredUsers - Array of referred users
 * @returns {number} - Capped referral count (max 10)
 */
export const getCappedReferralCount = (referredUsers) => {
  const totalReferrals = referredUsers?.length || 0;
  return Math.min(totalReferrals, REFERRAL_LIMIT_PER_COLLEGE);
};

/**
 * Calculate referral bonus rate for a college
 * @param {number} totalReferrals - Total number of referrals
 * @param {number} referralBonusRate - Bonus rate per referral (tokens/hour)
 * @returns {number} - Total referral bonus rate (capped at 10 referrals)
 */
export const calculateReferralBonus = (totalReferrals, referralBonusRate) => {
  const cappedReferrals = Math.min(totalReferrals, REFERRAL_LIMIT_PER_COLLEGE);
  return cappedReferrals * referralBonusRate;
};

