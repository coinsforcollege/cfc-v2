import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '../../components/sections/HeroSection';
import NetworkMapSection from '../../components/sections/NetworkMapSection';
import HowItWorksSection from '../../components/sections/HowItWorksSection';
import InfrastructureSection from '../../components/sections/InfrastructureSection';
import FundraisingSection from '../../components/sections/FundraisingSection';
import CampusDigitalEconomySection from '../../components/sections/CampusDigitalEconomySection';
import OperationsModelSection from '../../components/sections/OperationsModelSection';
import TractionProofSection from '../../components/sections/TractionProofSection';
import BuildOnCollegenSection from '../../components/sections/BuildOnCollegenSection';
import CTASection from '../../components/sections/CTASection';
import CollegeCoinsSection from '../../components/sections/CollegeCoinsSection';
import SEO from '../../components/common/SEO';

function Home() {
  return (
    <Box>
      <SEO 
        title="Home"
        description="Join the revolution in campus economics. Earn tokens while supporting your college's digital transformation."
      />
      <HeroSection />
      <NetworkMapSection />
      <CollegeCoinsSection />
      <InfrastructureSection />
      <FundraisingSection />
      <CampusDigitalEconomySection />
      <OperationsModelSection />
      <TractionProofSection />
      <CTASection />
      <BuildOnCollegenSection />
      <HowItWorksSection />
    </Box>
  );
}

export default Home;
