import User from '../models/User.js';
import College from '../models/College.js';
import CollegeReadinessChecklist from '../models/CollegeReadinessChecklist.js';
import Document from '../models/Document.js';
import ScholarshipWallet from '../models/ScholarshipWallet.js';
import { generateCollegeReadinessChecklist } from '../utils/openai.js';

// Fields of study options
const FIELDS_OF_STUDY = [
  'Humanities',
  'Science',
  'Business & Finance',
  'Computer Science',
  'Engineering',
  'Medical',
  'Media & Entertainment',
  'Photography & Filmmaking',
  'Arts & Craft',
  'Skill Based Education'
];

// Tier configurations (matching frontend)
const TIER_CONFIGS = [
  {
    id: 'ivy',
    name: 'Ivy League',
    weeklyRate: 300,
    color: '#3B82F6',
    description: 'Top tier universities'
  },
  {
    id: 'tier1',
    name: 'Tier 1',
    weeklyRate: 200,
    color: '#8B5CF6',
    description: 'Highly competitive schools'
  },
  {
    id: 'tier2',
    name: 'Tier 2',
    weeklyRate: 100,
    color: '#22C55E',
    description: 'Competitive schools'
  },
  {
    id: 'regional',
    name: 'Regional',
    weeklyRate: 50,
    color: '#F97316',
    description: 'Regional universities'
  }
];

// Common languages list
const COMMON_LANGUAGES = [
  'English',
  'Spanish',
  'Mandarin',
  'Hindi',
  'French',
  'Arabic',
  'Portuguese',
  'Bengali',
  'Russian',
  'Japanese',
  'German',
  'Korean',
  'Italian',
  'Turkish',
  'Vietnamese',
  'Thai',
  'Dutch',
  'Greek',
  'Polish',
  'Swedish'
];

/**
 * @desc    Check if user has required basic data for college readiness
 * @route   GET /api/college-readiness/check-basic-data
 * @access  Private (Student)
 */
export const checkBasicData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userProfile = user.userProfile || {};
    const missingFields = [];

    // Check required fields
    if (!userProfile.gradeLevel) {
      missingFields.push('gradeLevel');
    }
    if (!userProfile.country) {
      missingFields.push('country');
    }
    if (!userProfile.desiredCollegeCountries || userProfile.desiredCollegeCountries.length === 0) {
      missingFields.push('desiredCollegeCountries');
    }

    const hasBasicData = missingFields.length === 0;

    // Also check if user has an active checklist
    const activeChecklist = userProfile.collegeReadiness?.activeChecklistId
      ? await CollegeReadinessChecklist.findById(userProfile.collegeReadiness.activeChecklistId)
      : null;

    res.status(200).json({
      success: true,
      data: {
        hasBasicData,
        missingFields,
        currentData: {
          gradeLevel: userProfile.gradeLevel || null,
          country: userProfile.country || null,
          desiredCollegeCountries: userProfile.desiredCollegeCountries || []
        },
        hasActiveChecklist: !!activeChecklist,
        activeChecklistId: activeChecklist?._id || null,
        collegeReadiness: {
          hasGeneratedChecklist: userProfile.collegeReadiness?.hasGeneratedChecklist || false,
          lastChecklistGeneratedAt: userProfile.collegeReadiness?.lastChecklistGeneratedAt || null
        }
      }
    });
  } catch (error) {
    console.error('Error checking basic data:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking basic data',
      error: error.message
    });
  }
};

/**
 * @desc    Update basic profile data
 * @route   PUT /api/college-readiness/basic-data
 * @access  Private (Student)
 */
