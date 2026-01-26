import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Tier information for context
const TIER_INFO = {
  ivy: { name: 'Ivy League', weeklyRate: 300, annualTuition: '$60,000-$80,000' },
  tier1: { name: 'Tier 1', weeklyRate: 200, annualTuition: '$40,000-$60,000' },
  tier2: { name: 'Tier 2', weeklyRate: 100, annualTuition: '$20,000-$40,000' },
  regional: { name: 'Regional', weeklyRate: 50, annualTuition: '$10,000-$25,000' }
};

/**
 * Build the system prompt for checklist generation
 */
const buildSystemPrompt = () => `
You are an expert college admissions counselor specializing in international students.
Generate a comprehensive, actionable college readiness checklist.

RESPONSE FORMAT:
Return a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):
{
  "sections": [
    {
      "sectionId": "string (e.g., immigration, language, finance, academics, living)",
      "name": "string (display name)",
      "icon": "string (lucide icon name: Passport, Languages, Wallet, GraduationCap, Home)",
      "order": number (1-5),
      "items": [
        {
          "itemId": "string (unique within section, e.g., imm_1, lang_1)",
          "title": "string (short, actionable title)",
          "description": "string (detailed explanation, 1-3 sentences)",
          "actionType": "checkbox|file_upload|link|calculation|info",
          "linkedDocumentCategory": "string or null (for file_upload: transcript, recommendation_letter, passport, visa_documents, financial_documents, test_scores, essays, certificates)",
          "externalLink": "string or null (for link type, provide actual helpful URL)",
          "priority": "critical|high|medium|low",
          "deadline": "string or null (relative deadline like '6 months before application' or null)",
          "notes": "string or null (additional tips or context)"
        }
      ]
    }
  ]
}

REQUIRED SECTIONS (in this order):
1. Immigration & Visa (sectionId: "immigration", icon: "Passport")
2. Language Qualifications (sectionId: "language", icon: "Languages")
3. Academic Documents (sectionId: "academics", icon: "GraduationCap")
4. Finance & Scholarships (sectionId: "finance", icon: "Wallet")
5. Living Abroad Preparation (sectionId: "living", icon: "Home")

ACTION TYPES EXPLAINED:
- checkbox: Simple task to complete manually
- file_upload: Requires uploading a document (MUST specify linkedDocumentCategory)
- link: External resource with helpful URL (MUST specify externalLink)
- calculation: Financial calculation (used for scholarship points suggestion - only ONE per checklist in finance section)
- info: Informational item only (no action needed, just awareness)

IMPORTANT GUIDELINES:
1. Generate 4-6 items per section (20-30 total items)
2. Be specific to the student's destination countries
3. Include actual, working URLs for link items (government visa sites, test registration, etc.)
4. For file_upload items, use these exact categories: transcript, recommendation_letter, passport, visa_documents, financial_documents, test_scores, essays, certificates
5. Set priority based on timeline urgency and importance
6. Include ONE calculation item in finance section for scholarship points tracking
7. Make deadlines relative to application date (e.g., "3 months before", "1 year before")
8. Consider the student's current grade level for timeline appropriateness
`;

/**
 * Build the user prompt with student context
 */
