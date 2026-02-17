import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: STRAPI_API_TOKEN ? {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`
  } : {}
});

// Submit testnet access request
export const submitAccessRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      role,
      organization,
      projectDescription,
      rails,
      projectStage,
      blockchainExperience,
      preferredLanguages,
      referralSource,
      additionalNotes
    } = req.body;

    if (!fullName || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and role are required'
      });
    }

    const response = await strapiClient.post('/access-requests', {
      data: {
        fullName,
        email,
        role,
        organization,
        projectDescription,
        rails: Array.isArray(rails) ? rails.join(', ') : rails,
        projectStage,
        blockchainExperience,
        preferredLanguages: Array.isArray(preferredLanguages) ? preferredLanguages.join(', ') : preferredLanguages,
        referralSource,
        additionalNotes,
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      message: 'Access request submitted successfully',
      data: response.data.data || response.data
    });
  } catch (error) {
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.response.data.error?.message || 'Invalid request data'
      });
    }

    console.error('Error submitting access request:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to submit access request'
    });
  }
};
