import OpenAI from 'openai';
import User from '../models/User.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Valid grade levels for context
const GRADE_LEVEL_DESCRIPTIONS = {
  'K': 'Kindergarten (5-6 years old)',
  '1': '1st grade (6-7 years old)',
  '2': '2nd grade (7-8 years old)',
  '3': '3rd grade (8-9 years old)',
  '4': '4th grade (9-10 years old)',
  '5': '5th grade (10-11 years old)',
  '6': '6th grade (11-12 years old)',
  '7': '7th grade (12-13 years old)',
  '8': '8th grade (13-14 years old)',
  '9': '9th grade / Freshman (14-15 years old)',
  '10': '10th grade / Sophomore (15-16 years old)',
  '11': '11th grade / Junior (16-17 years old)',
  '12': '12th grade / Senior (17-18 years old)',
};

// Topics that are allowed
const ALLOWED_TOPICS = [
  'math', 'mathematics', 'algebra', 'geometry', 'calculus', 'statistics',
  'science', 'physics', 'chemistry', 'biology', 'astronomy', 'geology',
  'history', 'world history', 'american history', 'ancient history', 'geography',
  'english', 'grammar', 'vocabulary', 'reading', 'writing', 'literature', 'poetry',
  'languages', 'spanish', 'french', 'german', 'chinese', 'japanese', 'latin',
  'programming', 'coding', 'computer science', 'python', 'javascript', 'html', 'css',
  'trivia', 'facts', 'general knowledge', 'quiz',
  'study tips', 'learning', 'education', 'homework help',
  'college preparation', 'sat', 'act', 'college applications', 'scholarships',
  'art history', 'music theory', 'economics', 'psychology', 'sociology',
  'environmental science', 'health', 'nutrition', 'anatomy',
];

// Build the system prompt based on grade level
function buildSystemPrompt(gradeLevel) {
  const gradeLevelDesc = gradeLevel && GRADE_LEVEL_DESCRIPTIONS[gradeLevel]
    ? GRADE_LEVEL_DESCRIPTIONS[gradeLevel]
    : 'a student';

  return `You are Hugo, a warm, kind, and encouraging AI tutor for Rewards For Education app. You help students learn and explore academic topics.

ABOUT THE STUDENT:
- Grade level: ${gradeLevelDesc}
- Adapt your explanations to be age-appropriate and match their educational level

YOUR PERSONALITY:
- Warm, patient, and encouraging like a favorite teacher
- Use simple language appropriate for the student's grade level
- Celebrate curiosity and effort
- Make learning fun and engaging
- Be supportive when students struggle

ALLOWED TOPICS (you can ONLY discuss these):
- Mathematics (arithmetic, algebra, geometry, calculus, statistics)
- Science (physics, chemistry, biology, astronomy, geology, environmental science)
- History (world history, American history, ancient civilizations, geography)
- English (grammar, vocabulary, reading comprehension, writing, literature)
- Languages (Spanish, French, German, Chinese, Japanese, etc.)
- Programming (Python, JavaScript, HTML, CSS, computer science basics)
- Academic trivia and facts
- Study tips and learning strategies
- College preparation (SAT, ACT, applications, scholarships)
- Art history, music theory, economics, psychology, sociology
- Health, nutrition, and anatomy

STRICTLY FORBIDDEN TOPICS (politely redirect if asked):
- Personal advice unrelated to education
- Violence, weapons, or harmful content
- Inappropriate or adult content
- Political opinions or debates
- Religious debates
- Medical diagnosis or treatment advice
- Legal advice
- Financial/investment advice
- Social media, celebrities, or entertainment gossip
- Dating or relationship advice

RESPONSE GUIDELINES:
- Keep responses concise but helpful
- Use examples that are relatable to students
- For younger students (K-5): Use simple words, short sentences, fun analogies
- For middle school (6-8): Can use more complex concepts, encourage exploration
- For high school (9-12): Can discuss advanced topics, focus on college readiness
- If a topic is off-limits, kindly say: "That's outside what I can help with, but I'd love to help you with any school subjects! What would you like to learn about?"

ABOUT THE APP:
- Rewards For Education helps students earn scholarship points by completing educational tasks
- Students can explore colleges, receive scholarship offers, and track their college readiness
- You can mention these features if relevant to help students understand the platform`;
}

// @desc    Chat with Hugo AI
// @route   POST /api/hugo-chat
// @access  Private (Student only)
export const chat = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Get user's grade level
    const user = await User.findById(userId).select('userProfile.gradeLevel');
    const gradeLevel = user?.userProfile?.gradeLevel || null;

    // Build messages array for OpenAI
    const systemPrompt = buildSystemPrompt(gradeLevel);

    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history (limit to last 10 exchanges to manage context)
    const recentHistory = conversationHistory.slice(-20);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message.trim() });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';

    res.status(200).json({
      success: true,
      data: {
        reply: reply,
        gradeLevel: gradeLevel,
      },
    });
  } catch (error) {
    console.error('Hugo Chat Error:', error);

    // Handle OpenAI specific errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        message: 'Hugo is taking a short break. Please try again later.',
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a moment and try again.',
      });
    }

    next(error);
  }
};

// @desc    Get suggested questions based on grade level
// @route   GET /api/hugo-chat/suggestions
// @access  Private (Student only)
export const getSuggestions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's grade level
    const user = await User.findById(userId).select('userProfile.gradeLevel');
    const gradeLevel = user?.userProfile?.gradeLevel || null;

    let suggestions = [];

    // Grade-appropriate suggestions
    if (!gradeLevel || ['K', '1', '2', '3', '4', '5'].includes(gradeLevel)) {
      // Elementary school
      suggestions = [
        { text: 'Can you teach me a fun math trick?', category: 'Math' },
        { text: 'Tell me a cool science fact!', category: 'Science' },
        { text: 'What were dinosaurs like?', category: 'History' },
        { text: 'Help me with my spelling words', category: 'English' },
        { text: 'Why is the sky blue?', category: 'Science' },
        { text: 'What is the solar system?', category: 'Science' },
      ];
    } else if (['6', '7', '8'].includes(gradeLevel)) {
      // Middle school
      suggestions = [
        { text: 'Explain how fractions and decimals work', category: 'Math' },
        { text: 'What causes earthquakes?', category: 'Science' },
        { text: 'Tell me about ancient Egypt', category: 'History' },
        { text: 'How do I write a good essay?', category: 'English' },
        { text: 'What is coding and how do I start?', category: 'Programming' },
        { text: 'Quiz me on world capitals!', category: 'Trivia' },
      ];
    } else {
      // High school
      suggestions = [
        { text: 'Help me understand algebra equations', category: 'Math' },
        { text: 'Explain photosynthesis in detail', category: 'Science' },
        { text: 'What should I know about the SAT?', category: 'College Prep' },
        { text: 'How do I write a college application essay?', category: 'College Prep' },
        { text: 'Teach me basic Python programming', category: 'Programming' },
        { text: 'What are good study habits?', category: 'Study Tips' },
      ];
    }

    res.status(200).json({
      success: true,
      data: {
        suggestions,
        gradeLevel,
      },
    });
  } catch (error) {
    next(error);
  }
};
