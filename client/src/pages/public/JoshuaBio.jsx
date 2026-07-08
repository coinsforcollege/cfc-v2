import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './JoshuaBio.css';

const IMAGES = {
  portrait: '/images/joshua-bio/square-joshua-portrait.jpeg',
  team: '/images/joshua-bio/cfc-team.jpeg',
  video: '/images/joshua-bio/joshua-vertical-video.mp4',
  rfe: '/images/joshua-bio/rfe.png',
  cfc: '/images/joshua-bio/cfc.png',
  collegenz: '/images/joshua-bio/collegenz.png',
  exchange: '/images/joshua-bio/exchange.png',
};

const BUSINESSES = [
  {
    name: 'Rewards For Education',
    abbr: 'RFE',
    description: 'A multilingual AI learning + international readiness platform. Rewards students with digital points, converted into College Coins.',
    image: IMAGES.rfe,
  },
  {
    name: 'Coins For College',
    abbr: 'CFC',
    description: 'Turnkey digital economy solutions for universities and schools. Micro-economies centered around campus and alumni.',
    image: IMAGES.cfc,
  },
  {
    name: 'CollegenZ',
    abbr: 'CollegenZ',
    description: 'Layer-2 blockchain hosting thousands of College Coins from universities across the world.',
    image: IMAGES.collegenz,
  },
  {
    name: 'InTuition Exchange',
    abbr: 'InTuition',
    description: 'A compliant centralized exchange built to list, trade, and manage all College Coins and Tuition Coin.',
    image: IMAGES.exchange,
  },
];

