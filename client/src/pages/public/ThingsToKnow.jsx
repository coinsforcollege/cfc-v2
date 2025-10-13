import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Alert, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function ThingsToKnow() {
  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 10, md: 12 }, background: 'linear-gradient(135deg, rgba(155, 184, 224, 0.1) 0%, rgba(179, 154, 232, 0.05) 50%, rgba(230, 155, 184, 0.05) 100%)' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
            Things to Know
          </Typography>
          <Typography variant="h6" sx={{ color: '#718096', maxWidth: '800px', mx: 'auto' }}>
            Important information about CollegenZ platform, token mining, and legal disclaimers
          </Typography>
        </Box>

        {/* Important Alert */}
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 4, borderRadius: '12px', fontSize: '1rem' }}
        >
          Please read this page carefully. This information is crucial for understanding how the platform works and your rights and obligations as a user.
        </Alert>

        {/* College Affiliation Disclaimer */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountBalanceIcon sx={{ color: '#8b5cf6', fontSize: 32, mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>
              College Affiliation
            </Typography>
          </Box>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>No Official Affiliation Unless Explicitly Stated</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                CollegenZ is <strong>not affiliated, endorsed, or partnered</strong> with any of the colleges listed on the platform unless explicitly mentioned otherwise. The colleges listed are independent educational institutions, and their presence on our platform does not imply any formal partnership or endorsement.
              </Typography>
              <Typography sx={{ color: '#718096', lineHeight: 1.8 }}>
                We are building a platform to enable colleges to launch their own digital tokens for campus economies. Until a college officially partners with us, any mining activity for that college is speculative and represents an early opportunity to potentially earn tokens if and when that college joins the platform.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* Token Mechanics */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SwapHorizIcon sx={{ color: '#ec4899', fontSize: 32, mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>
              Understanding Token Allocation
            </Typography>
          </Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>Tokens Mined vs. College Coins: Not 1:1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                The "tokens" you mine on CollegenZ are <strong>not the same</strong> as the actual college coins that will be issued when a college partners with us. Your mined tokens represent your <strong>proportional share</strong> of the total allocated college coins.
              </Typography>
              <Typography sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                How it works (Example):
              </Typography>
              <Box sx={{ bgcolor: 'rgba(139, 92, 246, 0.05)', p: 2, borderRadius: '8px', mb: 2 }}>
                <Typography sx={{ color: '#2d3748', lineHeight: 1.8 }}>
                  • College XYZ allocates <strong>1,000,000 college coins</strong> for miners<br />
                  • All miners collectively mined <strong>10,000,000 tokens</strong><br />
                  • You mined <strong>2,000,000 tokens</strong> (20% of total mined)<br />
                  • You will receive <strong>200,000 college coins</strong> (20% of allocated amount)
                </Typography>
              </Box>
              <Typography sx={{ color: '#718096', lineHeight: 1.8 }}>
                Your share is calculated as: <strong>(Your Mined Tokens / Total Mined Tokens) × Total Allocated College Coins</strong>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>Token Distribution Timeline</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                Users who mine tokens for a college will receive their allocated college coins as <strong>airdrops</strong> after the college officially partners with CollegenZ and launches their digital token.
              </Typography>
              <Typography sx={{ color: '#718096', lineHeight: 1.8 }}>
                The timing of the airdrop depends entirely on when and if the college decides to partner with us. There is no guaranteed timeline, and some colleges may never partner with us.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* Mining Rate Halving */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingDownIcon sx={{ color: '#f59e0b', fontSize: 32, mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>
              Mining Rate Schedule
            </Typography>
          </Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>Early Mining Advantage</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                Mining now represents an <strong>early opportunity</strong> to earn tokens at a higher rate. As colleges progress through different stages of partnership, the mining rate will be systematically reduced to reward early miners.
              </Typography>
              <Typography sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                Rate Halving Schedule:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(245, 158, 11, 0.05)', p: 2, borderRadius: '8px' }}>
                <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
                  <strong>1. Baseline Rate:</strong> Current mining rate (highest)<br />
                  <strong>2. Waitlist Stage:</strong> Rate halved to 50% when college joins our waitlist<br />
                  <strong>3. Live Stage:</strong> Rate halved again to 25% when college coins go live<br />
                  <strong>4. Exchange Listing:</strong> Rate halved again to 12.5% when listed on InTuition Exchange<br />
                  <strong>5. Mining Stopped:</strong> No further mining allowed after exchange listing
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>Why Mining Rates Decrease</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8 }}>
                The halving schedule is designed to reward early believers who took the risk of mining before a college officially partnered with us. As the college progresses and risk decreases, the rewards also decrease proportionally. This ensures fair distribution and incentivizes early participation.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* 15-Month Deadline & TUIT Conversion */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InfoOutlinedIcon sx={{ color: '#06b6d4', fontSize: 32, mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>
              College Partnership Timeline
            </Typography>
          </Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>15-Month Deadline</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                Each college has <strong>15 months from the start of the first mining session</strong> to officially sign up and partner with CollegenZ. This timeline is tracked individually for each college.
              </Typography>
              <Typography sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                What happens after 15 months?
              </Typography>
              <Typography sx={{ color: '#718096', lineHeight: 1.8 }}>
                If a college does not sign up within this timeframe, miners for that college will have the option to convert their mined tokens to <strong>TUIT</strong>, CollegenZ's native platform token.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>TUIT Conversion Terms</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                The conversion rate from college-specific tokens to TUIT will be <strong>determined at the time of conversion</strong> and will not be a fixed 1:1 ratio.
              </Typography>
              <Typography sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                Factors affecting conversion rate:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(6, 182, 212, 0.05)', p: 2, borderRadius: '8px' }}>
                <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
                  • Total tokens mined for that college<br />
                  • Number of active miners<br />
                  • Current TUIT market value<br />
                  • Platform tokenomics at time of conversion<br />
                  • Overall demand and supply dynamics
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>No Guaranteed Value</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8 }}>
                There is <strong>no guarantee</strong> that the TUIT conversion will be favorable or that TUIT will have any specific market value. Mining is speculative, and miners accept the risk that a college may never partner with us, requiring conversion to TUIT at rates determined by market conditions.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* KYC and Verification Requirements */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <VerifiedUserIcon sx={{ color: '#10b981', fontSize: 32, mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>
              Verification Requirements
            </Typography>
          </Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>Mandatory KYC Before Withdrawal</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                All users must complete <strong>Know Your Customer (KYC)</strong> verification before they can:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.05)', p: 2, borderRadius: '8px', mb: 2 }}>
                <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
                  • Withdraw tokens to external wallets<br />
                  • Exchange tokens for other cryptocurrencies<br />
                  • Convert tokens to fiat currency<br />
                  • Transfer tokens to other platforms
                </Typography>
              </Box>
              <Typography sx={{ color: '#718096', lineHeight: 1.8 }}>
                KYC is a legal requirement to comply with anti-money laundering (AML) regulations and prevent fraudulent activity. Failure to complete KYC will result in inability to access your earned tokens outside the platform.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>Proof of College Association</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                Before withdrawal or exchange, students must prove their association with the colleges they have added to their mining portfolio. This verification ensures that only legitimate students benefit from college-specific tokens.
              </Typography>
              <Typography sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                Accepted proof documents:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.05)', p: 2, borderRadius: '8px', mb: 2 }}>
                <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
                  • Official college offer letters<br />
                  • Valid student ID cards<br />
                  • Official transcripts or grade reports<br />
                  • Enrollment verification letters<br />
                  • Alumni certificates (for graduated students)
                </Typography>
              </Box>
              <Typography sx={{ color: '#718096', lineHeight: 1.8 }}>
                All documents must be official, verifiable, and clearly show your name and the college name. Fake or forged documents will result in permanent account suspension and forfeiture of all mined tokens.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>College Admin Verification</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
                College administrators who sign up to manage their institution's presence on CollegenZ must verify their management rights and official capacity. We are implementing a rigorous verification process and will begin authenticating all college admins before they join our waitlist.
              </Typography>
              <Typography sx={{ color: '#2d3748', fontWeight: 600, mb: 1 }}>
                Admin verification requirements:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.05)', p: 2, borderRadius: '8px' }}>
                <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
                  • Official college email address verification<br />
                  • Proof of administrative role (employment letter, faculty ID)<br />
                  • Authorization from college management<br />
                  • Video verification call with our team<br />
                  • Legal documentation review
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* Risk and Legal Disclaimer */}
        <Alert
          severity="error"
          icon={<WarningAmberIcon />}
          sx={{ mb: 4, borderRadius: '12px' }}
        >
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Risk Acknowledgment
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
            Mining tokens on CollegenZ is speculative and involves significant risk. There is no guarantee that any college will partner with us, that tokens will have any value, or that you will be able to withdraw or exchange your tokens. You may lose all the time and effort invested in mining. Only participate if you understand and accept these risks.
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
