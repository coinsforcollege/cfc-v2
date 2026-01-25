import mongoose from 'mongoose';
import ScholarshipOffer from '../models/ScholarshipOffer.js';
import StudentOfferResponse from '../models/StudentOfferResponse.js';
import ScholarshipWallet from '../models/ScholarshipWallet.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import College from '../models/College.js';
import Notification from '../models/Notification.js';
import { createNotification } from '../services/notification.service.js';

// Helper to check if student matches offer targeting
const studentMatchesTargeting = async (studentId, offer) => {
  const targeting = offer.targeting;

  // If targeting type is 'all', everyone matches
  if (targeting.type === 'all') {
    return true;
  }

  // If targeting type is 'individual', check if student is in the list
  if (targeting.type === 'individual') {
    return targeting.students.some(s => s.toString() === studentId.toString());
  }

  // For other targeting types, get student data
  const student = await User.findById(studentId).select('userProfile.country userProfile.gradeLevel');
  const wallet = await ScholarshipWallet.findOne({ user: studentId });

  // Check country targeting
  if (targeting.type === 'country' || targeting.type === 'combined') {
    if (targeting.countries && targeting.countries.length > 0) {
      const studentCountry = student?.userProfile?.country?.toLowerCase();
      const matches = targeting.countries.some(c => c.toLowerCase() === studentCountry);
      if (targeting.type === 'country') return matches;
      if (!matches) return false;
    }
  }

  // Check grade level targeting
  if (targeting.type === 'gradeLevel' || targeting.type === 'combined') {
    if (targeting.gradeLevels && targeting.gradeLevels.length > 0) {
      const studentGrade = student?.userProfile?.gradeLevel;
      const matches = targeting.gradeLevels.includes(studentGrade);
      if (targeting.type === 'gradeLevel') return matches;
      if (!matches) return false;
    }
  }

  // Check points range targeting
  if (targeting.type === 'pointsRange' || targeting.type === 'combined') {
    const studentPoints = wallet?.balance || 0;
    const { min, max } = targeting.pointsRange;
    if (min !== null && studentPoints < min) return false;
    if (max !== null && studentPoints > max) return false;
    if (targeting.type === 'pointsRange') return true;
  }

  return true;
};

