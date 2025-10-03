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

function Home() {
  return (
    <Box>
      <HeroSection />
      <NetworkMapSection />
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