export const updateBasicData = async (req, res) => {
  try {
    const { gradeLevel, country, desiredCollegeCountries } = req.body;

    // Validate inputs
    const validGradeLevels = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    if (gradeLevel && !validGradeLevels.includes(gradeLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid grade level'
      });
    }

    if (desiredCollegeCountries && !Array.isArray(desiredCollegeCountries)) {
      return res.status(400).json({
        success: false,
        message: 'desiredCollegeCountries must be an array'
      });
    }

    // Build update object
    const updateFields = {};
    if (gradeLevel) {
      updateFields['userProfile.gradeLevel'] = gradeLevel;
    }
    if (country) {
      updateFields['userProfile.country'] = country.trim();
    }
    if (desiredCollegeCountries && desiredCollegeCountries.length > 0) {
      updateFields['userProfile.desiredCollegeCountries'] = desiredCollegeCountries.map(c => c.trim());
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Basic data updated successfully',
      data: {
        gradeLevel: user.userProfile.gradeLevel,
        country: user.userProfile.country,
        desiredCollegeCountries: user.userProfile.desiredCollegeCountries
      }
    });
  } catch (error) {
    console.error('Error updating basic data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating basic data',
      error: error.message
    });
  }
};

/**
 * @desc    Get form options for college readiness form
 * @route   GET /api/college-readiness/form-options
 * @access  Private (Student)
 */
export const getFormOptions = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        fieldsOfStudy: FIELDS_OF_STUDY,
        tiers: TIER_CONFIGS,
        commonLanguages: COMMON_LANGUAGES
      }
    });
  } catch (error) {
    console.error('Error getting form options:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting form options',
      error: error.message
    });
  }
};

/**
 * @desc    Search colleges for preferred colleges selection
 * @route   GET /api/college-readiness/search-colleges
 * @access  Private (Student)
 */
export const searchColleges = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        data: {
          colleges: []
        }
      });
    }

    const colleges = await College.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { shortName: { $regex: q, $options: 'i' } }
      ]
    })
      .select('_id name shortName country logo')
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: {
        colleges
      }
    });
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching colleges',
      error: error.message
    });
  }
};

/**
 * @desc    Generate college readiness checklist via AI
 * @route   POST /api/college-readiness/generate
 * @access  Private (Student)
 */
