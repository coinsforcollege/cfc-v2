import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const TABS = [
  { id: 'overview', label: 'Program Overview' },
  { id: 'countries', label: 'Country Allocation' },
  { id: 'benefits', label: 'Scholarship Benefits' },
  { id: 'timeline', label: 'Key Dates' },
  { id: 'diversity', label: 'Diversity Commitment' },
];

const COUNTRY_DATA = [
  { country: 'United States', flag: '\u{1F1FA}\u{1F1F8}', slots: 30, color: 'from-blue-500 to-blue-700', colleges: ['MIT', 'Stanford University', 'Harvard University', 'UC Berkeley', 'Columbia University', 'University of Michigan'] },
  { country: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}', slots: 20, color: 'from-red-500 to-red-700', colleges: ['University of Oxford', 'University of Cambridge', 'Imperial College London', 'UCL', 'University of Edinburgh'] },
  { country: 'Canada', flag: '\u{1F1E8}\u{1F1E6}', slots: 20, color: 'from-red-500 to-red-600', colleges: ['University of Toronto', 'University of British Columbia', 'McGill University', 'University of Waterloo', 'University of Alberta'] },
  { country: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', slots: 10, color: 'from-yellow-500 to-yellow-700', colleges: ['University of Melbourne', 'University of Sydney', 'Australian National University', 'Monash University'] },
  { country: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', slots: 10, color: 'from-amber-500 to-yellow-600', colleges: ['TU Munich', 'LMU Munich', 'Heidelberg University', 'Humboldt University of Berlin'] },
  { country: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}', slots: 10, color: 'from-red-600 to-red-800', colleges: ['National University of Singapore', 'Nanyang Technological University', 'Singapore Management University'] },
];

const FAQ_DATA = [
  { q: 'What does "up to 100% scholarship" mean?', a: 'The CFC Wings Scholarship covers up to 100% of tuition fees depending on the applicant\'s profile, financial need, academic merit, and the specific institution. Some recipients may receive full tuition coverage, while others may receive partial scholarships ranging from 25% to 75% based on the evaluation criteria.' },
  { q: 'Do I need to attend the CFC Education Fair to apply?', a: 'Yes. Registration for the CFC Education Fair 2026 is a mandatory first step in the application process. The fair serves as the initial screening and orientation for all scholarship applicants. You will meet admissions representatives, attend scholarship strategy sessions, and begin your application during the event.' },
  { q: 'Can I apply for multiple countries?', a: 'Yes, you may indicate up to two country preferences in your application. However, your final allocation will depend on your profile match, chosen field of study, and slot availability in each country.' },
  { q: 'Is there an age limit for applicants?', a: 'Applicants must be between 17 and 28 years of age at the time of application. There is no upper age limit for postgraduate applicants pursuing research-based programs.' },
  { q: 'What is the 30% female reservation?', a: 'CFC Wings is committed to gender equity in global education. 30% of all scholarship slots (30 out of 100) are exclusively reserved for female applicants. Female applicants may also compete for the remaining 70% of general slots.' },
  { q: 'When will I know the results?', a: 'Shortlisted candidates will be notified within 4-6 weeks after the application deadline. Final scholarship offers are contingent upon admission confirmation from the partner institution.' },
  { q: 'Does the scholarship cover living expenses?', a: 'The primary scholarship covers tuition fees. However, top-ranked applicants may be eligible for additional living stipends. Details about supplementary financial support will be shared during the interview stage.' },
  { q: 'Can I defer my scholarship to the next academic year?', a: 'Scholarship deferral is considered on a case-by-case basis. Applicants must submit a deferral request with valid justification within 30 days of receiving the offer. Deferral is limited to one academic year.' },
];

const WingsScholarship = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);

  const EVENT_URL = 'https://events.coinsforcollege.org/';

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="CFC Wings Scholarship Program 2026"
        description="Apply for up to 100% scholarship to study abroad. 100 scholarships across USA, UK, Canada, Australia, Germany, and Singapore. Register for the CFC Education Fair to begin your application."
        url="https://coinsforcollege.org/wings-scholarship"
        image="https://coinsforcollege.org/og-scholarship.jpg"
        ogImage="https://coinsforcollege.org/og-scholarship.jpg"
        twitterImage="https://coinsforcollege.org/og-scholarship.jpg"
        imageWidth="1200"
        imageHeight="630"
      />

      {/* ============================================================ */}
      {/* SECTION 1: HERO - Text Left, Image Right */}
      {/* ============================================================ */}
      <section
        className="relative overflow-hidden lg:h-screen lg:min-h-[700px]"
        style={{
          backgroundImage: 'url(/images/hero-scholarship.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-0 lg:h-full lg:flex lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sky-300 text-sm font-semibold border border-sky-400/20 shadow-sm mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" /></svg>
              Applications Open for 2026
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              CFC Wings{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Scholarship
              </span>{' '}
              Program 2026
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Up to 100% scholarship for 100 exceptional students to study at world-class universities across 6 countries. Your wings to a global education start here.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href={EVENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-bold text-lg hover:from-sky-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/25 inline-flex items-center gap-2"
              >
                Register Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a
                href="#eligibility"
                className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all inline-flex items-center gap-2"
              >
                Check Eligibility
              </a>
            </div>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-6 md:gap-10">
              <div>
                <div className="text-3xl font-bold text-white">100</div>
                <div className="text-sm text-slate-300">Scholarships</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">6</div>
                <div className="text-sm text-slate-300">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-slate-300">Max Coverage</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">30%</div>
                <div className="text-sm text-slate-300">Female Reserved</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MAIN CONTENT WITH STICKY SIDEBAR */}
      {/* ============================================================ */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* LEFT: Main content */}
          <div className="flex-1 min-w-0">

            {/* ============================================================ */}
            {/* SECTION 2: TABBED CONTENT (5 tabs) */}
            {/* ============================================================ */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Everything You Need to Know
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Explore the details of the CFC Wings Scholarship Program across every dimension
                </p>
              </motion.div>

              {/* Tab navigation */}
              <div className="flex overflow-x-auto gap-2 mb-10 pb-2 scrollbar-hide justify-start md:justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">What is CFC Wings?</h3>
                  <p className="text-slate-700 mb-4 leading-relaxed">
                    CFC Wings is Coins For College's flagship scholarship initiative designed to break financial barriers for talented students aspiring to study at top-ranked global universities. The program provides up to 100% tuition fee coverage for 100 selected students across six major study destinations.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Unlike traditional scholarship programs, CFC Wings integrates a holistic evaluation model that considers not just academic merit, but also leadership potential, community impact, extracurricular depth, and the applicant's vision for leveraging international education to drive positive change.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Academic Excellence</h4>
                        <p className="text-sm text-slate-600">Minimum 80% aggregate or equivalent GPA in your most recent qualification. Standardized test scores (SAT, GRE, GMAT, IELTS, TOEFL) as applicable.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Leadership & Impact</h4>
                        <p className="text-sm text-slate-600">Demonstrated leadership through community service, student organizations, social initiatives, or entrepreneurial ventures that reflect your commitment to positive change.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Financial Need Assessment</h4>
                        <p className="text-sm text-slate-600">Scholarship percentage is calibrated based on documented financial need. Applicants from economically disadvantaged backgrounds receive priority consideration.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'countries' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {COUNTRY_DATA.map((c, i) => (
                  <motion.div
                    key={c.country}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`h-2 bg-gradient-to-r ${c.color}`} />
                    <div className="p-5 md:p-6">
                      <div className="text-3xl mb-2">{c.flag}</div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{c.country}</h4>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${c.color} bg-clip-text text-transparent mb-3`}>
                        {c.slots} <span className="text-sm font-semibold text-slate-500">seats</span>
                      </div>
                      <div className="space-y-1">
                        {c.colleges.map((col) => (
                          <div key={col} className="text-xs text-slate-600 flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                            {col}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: 'Tuition Coverage', desc: 'Up to 100% tuition fee coverage at partner universities worldwide. The exact percentage is determined by your merit score and financial need assessment.', icon: (
                      <svg className="w-7 h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ), bg: 'bg-sky-50', border: 'border-sky-100' },
                    { title: 'University Matching', desc: 'Personalized guidance from our admissions experts to match you with the best-fit university based on your academic profile, career goals, and personal preferences.', icon: (
                      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    ), bg: 'bg-purple-50', border: 'border-purple-100' },
                    { title: 'Visa Assistance', desc: 'Comprehensive visa application support including document preparation, interview coaching, and guidance through the entire immigration process for your destination country.', icon: (
                      <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    ), bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  ].map((b, i) => (
                    <motion.div
                      key={b.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`${b.bg} rounded-2xl p-7 border ${b.border}`}
                    >
                      <div className="mb-4">{b.icon}</div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: 'Pre-Departure Orientation', desc: 'Intensive orientation covering cultural adaptation, academic expectations, financial management abroad, health insurance, and connecting with fellow scholars heading to the same country.', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { title: 'Alumni Network Access', desc: 'Lifetime membership in the CFC Wings Alumni Network, connecting you with past scholars across industries and geographies for mentorship, job referrals, and collaboration opportunities.', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
                  ].map((b, i) => (
                    <motion.div
                      key={b.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className={`${b.bg} rounded-2xl p-7 border ${b.border} flex items-start gap-4`}
                    >
                      <div className={`w-3 h-3 rounded-full ${b.color === 'text-amber-600' ? 'bg-amber-500' : 'bg-pink-500'} mt-2 flex-shrink-0`} />
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-300 via-blue-400 to-purple-400 hidden md:block" />
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-300 via-blue-400 to-purple-400 md:hidden" />

                <div className="space-y-8 md:space-y-12">
                  {[
                    { date: 'April 1, 2026', title: 'Applications Open', desc: 'Registration begins at the CFC Education Fair. Complete your initial profile and submit your expression of interest.', side: 'left' },
                    { date: 'June 15, 2026', title: 'CFC Education Fair', desc: 'Attend the virtual education fair to interact with university representatives, attend scholarship strategy sessions, and complete your application.', side: 'right' },
                    { date: 'July 31, 2026', title: 'Application Deadline', desc: 'All supporting documents, essays, recommendation letters, and test scores must be submitted by this date.', side: 'left' },
                    { date: 'August - September 2026', title: 'Evaluation & Interviews', desc: 'Shortlisted candidates undergo panel interviews with academic experts and industry leaders. Expect 2-3 rounds of evaluation.', side: 'right' },
                    { date: 'October 15, 2026', title: 'Results Announced', desc: 'Scholarship recipients are notified. Conditional offers are extended pending university admission confirmations.', side: 'left' },
                    { date: 'January 2027', title: 'Pre-Departure & Enrollment', desc: 'Attend orientation programs, complete visa processes, and prepare for your journey to your chosen university.', side: 'right' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex gap-4 md:gap-0 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}
                    >
                      {/* Mobile: simple left-aligned */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                        {i + 1}
                      </div>
                      <div className={`flex-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm md:w-[calc(50%-40px)] ${item.side === 'right' ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'}`}>
                        <div className="text-sm font-semibold text-sky-600 mb-1">{item.date}</div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'diversity' && (
              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-3">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment to Gender Equity</h3>
                    <p className="text-slate-700 mb-6 leading-relaxed">
                      CFC Wings believes that access to global education must be equitable. Women remain significantly underrepresented in international student mobility, particularly in STEM fields and from developing economies. Our 30% reservation policy is a deliberate, structural commitment to changing this imbalance.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/70 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">30</div>
                        <div className="text-sm text-slate-600">Seats reserved for female applicants</div>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4">
                        <div className="text-2xl font-bold text-pink-600">70</div>
                        <div className="text-sm text-slate-600">Open seats (all genders eligible)</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Female applicants compete for both the reserved 30 seats and the 70 open seats. This means a strong female candidate has access to the entire pool of 100 scholarships. We also encourage applications from non-binary and gender non-conforming individuals, who are eligible for both pools.
                  </p>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-2">First-Generation Scholars</h4>
                    <p className="text-sm text-slate-600">Additional weighting for applicants who would be the first in their family to pursue higher education abroad.</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-2">Rural & Underserved Regions</h4>
                    <p className="text-sm text-slate-600">Targeted outreach to students from Tier-2, Tier-3 cities and rural areas who traditionally lack access to international education guidance.</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-2">Differently-Abled Applicants</h4>
                    <p className="text-sm text-slate-600">Accessible application process and accommodations throughout evaluation. Disability is never a disqualifying factor.</p>
                  </div>
                </div>
              </div>
            )}
              </motion.div>
            </section>

            {/* ============================================================ */}
            {/* SECTION 3: COUNTRY DISTRIBUTION - Visual Cards */}
            {/* ============================================================ */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Global Distribution
                </h2>
                <p className="text-lg text-slate-600 mb-10">
                  100 scholarships strategically allocated across the world's leading education destinations
                </p>
              </motion.div>

              {/* Visual bar chart */}
              <div className="space-y-5">
                {COUNTRY_DATA.map((c, i) => (
                  <motion.div
                    key={c.country}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl">{c.flag}</span>
                      <span className="font-semibold text-slate-900 w-32">{c.country}</span>
                      <span className="text-sm font-bold text-slate-500">{c.slots} seats</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.slots}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.colleges.map((col) => (
                        <span key={col} className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-600">
                          {col}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ============================================================ */}
            {/* SECTION 4: ELIGIBILITY - Checklist Style */}
            {/* ============================================================ */}
            <section id="eligibility" className="mb-20 scroll-mt-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Eligibility Criteria
                </h2>
                <p className="text-lg text-slate-600 mb-10">
                  Ensure you meet all the requirements before starting your application
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Academic Requirements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-7 border border-sky-100"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Academic Requirements</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Minimum 80% aggregate or 3.5 GPA in most recent qualification',
                      'Valid standardized test scores (SAT/ACT for undergraduate, GRE/GMAT for postgraduate)',
                      'English proficiency: IELTS 6.5+ or TOEFL 90+ (waived for native English speakers)',
                      'Currently enrolled in or graduated from a recognized institution',
                      'Strong academic recommendation from at least two faculty members',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Personal Requirements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-7 border border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Personal Requirements</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Age between 17 and 28 years at the time of application',
                      'Demonstrated leadership or community service involvement',
                      'Clear statement of purpose outlining career goals and how international education aligns with them',
                      'No prior full-tuition scholarship from another organization for the same program',
                      'Willingness to participate in CFC Wings alumni mentoring program post-graduation',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Documents Required */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-7 border border-amber-100"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Documents Required</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Official academic transcripts and marksheets (all years)',
                      'Valid passport (minimum 18 months validity)',
                      'Standardized test score reports (SAT, GRE, GMAT, IELTS, TOEFL)',
                      'Two academic letters of recommendation',
                      'Statement of Purpose (1000-1500 words)',
                      'Resume/CV highlighting extracurricular activities and achievements',
                      'Family income documentation (ITR, salary slips, or equivalent)',
                      'Passport-size photographs (white background)',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Financial Criteria */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-7 border border-emerald-100"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Financial Criteria</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Annual family income below INR 15 lakhs receives maximum scholarship consideration',
                      'Income between INR 15-30 lakhs eligible for partial scholarships (50-75%)',
                      'Exceptional merit applicants considered regardless of income bracket',
                      'Income documentation must be verifiable through government-issued records',
                      'Scholarship covers tuition only; living expenses are the applicant\'s responsibility unless supplementary aid is awarded',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* SECTION 5: APPLICATION PROCESS - Numbered Steps */}
            {/* ============================================================ */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Application Process
                </h2>
                <p className="text-lg text-slate-600 mb-10">
                  A step-by-step guide from registration to receiving your scholarship offer
                </p>
              </motion.div>

              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-300 via-purple-400 to-pink-400 hidden md:block" />

                <div className="space-y-8">
                  {[
                    {
                      step: 1,
                      title: 'Register for the CFC Education Fair 2026',
                      desc: 'Your scholarship journey begins with registration for the Coins For College Education Fair. This is a mandatory first step -- the fair serves as the initial orientation and screening platform for all Wings Scholarship applicants. Visit events.coinsforcollege.org to secure your spot.',
                      color: 'bg-sky-500',
                      detail: 'The Education Fair is scheduled for June 15, 2026 and features 8 expert-led sessions, access to 50+ universities, and direct interaction with admissions officers and scholarship coordinators.',
                    },
                    {
                      step: 2,
                      title: 'Complete Your Profile',
                      desc: 'After registering for the fair, you will receive access to the CFC Wings application portal. Complete your academic profile, upload transcripts, and provide your standardized test scores. This forms the foundation of your scholarship evaluation.',
                      color: 'bg-blue-500',
                      detail: 'You can save your progress and return to the application at any time before the deadline. Ensure all information is accurate as it will be verified during the evaluation stage.',
                    },
                    {
                      step: 3,
                      title: 'Attend the Education Fair',
                      desc: 'Participate in the CFC Education Fair on June 15, 2026. Attend the scholarship strategy session, interact with university representatives from your preferred countries, and complete the on-event assessment components.',
                      color: 'bg-indigo-500',
                      detail: 'Key sessions include: "Scholarship Application Strategies That Work" and "Financial Planning for International Education." Your engagement and participation at the fair is part of the evaluation.',
                    },
                    {
                      step: 4,
                      title: 'Submit Your Full Application',
                      desc: 'After the fair, finalize your application with your Statement of Purpose, letters of recommendation, financial documents, and any additional materials. Double-check every document before the July 31 deadline.',
                      color: 'bg-violet-500',
                      detail: 'Applications submitted after the deadline will not be considered. Incomplete applications are automatically disqualified. We recommend submitting at least 5 days before the deadline.',
                    },
                    {
                      step: 5,
                      title: 'Evaluation & Interview',
                      desc: 'Shortlisted candidates will be invited for a panel interview conducted by academic experts, industry leaders, and CFC advisors. Expect 2-3 rounds including a written assessment, a virtual interview, and a final review.',
                      color: 'bg-purple-500',
                      detail: 'Interviews evaluate communication skills, clarity of purpose, critical thinking, and cultural readiness. Candidates are assessed holistically, not just on academics.',
                    },
                    {
                      step: 6,
                      title: 'Receive Your Scholarship Offer',
                      desc: 'Successful candidates receive their scholarship offer by October 15, 2026. The offer includes the scholarship percentage, matched university, and next steps for enrollment and visa processing.',
                      color: 'bg-pink-500',
                      detail: 'You will have 14 days to accept or decline the offer. Accepted scholars proceed to the pre-departure orientation and university admission process.',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-6 relative"
                    >
                      <div className={`flex-shrink-0 w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg`}>
                        {item.step}
                      </div>
                      <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-600 mb-3">{item.desc}</p>
                        <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-100">{item.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* SECTION 6: FIELDS OF STUDY - Horizontal Scroll */}
            {/* ============================================================ */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Eligible Fields of Study
                </h2>
                <p className="text-lg text-slate-600 mb-10">
                  The CFC Wings Scholarship supports a wide range of academic disciplines across undergraduate and postgraduate levels
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Engineering & Technology', icon: '/', color: 'from-blue-500 to-cyan-500', examples: 'Computer Science, Mechanical, Electrical, Civil, Aerospace, AI/ML' },
                  { name: 'Business & Management', icon: '/', color: 'from-purple-500 to-indigo-500', examples: 'MBA, Finance, Marketing, Entrepreneurship, Supply Chain' },
                  { name: 'Medicine & Health Sciences', icon: '/', color: 'from-red-500 to-pink-500', examples: 'MBBS, Public Health, Nursing, Biomedical Sciences, Pharmacy' },
                  { name: 'Sciences & Mathematics', icon: '/', color: 'from-emerald-500 to-green-500', examples: 'Physics, Chemistry, Biology, Mathematics, Data Science' },
                  { name: 'Arts & Humanities', icon: '/', color: 'from-amber-500 to-orange-500', examples: 'Literature, Philosophy, History, Linguistics, Fine Arts' },
                  { name: 'Law & Public Policy', icon: '/', color: 'from-slate-600 to-slate-800', examples: 'LLB, LLM, International Relations, Public Administration' },
                  { name: 'Architecture & Design', icon: '/', color: 'from-teal-500 to-cyan-600', examples: 'Architecture, Urban Planning, Interior Design, Industrial Design' },
                  { name: 'Social Sciences', icon: '/', color: 'from-rose-500 to-pink-600', examples: 'Psychology, Sociology, Economics, Political Science, Education' },
                ].map((field, i) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${field.color}`} />
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{field.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{field.examples}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ============================================================ */}
            {/* SECTION 7: SELECTION CRITERIA - Weighted Visual */}
            {/* ============================================================ */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Selection Criteria
                </h2>
                <p className="text-lg text-slate-600 mb-10">
                  Our evaluation uses a weighted scoring model across five dimensions
                </p>
              </motion.div>

              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10">
                <div className="space-y-6">
                  {[
                    { label: 'Academic Merit', weight: 35, color: 'from-sky-400 to-blue-500', desc: 'GPA, test scores, academic awards, research publications' },
                    { label: 'Financial Need', weight: 25, color: 'from-emerald-400 to-green-500', desc: 'Family income, dependents, access to alternative funding sources' },
                    { label: 'Leadership & Extracurriculars', weight: 20, color: 'from-purple-400 to-violet-500', desc: 'Community impact, student organizations, volunteer work, initiatives led' },
                    { label: 'Statement of Purpose', weight: 10, color: 'from-amber-400 to-orange-500', desc: 'Clarity of goals, alignment with chosen field, long-term vision' },
                    { label: 'Interview Performance', weight: 10, color: 'from-pink-400 to-rose-500', desc: 'Communication, critical thinking, cultural readiness, composure' },
                  ].map((c, i) => (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">{c.label}</span>
                        <span className="text-white/80 font-bold text-lg">{c.weight}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden mb-1">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${c.weight}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                        />
                      </div>
                      <p className="text-sm text-white/50">{c.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* SECTION 8: PARTNER UNIVERSITIES - Image Grid */}
            {/* ============================================================ */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Where Our Scholars Go
                </h2>
                <p className="text-lg text-slate-600 mb-10">
                  CFC Wings scholars have the opportunity to study at some of the world's most prestigious institutions
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Large featured card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop"
                    alt="University campus"
                    className="w-full h-full min-h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-white mb-2">United States</h3>
                    <p className="text-white/80 text-sm mb-3">Home to 30 scholarship seats across MIT, Stanford, Harvard, UC Berkeley, Columbia, and University of Michigan</p>
                    <div className="flex flex-wrap gap-2">
                      {['MIT', 'Stanford', 'Harvard', 'UC Berkeley'].map((u) => (
                        <span key={u} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">{u}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* UK card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl overflow-hidden relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=2074&auto=format&fit=crop"
                    alt="UK university"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="text-lg font-bold text-white">United Kingdom</h4>
                    <p className="text-white/70 text-xs">Oxford, Cambridge, Imperial College, UCL</p>
                  </div>
                </motion.div>

                {/* Canada card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl overflow-hidden relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1569098644584-210bcd375b59?q=80&w=2070&auto=format&fit=crop"
                    alt="Canada university"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="text-lg font-bold text-white">Canada</h4>
                    <p className="text-white/70 text-xs">U of Toronto, UBC, McGill, Waterloo</p>
                  </div>
                </motion.div>

                {/* Bottom row - 3 small cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl overflow-hidden relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2130&auto=format&fit=crop"
                    alt="Australia"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-bold text-white">Australia</h4>
                    <p className="text-white/70 text-xs">Melbourne, Sydney, ANU, Monash</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  className="rounded-2xl overflow-hidden relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop"
                    alt="Germany"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-bold text-white">Germany</h4>
                    <p className="text-white/70 text-xs">TU Munich, LMU, Heidelberg</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl overflow-hidden relative group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2052&auto=format&fit=crop"
                    alt="Singapore"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-bold text-white">Singapore</h4>
                    <p className="text-white/70 text-xs">NUS, NTU, SMU</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* SECTION 9: FAQ - Accordion */}
            {/* ============================================================ */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-slate-600 mb-10">
                  Find answers to the most common questions about the CFC Wings Scholarship
                </p>
              </motion.div>

              <div className="space-y-3">
                {FAQ_DATA.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-200 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-semibold text-slate-900">{faq.q}</h4>
                        <svg
                          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {openFaq === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 text-sm text-slate-600 leading-relaxed"
                        >
                          {faq.a}
                        </motion.p>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ============================================================ */}
            {/* SECTION 10: TERMS & CONDITIONS */}
            {/* ============================================================ */}
            <section className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Terms & Conditions
                </h2>
                <p className="text-lg text-slate-600 mb-10">
                  Important terms governing the CFC Wings Scholarship Program
                </p>
              </motion.div>

              <div className="bg-slate-50 rounded-2xl p-7 md:p-8 border border-slate-200 space-y-4">
                {[
                  'The CFC Wings Scholarship is awarded for one academic program only and is non-transferable to another institution or program without prior written approval from CFC.',
                  'Scholarship recipients must maintain a minimum GPA of 3.0 (or equivalent) throughout their program. Failure to maintain academic standing may result in scholarship revocation.',
                  'Recipients are expected to participate in the CFC Wings Alumni Network and contribute to mentoring future applicants for a minimum of 2 years after graduation.',
                  'Misrepresentation of information in the application, including academic records, financial documents, or personal details, will result in immediate disqualification or revocation of the scholarship.',
                  'CFC reserves the right to modify scholarship terms, allocation numbers, or program structure based on operational requirements. Any changes will be communicated to applicants in writing.',
                  'The scholarship covers tuition fees only. Travel, accommodation, insurance, and living expenses are the responsibility of the scholar unless a supplementary grant is awarded.',
                  'Scholarship deferral requests must be submitted within 30 days of the offer and are subject to approval. Maximum deferral period is one academic year.',
                  'CFC Wings Scholarship cannot be combined with another full-tuition scholarship. Partial external scholarships may be permitted subject to review.',
                  'All disputes related to the scholarship will be resolved under the jurisdiction of courts in India.',
                  'By applying, candidates consent to CFC using their name, photographs, and testimonials for promotional purposes related to the CFC Wings program.',
                ].map((term, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold text-slate-400 mt-0.5 flex-shrink-0 w-6">{i + 1}.</span>
                    <p className="text-sm text-slate-600 leading-relaxed">{term}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ============================================================ */}
          {/* RIGHT: STICKY SIDEBAR */}
          {/* ============================================================ */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Main CTA Card */}
              <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-purple-600 rounded-2xl p-7 text-white shadow-xl shadow-blue-500/20">
                <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
                <p className="text-white/80 text-sm mb-6">
                  Register for the CFC Education Fair 2026 to begin your scholarship application journey.
                </p>
                <a
                  href={EVENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-white text-blue-600 rounded-xl font-bold text-center hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Register for Education Fair
                </a>
                <p className="text-white/60 text-xs text-center mt-3">
                  Free registration at events.coinsforcollege.org
                </p>
              </div>

              {/* Key Info Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4">Quick Facts</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Total Scholarships</span>
                    <span className="font-bold text-slate-900">100</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Coverage</span>
                    <span className="font-bold text-emerald-600">Up to 100%</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Countries</span>
                    <span className="font-bold text-slate-900">6</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Female Reserved</span>
                    <span className="font-bold text-purple-600">30%</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Education Fair</span>
                    <span className="font-bold text-slate-900">June 15, 2026</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Application Deadline</span>
                    <span className="font-bold text-red-600">July 31, 2026</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Results</span>
                    <span className="font-bold text-slate-900">Oct 15, 2026</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM CTA BANNER - Full Width */}
      {/* ============================================================ */}
      <section className="py-20 bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Your Future Starts with One Step
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Join the CFC Education Fair 2026 on June 15 to begin your scholarship application. Meet 50+ universities, attend expert sessions, and take the first step toward your global education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={EVENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
              >
                Register for the Fair
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a
                href="#eligibility"
                className="px-10 py-4 bg-transparent text-white rounded-full font-semibold text-lg border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all inline-flex items-center justify-center"
              >
                Review Eligibility
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WingsScholarship;