// @desc    Get offers available to the student
// @route   GET /api/student-offers
// @access  Private (Student only)
export const getMyOffers = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;

    // Get student's existing responses
    const existingResponses = await StudentOfferResponse.find({ student: studentId });
    const respondedOfferIds = existingResponses.map(r => r.offer.toString());

    // Build query based on status filter
    let offers = [];
    let total = 0;

    if (status === 'accepted' || status === 'rejected') {
      // Get offers the student has responded to with this status
      const responses = await StudentOfferResponse.find({
        student: studentId,
        status: status
      })
        .populate({
          path: 'offer',
          populate: { path: 'college', select: 'name logo country' }
        })
        .sort({ respondedAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));

      offers = responses.map(r => ({
        ...r.offer.toObject(),
        responseStatus: r.status,
        respondedAt: r.respondedAt
      }));

      total = await StudentOfferResponse.countDocuments({
        student: studentId,
        status: status
      });
    } else {
      // Get active offers the student hasn't responded to yet
      const activeOffers = await ScholarshipOffer.find({
        status: 'active',
        $or: [
          { expiryDate: null },
          { expiryDate: { $gt: new Date() } }
        ]
      })
        .populate('college', 'name logo country')
        .sort({ isRecommended: -1, createdAt: -1 });

      // Filter offers based on targeting and exclude already responded
      const eligibleOffers = [];
      for (const offer of activeOffers) {
        if (respondedOfferIds.includes(offer._id.toString())) continue;
        const matches = await studentMatchesTargeting(studentId, offer);
        if (matches) {
          eligibleOffers.push(offer);
        }
      }

      total = eligibleOffers.length;
      offers = eligibleOffers.slice(
        (parseInt(page) - 1) * parseInt(limit),
        parseInt(page) * parseInt(limit)
      );
    }

    res.status(200).json({
      success: true,
      data: offers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get a single random recommended offer
// @route   GET /api/student-offers/recommended
// @access  Private (Student only)
export const getRecommendedOffer = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get offers the student has already responded to
    const existingResponses = await StudentOfferResponse.find({ student: studentId });
    const respondedOfferIds = existingResponses.map(r => r.offer.toString());

    // Find recommended active offers
    const recommendedOffers = await ScholarshipOffer.find({
      status: 'active',
      isRecommended: true,
      _id: { $nin: respondedOfferIds.map(id => new mongoose.Types.ObjectId(id)) },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    }).populate('college', 'name logo country coverImage');

    // Filter by targeting eligibility
    const eligibleOffers = [];
    for (const offer of recommendedOffers) {
      const matches = await studentMatchesTargeting(studentId, offer);
      if (matches) {
        eligibleOffers.push(offer);
      }
    }

    if (eligibleOffers.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No recommended offers available'
      });
    }

    // Return a random one
    const randomIndex = Math.floor(Math.random() * eligibleOffers.length);
    const offer = eligibleOffers[randomIndex];

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get offer details
// @route   GET /api/student-offers/:id
// @access  Private (Student only)
export const getOfferDetails = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;

    const offer = await ScholarshipOffer.findOne({
      _id: id,
      status: { $in: ['active', 'expired'] }
    }).populate('college', 'name logo country coverImage description website');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Check if student has already responded
    const existingResponse = await StudentOfferResponse.findOne({
      student: studentId,
      offer: id
    });

    // Check targeting eligibility
    const isEligible = await studentMatchesTargeting(studentId, offer);

    res.status(200).json({
      success: true,
      data: {
        offer,
        existingResponse: existingResponse ? {
          status: existingResponse.status,
          respondedAt: existingResponse.respondedAt
        } : null,
        isEligible
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Accept an offer with documents
// @route   POST /api/student-offers/:id/accept
// @access  Private (Student only)
export const acceptOffer = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;
    const { submittedDocuments } = req.body;

    // Find the offer
    const offer = await ScholarshipOffer.findOne({
      _id: id,
      status: 'active'
    }).populate('college', 'name admin');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found or no longer active'
      });
    }

    // Check if offer is expired
    if (offer.expiryDate && new Date() > offer.expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'This offer has expired'
      });
    }

    // Check if student already responded
    const existingResponse = await StudentOfferResponse.findOne({
      student: studentId,
      offer: id
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: `You have already ${existingResponse.status} this offer`
      });
    }

    // Check targeting eligibility
    const isEligible = await studentMatchesTargeting(studentId, offer);
    if (!isEligible) {
      return res.status(400).json({
        success: false,
        message: 'You are not eligible for this offer'
      });
    }

    // Validate required documents
    const requiredDocs = offer.requiredDocuments.filter(d => d.required);
    if (requiredDocs.length > 0) {
      if (!submittedDocuments || submittedDocuments.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Required documents must be submitted'
        });
      }

      // Verify all required documents are provided
      for (const reqDoc of requiredDocs) {
        const submitted = submittedDocuments.find(
          s => s.requiredDocId === reqDoc._id.toString()
        );
        if (!submitted) {
          return res.status(400).json({
            success: false,
            message: `Required document "${reqDoc.name}" is missing`
          });
        }

        // Verify the document exists and belongs to the student
        const doc = await Document.findOne({
          _id: submitted.documentId,
          user: studentId
        });
        if (!doc) {
          return res.status(400).json({
            success: false,
            message: `Document for "${reqDoc.name}" not found`
          });
        }
      }
    }

    // Create response with submitted documents
    const formattedDocs = submittedDocuments ? submittedDocuments.map(s => ({
      requiredDocId: s.requiredDocId,
      document: s.documentId,
      submittedAt: new Date()
    })) : [];

    const response = new StudentOfferResponse({
      student: studentId,
      offer: id,
      status: 'accepted',
      submittedDocuments: formattedDocs,
      respondedAt: new Date()
    });

    await response.save();

    // Create notification for college admin
    if (offer.college.admin) {
      const student = await User.findById(studentId).select('name');
      await createNotification({
        recipient: offer.college.admin,
        type: 'scholarship_offer_accepted',
        title: 'Scholarship Offer Accepted',
        message: `${student.name} has accepted your scholarship offer: ${offer.title}`,
        category: 'scholarship',
        data: {
          offerId: offer._id,
          studentId: studentId,
          studentName: student.name
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer accepted successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject an offer
// @route   POST /api/student-offers/:id/reject
// @access  Private (Student only)
export const rejectOffer = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;
    const { reason } = req.body;

    // Find the offer
    const offer = await ScholarshipOffer.findOne({
      _id: id,
      status: 'active'
    }).populate('college', 'name admin');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found or no longer active'
      });
    }

    // Check if student already responded
    const existingResponse = await StudentOfferResponse.findOne({
      student: studentId,
      offer: id
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: `You have already ${existingResponse.status} this offer`
      });
    }

    // Create rejection response
    const response = new StudentOfferResponse({
      student: studentId,
      offer: id,
      status: 'rejected',
      rejectionReason: reason || null,
      respondedAt: new Date()
    });

    await response.save();

    // Create notification for college admin
    if (offer.college.admin) {
      const student = await User.findById(studentId).select('name');
      await createNotification({
        recipient: offer.college.admin,
        type: 'scholarship_offer_rejected',
        title: 'Scholarship Offer Declined',
        message: `${student.name} has declined your scholarship offer: ${offer.title}`,
        category: 'scholarship',
        data: {
          offerId: offer._id,
          studentId: studentId,
          studentName: student.name
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer declined',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
