import React from 'react';
import { Box, Container, Typography, Alert, Divider } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTranslation } from 'react-i18next';

function ThingsToKnow() {
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 10, md: 12 }, background: '#ffffff' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
            {t('auth.disclaimerAndImportantInfo')}
          </Typography>
          <Typography variant="h6" sx={{ color: '#718096', maxWidth: '800px', mx: 'auto' }}>
            {t('auth.pleaseReadCarefully')}
          </Typography>
        </Box>

        {/* Important Alert */}
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 6, borderRadius: '12px', fontSize: '1rem' }}
        >
          {t('auth.thisInfoIsCrucial')}
        </Alert>

        {/* College Affiliation */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            {t('auth.collegeAffiliation')}
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            {t('auth.noOfficialAffiliation')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.collegenzNotAffiliated')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 2 }}>
            {t('auth.buildingPlatformForColleges')}
          </Typography>
          <Typography sx={{ color: '#ef4444', fontWeight: 600, lineHeight: 1.8, fontStyle: 'italic' }}>
            {t('auth.finalDecisionRights')}
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Token Mechanics */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            {t('auth.understandingTokenAllocation')}
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            {t('auth.tokensMinedVsCollegeCoins')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.tokensNotSameAsCollegeCoins')}
          </Typography>
          
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            {t('auth.howItWorksExample')}
          </Typography>
          <Box sx={{ bgcolor: '#f3f4f6', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #8b5cf6' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • {t('auth.collegeXyzAllocates')}<br />
              • {t('auth.allMinersCollectivelyMined')}<br />
              • {t('auth.youMinedTokens')}<br />
              • {t('auth.youWillReceiveCoins')}
            </Typography>
          </Box>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.yourShareCalculated')}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            {t('auth.tokenDistributionTimeline')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 2 }}>
            {t('auth.usersReceiveAirdrops')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8 }}>
            {t('auth.timingDependsOnCollege')}
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Mining Rate Halving */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            {t('auth.miningRateSchedule')}
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            {t('auth.earlyMiningAdvantage')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.miningNowRepresents')}
          </Typography>
          
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            {t('auth.rateHalvingSchedule')}
          </Typography>
          <Box sx={{ bgcolor: '#fef3c7', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #f59e0b' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              <strong>1. {t('auth.baselineRate')}</strong><br />
              <strong>2. {t('auth.waitlistStage')}</strong><br />
              <strong>3. {t('auth.liveStage')}</strong><br />
              <strong>4. {t('auth.exchangeListing')}</strong><br />
              <strong>5. {t('auth.miningStopped')}</strong>
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            {t('auth.whyMiningRatesDecrease')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8 }}>
            {t('auth.halvingScheduleDesigned')}
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* 15-Month Deadline & TUIT Conversion */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            {t('auth.collegePartnershipTimeline')}
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            {t('auth.fifteenMonthDeadline')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.eachCollegeHasFifteenMonths')}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            {t('auth.whatHappensAfterFifteenMonths')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.ifCollegeDoesNotSignUp')}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            {t('auth.tuitConversionTerms')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.conversionRateDetermined')}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            {t('auth.factorsAffectingConversionRate')}
          </Typography>
          <Box sx={{ bgcolor: '#e0f2fe', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #06b6d4' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • {t('auth.totalTokensMinedForCollege')}<br />
              • {t('auth.numberOfActiveMiners')}<br />
              • {t('auth.currentTuitMarketValue')}<br />
              • {t('auth.platformTokenomicsAtTime')}<br />
              • {t('auth.overallDemandAndSupply')}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            {t('auth.noGuaranteedValue')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8 }}>
            {t('auth.noGuaranteeTuitConversion')}
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* KYC and Verification Requirements */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
            {t('auth.verificationParticipationRequirements')}
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            {t('auth.whoCanParticipate')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.platformWelcomesStudents')}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            {t('auth.mandatoryKycBeforeWithdrawal')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.allUsersMustCompleteKyc')}
          </Typography>
          <Box sx={{ bgcolor: '#d1fae5', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #10b981' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • {t('auth.withdrawTokensToExternalWallets')}<br />
              • {t('auth.exchangeTokensForOtherCryptocurrencies')}<br />
              • {t('auth.convertTokensToFiatCurrency')}<br />
              • {t('auth.transferTokensToOtherPlatforms')}
            </Typography>
          </Box>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.kycLegalRequirement')}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            {t('auth.collegeAssociationProofMayBeRequired')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 3 }}>
            {t('auth.whileWeWelcomeAllCommunity')}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            {t('auth.acceptedProofDocuments')}
          </Typography>
          <Box sx={{ bgcolor: '#d1fae5', p: 3, borderRadius: '8px', mb: 3, borderLeft: '4px solid #10b981' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • {t('auth.officialCollegeOfferLetters')}<br />
              • {t('auth.validStudentIdCards')}<br />
              • {t('auth.officialTranscriptsOrGradeReports')}<br />
              • {t('auth.enrollmentVerificationLetters')}<br />
              • {t('auth.alumniCertificatesOrAssociationMembership')}<br />
              • {t('auth.documentationShowingConnection')}
            </Typography>
          </Box>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 2 }}>
            {t('auth.allDocumentsMustBeOfficial')}
          </Typography>
          <Typography sx={{ color: '#ef4444', fontWeight: 600, lineHeight: 1.8, fontStyle: 'italic' }}>
            {t('auth.importantCollegesRetainFinalAuthority')}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2, mt: 4 }}>
            {t('auth.collegeAdminVerification')}
          </Typography>
          <Typography sx={{ color: '#4a5568', lineHeight: 1.8, mb: 2 }}>
            {t('auth.collegeAdministratorsMustVerify')}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
            {t('auth.adminVerificationRequirements')}
          </Typography>
          <Box sx={{ bgcolor: '#d1fae5', p: 3, borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <Typography sx={{ color: '#2d3748', lineHeight: 2 }}>
              • {t('auth.officialCollegeEmailAddressVerification')}<br />
              • {t('auth.proofOfAdministrativeRole')}<br />
              • {t('auth.authorizationFromCollegeManagement')}<br />
              • {t('auth.videoVerificationCallWithTeam')}<br />
              • {t('auth.legalDocumentationReview')}
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
            {t('auth.riskAcknowledgment')}
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.8, mb: 2 }}>
            {t('auth.miningTokensSpeculative')}
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.8, fontStyle: 'italic', color: '#dc2626' }}>
            {t('auth.finalAuthorityAllUltimateDecisions')}
          </Typography>
        </Alert>

        <Divider sx={{ my: 4 }} />

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: '#718096', lineHeight: 1.8, mb: 2 }}>
            {t('auth.byUsingCollegenzPlatform')}
          </Typography>
          <Typography sx={{ color: '#2d3748', fontWeight: 600 }}>
            {t('auth.lastUpdated')} {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ThingsToKnow;
