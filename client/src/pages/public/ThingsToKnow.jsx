import React from 'react';
import { Box, Container, Typography, Alert, Divider } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function ThingsToKnow() {
  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 10, md: 12 }, background: '#ffffff' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
            Disclaimer & Important Information
          </Typography>
          <Typography variant="h6" sx={{ color: '#718096', maxWidth: '800px', mx: 'auto' }}>
            Please read this carefully before participating in the CollegenZ platform
          </Typography>
        </Box>

        {/* Important Alert */}
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 6, borderRadius: '12px', fontSize: '1rem' }}
        >
          This information is crucial for understanding how the platform works and your rights and obligations as a user.
        </Alert>

        {/* College Affiliation */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            College Affiliation
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            No Official Affiliation Unless Explicitly Stated
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            CollegenZ is <strong>not affiliated, endorsed, or partnered</strong> with any of the colleges listed on the platform unless explicitly mentioned otherwise. The colleges listed are independent educational institutions, and their presence on our platform does not imply any formal partnership or endorsement.
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 2 }}>
            We are building a platform to enable colleges to launch their own digital tokens for campus economies. Until a college officially partners with us, any mining activity for that college is speculative and represents an early opportunity to potentially earn tokens if and when that college joins the platform.
          </Typography>
          <Typography sx={{ color: '#ef4444', fontWeight: 600, lineHeight: 1.8, fontStyle: 'italic' }}>
            Final decision rights for all token-related matters, including distribution, governance, and utility, belong exclusively to the respective colleges. CollegenZ serves as a facilitator and technology provider.
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Token Mechanics */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            Understanding Token Allocation
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            Tokens Mined vs. College Coins: Not 1:1
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            The "tokens" you mine on CollegenZ are <strong>not the same</strong> as the actual college coins that will be issued when a college partners with us. Your mined tokens represent your <strong>proportional share</strong> of the total allocated college coins.
          </Typography>
          
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            How it works (Example):
          </Typography>
          <Box sx={{ bgcolor: '#f3f4f6', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #8b5cf6' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • College XYZ allocates <strong>1,000,000 college coins</strong> for miners<br />
              • All miners collectively mined <strong>10,000,000 tokens</strong><br />
              • You mined <strong>2,000,000 tokens</strong> (20% of total mined)<br />
              • You will receive <strong>200,000 college coins</strong> (20% of allocated amount)
            </Typography>
          </Box>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            Your share is calculated as: <strong>(Your Mined Tokens / Total Mined Tokens) × Total Allocated College Coins</strong>
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            Token Distribution Timeline
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 2 }}>
            Users who mine tokens for a college will receive their allocated college coins as <strong>airdrops</strong> after the college officially partners with CollegenZ and launches their digital token.
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8 }}>
            The timing of the airdrop depends entirely on when and if the college decides to partner with us. There is no guaranteed timeline, and some colleges may never partner with us.
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Mining Rate Halving */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            Mining Rate Schedule
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            Early Mining Advantage
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            Mining now represents an <strong>early opportunity</strong> to earn tokens at a higher rate. As colleges progress through different stages of partnership, the mining rate will be systematically reduced to reward early miners.
          </Typography>
          
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            Rate Halving Schedule:
          </Typography>
          <Box sx={{ bgcolor: '#fef3c7', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #f59e0b' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              <strong>1. Baseline Rate:</strong> Current mining rate (highest)<br />
              <strong>2. Waitlist Stage:</strong> Rate halved to 50% when college joins our waitlist<br />
              <strong>3. Live Stage:</strong> Rate halved again to 25% when college coins go live<br />
              <strong>4. Exchange Listing:</strong> Rate halved again to 12.5% when listed on InTuition Exchange<br />
              <strong>5. Mining Stopped:</strong> No further mining allowed after exchange listing
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            Why Mining Rates Decrease
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8 }}>
            The halving schedule is designed to reward early believers who took the risk of mining before a college officially partnered with us. As the college progresses and risk decreases, the rewards also decrease proportionally. This ensures fair distribution and incentivizes early participation.
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* 15-Month Deadline & TUIT Conversion */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            College Partnership Timeline
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            15-Month Deadline
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            Each college has <strong>15 months from the start of the first mining session</strong> to officially sign up and partner with CollegenZ. This timeline is tracked individually for each college.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            What happens after 15 months?
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            If a college does not sign up within this timeframe, miners for that college will have the option to convert their mined tokens to <strong>TUIT</strong>, CollegenZ's native platform token.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            TUIT Conversion Terms
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            The conversion rate from college-specific tokens to TUIT will be <strong>determined at the time of conversion</strong> and will not be a fixed 1:1 ratio.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            Factors affecting conversion rate:
          </Typography>
          <Box sx={{ bgcolor: '#e0f2fe', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #06b6d4' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • Total tokens mined for that college<br />
              • Number of active miners<br />
              • Current TUIT market value<br />
              • Platform tokenomics at time of conversion<br />
              • Overall demand and supply dynamics
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            No Guaranteed Value
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8 }}>
            There is <strong>no guarantee</strong> that the TUIT conversion will be favorable or that TUIT will have any specific market value. Mining is speculative, and miners accept the risk that a college may never partner with us, requiring conversion to TUIT at rates determined by market conditions.
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* KYC and Verification Requirements */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            Verification & Participation Requirements
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            Who Can Participate?
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            Our platform welcomes <strong>students, alumni, fans, and supporters</strong> of any college. You don't need to be currently enrolled or have official college affiliation to participate in mining tokens. We believe in building inclusive communities around colleges.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            Mandatory KYC Before Withdrawal
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            All users must complete <strong>Know Your Customer (KYC)</strong> verification before they can:
          </Typography>
          <Box sx={{ bgcolor: '#d1fae5', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #10b981' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • Withdraw tokens to external wallets<br />
              • Exchange tokens for other cryptocurrencies<br />
              • Convert tokens to fiat currency<br />
              • Transfer tokens to other platforms
            </Typography>
          </Box>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            KYC is a legal requirement to comply with anti-money laundering (AML) regulations and prevent fraudulent activity. Failure to complete KYC will result in inability to access your earned tokens outside the platform.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            College Association Proof (May Be Required)
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            While we welcome all community members to participate in mining, <strong>proof of college association may be required</strong> in certain circumstances, such as before withdrawal or for accessing specific benefits. However, this requirement may vary based on the college's policies and the nature of your participation.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            Accepted proof documents (if required):
          </Typography>
          <Box sx={{ bgcolor: '#d1fae5', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #10b981' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • Official college offer letters<br />
              • Valid student ID cards<br />
              • Official transcripts or grade reports<br />
              • Enrollment verification letters<br />
              • Alumni certificates or association membership<br />
              • Documentation showing connection to the college community
            </Typography>
          </Box>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 2 }}>
            All documents must be official, verifiable, and clearly show your name and the college name. Fake or forged documents will result in permanent account suspension and forfeiture of all mined tokens.
          </Typography>
          <Typography sx={{ color: '#ef4444', fontWeight: 600, lineHeight: 1.8, fontStyle: 'italic' }}>
            Important: Colleges retain final authority over eligibility criteria and token distribution. They may impose additional requirements or restrictions at their discretion.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            College Admin Verification
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 2 }}>
            College administrators who sign up to manage their institution's presence on CollegenZ must verify their management rights and official capacity. We are implementing a rigorous verification process and will begin authenticating all college admins before they join our waitlist.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            Admin verification requirements:
          </Typography>
          <Box sx={{ bgcolor: '#d1fae5', p: 3, borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • Official college email address verification<br />
              • Proof of administrative role (employment letter, faculty ID)<br />
              • Authorization from college management<br />
              • Video verification call with our team<br />
              • Legal documentation review
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Risk and Legal Disclaimer */}
        <Alert
          severity="error"
          icon={<WarningAmberIcon />}
          sx={{ mb: 4, borderRadius: '12px' }}
        >
          <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '1.1rem' }}>
            Risk Acknowledgment
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.8, mb: 2 }}>
            Mining tokens on CollegenZ is speculative and involves significant risk. There is no guarantee that any college will partner with us, that tokens will have any value, or that you will be able to withdraw or exchange your tokens. You may lose all the time and effort invested in mining. Only participate if you understand and accept these risks.
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.8, fontStyle: 'italic', color: '#dc2626' }}>
            <strong>Final Authority:</strong> All ultimate decisions regarding token distribution, utility, governance, and eligibility rest exclusively with the respective colleges. CollegenZ acts as a technology provider and cannot override college decisions.
          </Typography>
        </Alert>

        <Divider sx={{ my: 4 }} />

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
            By using the CollegenZ platform, you acknowledge that you have read, understood, and agreed to all the terms and conditions outlined on this page.
          </Typography>
          <Typography sx={{ color: '#2d3748', fontWeight: 600 }}>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ThingsToKnow;