export const generateChecklist = async (req, res) => {
  try {
    const { fieldOfStudy, targetTier, languagesKnown, preferredColleges } = req.body;

    // Validate required fields
    if (!fieldOfStudy || !FIELDS_OF_STUDY.includes(fieldOfStudy)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing field of study'
      });
    }

    if (!targetTier || !TIER_CONFIGS.find(t => t.id === targetTier)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing target tier'
      });
    }

    // Get user data
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userProfile = user.userProfile || {};

    // Check if user has basic data
    if (!userProfile.gradeLevel || !userProfile.country ||
        !userProfile.desiredCollegeCountries || userProfile.desiredCollegeCountries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your basic profile data first (grade level, country, desired college countries)'
      });
    }

    // Check regeneration rate limit (skip if this is first generation)
    const existingChecklist = await CollegeReadinessChecklist.findOne({ user: req.user.id });
    if (existingChecklist) {
      const canRegenerateResult = await CollegeReadinessChecklist.canRegenerate(req.user.id);
      if (!canRegenerateResult.canRegenerate) {
        return res.status(429).json({
          success: false,
          message: `You can only generate a new checklist once per week. Next available: ${canRegenerateResult.nextAvailableAt.toISOString()}`,
          data: {
            nextAvailableAt: canRegenerateResult.nextAvailableAt,
            daysRemaining: canRegenerateResult.daysRemaining
          }
        });
      }
    }

    // Get user's current scholarship points
    let currentScholarshipPoints = 0;
    try {
      const wallet = await ScholarshipWallet.findOne({ user: req.user.id });
      if (wallet) {
        currentScholarshipPoints = wallet.balance || 0;
      }
    } catch (walletError) {
      console.warn('Could not fetch scholarship wallet:', walletError.message);
    }

    // Process preferred colleges - fetch names for any college IDs
    const processedColleges = [];
    if (preferredColleges && Array.isArray(preferredColleges)) {
      for (const college of preferredColleges) {
        if (college.collegeId) {
          const collegeDoc = await College.findById(college.collegeId).select('name').lean();
          if (collegeDoc) {
            processedColleges.push({
              college: college.collegeId,
              name: collegeDoc.name,
              manualEntry: null
            });
          }
        } else if (college.manualEntry) {
          processedColleges.push({
            college: null,
            name: null,
            manualEntry: college.manualEntry.trim()
          });
        }
      }
    }

    // Calculate weeks until application
    const gradeNum = userProfile.gradeLevel === 'K' ? 0 : parseInt(userProfile.gradeLevel);
    const yearsUntilGrade12 = Math.max(0, 12 - gradeNum);
    const weeksUntilApplication = yearsUntilGrade12 * 52;

    // Build data for AI
    const aiData = {
      gradeLevel: userProfile.gradeLevel,
      country: userProfile.country,
      desiredCollegeCountries: userProfile.desiredCollegeCountries,
      fieldOfStudy,
      targetTier,
      languagesKnown: languagesKnown || [],
      preferredColleges: processedColleges,
      currentScholarshipPoints,
      weeksUntilApplication
    };

    // Generate checklist using OpenAI
    let aiResult;
    try {
      aiResult = await generateCollegeReadinessChecklist(aiData);
    } catch (aiError) {
      console.error('AI Generation Error:', aiError);
      return res.status(500).json({
        success: false,
        message: aiError.message || 'Failed to generate checklist. Please try again.',
        error: aiError.message
      });
    }

    // Mark old checklists as inactive
    await CollegeReadinessChecklist.updateMany(
      { user: req.user.id, isActive: true },
      { isActive: false }
    );

    // Calculate total items for progress
    let totalItems = 0;
    aiResult.sections.forEach(section => {
      totalItems += section.items.length;
    });

    // Create new checklist
    const checklist = new CollegeReadinessChecklist({
      user: req.user.id,
      formData: {
        fieldOfStudy,
        targetTier,
        languagesKnown: languagesKnown || [],
        preferredColleges: processedColleges.map(c => ({
          college: c.college,
          manualEntry: c.manualEntry
        }))
      },
      profileSnapshot: {
        gradeLevel: userProfile.gradeLevel,
        country: userProfile.country,
        desiredCollegeCountries: userProfile.desiredCollegeCountries
      },
      sections: aiResult.sections,
      progress: {
        totalItems,
        completedItems: 0,
        percentage: 0
      },
      aiGeneration: {
        prompt: `Field: ${fieldOfStudy}, Tier: ${targetTier}, Destinations: ${userProfile.desiredCollegeCountries.join(', ')}`,
        model: 'gpt-4o',
        generatedAt: new Date(),
        tokensUsed: aiResult.usage?.totalTokens || null
      },
      lastGeneratedAt: new Date(),
      isActive: true
    });

    await checklist.save();

    // Update user's college readiness tracking
    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        'userProfile.collegeReadiness.hasGeneratedChecklist': true,
        'userProfile.collegeReadiness.lastChecklistGeneratedAt': new Date(),
        'userProfile.collegeReadiness.activeChecklistId': checklist._id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Checklist generated successfully',
      data: {
        checklist
      }
    });
  } catch (error) {
    console.error('Error generating checklist:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating checklist',
      error: error.message
    });
  }
};

/**
 * @desc    Get user's active checklist
 * @route   GET /api/college-readiness/checklist
 * @access  Private (Student)
 */
export const getChecklist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const activeChecklistId = user.userProfile?.collegeReadiness?.activeChecklistId;

    if (!activeChecklistId) {
      return res.status(404).json({
        success: false,
        message: 'No active checklist found',
        data: {
          hasChecklist: false
        }
      });
    }

    const checklist = await CollegeReadinessChecklist.findById(activeChecklistId)
      .populate('formData.preferredColleges.college', 'name shortName logo')
      .populate('sections.items.linkedDocument', 'name url fileType');

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: 'Checklist not found',
        data: {
          hasChecklist: false
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        hasChecklist: true,
        checklist
      }
    });
  } catch (error) {
    console.error('Error getting checklist:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting checklist',
      error: error.message
    });
  }
};

/**
 * @desc    Get checklist history
 * @route   GET /api/college-readiness/history
 * @access  Private (Student)
 */
export const getChecklistHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const checklists = await CollegeReadinessChecklist.find({ user: req.user.id })
      .select('formData.fieldOfStudy formData.targetTier progress version createdAt isActive')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const total = await CollegeReadinessChecklist.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        checklists,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error getting checklist history:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting checklist history',
      error: error.message
    });
  }
};