const SOCIALS = [
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'X',
    url: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

// Sound toggle button component
function SoundToggle({ isMuted, onToggle, className = '' }) {
  return (
    <button
      onClick={onToggle}
      className={`bio-sound-toggle ${className}`}
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
    >
      {isMuted ? (
        <VolumeOffIcon sx={{ fontSize: 18 }} />
      ) : (
        <VolumeUpIcon sx={{ fontSize: 18 }} />
      )}
    </button>
  );
}

// Desktop sticky video sidebar
function DesktopVideoSidebar({ videoRef, isMuted, onToggleMute }) {
  return (
    <aside className="bio-sidebar">
      <video
        ref={videoRef}
        src={IMAGES.video}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="bio-sidebar__video"
      />
      <SoundToggle isMuted={isMuted} onToggle={onToggleMute} className="bio-sidebar__sound" />
    </aside>
  );
}

// Mobile hero — video opacity is derived from the text's actual screen position.
// No alignment of two independent animations. One action: scroll moves text,
// opacity is computed from where the text IS.
function MobileHero({ mobileVideoRef, isMuted, onToggleMute }) {
  const textRef = useRef(null);
  const initialBottomRef = useRef(null);

  useEffect(() => {
    const textEl = textRef.current;
    const videoEl = mobileVideoRef.current;
    if (!textEl || !videoEl) return;

    // Capture the text's initial bottom position on first render
    if (initialBottomRef.current === null) {
      initialBottomRef.current = textEl.getBoundingClientRect().bottom;
    }

    const handleScroll = () => {
      const rect = textEl.getBoundingClientRect();
      const initialBottom = initialBottomRef.current;

      // progress: 0 when text at initial position, 1 when text exits viewport top
      const progress = Math.max(0, Math.min(1, 1 - rect.bottom / initialBottom));

      // opacity: 0.3 at rest → 1.0 when text is out
      videoEl.style.opacity = 0.3 + progress * 0.7;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileVideoRef]);

  return (
    <div className="bio-mobile-hero-wrapper">
      {/* Sticky video */}
      <div className="bio-mobile-hero-sticky">
        <video
          src={IMAGES.video}
          ref={mobileVideoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="bio-mobile-hero__video"
          style={{ opacity: 0.3 }}
        />
        <SoundToggle isMuted={isMuted} onToggle={onToggleMute} className="bio-mobile-hero__sound" />
      </div>

      {/* Text — scrolls naturally. Video opacity reads this element's position. */}
      <div ref={textRef} className="bio-mobile-hero__text">
        <span className="bio-mobile-hero__label">Founder & CEO</span>
        <h1 className="bio-mobile-hero__name">Joshua Samuel</h1>
      </div>
    </div>
  );
}

// Pullquote component
function Pullquote() {
  return (
    <blockquote className="bio-pullquote">
      <p className="bio-pullquote__text">
        "The entire world is going digital, and blockchain is the infrastructure that will carry it there."
      </p>
    </blockquote>
  );
}

// Business card for the 2x2 grid
function BusinessCard({ business }) {
  return (
    <div className="bio-business-card">
      <div className="bio-business-card__image-wrapper">
        <img
          src={business.image}
          alt={business.name}
          className="bio-business-card__image"
          loading="lazy"
        />
      </div>
      <div className="bio-business-card__info">
        <h3 className="bio-business-card__name">{business.name}</h3>
        <p className="bio-business-card__desc">{business.description}</p>
      </div>
    </div>
  );
}

// Social links row
function SocialLinks() {
  return (
    <div className="bio-socials">
      {SOCIALS.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bio-socials__link"
          aria-label={social.name}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}

// Main bio content
function BioContent() {
  return (
    <div className="bio-content">
      {/* Opening: Portrait + Name + Intro */}
      <header className="bio-header">
        <div className="bio-header__portrait-col">
          <img
            src={IMAGES.portrait}
            alt="Joshua Samuel"
            className="bio-header__portrait"
          />
        </div>
        <div className="bio-header__text-col">
          <div className="bio-header__titles">
            <h1 className="bio-header__name">Joshua Samuel</h1>
            <p className="bio-header__role">Founder & CEO</p>
          </div>
          <p className="bio-text">
            A visionary entrepreneur, sought-after speaker, and the founder and CEO of
            Coins for College, Rewards for Education, CollegenZ, and InTuition Exchange.
          </p>
        </div>
      </header>

      {/* The thesis - pullquote */}
      <Pullquote />

      {/* Bio narrative */}
      <div className="bio-narrative">
        <p className="bio-text">
          His thesis is simple but far-reaching: every industry, every sector, and every
          company will eventually have its own coin — and realizing this future requires three
          things working in concert. A real-world utility that gives the coin meaning. A
          blockchain company to power it. And an exchange where those coins can be traded.
        </p>

        <p className="bio-text">
          He's putting this thesis into practice in education first. Coins for College and
          Rewards for Education give the sector its utility, turning everyday actions —
          saving, learning, giving — into real progress toward college funding. CollegenZ is
          the layer-two blockchain built to power it, the network on which College Coins are
          created. InTuition Exchange provides the trading infrastructure that lets those
          coins move and hold value. Together, the four companies form a working blueprint
          for how any industry can transition onto the blockchain.
        </p>

        <p className="bio-text">
          But the vision extends well beyond education. The same coin-utility-exchange model
          will take hold across sectors in the years ahead, and these companies exist to
          prove it works — starting with the one closest to his heart: helping students get
          to college.
        </p>
      </div>

      {/* Team photo */}
      <figure className="bio-team">
        <img
          src={IMAGES.team}
          alt="The Coins For College team at a conference"
          className="bio-team__image"
          loading="lazy"
        />
        <figcaption className="bio-team__caption">The Coins For College team</figcaption>
      </figure>

      {/* Businesses / Ecosystem */}
      <section className="bio-ecosystem">
        <h2 className="bio-ecosystem__heading">The Ecosystem</h2>
        <p className="bio-ecosystem__subtext">
          Four companies, one blueprint — built to prove that any industry can transition onto the blockchain.
        </p>
        <div className="bio-ecosystem__grid">
          {BUSINESSES.map((biz) => (
            <BusinessCard key={biz.abbr} business={biz} />
          ))}
        </div>
      </section>

      {/* Speaker section */}
      <section className="bio-speaker">
        <p className="bio-text">
          As a speaker, he brings this thesis to audiences across the blockchain, fintech,
          and education spaces — making the case for a future where digital assets are woven
          into the fabric of every industry.
        </p>
      </section>

      {/* Social links */}
      <section className="bio-social-section">
        <SocialLinks />
      </section>

      {/* Back to home */}
      <footer className="bio-footer">
        <Link to="/" className="bio-footer__link">
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span>Back to Coins For College</span>
        </Link>
      </footer>
    </div>
  );
}

export default function JoshuaBio() {
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Hide reCAPTCHA badge reliably on this page by injecting a global style
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = '.grecaptcha-badge { display: none !important; visibility: hidden !important; opacity: 0 !important; }';
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      // Sync both video refs
      if (desktopVideoRef.current) desktopVideoRef.current.muted = next;
      if (mobileVideoRef.current) mobileVideoRef.current.muted = next;
      return next;
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Joshua Samuel — Founder & CEO | Coins For College</title>
        <meta
          name="description"
          content="Meet Joshua Samuel, visionary entrepreneur and founder of Coins for College, Rewards for Education, CollegenZ, and InTuition Exchange."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="bio-page">
        {/* Mobile hero — hidden on desktop */}
        {!isDesktop && (
          <MobileHero
            mobileVideoRef={mobileVideoRef}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}

        <div className="bio-layout">
          {/* Desktop sidebar — hidden on mobile */}
          {isDesktop && (
            <DesktopVideoSidebar
              videoRef={desktopVideoRef}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          )}

          <main className="bio-main">
            <BioContent />
          </main>
        </div>
      </div>
    </>
  );
}
