import React from 'react';
import { Box, Container, Typography, Divider, Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTranslation } from 'react-i18next';

function TermsOfService() {
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 10, md: 12 }, background: '#ffffff' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
            Terms of Service
          </Typography>
          <Typography variant="h6" sx={{ color: '#718096' }}>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 6, borderRadius: '12px', fontSize: '1rem' }}
        >
          Please read these Terms of Service carefully before using our Platform. By accessing or using Coins For College, you agree to be bound by these Terms.
        </Alert>

        <Box sx={{ color: '#4a5568', lineHeight: 1.8 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3, mt: 4 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography sx={{ mb: 3 }}>
            These Terms of Service ("Terms") constitute a legally binding agreement between you and Coins For College ("we," "our," or "us") governing your access to and use of our website, platform, and services (collectively, the "Platform"). By creating an account, accessing, or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use the Platform.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            2. Eligibility
          </Typography>
          <Typography sx={{ mb: 2 }}>
            To use the Platform, you must:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
            <li>Have the legal capacity to enter into binding contracts</li>
            <li>Not be prohibited from using the Platform under applicable laws</li>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>For college-specific features, have a genuine affiliation with the college or university you select</li>
          </Box>
          <Typography sx={{ mb: 3 }}>
            By using the Platform, you represent and warrant that you meet all of these eligibility requirements.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            3. Account Registration and Security
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            3.1 Account Creation
          </Typography>
          <Typography sx={{ mb: 3 }}>
            To access certain features of the Platform, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            3.2 Account Types
          </Typography>
          <Typography sx={{ mb: 2 }}>
            The Platform offers different account types:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li><strong>Student Accounts:</strong> For individuals affiliated with colleges or universities who wish to mine tokens</li>
            <li><strong>College Admin Accounts:</strong> For verified administrators representing educational institutions</li>
            <li><strong>Platform Admin Accounts:</strong> For authorized platform administrators</li>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            3.3 Account Security
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You are solely responsible for maintaining the security of your account and password. You must immediately notify us of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to protect your account credentials.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            4. Token Mining and Distribution
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            4.1 Mining Mechanism
          </Typography>
          <Typography sx={{ mb: 3 }}>
            The Platform allows eligible users to "mine" college-specific tokens by running mining sessions. Mining is a gamified mechanism to allocate tokens to early supporters and does not involve actual cryptocurrency mining or proof-of-work computations. Tokens mined on the Platform represent potential future allocation of college-specific cryptocurrencies and do not have inherent monetary value until a college officially launches its token.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            4.2 Token Allocation vs. Tokens Mined
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Tokens you mine on the Platform do not equal the final number of college coins you will receive. When a college officially launches its cryptocurrency, your share of the college's token allocation will be calculated proportionally based on the total tokens mined by all users for that college. Your actual allocation depends on factors including the college's total token supply decision, the total mining participation, and the college's distribution timeline.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            4.3 Mining Rate Schedule
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Mining rates decrease over time according to a halving schedule. Early miners receive higher rates. Rates are reduced when colleges reach certain milestones (waitlist status, live status, exchange listing). Mining for a college stops entirely once the college's token is listed on an exchange or at the college's discretion.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            4.4 Referral Bonuses
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Users may receive mining rate bonuses for referring other users to the Platform. Referral bonuses are capped and subject to verification. We reserve the right to revoke bonuses obtained through fraudulent or abusive referral practices.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            5. College Affiliation and Verification
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            5.1 No Official College Endorsement
          </Typography>
          <Typography sx={{ mb: 3 }}>
            IMPORTANT: Coins For College is not officially affiliated with, endorsed by, or partnered with any college or university unless explicitly stated otherwise. The presence of a college on our Platform does not constitute any official relationship. Colleges retain final authority over whether to adopt their token, and we are building infrastructure in anticipation of college adoption.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            5.2 Student Verification
          </Typography>
          <Typography sx={{ mb: 3 }}>
            While the Platform is open to all users during the mining phase, withdrawal of tokens or conversion to college-specific cryptocurrencies may require proof of college affiliation. Acceptable proof includes official college offer letters, valid student ID cards, official transcripts, enrollment verification letters, alumni certificates, or other documentation showing connection to the college. Colleges retain the ultimate authority to verify and approve which individuals are considered part of their community.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            5.3 College Administrator Verification
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Individuals claiming to represent colleges must undergo rigorous verification including official college email verification, proof of administrative role, authorization from college management, video verification calls, and legal documentation review.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            6. 15-Month Partnership Timeline
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Each college listed on the Platform has 15 months from their listing date to officially partner with Coins For College and launch their token. If a college does not sign up within this timeframe, the tokens mined for that college will be converted to TUIT, our platform's base token, at a conversion rate determined at the time of conversion based on market conditions and platform tokenomics. The conversion rate will depend on total tokens mined for the college, number of active miners, current TUIT market value, and overall platform supply and demand dynamics.
          </Typography>
          <Typography sx={{ mb: 3, color: '#ef4444', fontWeight: 600, fontStyle: 'italic' }}>
            There is no guarantee of any specific conversion rate or monetary value for tokens converted to TUIT. Token values may fluctuate, and you may receive significantly less value than anticipated or no value at all.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            7. KYC and Compliance Requirements
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            7.1 Mandatory KYC
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Before you can withdraw tokens to external wallets, exchange tokens for other cryptocurrencies, convert tokens to fiat currency, or transfer tokens to other platforms, you must complete Know Your Customer (KYC) verification. This is a legal requirement to comply with anti-money laundering (AML) and counter-terrorism financing (CTF) regulations.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            7.2 KYC Information
          </Typography>
          <Typography sx={{ mb: 3 }}>
            KYC verification requires you to provide government-issued identification, proof of address, facial recognition verification, and potentially additional documentation as required by law. We use third-party KYC providers to process this information securely.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            7.3 Compliance with Laws
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You agree to comply with all applicable laws and regulations regarding cryptocurrency, tokens, and digital assets in your jurisdiction. You are responsible for determining what, if any, taxes apply to your mining activities and token holdings, and for reporting and remitting those taxes to the appropriate authorities.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            8. Prohibited Activities
          </Typography>
          <Typography sx={{ mb: 2 }}>
            You agree not to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li>Use the Platform for any illegal purpose or in violation of any laws</li>
            <li>Create multiple accounts to manipulate mining or referral systems</li>
            <li>Use bots, scripts, or automated tools to mine tokens or interact with the Platform</li>
            <li>Engage in any fraudulent, abusive, or manipulative activity</li>
            <li>Attempt to gain unauthorized access to the Platform, other accounts, or systems</li>
            <li>Interfere with or disrupt the integrity or performance of the Platform</li>
            <li>Upload or transmit viruses, malware, or other malicious code</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with any institution</li>
            <li>Harvest or collect information about other users without their consent</li>
            <li>Use the Platform to transmit spam, chain letters, or other unsolicited communications</li>
            <li>Violate any applicable laws regarding export controls or cryptocurrency regulations</li>
          </Box>
          <Typography sx={{ mb: 3 }}>
            Violation of these prohibitions may result in immediate termination of your account and forfeiture of all mined tokens.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            9. Intellectual Property Rights
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            9.1 Platform Ownership
          </Typography>
          <Typography sx={{ mb: 3 }}>
            The Platform and its entire contents, features, and functionality, including but not limited to all information, software, code, text, displays, graphics, photographs, video, audio, design, presentation, selection, and arrangement, are owned by Coins For College, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            9.2 Limited License
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Platform for its intended purpose. This license does not include any right to reproduce, distribute, modify, create derivative works, publicly display, or otherwise exploit the Platform or its content except as expressly permitted.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            9.3 College Trademarks
          </Typography>
          <Typography sx={{ mb: 3 }}>
            All college and university names, logos, and trademarks displayed on the Platform are the property of their respective owners. Use of these marks does not imply endorsement, sponsorship, or affiliation with Coins For College unless explicitly stated.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            10. Risk Disclosure and Disclaimers
          </Typography>

          <Alert
            severity="error"
            icon={<WarningAmberIcon />}
            sx={{ mb: 3, borderRadius: '12px' }}
          >
            <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '1.1rem' }}>
              IMPORTANT RISK ACKNOWLEDGMENT
            </Typography>
            <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
              Mining tokens on this Platform is highly speculative and involves significant risks. You may lose all value from your mining activities.
            </Typography>
          </Alert>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            10.1 No Guarantee of Value
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Tokens mined on the Platform have no inherent value and do not constitute securities, investments, or financial instruments. There is no guarantee that any college will adopt its token, that tokens will be convertible to cryptocurrency, that any token will have monetary value, or that you will receive any financial benefit from mining activities.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            10.2 College Partnership Risk
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Colleges are under no obligation to partner with Coins For College or launch their tokens. If a college does not partner with us, your mined tokens for that college will be converted to TUIT at our discretion and prevailing conversion rates, which may result in significantly diminished or zero value.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            10.3 Regulatory Risk
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Cryptocurrency and token regulations are evolving and vary by jurisdiction. Changes in laws or regulations may affect the Platform's operations, token values, or your ability to access or transfer tokens. We make no representations regarding the legal status of tokens in any jurisdiction.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            10.4 Technology Risk
          </Typography>
          <Typography sx={{ mb: 3 }}>
            The Platform relies on blockchain technology and third-party services. Technical failures, security breaches, blockchain forks, smart contract vulnerabilities, or other technological issues could result in loss of access to your tokens or loss of token value.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            10.5 Disclaimer of Warranties
          </Typography>
          <Typography sx={{ mb: 3 }}>
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            11. Limitation of Liability
          </Typography>
          <Typography sx={{ mb: 3 }}>
            TO THE FULLEST EXTENT PERMITTED BY LAW, COINS FOR COLLEGE, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <li>Your access to, use of, or inability to access or use the Platform</li>
            <li>Any conduct or content of any third party on the Platform</li>
            <li>Any content obtained from the Platform</li>
            <li>Unauthorized access, use, or alteration of your content or data</li>
            <li>Loss of token value or inability to convert tokens to cryptocurrency</li>
            <li>Failure of any college to partner with us or launch its token</li>
          </Box>
          <Typography sx={{ mb: 3 }}>
            IN NO EVENT SHALL OUR AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE PLATFORM EXCEED THE AMOUNT YOU PAID US, IF ANY, IN THE PAST SIX MONTHS, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            12. Indemnification
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You agree to defend, indemnify, and hold harmless Coins For College and its affiliates, officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms, your use of the Platform, your mining activities, your violation of any rights of another party, or your violation of any applicable laws or regulations.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            13. Dispute Resolution and Arbitration
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            13.1 Informal Resolution
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Before filing a claim, you agree to try to resolve the dispute informally by contacting us at info@coinsforcollege.org. We will attempt to resolve the dispute informally by contacting you via email.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            13.2 Binding Arbitration
          </Typography>
          <Typography sx={{ mb: 3 }}>
            If we cannot resolve a dispute informally, any dispute arising out of or relating to these Terms or the Platform will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration will be conducted in English in the United States. You and we agree to submit to the personal jurisdiction of the arbitration forum.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            13.3 Class Action Waiver
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You agree that any arbitration or proceeding shall be limited to the dispute between you and us individually. To the fullest extent permitted by law, no arbitration or proceeding shall be joined with any other, no dispute shall be arbitrated on a class-action basis, and you waive any right to participate in a class action lawsuit or class-wide arbitration.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            14. Termination
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            14.1 Termination by You
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You may terminate your account at any time by contacting us at info@coinsforcollege.org. Upon termination, you will lose access to your mined tokens unless they have been previously withdrawn to an external wallet or converted to cryptocurrency.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            14.2 Termination by Us
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We reserve the right to suspend or terminate your account and access to the Platform at our sole discretion, without notice, for conduct that we believe violates these Terms, is harmful to other users, us, or third parties, or for any other reason. Upon termination for cause, you may forfeit all mined tokens and any other benefits.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            14.3 Effect of Termination
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Upon termination of your account, your right to use the Platform will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity obligations, and limitations of liability.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            15. Modifications to Terms and Platform
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            15.1 Changes to Terms
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by email or by posting a notice on the Platform prior to the effective date of the changes. Your continued use of the Platform after the effective date constitutes acceptance of the modified Terms.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            15.2 Changes to Platform
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We reserve the right to modify, suspend, or discontinue the Platform or any features at any time without notice or liability. We may also impose limits on certain features or restrict access to parts or all of the Platform without notice or liability.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            16. General Provisions
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            16.1 Entire Agreement
          </Typography>
          <Typography sx={{ mb: 3 }}>
            These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and Coins For College regarding the Platform and supersede all prior agreements and understandings.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            16.2 Governing Law
          </Typography>
          <Typography sx={{ mb: 3 }}>
            These Terms shall be governed by and construed in accordance with the laws of the United States and the State of Delaware, without regard to conflict of law principles.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            16.3 Severability
          </Typography>
          <Typography sx={{ mb: 3 }}>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect, and the invalid or unenforceable provision will be deemed modified to the minimum extent necessary to make it valid and enforceable.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            16.4 Waiver
          </Typography>
          <Typography sx={{ mb: 3 }}>
            No waiver of any provision of these Terms shall be deemed a further or continuing waiver of such provision or any other provision. Our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            16.5 Assignment
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You may not assign or transfer these Terms or your account without our prior written consent. We may assign or transfer these Terms or any rights or obligations hereunder without restriction.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            16.6 Force Majeure
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We shall not be liable for any failure to perform our obligations under these Terms where such failure results from circumstances beyond our reasonable control, including acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            17. Contact Information
          </Typography>
          <Typography sx={{ mb: 3 }}>
            If you have any questions about these Terms of Service, please contact us at:
          </Typography>
          <Box sx={{ bgcolor: '#f3f4f6', p: 3, borderRadius: '8px', mb: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Coins For College</Typography>
            <Typography>Email: info@coinsforcollege.org</Typography>
            <Typography>Website: https://coinsforcollege.org</Typography>
          </Box>

          <Box sx={{ mt: 6, p: 4, bgcolor: '#fef3c7', borderRadius: '12px', border: '2px solid #f59e0b' }}>
            <Typography sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
              Acknowledgment
            </Typography>
            <Typography sx={{ color: '#4a5568', lineHeight: 1.8 }}>
              BY USING THE COINS FOR COLLEGE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. YOU ALSO ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD OUR DISCLAIMER AND IMPORTANT INFORMATION PAGE REGARDING THE RISKS AND LIMITATIONS OF THE PLATFORM.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default TermsOfService;