/**
 * @desc    Update a checklist item (mark complete, add notes)
 * @route   PUT /api/college-readiness/checklist/:checklistId/items/:sectionId/:itemId
 * @access  Private (Student)
 */
export const updateChecklistItem = async (req, res) => {
  try {
    const { checklistId, sectionId, itemId } = req.params;
    const { isCompleted, notes } = req.body;

    const checklist = await CollegeReadinessChecklist.findOne({
      _id: checklistId,
      user: req.user.id
    });

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: 'Checklist not found'
      });
    }

    // Find and update the item
    let itemFound = false;
    for (const section of checklist.sections) {
      if (section.sectionId === sectionId) {
        for (const item of section.items) {
          if (item.itemId === itemId) {
            itemFound = true;

            if (typeof isCompleted === 'boolean') {
              item.isCompleted = isCompleted;
              item.completedAt = isCompleted ? new Date() : null;
            }

            if (notes !== undefined) {
              item.notes = notes;
            }

            break;
          }
        }
      }
    }

    if (!itemFound) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in checklist'
      });
    }

    // Recalculate progress
    checklist.recalculateProgress();
    await checklist.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: {
        progress: checklist.progress
      }
    });
  } catch (error) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating checklist item',
      error: error.message
    });
  }
};

/**
 * @desc    Link a document to a checklist item
 * @route   POST /api/college-readiness/checklist/:checklistId/items/:sectionId/:itemId/link-document
 * @access  Private (Student)
 */
export const linkDocumentToItem = async (req, res) => {
  try {
    const { checklistId, sectionId, itemId } = req.params;
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Document ID is required'
      });
    }

    // Verify the document belongs to the user
    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const checklist = await CollegeReadinessChecklist.findOne({
      _id: checklistId,
      user: req.user.id
    });

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: 'Checklist not found'
      });
    }

    // Find and update the item
    let itemFound = false;
    for (const section of checklist.sections) {
      if (section.sectionId === sectionId) {
        for (const item of section.items) {
          if (item.itemId === itemId) {
            itemFound = true;

            if (item.actionType !== 'file_upload') {
              return res.status(400).json({
                success: false,
                message: 'This item does not accept document uploads'
              });
            }

            item.linkedDocument = documentId;
            item.isCompleted = true;
            item.completedAt = new Date();

            break;
          }
        }
      }
    }

    if (!itemFound) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in checklist'
      });
    }

    // Recalculate progress
    checklist.recalculateProgress();
    await checklist.save();

    res.status(200).json({
      success: true,
      message: 'Document linked successfully',
      data: {
        progress: checklist.progress,
        document: {
          _id: document._id,
          name: document.name,
          url: document.url,
          fileType: document.fileType
        }
      }
    });
  } catch (error) {
    console.error('Error linking document to item:', error);
    res.status(500).json({
      success: false,
      message: 'Error linking document to item',
      error: error.message
    });
  }
};

/**
 * @desc    Regenerate checklist (rate limited to once per week)
 * @route   POST /api/college-readiness/regenerate
 * @access  Private (Student)
 */
export const regenerateChecklist = async (req, res) => {
  try {
    // Check rate limit
    const canRegenerateResult = await CollegeReadinessChecklist.canRegenerate(req.user.id);

    if (!canRegenerateResult.canRegenerate) {
      return res.status(429).json({
        success: false,
        message: `You can only generate a new checklist once per week. Next available: ${canRegenerateResult.nextAvailableAt.toISOString()}`,
        data: {
          nextAvailableAt: canRegenerateResult.nextAvailableAt,
          daysRemaining: canRegenerateResult.daysRemaining
        }
      });
    }

    // Mark old checklists as inactive
    await CollegeReadinessChecklist.updateMany(
      { user: req.user.id, isActive: true },
      { isActive: false }
    );

    // Forward to generate endpoint logic
    // This reuses the same validation and generation logic
    return generateChecklist(req, res);
  } catch (error) {
    console.error('Error regenerating checklist:', error);
    res.status(500).json({
      success: false,
      message: 'Error regenerating checklist',
      error: error.message
    });
  }
};
