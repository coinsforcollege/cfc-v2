import React from 'react';
import { Box } from '@mui/material';
import { 
  IndiaHero, 
  IndiaEvidence, 
  IndiaArgument, 
  IndiaAgenda, 
  IndiaAudience, 
  IndiaDeliverables, 
  IndiaCredibility, 
  IndiaTestimonials 
} from './IndiaComponents';
import WebinarHost from '../shared/WebinarHost';
import WebinarFAQ from '../shared/WebinarFAQ';
import WebinarCTA from '../shared/WebinarCTA';

const WebinarIndia = () => {
  const hostBio = (
    <>
      <p>Joshua Samuel founded Coins for College on a conviction shaped by his own path through the American education system: that the infrastructure built around students has consistently failed the students it claims to serve, and that the next generation deserves systems that work before they arrive.</p>
      <p>His current research focuses on the convergence of demographic, technological, and behavioral forces reshaping higher education across global markets, with particular attention to the India enrollment opportunity now opening. He has presented this work to senior leadership at private and public institutions across the United States and India, and is partnering with anchor institutions in India to build the infrastructure for the next decade of growth.</p>
      <p>This briefing is the synthesis of that research.</p>
    </>
  );

  const faqs = [
    {
      question: "Is this a sales presentation for Coins for College?",
      answer: "No. The session is a research briefing on the structural forces shaping the next decade of Indian higher education. Coins for College hosts the briefing. The final module includes the frameworks we are building, presented alongside the broader category of responses emerging across the sector. Attendance carries no obligation of any kind."
    },
    {
      question: "Is registration really free?",
      answer: "Yes. The live session, the recording, and the data appendix are all complimentary for registered attendees."
    },
    {
      question: "Will the session be recorded and shared?",
      answer: "Yes. Every registered attendee receives the full recording within forty-eight hours of the live session, along with the data appendix and the frameworks document."
    },
    {
      question: "Can I bring colleagues from my institution?",
      answer: "Yes. Each colleague registers individually. The conversation is most productive when attended by a small team from the same institution, particularly when that team includes academic leadership, admissions, and strategy."
    },
    {
      question: "Is a continuing education certificate available?",
      answer: "Yes. School principals, career counselors, and college advisors can request a certificate at registration or by emailing our team within thirty days of the live session."
    },
    {
      question: "What if I cannot attend live?",
      answer: "Register anyway. The recording and the data appendix are sent to every registered attendee, regardless of whether they attended live."
    }
  ];

  return (
    <Box>
      <IndiaHero />
      <IndiaEvidence />
      <IndiaArgument />
      <IndiaAgenda />
      <IndiaAudience />
      <IndiaDeliverables />
      <IndiaCredibility />
      <WebinarHost bio={hostBio} />
      <IndiaTestimonials />
      <WebinarFAQ faqs={faqs} />
      <WebinarCTA 
        headline="The universities that position now will absorb the largest share of the largest enrollment wave in history."
        subline="Tuesday, July 7, 2026. Ninety minutes. Complimentary registration."
        buttonText="Register for the Briefing"
        microcopy="Real institutional email required. Recording and data appendix sent to all who register."
      />
    </Box>
  );
};

export default WebinarIndia;
