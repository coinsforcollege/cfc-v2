import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Container, Typography, Card, CardContent, Chip, Stack } from '@mui/material';
import { School, TrendingUp, People, LocationOn } from '@mui/icons-material';
import * as d3 from 'd3';
import { collegesApi } from '../../api/colleges.api';

const NetworkMapSection = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [pulseNodes, setPulseNodes] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const svgRef = useRef();

  // Fetch real college data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegesRes, statsRes] = await Promise.all([
          collegesApi.getAll({ limit: 50 }),
          collegesApi.getGlobalStats()
        ]);

        const realColleges = collegesRes.colleges.map((college, index) => ({
          id: college._id,
          name: college.name,
          supporters: college.stats?.totalMiners || 0,
          status: college.status.toLowerCase(),
          tier: getTierByMiners(college.stats?.totalMiners || 0),
          isBlank: false
        }));

        // Add some blank nodes as fillers
        const blankNodes = Array.from({ length: 15 }, (_, i) => ({
          id: `blank_${i + 1}`,
          name: `blank_${i + 1}`,
          supporters: 0,
          status: 'blank',
          tier: 'blank',
          isBlank: true
        }));

        setColleges([...realColleges, ...blankNodes]);
        setGlobalStats(statsRes.data);

        // Generate activities from real data
        generateActivities(statsRes.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchData();
  }, []);

  const getTierByMiners = (miners) => {
    if (miners >= 1000) return 'tier1';
    if (miners >= 500) return 'tier2';
    if (miners >= 100) return 'tier3';
    return 'tier3';
  };

  const generateActivities = (stats) => {
    const activityList = [];

    if (stats.topColleges?.byMiners?.[0]) {
      const top = stats.topColleges.byMiners[0];
      activityList.push({
        text: `${top.name}: ${top.stats.totalMiners.toLocaleString()} total supporters`,
        icon: TrendingUp,
        color: '#68d391'
      });
    }

    if (stats.recentColleges?.[0]) {
      activityList.push({
        text: `${stats.recentColleges[0].name} joined the network`,
        icon: School,
        color: '#a8c8ec'
      });
    }

    if (stats.global?.activeMiners > 0) {
      activityList.push({
        text: `${stats.global.activeMiners.toLocaleString()} students actively mining`,
        icon: People,
        color: '#fbbf24'
      });
    }

    if (stats.topColleges?.byTokens?.[0]) {
      const top = stats.topColleges.byTokens[0];
      activityList.push({
        text: `${top.name} reached ${Math.round(top.stats.totalTokensMined).toLocaleString()} tokens`,
        icon: LocationOn,
        color: '#c4a8f2'
      });
    }

    setActivities(activityList);
  };

  // Create D3 network visualization
  useEffect(() => {
    if (!svgRef.current || colleges.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = window.innerWidth;
    const height = window.innerHeight;

    svg.attr("width", width).attr("height", height);

    // Create nodes and links data
    const nodes = colleges.map(college => ({
      id: college.name,
      group: college.status,
      supporters: college.supporters,
      isBlank: college.isBlank
    }));
    

    // Create more realistic network connections
    const links = [];
    
    // Connect tier 1 colleges to each other
    const tier1Colleges = colleges.filter(c => c.tier === 'tier1');
    for (let i = 0; i < tier1Colleges.length; i++) {
      for (let j = i + 1; j < tier1Colleges.length; j++) {
        links.push({
          source: tier1Colleges[i].name,
          target: tier1Colleges[j].name,
          value: Math.random() * 5 + 5
        });
      }
    }
    
    // Connect tier 2 colleges to tier 1 and some tier 2
    const tier2Colleges = colleges.filter(c => c.tier === 'tier2');
    tier2Colleges.forEach(tier2 => {
      // Connect to 2-3 random tier 1 colleges
      const randomTier1 = tier1Colleges.sort(() => 0.5 - Math.random()).slice(0, 3);
      randomTier1.forEach(tier1 => {
        links.push({
          source: tier2.name,
          target: tier1.name,
          value: Math.random() * 3 + 2
        });
      });
      
      // Connect to 1-2 other tier 2 colleges
      const otherTier2 = tier2Colleges.filter(c => c.name !== tier2.name)
        .sort(() => 0.5 - Math.random()).slice(0, 2);
      otherTier2.forEach(other => {
        links.push({
          source: tier2.name,
          target: other.name,
          value: Math.random() * 2 + 1
        });
      });
    });
    
    // Connect tier 3 colleges to tier 2 and some tier 3
    const tier3Colleges = colleges.filter(c => c.tier === 'tier3');
    tier3Colleges.forEach(tier3 => {
      // Connect to 1-2 random tier 2 colleges
      const randomTier2 = tier2Colleges.sort(() => 0.5 - Math.random()).slice(0, 2);
      randomTier2.forEach(tier2 => {
        links.push({
          source: tier3.name,
          target: tier2.name,
          value: Math.random() * 2 + 1
        });
      });
      
      // Connect to 1-2 other tier 3 colleges
      const otherTier3 = tier3Colleges.filter(c => c.name !== tier3.name)
        .sort(() => 0.5 - Math.random()).slice(0, 2);
      otherTier3.forEach(other => {
        links.push({
          source: tier3.name,
          target: other.name,
          value: Math.random() * 1.5 + 0.5
        });
      });
    });
    
    // Connect some blank nodes to the network so they appear
    const blankNodes = colleges.filter(c => c.isBlank);
    blankNodes.forEach(blankNode => {
      // Connect each blank node to 1-2 random existing colleges
      const randomColleges = colleges.filter(c => !c.isBlank)
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 1);
      
      randomColleges.forEach(college => {
        links.push({
          source: blankNode.name,
          target: college.name,
          value: Math.random() * 0.5 + 0.5
        });
      });
    });
    

    // Create force simulation with more spacing for blank nodes
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(200))
      .force("charge", d3.forceManyBody().strength(-800)) // Increased for more spacing
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.isBlank ? 12 : 40)); // Prevent overlap

    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#a8c8ec")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create nodes with 5x bigger size and relative sizing
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", d => {
        if (d.isBlank) return 6; // Slightly bigger for blank nodes to make them visible
        // 5x bigger base size with relative scaling based on supporters
        const baseSize = 15; // 5x bigger than before
        const maxSupporters = Math.max(...nodes.filter(n => !n.isBlank).map(n => n.supporters));
        const minSupporters = Math.min(...nodes.filter(n => !n.isBlank).map(n => n.supporters));
        const normalizedSupporters = (d.supporters - minSupporters) / (maxSupporters - minSupporters);
        return baseSize + (normalizedSupporters * 20); // Range from 15 to 35
      })
      .attr("fill", d => {
        if (d.isBlank) return '#cbd5e0'; // Darker gray for blank nodes to make them visible
        switch (d.group) {
          case 'live': return '#68d391';
          case 'setup': return '#fbbf24';
          case 'waitlist': return '#a8c8ec';
          default: return '#c4a8f2';
        }
      })
      .attr("stroke", d => d.isBlank ? '#94a3b8' : "#fff")
      .attr("stroke-width", d => d.isBlank ? 1 : 2)
      .attr("opacity", d => d.isBlank ? 0.7 : 1) // More visible for blank nodes
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Store node reference for pulsing
    window.networkNodes = node;

    // Add labels (only for non-blank nodes)
    const label = svg.append("g")
      .selectAll("text")
      .data(nodes.filter(d => !d.isBlank))
      .enter().append("text")
      .text(d => d.id)
      .attr("font-size", "14px")
      .attr("font-family", "sans-serif")
      .attr("font-weight", "600")
      .attr("fill", "#2d3748")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y + 25);
    });

    // Keep simulation running to maintain positions
    simulation.alpha(0.1).restart();

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [colleges]);

  // Simulate live activity pulses for any node (including blank nodes)
  useEffect(() => {
    if (colleges.length === 0) return;

    const interval = setInterval(() => {
      const randomNode = Math.floor(Math.random() * colleges.length);
      setPulseNodes(prev => [...prev, randomNode]);
      setTimeout(() => {
        setPulseNodes(prev => prev.filter(node => node !== randomNode));
      }, 1000); // 1 second of pulsing
    }, 300); // 3 times per second (every 300ms)

    return () => clearInterval(interval);
  }, [colleges]);

  // Handle pulsing animation - only animate the pulsing nodes
  useEffect(() => {
    if (window.networkNodes && pulseNodes.length > 0) {
      pulseNodes.forEach(nodeIndex => {
        const pulsingNode = window.networkNodes.filter((d, i) => i === nodeIndex);
        
        // Create a fast beat effect - only animate visual properties, not positions
        pulsingNode
          .transition()
          .duration(150) // Much faster - 150ms
          .attr("r", (d) => {
            if (d.isBlank) return 12; // Bigger pulse for blank nodes
            // Calculate original radius from node data
            const baseSize = 15;
            const maxSupporters = Math.max(...window.networkNodes.data().filter(n => !n.isBlank).map(n => n.supporters));
            const minSupporters = Math.min(...window.networkNodes.data().filter(n => !n.isBlank).map(n => n.supporters));
            const normalizedSupporters = (d.supporters - minSupporters) / (maxSupporters - minSupporters);
            const originalRadius = baseSize + (normalizedSupporters * 20);
            return originalRadius * 1.2; // 1.2x bigger for named nodes
          })
          .attr("opacity", 1) // Full opacity when pulsing
          .attr("fill", "#f2a8c8") // Pastel pink from our design palette
          .attr("stroke", "#e879f9") // Slightly darker pink stroke
          .attr("stroke-width", 3) // Thicker stroke
          .transition()
          .duration(150) // Much faster - 150ms
          .attr("r", (d) => {
            if (d.isBlank) return 6; // Back to original size for blank nodes
            // Calculate original radius from node data
            const baseSize = 15;
            const maxSupporters = Math.max(...window.networkNodes.data().filter(n => !n.isBlank).map(n => n.supporters));
            const minSupporters = Math.min(...window.networkNodes.data().filter(n => !n.isBlank).map(n => n.supporters));
            const normalizedSupporters = (d.supporters - minSupporters) / (maxSupporters - minSupporters);
            return baseSize + (normalizedSupporters * 20); // Back to original size
          })
          .attr("opacity", (d) => d.isBlank ? 0.7 : 1) // Back to original opacity
          .attr("fill", (d) => {
            if (d.isBlank) return '#cbd5e0'; // Back to original gray
            switch (d.group) {
              case 'live': return '#68d391';
              case 'setup': return '#fbbf24';
              case 'waitlist': return '#a8c8ec';
              default: return '#c4a8f2';
            }
          })
          .attr("stroke", (d) => d.isBlank ? '#94a3b8' : "#fff") // Back to original stroke
          .attr("stroke-width", (d) => d.isBlank ? 1 : 2); // Back to original stroke width
      });
    }
  }, [pulseNodes]);

  const getNodeSize = (supporters) => {
    if (supporters >= 2000) return 8;
    if (supporters >= 1000) return 6;
    if (supporters >= 500) return 4;
    return 3;
  };

  const getNodeColor = (status) => {
    switch (status) {
      case 'live': return '#68d391';
      case 'setup': return '#fbbf24';
      case 'waitlist': return '#a8c8ec';
      default: return '#c4a8f2';
    }
  };

  const getNodeGradient = (status) => {
    switch (status) {
      case 'live': return 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)';
      case 'setup': return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
      case 'waitlist': return 'linear-gradient(135deg, #a8c8ec 0%, #90cdf4 100%)';
      default: return 'linear-gradient(135deg, #c4a8f2 0%, #a78bfa 100%)';
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(168, 200, 236, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(196, 168, 242, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(242, 168, 200, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 3,
              }}
            >
              Global Network Map
            </Typography>
            
          </Box>
        </motion.div>

        {/* Box 1: Network Universe */}
        <Box sx={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'relative', 
          overflow: 'hidden',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)'
        }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        </Box>

        {/* Box 2: Activity Feed Universe */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 2,
          mb: 6,
          mt: 8
        }}>
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${activity.color} 0%, ${activity.color}80 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <activity.icon sx={{ color: 'white', fontSize: '20px' }} />
                    </Box>
                    <Typography sx={{ 
                      color: '#4a5568', 
                      fontSize: { xs: '0.875rem', md: '1rem' }, 
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}>
                      {activity.text}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default NetworkMapSection;
