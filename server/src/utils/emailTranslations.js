// Email translation templates
const emailTranslations = {
  en: {
    otp: {
      subject: 'Verify Your Email - Coins For College',
      title: 'Email Verification',
      message: 'Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email address:',
      otpLabel: 'Your OTP Code',
      validity: 'This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.',
      footer: 'If you didn\'t request this verification, please ignore this email.'
    },
    welcome: {
      subject: 'Welcome to Coins For College!',
      title: 'Welcome to Coins For College!',
      greeting: 'Hi {{name}},',
      message: 'Congratulations on joining Coins For College! You\'re now part of a community helping users mine tokens for their favorite colleges.',
      gettingStarted: 'Getting Started:',
      gettingStartedItems: [
        'Add colleges to your mining list',
        'Start mining to earn tokens',
        'Share your referral code to earn bonuses',
        'Track your progress on your dashboard'
      ],
      ctaButton: 'Go to Dashboard',
      helpText: 'Need help? Visit our help center or contact support anytime.'
    },
    minerStopped: {
      subject: 'Your Mining Session is Complete!',
      title: 'Mining Session Complete!',
      greeting: 'Hi {{name}},',
      message: 'Your 24-hour mining session has ended. Here\'s what you accomplished:',
      totalTokensLabel: 'Total Tokens Earned',
      tableHeaders: {
        college: 'College',
        earned: 'Earned',
        balance: 'Balance',
        time: 'Time'
      },
      encouragement: 'Ready to keep earning? Start a new mining session now!',
      ctaButton: 'Start Mining Again'
    },
    inactivityReminder: {
      subject: 'Time to Start Mining Again! (Inactive {{duration}})',
      title: 'We Miss You, {{name}}!',
      encouragement: {
        '12h': 'Your miners have been inactive for 12 hours. Don\'t miss out on earning tokens!',
        '3d': 'It\'s been 3 days since you last mined. Your colleges are waiting for you!',
        '1w': 'We miss you! It\'s been a week since your last mining session.',
        'default': 'Come back and keep earning tokens for your favorite colleges!'
      },
      noActiveMiners: 'No Active Miners',
      inactiveFor: 'Inactive for {{duration}}',
      whyStartMining: 'Why Start Mining Again?',
      reasons: [
        'Earn tokens for your favorite colleges',
        'Build your balance continuously',
        'Support your college community',
        'Climb the leaderboards'
      ],
      ctaButton: 'Start Mining Now'
    },
    common: {
      brandName: 'Coins For College',
      copyright: '© 2025 Coins For College. All rights reserved.'
    }
  },
  zh: {
    otp: {
      subject: '验证您的邮箱 - 大学代币',
      title: '邮箱验证',
      message: '感谢您的注册！请使用以下一次性密码（OTP）来验证您的邮箱地址：',
      otpLabel: '您的OTP代码',
      validity: '此OTP有效期为<strong>10分钟</strong>。请不要与任何人分享此代码。',
      footer: '如果您没有请求此验证，请忽略此邮件。'
    },
    welcome: {
      subject: '欢迎来到大学代币！',
      title: '欢迎来到大学代币！',
      greeting: '您好 {{name}}，',
      message: '恭喜您加入大学代币！您现在是一个帮助学生为他们喜爱的大学挖矿代币的社区的一员。',
      gettingStarted: '开始使用：',
      gettingStartedItems: [
        '将大学添加到您的挖矿列表',
        '开始挖矿赚取代币',
        '分享您的推荐代码赚取奖励',
        '在您的仪表板上跟踪您的进度'
      ],
      ctaButton: '前往仪表板',
      helpText: '需要帮助？随时访问我们的帮助中心或联系支持。'
    },
    minerStopped: {
      subject: '您的挖矿会话已完成！',
      title: '挖矿会话完成！',
      greeting: '您好 {{name}}，',
      message: '您的24小时挖矿会话已结束。以下是您的成就：',
      totalTokensLabel: '总赚取代币',
      tableHeaders: {
        college: '大学',
        earned: '已赚取',
        balance: '余额',
        time: '时间'
      },
      encouragement: '准备继续赚取？立即开始新的挖矿会话！',
      ctaButton: '重新开始挖矿'
    },
    inactivityReminder: {
      subject: '是时候重新开始挖矿了！（已闲置 {{duration}}）',
      title: '我们想念您，{{name}}！',
      encouragement: {
        '12h': '您的矿工已闲置12小时。不要错过赚取代币的机会！',
        '3d': '距离您上次挖矿已经3天了。您的大学在等待您！',
        '1w': '我们想念您！距离您上次挖矿会话已经一周了。',
        'default': '回来继续为您喜爱的大学赚取代币！'
      },
      noActiveMiners: '无活跃矿工',
      inactiveFor: '已闲置 {{duration}}',
      whyStartMining: '为什么重新开始挖矿？',
      reasons: [
        '为您喜爱的大学赚取代币',
        '持续建立您的余额',
        '支持您的大学社区',
        '攀登排行榜'
      ],
      ctaButton: '立即开始挖矿'
    },
    common: {
      brandName: '大学代币',
      copyright: '© 2025 大学代币。保留所有权利。'
    }
  }
};

// Helper function to get email translations
export const getEmailTranslations = (language = 'en') => {
  return emailTranslations[language] || emailTranslations.en;
};

// Helper function to get duration text in different languages
export const getDurationText = (duration, language = 'en') => {
  const translations = {
    en: {
      '12h': '12 hours',
      '3d': '3 days',
      '1w': '1 week',
      'default': 'a while'
    },
    zh: {
      '12h': '12小时',
      '3d': '3天',
      '1w': '1周',
      'default': '一段时间'
    }
  };
  
  return translations[language]?.[duration] || translations.en[duration] || translations.en.default;
};

export default emailTranslations;