const buildUserPrompt = (data) => {
  const tierInfo = TIER_INFO[data.targetTier] || TIER_INFO.tier2;

  // Calculate weeks until typical application deadline (assuming grade 12 applications)
  const gradeNum = data.gradeLevel === 'K' ? 0 : parseInt(data.gradeLevel);
  const yearsUntilGrade12 = Math.max(0, 12 - gradeNum);
  const weeksUntilApplication = yearsUntilGrade12 * 52;

  return `
Generate a personalized college readiness checklist for this student:

STUDENT PROFILE:
- Current Grade: ${data.gradeLevel} (${weeksUntilApplication > 0 ? `${weeksUntilApplication} weeks until typical college application` : 'Application year'})
- Country of Residence: ${data.country}
- Target Destination Countries: ${data.desiredCollegeCountries.join(', ')}
- Field of Study: ${data.fieldOfStudy}
- Target Tier: ${tierInfo.name} (typical tuition: ${tierInfo.annualTuition})
- Languages Known: ${data.languagesKnown.length > 0 ? data.languagesKnown.join(', ') : 'Not specified'}
${data.preferredColleges && data.preferredColleges.length > 0 ?
  `- Preferred Colleges: ${data.preferredColleges.map(c => c.name || c.manualEntry).filter(Boolean).join(', ')}` : ''}

CURRENT SCHOLARSHIP POINTS: ${data.currentScholarshipPoints || 0}
TARGET WEEKLY SCHOLARSHIP RATE FOR ${tierInfo.name.toUpperCase()}: ${tierInfo.weeklyRate} SP/week

SPECIFIC REQUIREMENTS FOR THIS CHECKLIST:

1. IMMIGRATION & VISA:
   - Include specific visa types for ${data.desiredCollegeCountries.join(' and ')} (e.g., F-1 for USA, Tier 4 for UK)
   - Add links to official government visa application portals
   - Include passport requirements and timeline

2. LANGUAGE QUALIFICATIONS:
   - Consider student already knows: ${data.languagesKnown.join(', ') || 'not specified'}
   - Include required tests for ${data.desiredCollegeCountries.join(' and ')} (TOEFL, IELTS, Duolingo, etc.)
   - Add minimum score requirements for ${tierInfo.name} tier schools

3. ACADEMIC DOCUMENTS:
   - Transcripts (official, translated if needed)
   - Letters of recommendation (how many, from whom)
   - Standardized tests relevant to ${data.fieldOfStudy} (SAT, ACT, AP, etc.)
   - Personal essays/statements
   - Extracurricular documentation

4. FINANCE & SCHOLARSHIPS:
   - Estimated total cost for ${tierInfo.name} tier schools (tuition + living)
   - Include ONE calculation item for scholarship points:
     * Current points: ${data.currentScholarshipPoints || 0}
     * Weeks remaining: ${weeksUntilApplication}
     * Calculate required weekly rate to cover estimated tuition
   - FAFSA/CSS Profile if applicable
   - Bank statements and financial documentation
   - Scholarship application deadlines

5. LIVING ABROAD:
   - Housing considerations for ${data.desiredCollegeCountries.join(' and ')}
   - Health insurance requirements
   - Cultural preparation
   - Essential documents to carry

Make sure all items are actionable and appropriate for a Grade ${data.gradeLevel} student from ${data.country} aiming for ${data.fieldOfStudy} programs.
`;
};

/**
 * Generate college readiness checklist using OpenAI
 * @param {Object} data - Student and form data
 * @returns {Object} - Parsed checklist sections
 */
export const generateCollegeReadinessChecklist = async (data) => {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(data);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid response structure: missing sections array');
    }

    // Validate and clean up the response
    const validatedSections = parsed.sections.map((section, sIndex) => ({
      sectionId: section.sectionId || `section_${sIndex}`,
      name: section.name || 'Unnamed Section',
      icon: section.icon || 'CheckSquare',
      order: section.order || sIndex + 1,
      items: (section.items || []).map((item, iIndex) => ({
        itemId: item.itemId || `${section.sectionId}_${iIndex}`,
        title: item.title || 'Unnamed Item',
        description: item.description || null,
        actionType: ['checkbox', 'file_upload', 'link', 'calculation', 'info'].includes(item.actionType)
          ? item.actionType
          : 'checkbox',
        linkedDocumentCategory: item.actionType === 'file_upload' ? item.linkedDocumentCategory : null,
        externalLink: item.actionType === 'link' ? item.externalLink : null,
        isCompleted: false,
        completedAt: null,
        priority: ['critical', 'high', 'medium', 'low'].includes(item.priority)
          ? item.priority
          : 'medium',
        deadline: item.deadline || null,
        notes: item.notes || null,
        // For calculation items, add calculation data
        calculationData: item.actionType === 'calculation' ? {
          estimatedCost: null, // Will be filled based on AI suggestions if provided
          currency: 'USD',
          currentPoints: data.currentScholarshipPoints || 0,
          targetPoints: null,
          weeksRemaining: data.weeksUntilApplication || null,
          requiredWeeklyRate: null,
          suggestedTier: data.targetTier
        } : null
      }))
    }));

    return {
      sections: validatedSections,
      usage: {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens
      }
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);

    // Check for specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please try again later.');
    }
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key configured.');
    }

    throw error;
  }
};

export default openai;
