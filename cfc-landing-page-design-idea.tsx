import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Building2, Users, TrendingUp, Zap, Code, Award, Coins, CheckCircle, Rocket, Globe, BarChart3, Lock, Layers } from 'lucide-react';

const topColleges = [
  { name: "MIT", supporters: 5234, country: "USA" },
  { name: "Stanford", supporters: 4891, country: "USA" },
  { name: "IIT Bombay", supporters: 4567, country: "India" },
  { name: "Harvard", supporters: 4123, country: "USA" },
  { name: "Oxford", supporters: 3890, country: "UK" },
  { name: "Cambridge", supporters: 3654, country: "UK" },
  { name: "Berkeley", supporters: 3421, country: "USA" },
  { name: "Toronto", supporters: 3210, country: "Canada" },
];

const NetworkVisualization = () => {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  
  useEffect(() => {
    const generatedNodes = topColleges.slice(0, 8).map((college, i) => ({
      id: i,
      name: college.name,
      supporters: college.supporters,
      x: 150 + (i % 4) * 200 + Math.random() * 60,
      y: 100 + Math.floor(i / 4) * 180 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
    
    for (let i = 8; i < 28; i++) {
      generatedNodes.push({
        id: i,
        supporters: Math.random() * 800 + 300,
        x: Math.random() * 900 + 50,
        y: Math.random() * 340 + 60,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
    
    setNodes(generatedNodes);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrame;
    
    const animate = () => {
      ctx.clearRect(0, 0, 1000, 450);
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 30 || node.x > 970) node.vx *= -1;
        if (node.y < 30 || node.y > 420) node.vy *= -1;
        
        node.x = Math.max(30, Math.min(970, node.x));
        node.y = Math.max(30, Math.min(420, node.y));
        
        const size = node.name ? Math.max(20, Math.min(40, Math.log(node.supporters) * 5)) : Math.max(3, Math.log(node.supporters) * 1.5);
        
        nodes.forEach((other, j) => {
          if (i < j) {
            const dist = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
            if (dist < 140) {
              ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 140)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });
        
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size);
        if (node.name) {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.9)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.5)');
        } else {
          gradient.addColorStop(0, 'rgba(196, 181, 253, 0.6)');
          gradient.addColorStop(1, 'rgba(167, 139, 250, 0.3)');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        if (node.name) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x, node.y - size - 7);
        }
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [nodes]);
  
  return <canvas ref={canvasRef} width={1000} height={450} className="w-full h-full" />;
};

export default function CoinsForCollege() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="grid grid-cols-12 min-h-screen max-w-[1400px] mx-auto">
          <div className="col-span-5 flex items-center px-16 py-20">
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Collegen L2
              </div>
              
              <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                Launch your college's digital economy
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Complete token infrastructure from configuration to go-live. Smart contracts, tokenomics, and campus integration in weeks.
              </p>
              
              <div className="flex gap-4 pt-4">
                <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all">
                  Join Waitlist
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white border-2 border-gray-200 hover:border-violet-300 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all">
                  Start Mining
                </button>
              </div>
              
              <div className="pt-8 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">47 colleges</p>
                  <p className="text-sm text-gray-600">On the network</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-7 relative flex items-center justify-center p-16">
            <div 
              className="relative w-full max-w-2xl"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
              <div className="aspect-square relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-200/40 to-purple-200/40 rounded-[40px]" />
                <div className="absolute inset-8 bg-white/70 backdrop-blur-lg rounded-[32px] shadow-2xl border border-violet-100 flex items-center justify-center">
                  <Building2 className="w-32 h-32 text-violet-400" />
                </div>
                
                <div className="absolute top-8 -left-4 bg-white rounded-2xl shadow-2xl p-5 border border-violet-100">
                  <p className="text-xs text-gray-600 mb-1">Tokens Mined</p>
                  <p className="text-3xl font-bold text-violet-600">87M+</p>
                </div>
                
                <div className="absolute bottom-8 -right-4 bg-white rounded-2xl shadow-2xl p-5 border border-purple-100">
                  <p className="text-xs text-gray-600 mb-1">Active Miners</p>
                  <p className="text-3xl font-bold text-purple-600">12.5K</p>
                </div>
                
                <div className="absolute top-1/2 -translate-y-1/2 -right-8 bg-white rounded-2xl shadow-2xl p-5 border border-indigo-100">
                  <p className="text-xs text-gray-600 mb-1">Countries</p>
                  <p className="text-3xl font-bold text-indigo-600">14</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Network Map Section */}
      <section className="py-20 bg-gradient-to-b from-white to-violet-50">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Live college network</h2>
            <p className="text-gray-600">Real-time activity across institutions</p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100">
              <BarChart3 className="w-10 h-10 text-violet-600 mb-3" />
              <p className="text-3xl font-bold text-gray-900">47</p>
              <p className="text-sm text-gray-600">Active Colleges</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <Users className="w-10 h-10 text-purple-600 mb-3" />
              <p className="text-3xl font-bold text-gray-900">12.5K</p>
              <p className="text-sm text-gray-600">Student Miners</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
              <Globe className="w-10 h-10 text-indigo-600 mb-3" />
              <p className="text-3xl font-bold text-gray-900">14</p>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl overflow-hidden shadow-2xl border border-violet-100 p-8">
            <NetworkVisualization />
          </div>
        </div>
      </section>
      
      {/* Value Prop */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="grid grid-cols-2 gap-20 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-gray-900">We build it. You launch it.</h2>
              <p className="text-xl text-gray-600">
                Complete digital economy infrastructure deployed on Collegen's Ethereum L2. We handle technical complexity.
              </p>
              
              <div className="space-y-5 pt-4">
                {[
                  { icon: Coins, title: "Custom Token Creation", desc: "Define token name, ticker, supply, and utility structure" },
                  { icon: Lock, title: "Audited Smart Contracts", desc: "Security-audited templates for fundraising and governance" },
                  { icon: Zap, title: "Campus Integration", desc: "API connectors for portals and payment systems" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Rocket className="w-40 h-40 text-violet-400" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6">
                    <p className="text-sm font-medium text-gray-600 mb-3">Token Dashboard</p>
                    <div className="space-y-2">
                      <div className="h-2 bg-violet-200 rounded-full w-3/4" />
                      <div className="h-2 bg-purple-200 rounded-full w-1/2" />
                      <div className="h-2 bg-indigo-200 rounded-full w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-20 items-center">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Alumni Giving</p>
                    <p className="font-semibold text-gray-900">Real-time tracking</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <Layers className="w-8 h-8 text-pink-600" />
                  <div>
                    <p className="text-sm text-gray-600">NFT Endowments</p>
                    <p className="font-semibold text-gray-900">Digital legacy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <Globe className="w-8 h-8 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">InTuition Exchange</p>
                    <p className="font-semibold text-gray-900">Auto-listed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-gray-900">Fundraising and alumni engagement</h2>
              <p className="text-xl text-gray-600">
                Direct blockchain donations with transparency. NFT-backed endowments for legacy gifts. Auto-listing on InTuition Exchange for liquidity.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all">
                  Learn More
                </button>
                <button className="bg-violet-50 text-violet-700 px-6 py-3 rounded-xl font-semibold hover:bg-violet-100 transition-all">
                  View Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Infrastructure Options */}
      <section className="py-20 bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="max-w-4xl mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Choose your infrastructure model</h2>
            <p className="text-xl text-gray-600">
              From fully managed to self-hosted, pick what fits your technical capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mb-12">
            {[
              { icon: Code, title: "Self-Managed", price: "One-time fee", features: ["Full source access", "Technical docs", "Admin dashboard", "Community support"] },
              { icon: Users, title: "Guided Setup", price: "One-time fee", features: ["Provider recommendations", "Setup consultation", "Integration guidance", "Priority support"], popular: true },
              { icon: Building2, title: "Managed AMC", price: "Annual contract", features: ["24/7 monitoring", "Automatic updates", "Scaling & optimization", "Dedicated support"] }
            ].map((option, i) => (
              <div key={i} className={`relative bg-white rounded-3xl p-8 shadow-xl ${option.popular ? 'ring-2 ring-violet-600' : 'border border-gray-200'}`}>
                {option.popular && (
                  <div className="absolute -top-4 left-8">
                    <span className="bg-violet-600 text-white text-sm font-semibold px-4 py-1 rounded-full">Popular</span>
                  </div>
                )}
                <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-6">
                  <option.icon className="w-7 h-7 text-violet-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-violet-600 font-semibold mb-6">{option.price}</p>
                <ul className="space-y-3 mb-8">
                  {option.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-all ${option.popular ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'}`}>
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl grid grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Early adopter offer</h3>
              <p className="text-xl text-violet-100">
                Join the waitlist: pay upfront OR allocate up to 5% of tokens. Free setup for waitlisted institutions.
              </p>
            </div>
            <div className="flex justify-end">
              <button className="bg-white text-violet-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-violet-50 transition-all shadow-xl">
                Claim Early Access
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* College Traction */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-4">
              <div className="sticky top-8">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">Institutions already moving</h2>
                <p className="text-xl text-gray-600 mb-8">Top colleges by early supporter count</p>
                <button className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-all">
                  View All Colleges
                </button>
              </div>
            </div>
            
            <div className="col-span-8 grid grid-cols-2 gap-6">
              {topColleges.map((college, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-violet-200 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-2xl">
                      🎓
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{college.country}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{college.name}</h3>
                  <p className="text-2xl font-bold text-violet-600">{college.supporters.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">early supporters</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Students Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-block bg-purple-600 text-white px-5 py-2 rounded-full font-semibold mb-6">For Students</div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Build, mine, and lead</h2>
            <p className="text-xl text-gray-600">Free blockchain infrastructure, early supporter rewards, and governance opportunities.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Developer access</h3>
              <p className="text-gray-600 mb-6">Deploy dApps on Collegen L2 with free infrastructure and gas sponsorship.</p>
              <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all">
                View Docs
              </button>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center mb-6">
                <Coins className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mining program</h3>
              <p className="text-gray-600 mb-6">Daily cycles for up to 10 colleges. Tokens unlock when colleges launch.</p>
              <button className="w-full bg-gradient-to-r from-pink-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Start Mining
              </button>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Campus ambassador</h3>
              <p className="text-gray-600 mb-6">Lead adoption. Get certificate, airdrops, and exclusive swag.</p>
              <button className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all">
                Apply Now
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-8 items-center bg-white rounded-3xl p-10 shadow-xl border border-purple-100">
            <div className="col-span-3">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">DAO governance opportunity</h3>
              <p className="text-gray-600 text-lg mb-4">
                First 10 miners become priority candidates. 2 may join the college's DAO governance team.
              </p>
              <p className="text-sm text-gray-600">Selection based on enrollment, campus involvement, and community contribution.</p>
            </div>
            <div className="col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-sm text-gray-700">Mine before launch</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-sm text-gray-700">Be in first 10</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-sm text-gray-700">College selects 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h2 className="text-6xl font-bold mb-6">Ready to move?</h2>
              <p className="text-2xl text-violet-100">
                Lock your competitive advantage before your peers. Join the waitlist today.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button className="bg-white text-violet-600 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-violet-50 transition-all shadow-2xl w-full">
                Join Waitlist
              </button>
              <button className="bg-violet-800 text-white px-12 py-5 rounded-2xl font-bold text-lg border-2 border-violet-400 hover:bg-violet-700 transition-all w-full">
                Start Mining
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="grid grid-cols-4 gap-12">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Coins For College</h3>
              <p className="text-sm text-gray-600">Digital economies for academic institutions on Collegen L2</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>InTuition Exchange</li>
                <li>Collegen Blockchain</li>
                <li>Gas Manager</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Developer Docs</li>
                <li>Tokenomics Library</li>
                <li>Ambassador Portal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <p className="text-sm text-gray-600">Token release subject to KYC verification</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}