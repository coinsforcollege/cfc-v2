import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 10, md: 12 }, background: '#ffffff' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
            Privacy Policy
          </Typography>
          <Typography variant="h6" sx={{ color: '#718096' }}>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

        <Box sx={{ color: '#4a5568', lineHeight: 1.8 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3, mt: 4 }}>
            1. Introduction
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Coins For College ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including our website and services (collectively, the "Platform"). By using our Platform, you agree to the collection and use of information in accordance with this Privacy Policy.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            2. Information We Collect
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            2.1 Personal Information
          </Typography>
          <Typography sx={{ mb: 2 }}>
            We collect personal information that you voluntarily provide to us when you register on the Platform, including:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li>Full name</li>
            <li>Email address</li>
            <li>College or university affiliation</li>
            <li>Student identification information</li>
            <li>Profile information (profile picture, bio)</li>
            <li>Referral codes and referral relationships</li>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            2.2 Financial and Blockchain Information
          </Typography>
          <Typography sx={{ mb: 2 }}>
            When you participate in mining activities or token transactions, we collect:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li>Digital wallet information and addresses</li>
            <li>Mining session data and token balances</li>
            <li>Transaction history</li>
            <li>Blockchain-related identifiers</li>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            2.3 Usage Information
          </Typography>
          <Typography sx={{ mb: 2 }}>
            We automatically collect certain information about your device and how you interact with our Platform:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li>IP address and device identifiers</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and features used</li>
            <li>Time and date of visits</li>
            <li>Referring website addresses</li>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            2.4 KYC Information
          </Typography>
          <Typography sx={{ mb: 3 }}>
            When you complete Know Your Customer (KYC) verification to withdraw tokens or access certain features, we collect government-issued identification documents, proof of address, college affiliation verification documents, and other information required for identity verification and compliance purposes.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            3. How We Use Your Information
          </Typography>
          <Typography sx={{ mb: 2 }}>
            We use the information we collect to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li>Create and manage your account</li>
            <li>Process mining activities and maintain token balances</li>
            <li>Verify your identity and college affiliation</li>
            <li>Facilitate token transactions and withdrawals</li>
            <li>Process referral bonuses and track referral relationships</li>
            <li>Communicate with you about your account and platform updates</li>
            <li>Provide customer support</li>
            <li>Improve and personalize your experience on the Platform</li>
            <li>Detect, prevent, and address fraud and security issues</li>
            <li>Comply with legal obligations and enforce our Terms of Service</li>
            <li>Conduct analytics and research to improve our services</li>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            4. How We Share Your Information
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            4.1 With Colleges and Universities
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We may share aggregated, non-identifiable information with colleges and universities about mining activities and community engagement. When a college officially partners with us, we may share information about students mining for their institution, subject to additional consent requirements.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            4.2 With Service Providers
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We share your information with third-party service providers who assist us in operating the Platform, including hosting services, email delivery services, analytics providers, KYC verification providers, and blockchain infrastructure providers.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            4.3 For Legal Compliance
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas, regulatory requirements).
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            4.4 Business Transfers
          </Typography>
          <Typography sx={{ mb: 3 }}>
            If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will provide notice before your information becomes subject to a different privacy policy.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            5. Data Security
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption of sensitive data, secure server infrastructure, regular security assessments, access controls and authentication mechanisms, and monitoring for suspicious activity. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            6. Data Retention
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. We will retain and use your information to comply with our legal obligations, resolve disputes, and enforce our agreements. When you close your account, we will deactivate it and remove your personal information from active use, but some information may be retained in backup systems or as required by law.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            7. Your Privacy Rights
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Depending on your location, you may have certain rights regarding your personal information:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal retention requirements</li>
            <li><strong>Data Portability:</strong> Request a copy of your information in a structured, machine-readable format</li>
            <li><strong>Objection:</strong> Object to our processing of your personal information</li>
            <li><strong>Restriction:</strong> Request restriction of processing of your information</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on consent to process your information</li>
          </Box>
          <Typography sx={{ mb: 3 }}>
            To exercise these rights, please contact us at info@coinsforcollege.org. We will respond to your request within a reasonable timeframe as required by applicable law.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            8. Cookies and Tracking Technologies
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We use cookies and similar tracking technologies to track activity on our Platform and store certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Platform.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            9. Third-Party Links
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Our Platform may contain links to third-party websites or services that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            10. Children's Privacy
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Our Platform is intended for users who are at least 18 years old or the age of majority in their jurisdiction. We do not knowingly collect personal information from individuals under this age. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete such information.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            11. International Data Transfers
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ from those in your jurisdiction. By using our Platform, you consent to the transfer of your information to the United States and other countries where we operate.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            12. Changes to This Privacy Policy
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            13. Contact Us
          </Typography>
          <Typography sx={{ mb: 3 }}>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </Typography>
          <Box sx={{ bgcolor: '#f3f4f6', p: 3, borderRadius: '8px', mb: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Coins For College</Typography>
            <Typography>Email: info@coinsforcollege.org</Typography>
            <Typography>Website: https://coinsforcollege.org</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default PrivacyPolicy;
