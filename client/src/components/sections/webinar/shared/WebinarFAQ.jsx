import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { motion } from 'framer-motion';

const FAQItem = ({ faq, isOpen, onClick }) => (
  <Box
    sx={{
      mb: 3,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: isOpen ? '0 12px 32px rgba(0,0,0,0.08)' : '0 4px 12px rgba(0,0,0,0.02)',
    }}
  >
    <Box
      onClick={onClick}
      sx={{
        p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
        '&:hover': { bgcolor: 'rgba(247, 250, 252, 0.5)' }
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', pr: 2 }}>
        {faq.question}
      </Typography>
      <IconButton size="small" sx={{ color: '#8b5cf6', bgcolor: 'rgba(139,92,246,0.1)', '&:hover': { bgcolor: 'rgba(139,92,246,0.2)' } }}>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    </Box>
    <Collapse in={isOpen}>
      <Box sx={{ p: 3, pt: 0, color: '#718096', fontSize: '1.1rem', lineHeight: 1.7 }}>
        {faq.answer}
      </Box>
    </Collapse>
  </Box>
);

const WebinarFAQ = ({ title, faqs }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Box sx={{ py: 16, bgcolor: '#f7fafc', position: 'relative' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ mb: 8, fontWeight: 800, color: '#2d3748' }}
          >
            {title || "Frequently Asked Questions"}
          </Typography>
        </motion.div>
        
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FAQItem 
                faq={faq} 
                isOpen={openIndex === index} 
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)} 
              />
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WebinarFAQ;
