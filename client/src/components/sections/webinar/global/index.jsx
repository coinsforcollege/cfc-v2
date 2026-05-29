import React from 'react';
import { Box } from '@mui/material';
import { 
  GlobalHero, 
  GlobalStats, 
  GlobalStatement, 
  GlobalShift, 
  GlobalAgenda, 
  GlobalAudience, 
  GlobalDeliverables 
} from './GlobalComponents';
import WebinarHost from '../shared/WebinarHost';
import WebinarFAQ from '../shared/WebinarFAQ';
import WebinarCTA from '../shared/WebinarCTA';

const WebinarGlobal = () => {
  const hostBio = (
    <>
      <p>Joshua Samuel founded Coins for College on a single conviction: the systems built around students have failed them, and the next generation deserves infrastructure that works before they arrive.</p>
      <p>He has spent the last several years researching the convergence of demographic decline, AI disruption, and behavioral shift inside American higher education.</p>
      <p>This briefing is the synthesis of that work.</p>
    </>
  );

  const faqs = [
    {
      question: "Is this a sales pitch?",
      answer: "No. The session is a research briefing on the structural forces reshaping college enrollment. Coins for College hosts it. The final module includes the frameworks we are building, presented alongside the broader category of responses emerging across the sector."
    },
    {
      question: "Is it really free?",
      answer: "Yes. Registration is free. The recording and the data appendix are sent to every registered attendee, whether they attend live or not."
    },
    {
      question: "Can I bring colleagues?",
      answer: "Yes. Each person registers individually. The conversation tends to be most useful when attended by a small team from the same institution."
    },
    {
      question: "What if I cannot attend live?",
      answer: "Register anyway. The recording arrives within forty-eight hours, with the data appendix included."
    }
  ];

  return (
    <Box>
      <GlobalHero />
      <GlobalStats />
      <GlobalStatement />
      <GlobalShift />
      <GlobalAgenda />
      <GlobalAudience />
      <GlobalDeliverables />
      <WebinarHost bio={hostBio} />
      <WebinarFAQ title="A few honest questions, answered." faqs={faqs} />
      <WebinarCTA 
        headline="The colleges that act on this in 2026 will spend the rest of the decade absorbing the students the slow movers lose."
        subline="Tuesday, July 7, 2026. Ninety minutes. Free."
        buttonText="Reserve Your Seat"
        microcopy="Real institutional email required. Recording sent to all who register."
      />
    </Box>
  );
};

export default WebinarGlobal;
