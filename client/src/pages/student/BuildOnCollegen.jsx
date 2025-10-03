import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Container, Typography, Card, CardContent, Chip, Stack, Button, Grid } from '@mui/material';
import { 
  Code, 
  Rocket, 
  School, 
  AttachMoney,
  Security,
  Speed,
  Group,
  Lightbulb,
  ArrowForward,
  PlayArrow,
  CheckCircle,
  TrendingUp,
  FlashOn,
  EmojiEvents,
  MonetizationOn,
  AccountBalance,
  HowToVote,
  BusinessCenter,
  Handshake,
  Extension,
  Star,
  Campaign,
  Public,
  Assignment,
  CardGiftcard,
  ContactSupport,
  PersonAdd
} from '@mui/icons-material';
import { Link } from 'react-router';
import Header from '../../components/layout/Header';
import blockchainImage from '../../assets/blockchain-development-dark-purple-bg-vector.jpg';

const BuildOnCollegen = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [gasComparison, setGasComparison] = useState({ ethereum: 0, collegen: 0 });

  const solidityCode = [
    "// Smart Contract for Campus Token",
    "pragma solidity ^0.8.0;",
    "",
    "contract CampusToken {",
    "    mapping(address => uint256) public balances;",
    "    mapping(address => mapping(address => uint256)) public allowances;",
    "    ",
    "    uint256 public totalSupply = 1000000 * 10**18;",
    "    string public name = \"CampusCoin\";",
    "    string public symbol = \"CAMP\";",
    "    ",
    "    event Transfer(address indexed from, address indexed to, uint256 value);",
    "    ",
    "    constructor() {",
    "        balances[msg.sender] = totalSupply;",
    "    }",
    "    ",
    "    function transfer(address to, uint256 amount) public returns (bool) {",
    "        require(balances[msg.sender] >= amount, \"Insufficient balance\");",
    "        balances[msg.sender] -= amount;",
    "        balances[to] += amount;",
    "        emit Transfer(msg.sender, to, amount);",
    "        return true;",
    "    }",
    "}"
  ];

  const pixelArtFeatures = [
    {
      icon: Rocket,
      title: "Deploy in Seconds",
      description: "No more waiting for gas fees to drop",
      color: "#ff6b6b",
      gas: "0.001 ETH",
      savings: "99.9%"
    },
    {
      icon: FlashOn,
      title: "Lightning Fast",
      description: "Transactions confirmed instantly",
      color: "#4ecdc4",
      gas: "0.0001 ETH",
      savings: "99.99%"
    },
    {
      icon: Security,
      title: "Secure & Audited",
      description: "Enterprise-grade security",
      color: "#45b7d1",
      gas: "0.0005 ETH",
      savings: "99.5%"
    }
  ];

  const pixelArtResources = [
    {
      icon: Code,
      title: "Complete SDK",
      description: "Everything you need to start building",
      color: "#96ceb4"
    },
    {
      icon: EmojiEvents,
      title: "Hackathons",
      description: "Compete for epic prizes",
      color: "#feca57"
    },
    {
      icon: MonetizationOn,
      title: "Gas Sponsorship",
      description: "We pay for your transactions",
      color: "#ff9ff3"
    },
    {
      icon: Star,
      title: "Project Grants",
      description: "Funding for innovative ideas",
      color: "#54a0ff"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < solidityCode.length - 1) {
          return prev + 1;
        } else {
          setIsTyping(false);
          return prev;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGasComparison({
        ethereum: Math.floor(Math.random() * 50) + 20,
        collegen: Math.floor(Math.random() * 2) + 1
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Header />
      
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            linear-gradient(135deg, 
              rgba(255, 107, 107, 0.1) 0%, 
              rgba(78, 205, 196, 0.1) 25%,
              rgba(69, 183, 209, 0.1) 50%,
              rgba(255, 159, 243, 0.1) 75%,
              rgba(84, 160, 255, 0.1) 100%
            )
          `,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pixel Art Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '60px',
              height: '60px',
              background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect x=\'20\' y=\'20\' width=\'60\' height=\'60\' fill=\'%23ff6b6b\'/%3E%3C/svg%3E")',
              backgroundSize: 'contain',
              animation: 'float 3s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: '40px',
              height: '40px',
              background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'30\' fill=\'%234ecdc4\'/%3E%3C/svg%3E")',
              backgroundSize: 'contain',
              animation: 'float 2s ease-in-out infinite reverse',
            },
          }}
        />

        <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Chip
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rocket sx={{ fontSize: '1rem' }} />
                    For Students
                  </Box>
                }
                sx={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  borderRadius: '20px',
                  mb: 3,
                  fontSize: '1rem',
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 3,
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                Build on Collegen
              </Typography>
              <Typography
                sx={{
                  color: '#2d3748',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  lineHeight: 1.6,
                  maxWidth: '800px',
                  mx: 'auto',
                  fontWeight: 500,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Code sx={{ color: '#4ecdc4', fontSize: '1.2rem' }} />
                    Deploy dApps with zero gas fees
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlashOn sx={{ color: '#4ecdc4', fontSize: '1.2rem' }} />
                    Lightning fast
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security sx={{ color: '#4ecdc4', fontSize: '1.2rem' }} />
                    Enterprise secure
                  </Box>
                </Box>
              </Typography>
            </Box>
          </motion.div>

          {/* Animated Code Editor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card
              sx={{
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '2px solid #4ecdc4',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                mb: 8,
                overflow: 'hidden',
              }}
            >
              {/* Code Editor Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#ff6b6b' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#feca57' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#4ecdc4' }} />
                </Box>
                <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                  CampusToken.sol
                </Typography>
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlayArrow sx={{ color: '#4ecdc4', fontSize: '20px' }} />
                  <Typography sx={{ color: '#4ecdc4', fontSize: '0.8rem' }}>
                    Deploying to Collegen L2...
                  </Typography>
                </Box>
              </Box>

              {/* Code Content */}
              <Box sx={{ p: 3, fontFamily: 'Monaco, Consolas, monospace' }}>
                {solidityCode.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: index <= currentLine ? 1 : 0.3,
                      x: 0 
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '4px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#718096',
                        fontSize: '0.8rem',
                        minWidth: '30px',
                        textAlign: 'right',
                        mr: 2,
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography
                      sx={{
                        color: index <= currentLine ? '#e2e8f0' : '#4a5568',
                        fontSize: '0.9rem',
                        fontFamily: 'Monaco, Consolas, monospace',
                      }}
                    >
                      {line}
                    </Typography>
                    {index === currentLine && isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ color: '#4ecdc4', marginLeft: '4px' }}
                      >
                        |
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </Box>
            </Card>
          </motion.div>

          {/* Gas Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: '#2d3748',
                  mb: 4,
                  textAlign: 'center',
                }}
              >
                Gas Fee Comparison
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: 4 }}>
                <Card
                  sx={{
                    background: 'rgba(255, 107, 107, 0.1)',
                    border: '2px solid #ff6b6b',
                    borderRadius: '16px',
                    p: 4,
                    textAlign: 'center',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Box
                      component="img"
                      src="/images/ethereum-cryptocurrency-pixel-art-illustration-600nw-2077265023.webp"
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#ff6b6b' }}>
                      Ethereum Mainnet
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '3rem',
                      fontWeight: 800,
                      color: '#ff6b6b',
                      mb: 1,
                    }}
                  >
                    ${gasComparison.ethereum}
                  </Typography>
                  <Typography sx={{ color: '#718096' }}>
                    Per transaction
                  </Typography>
                </Card>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(78, 205, 196, 0.1)',
                      border: '2px solid #4ecdc4',
                      borderRadius: '16px',
                      p: 4,
                      textAlign: 'center',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3), 0 0 20px rgba(78, 205, 196, 0.2)',
                      '&::after': {
                        content: '"✨"',
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontSize: '1.5rem',
                        zIndex: 2,
                        animation: 'sparkle 2s ease-in-out infinite',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                      <Box
                        component="img"
                        src="/images/collegen-icon.svg"
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#2d3748' }}>
                        Collegen L2
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        color: '#4ecdc4',
                        mb: 1,
                      }}
                    >
                      ${gasComparison.collegen}
                    </Typography>
                    <Typography sx={{ color: '#718096' }}>
                      Per transaction
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        px: 2,
                        py: 1,
                        background: 'rgba(78, 205, 196, 0.2)',
                        borderRadius: '12px',
                        border: '1px solid rgba(78, 205, 196, 0.3)',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.9rem', color: '#2d3748', fontWeight: 600 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FlashOn sx={{ fontSize: '1rem' }} />
                          99%+ Savings!
                        </Box>
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
                
                {/* Pixel Art Image */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/immutable-place-game-screen-pixel-art.jpeg"
                      sx={{
                        width: 'auto',
                        height: '200px',
                        borderRadius: '16px',
                        objectFit: 'contain',
                        position: 'relative',
                      }}
                    />
                  </motion.div>
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Why Students Love Collegen & Developer Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: '#2d3748',
                  mb: 6,
                  textAlign: 'center',
                }}
              >
                Why Students Love Collegen
              </Typography>
              
              {/* Main Features Row */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
                <Box sx={{ flex: '1 1 300px', display: 'flex', gap: 3, p: 3, background: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Box sx={{ flexShrink: 0 }}>
                    {React.createElement(Code, { sx: { color: '#8b5cf6', fontSize: '32px' } })}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Comprehensive SDK & Tools
                    </Typography>
                    <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                      Pre-built components, utilities, and development tools to accelerate your blockchain projects
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: '1 1 300px', display: 'flex', gap: 3, p: 3, background: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Box sx={{ flexShrink: 0 }}>
                    {React.createElement(FlashOn, { sx: { color: '#8b5cf6', fontSize: '32px' } })}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Gas Sponsorship Program
                    </Typography>
                    <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                      Free transactions for student projects, hackathons, and educational initiatives
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: '1 1 300px', display: 'flex', gap: 3, p: 3, background: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Box sx={{ flexShrink: 0 }}>
                    {React.createElement(EmojiEvents, { sx: { color: '#8b5cf6', fontSize: '32px' } })}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Regular Hackathons
                    </Typography>
                    <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                      Coding competitions with prizes, recognition, and networking opportunities
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: '1 1 300px', display: 'flex', gap: 3, p: 3, background: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Box sx={{ flexShrink: 0 }}>
                    {React.createElement(MonetizationOn, { sx: { color: '#8b5cf6', fontSize: '32px' } })}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Project Grants
                    </Typography>
                    <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                      Funding opportunities for innovative blockchain projects and research
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Developer Resources */}
              <Box sx={{ 
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                py: 8, 
                px: 4,
                background: `
                  linear-gradient(135deg, 
                    rgba(155, 184, 224, 0.4) 0%, 
                    rgba(179, 154, 232, 0.3) 25%,
                    rgba(230, 155, 184, 0.3) 50%,
                    rgba(155, 214, 195, 0.3) 75%,
                    rgba(155, 184, 224, 0.4) 100%
                  )
                `,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                mb: 6
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700,
                    color: '#2d3748',
                    mb: 6,
                    textAlign: 'center',
                  }}
                >
                  Developer Resources
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                  {[
                    { title: 'Documentation', color: 'rgba(155, 184, 224, 0.8)' },
                    { title: 'Code Examples', color: 'rgba(179, 154, 232, 0.8)' },
                    { title: 'API Reference', color: 'rgba(230, 155, 184, 0.8)' },
                    { title: 'Community Forum', color: 'rgba(155, 214, 195, 0.8)' },
                    { title: 'GitHub Repository', color: 'rgba(155, 184, 224, 0.8)' },
                    { title: 'Discord Server', color: 'rgba(179, 154, 232, 0.8)' }
                  ].map((resource, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          background: resource.color,
                          color: '#2d3748',
                          borderRadius: '16px',
                          px: 3,
                          py: 1.5,
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            background: resource.color,
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                          },
                        }}
                      >
                        {resource.title}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Mining Program Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: '#2d3748',
                  mb: 6,
                  textAlign: 'center',
                }}
              >
                Mining Program
              </Typography>
              
              {/* How Mining Works - Timeline Design */}
              <Box sx={{ mb: 6 }}>
                
                {/* Timeline Layout */}
                <Box sx={{ position: 'relative' }}>
                  {/* Central Line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: 'linear-gradient(180deg, #8b5cf6 0%, #ec4899 100%)',
                      borderRadius: '2px',
                      transform: 'translateX(-50%)',
                      zIndex: 1,
                    }}
                  />
                  
                  {/* Step 1 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 8 }}>
                    <Box sx={{ flex: 1, pr: 6, textAlign: 'right' }}>
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        <Box sx={{ p: 4, background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px', border: '2px solid rgba(139, 92, 246, 0.2)', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.1)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                            <Box sx={{ p: 2, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.2) 100%)', borderRadius: '12px' }}>
                              {React.createElement(Speed, { sx: { color: '#8b5cf6', fontSize: '32px' } })}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                              Daily Login
                            </Typography>
                          </Box>
                          <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                            Log in daily to start a 24-hour mining cycle
                          </Typography>
                        </Box>
                      </motion.div>
                    </Box>
                    
                    {/* Timeline Dot */}
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        background: '#8b5cf6',
                        borderRadius: '50%',
                        border: '4px solid white',
                        boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.2)',
                        zIndex: 2,
                        position: 'relative',
                      }}
                    />
                    
                    <Box sx={{ flex: 1, pl: 6 }}>
                      <Box
                        component="img"
                        src="/images/students-working-study-group.jpg"
                        sx={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '16px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </Box>
                  </Box>
                  
                  {/* Step 2 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 8 }}>
                    <Box sx={{ flex: 1, pr: 6 }}>
                      <Box
                        component="img"
                        src="/images/collegen-icon.svg"
                        sx={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          borderRadius: '16px',
                        }}
                      />
                    </Box>
                    
                    {/* Timeline Dot */}
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        background: '#ec4899',
                        borderRadius: '50%',
                        border: '4px solid white',
                        boxShadow: '0 0 0 4px rgba(236, 72, 153, 0.2)',
                        zIndex: 2,
                        position: 'relative',
                      }}
                    />
                    
                    <Box sx={{ flex: 1, pl: 6 }}>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        <Box sx={{ p: 4, background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px', border: '2px solid rgba(236, 72, 153, 0.2)', boxShadow: '0 10px 30px rgba(236, 72, 153, 0.1)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                            <Box sx={{ p: 2, background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.2) 100%)', borderRadius: '12px' }}>
                              {React.createElement(Group, { sx: { color: '#ec4899', fontSize: '32px' } })}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                              Earn & Invite
                            </Typography>
                          </Box>
                          <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                            Earn virtual tokens for up to 10 colleges. Invite peers for mining bonuses.
                          </Typography>
                        </Box>
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Token Release & Requirements */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 6, alignItems: 'stretch' }}>
                <Box sx={{ flex: 1, p: 4, background: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
                    Token Release Mechanism
                  </Typography>
                  <Typography sx={{ color: '#718096', lineHeight: 1.6, mb: 3 }}>
                    When your college joins Coins For College and goes live, your mined balance converts to real tokens. The ratio depends on what the college allocates to early supporters versus total tokens mined.
                  </Typography>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
                    Requirements Before Release
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography sx={{ color: '#718096', mb: 1 }}>• KYC verification</Typography>
                    <Typography sx={{ color: '#718096', mb: 1 }}>• Proof of college association (student ID, enrollment records)</Typography>
                    <Typography sx={{ color: '#718096', mb: 1 }}>• Cannot mine for the same college again after surrender</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1, p: 4, background: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
                    Fallback Value Protection
                  </Typography>
                  <Typography sx={{ color: '#718096', lineHeight: 1.6, mb: 3 }}>
                    If a college hasn't joined after 1 year, surrender your mined tokens for TUIT (Collegen's native token). Exchange rate calculated at time of surrender based on TUIT market value and college tier.
                  </Typography>
                  
                  <Box sx={{ p: 3, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center' }}>
                    <Typography sx={{ color: '#8b5cf6', fontWeight: 600, mb: 1 }}>
                      Early Supporter Status
                    </Typography>
                    <Typography sx={{ color: '#718096', fontSize: '0.9rem' }}>
                      Secure your position before official launch
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* DAO Governance Opportunity Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ mb: 8 }}>
              {/* Title Section */}
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #4ecdc4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 3,
                      textShadow: '0 4px 8px rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    DAO Governance Opportunity
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 600,
                      color: '#2d3748',
                    }}
                  >
                    Help Shape Your College's Token Economy
                  </Typography>
                </motion.div>
              </Box>

              {/* Main Governance Content - Grid Layout */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 6, mb: 8 }}>
                {/* Left Column: Governance Pathway */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ 
                    p: 6, 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '24px', 
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1)',
                    height: 'fit-content'
                  }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        fontWeight: 700,
                        color: '#8b5cf6',
                        mb: 4,
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                        <Rocket sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                        Governance Pathway
                      </Box>
                    </Typography>
                    
                    {/* Pathway Steps */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {/* Step 1 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ 
                          width: '60px', 
                          height: '60px', 
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>1</Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                            First 10 Miners
                          </Typography>
                          <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                            The first 10 miners for any college become priority candidates for DAO representation
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Arrow */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <ArrowForward sx={{ color: '#8b5cf6', fontSize: '2rem', transform: 'rotate(90deg)' }} />
                      </Box>
                      
                      {/* Step 2 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ 
                          width: '60px', 
                          height: '60px', 
                          background: 'linear-gradient(135deg, #ec4899 0%, #4ecdc4 100%)', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>2</Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                            2 Selected for Governance
                          </Typography>
                          <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                            2 of these 10 may be selected to join the college's governance team
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Arrow */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <ArrowForward sx={{ color: '#ec4899', fontSize: '2rem', transform: 'rotate(90deg)' }} />
                      </Box>
                      
                      {/* Step 3 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ 
                          width: '60px', 
                          height: '60px', 
                          background: 'linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%)', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>3</Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                            Active Governance
                          </Typography>
                          <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                            Vote on token utility, treasury allocation, partnerships, and ecosystem development
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>

                {/* Right Column: Selection Criteria */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ 
                    p: 6, 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '24px', 
                    border: '2px solid rgba(236, 72, 153, 0.2)',
                    boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)',
                    height: 'fit-content'
                  }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        fontWeight: 700,
                        color: '#ec4899',
                        mb: 4,
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                        <Star sx={{ color: '#ec4899', fontSize: '2rem' }} />
                        Selection Criteria
                      </Box>
                    </Typography>
                    
                    {/* Criteria List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {[
                        {
                          icon: School,
                          title: 'Current Enrollment or Alumni Status',
                          description: 'Must be currently enrolled or a verified alumni of the college',
                          color: '#8b5cf6'
                        },
                        {
                          icon: Group,
                          title: 'Campus Involvement & Public Influence',
                          description: 'Active participation in campus life and positive influence on the community',
                          color: '#ec4899'
                        },
                        {
                          icon: Security,
                          title: 'Background Verification',
                          description: 'Clean background check and verification of academic standing',
                          color: '#4ecdc4'
                        },
                        {
                          icon: Lightbulb,
                          title: 'Contribution to College Community',
                          description: 'Demonstrated commitment to improving campus life and student experience',
                          color: '#45b7d1'
                        }
                      ].map((criteria, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02, x: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box sx={{ 
                            p: 3, 
                            background: `${criteria.color}10`, 
                            borderRadius: '16px', 
                            border: `1px solid ${criteria.color}30`,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 3
                          }}>
                            <Box sx={{ 
                              p: 1.5, 
                              background: `${criteria.color}20`, 
                              borderRadius: '8px',
                              flexShrink: 0
                            }}>
                              {React.createElement(criteria.icon, { sx: { color: criteria.color, fontSize: '24px' } })}
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 1, fontSize: '1rem' }}>
                                {criteria.title}
                              </Typography>
                              <Typography sx={{ color: '#718096', lineHeight: 1.5, fontSize: '0.9rem' }}>
                                {criteria.description}
                              </Typography>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </Box>

              {/* Your Role in DAO - Full Width Section */}
              <Box sx={{ 
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                py: 8, 
                px: 4,
                background: `
                  linear-gradient(135deg, 
                    rgba(78, 205, 196, 0.15) 0%, 
                    rgba(139, 92, 246, 0.15) 25%,
                    rgba(236, 72, 153, 0.15) 50%,
                    rgba(69, 183, 209, 0.15) 75%,
                    rgba(78, 205, 196, 0.15) 100%
                  )
                `,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                mb: 6
              }}>
                <Container maxWidth="lg">
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: '1.8rem', md: '2.2rem' },
                      fontWeight: 700,
                      color: '#2d3748',
                      mb: 6,
                      textAlign: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                      <HowToVote sx={{ color: '#2d3748', fontSize: '2rem' }} />
                      Your Role in DAO
                    </Box>
                  </Typography>
                  
                  {/* Voting Powers Grid */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 4, 
                    mb: 6 
                  }}>
                    {[
                      {
                        title: 'Token Utility Expansion',
                        description: 'Vote on new use cases for campus tokens, from dining discounts to event access',
                        icon: AccountBalance,
                        color: '#8b5cf6'
                      },
                      {
                        title: 'Treasury Allocation',
                        description: 'Decide how college treasury funds are distributed across campus initiatives',
                        icon: MonetizationOn,
                        color: '#ec4899'
                      },
                      {
                        title: 'Partnership Decisions',
                        description: 'Approve partnerships with local businesses and service providers',
                        icon: Handshake,
                        color: '#4ecdc4'
                      },
                      {
                        title: 'Ecosystem Development',
                        description: 'Shape the roadmap for campus digital economy features and integrations',
                        icon: Extension,
                        color: '#45b7d1'
                      }
                    ].map((role, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ 
                          p: 4, 
                          background: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '20px', 
                          border: `2px solid ${role.color}30`,
                          boxShadow: `0 10px 30px ${role.color}20`,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}>
                          <Box sx={{ 
                            p: 2, 
                            background: `${role.color}20`, 
                            borderRadius: '50%',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {React.createElement(role.icon, { sx: { color: role.color, fontSize: '2.5rem' } })}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
                            {role.title}
                          </Typography>
                          <Typography sx={{ color: '#718096', lineHeight: 1.6 }}>
                            {role.description}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  {/* Call to Action */}
                  <Box sx={{ textAlign: 'center' }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        component={Link}
                        to="/auth/register/student"
                        variant="contained"
                        size="large"
                        endIcon={<EmojiEvents />}
                        sx={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                          color: '#ffffff',
                          px: 6,
                          py: 2,
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: '20px',
                          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                          '&:hover': {
                            boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rocket sx={{ fontSize: '1.2rem' }} />
                          Start Mining for Governance
                        </Box>
                      </Button>
                    </motion.div>
                  </Box>
                </Container>
              </Box>
            </Box>
          </motion.div>

          {/* Campus Ambassador Program Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ mb: 8 }}>
              {/* Hero Section with Pixel Art Background */}
              <Box sx={{ 
                position: 'relative',
                textAlign: 'center', 
                mb: 12,
                py: 8,
                background: `
                  linear-gradient(135deg, 
                    rgba(139, 92, 246, 0.05) 0%, 
                    rgba(236, 72, 153, 0.05) 50%,
                    rgba(78, 205, 196, 0.05) 100%
                  )
                `,
                borderRadius: '32px',
                overflow: 'hidden',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '3rem', md: '4.5rem' },
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 3,
                      textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Campus Ambassador Program
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2.2rem' },
                      fontWeight: 600,
                      color: '#2d3748',
                      mb: 4
                    }}
                  >
                    Lead Adoption, Build Experience
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.1rem',
                      color: '#718096',
                      maxWidth: '600px',
                      mx: 'auto',
                      lineHeight: 1.6
                    }}
                  >
                    Become a student leader and help shape the future of campus digital economies. 
                    Join our elite ambassador program and gain valuable experience while building communities.
                  </Typography>
                </motion.div>
              </Box>

              {/* What Ambassadors Do - Bento Grid Style */}
              <Box sx={{ mb: 12 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.8rem' },
                    fontWeight: 800,
                    color: '#2d3748',
                    mb: 8,
                    textAlign: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                    <Campaign sx={{ color: '#8b5cf6', fontSize: '2.5rem' }} />
                    What Ambassadors Do
                  </Box>
                </Typography>
                
                {/* Bento Grid Layout */}
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                  gap: 4,
                  maxWidth: '1200px',
                  mx: 'auto'
                }}>
                  {[
                    {
                      icon: Public,
                      title: 'Organize Campus Events',
                      description: 'Host workshops, presentations, and meetups to spread awareness about Coins For College',
                      color: '#8b5cf6',
                      gridSpan: { md: 'span 1', lg: 'span 2' },
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                      border: '2px solid rgba(139, 92, 246, 0.2)'
                    },
                    {
                      icon: PersonAdd,
                      title: 'Recruit Miners',
                      description: 'Build and maintain active mining communities across campus',
                      color: '#ec4899',
                      gridSpan: { md: 'span 1', lg: 'span 1' },
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                      border: '2px solid rgba(236, 72, 153, 0.2)'
                    },
                    {
                      icon: ContactSupport,
                      title: 'Bridge Communication',
                      description: 'Facilitate communication between students and college administration',
                      color: '#4ecdc4',
                      gridSpan: { md: 'span 1', lg: 'span 1' },
                      background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(78, 205, 196, 0.05) 100%)',
                      border: '2px solid rgba(78, 205, 196, 0.2)'
                    },
                    {
                      icon: Group,
                      title: 'Keep Communities Active',
                      description: 'Ensure mining communities stay informed and engaged with regular updates',
                      color: '#45b7d1',
                      gridSpan: { md: 'span 2', lg: 'span 2' },
                      background: 'linear-gradient(135deg, rgba(69, 183, 209, 0.1) 0%, rgba(69, 183, 209, 0.05) 100%)',
                      border: '2px solid rgba(69, 183, 209, 0.2)'
                    }
                  ].map((responsibility, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      style={{
                        gridColumn: responsibility.gridSpan,
                        minHeight: '200px'
                      }}
                    >
                      <Box sx={{ 
                        p: 6, 
                        background: responsibility.background,
                        borderRadius: '24px', 
                        border: responsibility.border,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        {/* Pixel Art Decoration */}
                        <Box
                          component="img"
                          src="/images/pixel-art-mining-cart-with-gold-icon-for-8bit-game-on-white-background-vector.jpg"
                          sx={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            width: '60px',
                            height: '60px',
                            opacity: 0.1,
                            borderRadius: '8px',
                            transform: 'rotate(15deg)',
                            zIndex: 1
                          }}
                        />
                        
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                          <Box sx={{ 
                            p: 3, 
                            background: `${responsibility.color}20`, 
                            borderRadius: '16px',
                            width: 'fit-content',
                            mb: 4
                          }}>
                            {React.createElement(responsibility.icon, { sx: { color: responsibility.color, fontSize: '32px' } })}
                          </Box>
                          
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748', mb: 3 }}>
                            {responsibility.title}
                          </Typography>
                          
                          <Typography sx={{ color: '#718096', lineHeight: 1.6, fontSize: '1rem' }}>
                            {responsibility.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {/* What You Receive - Horizontal Scroll Cards */}
              <Box sx={{ 
                mb: 12,
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                px: 4
              }}>
                <Container maxWidth="lg">
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '2rem', md: '2.8rem' },
                      fontWeight: 800,
                      color: '#2d3748',
                      mb: 8,
                      textAlign: 'center'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                      <CardGiftcard sx={{ color: '#ec4899', fontSize: '2.5rem' }} />
                      What You Receive
                    </Box>
                  </Typography>
                </Container>
                
                <Box sx={{ 
                  display: 'flex',
                  gap: 4,
                  overflowX: 'auto',
                  pb: 2,
                  px: 4,
                  '&::-webkit-scrollbar': {
                    height: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    borderRadius: '4px'
                  }
                }}>
                  {[
                    {
                      icon: Assignment,
                      title: 'Official Internship Certificate',
                      description: 'Get a professional certificate recognizing your contribution',
                      color: '#8b5cf6'
                    },
                    {
                      icon: BusinessCenter,
                      title: 'Professional Experience Letter',
                      description: 'Receive a detailed experience letter for your resume',
                      color: '#ec4899'
                    },
                    {
                      icon: Star,
                      title: 'Priority Token Airdrops',
                      description: 'Get early access to token distributions',
                      color: '#4ecdc4'
                    },
                    {
                      icon: CardGiftcard,
                      title: 'Exclusive Swag & Merchandise',
                      description: 'Receive branded merchandise and collectibles',
                      color: '#45b7d1'
                    },
                    {
                      icon: ContactSupport,
                      title: 'Direct Access to Core Team',
                      description: 'Connect directly with our development team',
                      color: '#f59e0b'
                    }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      style={{ minWidth: '320px' }}
                    >
                      <Box sx={{ 
                        p: 5, 
                        background: `linear-gradient(135deg, ${benefit.color}15 0%, ${benefit.color}05 100%)`,
                        borderRadius: '20px', 
                        border: `2px solid ${benefit.color}30`,
                        height: '280px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Animated Background */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `radial-gradient(circle at 50% 50%, ${benefit.color}10 0%, transparent 70%)`,
                            animation: 'pulse 4s ease-in-out infinite',
                            zIndex: 1
                          }}
                        />
                        
                        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Box sx={{ 
                            p: 3, 
                            background: `${benefit.color}25`, 
                            borderRadius: '50%',
                            width: 'fit-content',
                            mx: 'auto',
                            mb: 4
                          }}>
                            {React.createElement(benefit.icon, { sx: { color: benefit.color, fontSize: '40px' } })}
                          </Box>
                          
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
                            {benefit.title}
                          </Typography>
                          
                          <Typography sx={{ color: '#718096', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            {benefit.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {/* Eligibility & CTA Section */}
              <Box sx={{ 
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                py: 10, 
                px: 4,
                background: `
                  linear-gradient(135deg, 
                    rgba(139, 92, 246, 0.08) 0%, 
                    rgba(236, 72, 153, 0.08) 25%,
                    rgba(78, 205, 196, 0.08) 50%,
                    rgba(69, 183, 209, 0.08) 75%,
                    rgba(139, 92, 246, 0.08) 100%
                  )
                `,
                border: '1px solid rgba(139, 92, 246, 0.1)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background Pixel Art */}
                <Box
                  component="img"
                  src="/images/pixel-art-isometric-landscape-trees-bridge-lake-mine-mining-pixel-art-isometric-landscape-trees-bridge-lake-mine-mining-238827112.webp"
                  sx={{
                    position: 'absolute',
                    top: 40,
                    right: 40,
                    width: '300px',
                    height: '200px',
                    opacity: 0.08,
                    zIndex: 1
                  }}
                />
                <Box
                  component="img"
                  src="/images/college-ambassador-vector-transparent-bg.svg"
                  sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: 40,
                    width: '120px',
                    height: '120px',
                    opacity: 1,
                    borderRadius: '12px',
                    zIndex: 1
                  }}
                />
                
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
                    gap: 8, 
                    alignItems: 'center' 
                  }}>
                    {/* Eligibility Info */}
                    <Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: { xs: '2rem', md: '2.8rem' },
                          fontWeight: 800,
                          color: '#2d3748',
                          mb: 6
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <CheckCircle sx={{ color: '#4ecdc4', fontSize: '3rem' }} />
                          Eligibility Requirements
                        </Box>
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {[
                          'Must be an active miner on the platform',
                          'Apply through our ambassador portal',
                          'Demonstrate leadership and communication skills'
                        ].map((requirement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 3,
                              p: 3,
                              background: 'rgba(255, 255, 255, 0.7)',
                              borderRadius: '16px',
                              border: '1px solid rgba(78, 205, 196, 0.2)',
                              backdropFilter: 'blur(10px)'
                            }}>
                              <Box sx={{ 
                                p: 1.5, 
                                background: '#4ecdc420', 
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <CheckCircle sx={{ color: '#4ecdc4', fontSize: '24px' }} />
                              </Box>
                              <Typography sx={{ color: '#2d3748', fontWeight: 500, fontSize: '1.1rem' }}>
                                {requirement}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                    
                    {/* CTA Section */}
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Box sx={{ 
                          p: 6,
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '24px',
                          border: '2px solid rgba(139, 92, 246, 0.2)',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1)'
                        }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontSize: { xs: '1.8rem', md: '2.2rem' },
                              fontWeight: 700,
                              color: '#2d3748',
                              mb: 4
                            }}
                          >
                            Ready to Lead?
                          </Typography>
                          
                          <Typography sx={{ 
                            color: '#718096', 
                            fontSize: '1.1rem',
                            mb: 6,
                            lineHeight: 1.6
                          }}>
                            Join the elite group of student leaders shaping the future of campus digital economies
                          </Typography>
                          
                          <Button
                            component={Link}
                            to="/ambassador/apply"
                            variant="contained"
                            size="large"
                            sx={{
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                              color: '#ffffff',
                              px: 8,
                              py: 3,
                              fontSize: '1.2rem',
                              fontWeight: 600,
                              textTransform: 'none',
                              borderRadius: '20px',
                              boxShadow: '0 15px 40px rgba(139, 92, 246, 0.3)',
                              '&:hover': {
                                boxShadow: '0 20px 50px rgba(139, 92, 246, 0.4)',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <PersonAdd sx={{ fontSize: '1.3rem' }} />
                              Apply as Campus Ambassador
                            </Box>
                          </Button>
                        </Box>
                      </motion.div>
                    </Box>
                  </Box>
                </Container>
              </Box>
            </Box>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)',
                border: '2px solid #4ecdc4',
                borderRadius: '24px',
                p: 6,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: '#2d3748',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                  <Rocket sx={{ fontSize: '2.5rem', color: '#4ecdc4' }} />
                  Ready to Build the Next Big Thing?
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: '#718096',
                  fontSize: '1.2rem',
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Join thousands of students building the future of Web3. Zero gas fees, instant deployment, infinite possibilities.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to="/auth/register/student"
                    variant="contained"
                    size="large"
                    endIcon={<Rocket />}
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                      color: '#ffffff',
                      px: 4,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Code sx={{ fontSize: '1.2rem' }} />
                      Start Building
                    </Box>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to="/docs"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: '#4ecdc4',
                      borderColor: '#4ecdc4',
                      px: 4,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '16px',
                      '&:hover': {
                        borderColor: '#45b7d1',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Code sx={{ fontSize: '1.2rem' }} />
                      View Docs
                    </Box>
                  </Button>
                </motion.div>
              </Stack>
            </Card>
          </motion.div>
        </Container>
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </Box>
  );
};

export default BuildOnCollegen;
