import React from 'react';
import { motion } from 'framer-motion';
import { PhoneMockup } from '../../components/PhoneMockup';
import { useTranslation, Trans } from 'react-i18next';

const CollegeCoins = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section - Full Height */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://unsplash.com/photos/pvHma684eEI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NDB8fGNvbGxlZ2UlMjBzdHVkZW50fGVufDB8fHx8MTc2NTE3NTM4OXwy&force=true&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-slate-900">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('collegeCoins.hero.title')} <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
              {t('collegeCoins.hero.subtitle')}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('collegeCoins.hero.description')}
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-slate-800/50 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-slate-800/50 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-4 gap-x-8"
          >
            {/* Stat 1 */}
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {t('collegeCoins.stats.stat1.value')}
              </div>
              <div className="text-xs md:text-base text-slate-600">
                {t('collegeCoins.stats.stat1.label')}
              </div>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {t('collegeCoins.stats.stat2.value')}
              </div>
              <div className="text-xs md:text-base text-slate-600">
                {t('collegeCoins.stats.stat2.label')}
              </div>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {t('collegeCoins.stats.stat3.value')}
              </div>
              <div className="text-xs md:text-base text-slate-600">
                {t('collegeCoins.stats.stat3.label')}
              </div>
            </div>

            {/* Stat 4 */}
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {t('collegeCoins.stats.stat4.value')}
              </div>
              <div className="text-xs md:text-base text-slate-600">
                {t('collegeCoins.stats.stat4.label')}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* College Use Cases - Section 1: Scholarship Pledges */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t('collegeCoins.scholarshipPledges.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('collegeCoins.scholarshipPledges.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Flowchart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('collegeCoins.scholarshipPledges.lifecycle.title')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{t('collegeCoins.scholarshipPledges.lifecycle.step1.title')}</div>
                    <div className="text-sm text-slate-600">{t('collegeCoins.scholarshipPledges.lifecycle.step1.desc')}</div>
                  </div>
                </div>

                <div className="h-8 flex justify-center">
                  <div className="w-0.5 bg-gradient-to-b from-purple-300 to-pink-300 h-full"></div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{t('collegeCoins.scholarshipPledges.lifecycle.step2.title')}</div>
                    <div className="text-sm text-slate-600">{t('collegeCoins.scholarshipPledges.lifecycle.step2.desc')}</div>
                  </div>
                </div>

                <div className="h-8 flex justify-center">
                  <div className="w-0.5 bg-gradient-to-b from-pink-300 to-purple-300 h-full"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-semibold text-green-900 mb-1 text-sm">{t('collegeCoins.scholarshipPledges.lifecycle.step3a.title')}</div>
                    <div className="text-xs text-green-700">{t('collegeCoins.scholarshipPledges.lifecycle.step3a.desc')}</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="font-semibold text-orange-900 mb-1 text-sm">{t('collegeCoins.scholarshipPledges.lifecycle.step3b.title')}</div>
                    <div className="text-xs text-orange-700">{t('collegeCoins.scholarshipPledges.lifecycle.step3b.desc')}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                {t('collegeCoins.scholarshipPledges.content.title')}
              </h3>
              <p className="text-lg text-slate-700 mb-6">
                {t('collegeCoins.scholarshipPledges.content.description')}
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{t('collegeCoins.scholarshipPledges.content.trigger1.title')}</div>
                    <div className="text-slate-600">{t('collegeCoins.scholarshipPledges.content.trigger1.desc')}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{t('collegeCoins.scholarshipPledges.content.trigger2.title')}</div>
                    <div className="text-slate-600">{t('collegeCoins.scholarshipPledges.content.trigger2.desc')}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="font-semibold text-slate-900 mb-2">{t('collegeCoins.scholarshipPledges.content.example.title')}</div>
                <p className="text-slate-700 text-sm">
                  {t('collegeCoins.scholarshipPledges.content.example.desc')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* College Use Cases - Section 2: Student Engagement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t('collegeCoins.studentEngagement.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('collegeCoins.studentEngagement.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Pre-Enrollment */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-purple-100 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1622295023876-0cdf583c41f6?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Prospective Students"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{t('collegeCoins.studentEngagement.prospective.title')}</h3>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.prospective.items.0')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.prospective.items.1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.prospective.items.2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.prospective.items.3')}</span>
                </div>
              </div>
            </div>
            </motion.div>

            {/* On Campus */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-pink-100 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1514369118554-e20d93546b30?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Current Students"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{t('collegeCoins.studentEngagement.current.title')}</h3>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-pink-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.current.items.0')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.current.items.1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.current.items.2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.current.items.3')}</span>
                </div>
              </div>
            </div>
            </motion.div>

            {/* Alumni */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-purple-100 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1758270703733-3663d99c9dd7?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Post-Graduation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{t('collegeCoins.studentEngagement.alumni.title')}</h3>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.alumni.items.0')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.alumni.items.1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.alumni.items.2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">→</span>
                  <span className="text-base">{t('collegeCoins.studentEngagement.alumni.items.3')}</span>
                </div>
              </div>
            </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-lg text-slate-700 max-w-3xl mx-auto"
          >
            {t('collegeCoins.studentEngagement.footer')}
          </motion.p>
        </div>
      </section>

      {/* College Use Cases - Section 3: Campus Operations */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Section Header + Tuition */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              {/* Section Header */}
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {t('collegeCoins.campusOperations.title')}
                </h2>
                <p className="text-xl text-purple-200">
                  {t('collegeCoins.campusOperations.subtitle')}
                </p>
              </div>

              {/* Tuition Content */}
              <div className="inline-block px-4 py-2 bg-purple-500/30 backdrop-blur-sm rounded-full text-purple-200 text-sm font-semibold mb-4 w-fit">
                {t('collegeCoins.campusOperations.tuition.tag')}
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">{t('collegeCoins.campusOperations.tuition.title')}</h3>
              <p className="text-xl text-purple-100 mb-8">
                {t('collegeCoins.campusOperations.tuition.desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white">
                  {t('collegeCoins.campusOperations.tuition.items.0')}
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white">
                  {t('collegeCoins.campusOperations.tuition.items.1')}
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white">
                  {t('collegeCoins.campusOperations.tuition.items.2')}
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white">
                  {t('collegeCoins.campusOperations.tuition.items.3')}
                </div>
              </div>
            </motion.div>

            {/* Right: Two Sections with Animated Divider */}
            <div>
              {/* Campus Services */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex gap-6 mb-12"
              >
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-pink-500/30 backdrop-blur-sm rounded-full text-pink-200 text-xs font-semibold mb-3">
                    {t('collegeCoins.campusOperations.services.tag')}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('collegeCoins.campusOperations.services.title')}</h3>
                  <div className="space-y-3 text-purple-100">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                      <span>{t('collegeCoins.campusOperations.services.items.0')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                      <span>{t('collegeCoins.campusOperations.services.items.1')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                      <span>{t('collegeCoins.campusOperations.services.items.2')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                      <span>{t('collegeCoins.campusOperations.services.items.3')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                      <span>{t('collegeCoins.campusOperations.services.items.4')}</span>
                    </div>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2340&auto=format&fit=crop"
                  alt="Campus Services"
                  className="w-48 h-full object-cover rounded-xl flex-shrink-0"
                />
              </motion.div>

              {/* Animated Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent mb-12 animate-pulse"></div>

              {/* Local Ecosystem */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-6"
              >
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-purple-500/30 backdrop-blur-sm rounded-full text-purple-200 text-xs font-semibold mb-3">
                    {t('collegeCoins.campusOperations.local.tag')}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('collegeCoins.campusOperations.local.title')}</h3>
                  <div className="space-y-3 text-purple-100">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                      <span>{t('collegeCoins.campusOperations.local.items.0')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                      <span>{t('collegeCoins.campusOperations.local.items.1')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                      <span>{t('collegeCoins.campusOperations.local.items.2')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                      <span>{t('collegeCoins.campusOperations.local.items.3')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                      <span>{t('collegeCoins.campusOperations.local.items.4')}</span>
                    </div>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2374&auto=format&fit=crop"
                  alt="Local Business"
                  className="w-48 h-full object-cover rounded-xl flex-shrink-0"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* College CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('collegeCoins.collegeCTA.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('collegeCoins.collegeCTA.description')}
            </p>
            <a href="/auth/register/college" className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors inline-block">
              {t('collegeCoins.collegeCTA.button')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Student Use Cases - Section 1: Earning Before Enrollment */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Sticky Content */}
            <div className="md:sticky md:top-32 md:self-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  {t('collegeCoins.earningBeforeEnrollment.title')}
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  {t('collegeCoins.earningBeforeEnrollment.description')}
                </p>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-200">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-purple-600 mb-2">{t('collegeCoins.earningBeforeEnrollment.rfe.label')}</div>
                      <div className="text-2xl font-bold text-slate-900 mb-4">{t('collegeCoins.earningBeforeEnrollment.rfe.title')}</div>
                      <div className="space-y-3 text-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>{t('collegeCoins.earningBeforeEnrollment.rfe.items.0')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>{t('collegeCoins.earningBeforeEnrollment.rfe.items.1')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>{t('collegeCoins.earningBeforeEnrollment.rfe.items.2')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>{t('collegeCoins.earningBeforeEnrollment.rfe.items.3')}</span>
                        </div>
                      </div>
                    </div>
                    <a 
                      href="https://rewardsforeducation.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap inline-block text-center"
                    >
                      {t('collegeCoins.earningBeforeEnrollment.rfe.button')}
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Scrolling Timeline with Animated Line */}
            <div className="relative">
              {/* Animated vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400 opacity-30"></div>
              <motion.div 
                className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-purple-600 via-pink-600 to-purple-600"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              ></motion.div>

              <div className="space-y-12 relative">
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('collegeCoins.earningBeforeEnrollment.steps.step1.title')}</h3>
                    <p className="text-slate-600 mb-4">
                      {t('collegeCoins.earningBeforeEnrollment.steps.step1.desc')}
                    </p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('collegeCoins.earningBeforeEnrollment.steps.step2.title')}</h3>
                    <p className="text-slate-600 mb-4">
                      <Trans i18nKey="collegeCoins.earningBeforeEnrollment.steps.step2.desc" components={{ 1: <strong className="text-purple-600" /> }} />
                    </p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.894L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('collegeCoins.earningBeforeEnrollment.steps.step3.title')}</h3>
                    <p className="text-slate-600 mb-4">
                      <Trans i18nKey="collegeCoins.earningBeforeEnrollment.steps.step3.desc" components={{ 1: <strong className="text-purple-600" /> }} />
                    </p>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('collegeCoins.earningBeforeEnrollment.steps.step4.title')}</h3>
                    <p className="text-slate-600 mb-4">
                      <Trans i18nKey="collegeCoins.earningBeforeEnrollment.steps.step4.desc" components={{ 1: <strong className="text-purple-600" /> }} />
                    </p>
                  </div>
                </motion.div>

                {/* Step 5 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('collegeCoins.earningBeforeEnrollment.steps.step5.title')}</h3>
                    <p className="text-slate-600 mb-4">
                      <Trans i18nKey="collegeCoins.earningBeforeEnrollment.steps.step5.desc" components={{ 1: <strong className="text-purple-600" /> }} />
                    </p>
                  </div>
                </motion.div>

                {/* Step 6 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('collegeCoins.earningBeforeEnrollment.steps.step6.title')}</h3>
                    <p className="text-slate-600 mb-4">
                      <Trans i18nKey="collegeCoins.earningBeforeEnrollment.steps.step6.desc" components={{ 1: <strong className="text-purple-600" /> }} />
                    </p>
                  </div>
                </motion.div>

                {/* Step 7 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('collegeCoins.earningBeforeEnrollment.steps.step7.title')}</h3>
                    <p className="text-slate-600 mb-4">
                      <Trans i18nKey="collegeCoins.earningBeforeEnrollment.steps.step7.desc" components={{ 1: <strong className="text-purple-600" /> }} />
                    </p>
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                      <p className="text-sm text-slate-700">
                        <Trans i18nKey="collegeCoins.earningBeforeEnrollment.result" components={{ 0: <strong /> }} />
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Additional Content - Phone Mockups */}
          <div className="mt-20 grid md:grid-cols-2 gap-12">
            {/* Language Learning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-full blur-3xl -z-10" />
                 <PhoneMockup variant="graph" frameStyle="minimal" />
              </div>
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.894L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                  </svg>
                  <span>{t('collegeCoins.phoneMockups.language.tag')}</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">{t('collegeCoins.phoneMockups.language.title')}</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {t('collegeCoins.phoneMockups.language.desc')}
                </p>
              </div>
            </motion.div>

            {/* Visa Documentation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-transparent rounded-full blur-3xl -z-10" />
                 <PhoneMockup variant="vault" frameStyle="dark" />
              </div>
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('collegeCoins.phoneMockups.visa.tag')}</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">{t('collegeCoins.phoneMockups.visa.title')}</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {t('collegeCoins.phoneMockups.visa.desc')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Student Use Cases - Section 2: Campus Payments After Enrollment */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        {/* Dark Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1920&auto=format&fit=crop)' }}
        ></div>
        <div className="absolute inset-0 bg-indigo-950/80"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('collegeCoins.campusPayments.title')}
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              {t('collegeCoins.campusPayments.desc')}
            </p>
          </motion.div>

          {/* 4 columns on mobile, 6 on desktop */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {/* Card 1 - Tuition */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-purple-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.tuition.title')}</h3>
              <p className="text-sm text-purple-200">{t('collegeCoins.campusPayments.cards.tuition.desc')}</p>
            </motion.div>

            {/* Card 2 - Housing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-blue-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.housing.title')}</h3>
              <p className="text-sm text-blue-200">{t('collegeCoins.campusPayments.cards.housing.desc')}</p>
            </motion.div>

            {/* Card 3 - Dining */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-green-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.dining.title')}</h3>
              <p className="text-sm text-green-200">{t('collegeCoins.campusPayments.cards.dining.desc')}</p>
            </motion.div>

            {/* Card 4 - Books */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-orange-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.books.title')}</h3>
              <p className="text-sm text-orange-200">{t('collegeCoins.campusPayments.cards.books.desc')}</p>
            </motion.div>

            {/* Card 5 - Parking */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.parking.title')}</h3>
              <p className="text-sm text-indigo-200">{t('collegeCoins.campusPayments.cards.parking.desc')}</p>
            </motion.div>

            {/* Card 6 - Gym */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-red-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.gym.title')}</h3>
              <p className="text-sm text-red-200">{t('collegeCoins.campusPayments.cards.gym.desc')}</p>
            </motion.div>

            {/* Card 7 - Printing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-teal-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.printing.title')}</h3>
              <p className="text-sm text-teal-200">{t('collegeCoins.campusPayments.cards.printing.desc')}</p>
            </motion.div>

            {/* Card 8 - Events */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-violet-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-violet-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.events.title')}</h3>
              <p className="text-sm text-violet-200">{t('collegeCoins.campusPayments.cards.events.desc')}</p>
            </motion.div>

            {/* Card 9 - Lab Access */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-slate-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-slate-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.lab.title')}</h3>
              <p className="text-sm text-slate-200">{t('collegeCoins.campusPayments.cards.lab.desc')}</p>
            </motion.div>

            {/* Card 10 - Resume Review */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-lime-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-lime-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.resume.title')}</h3>
              <p className="text-sm text-lime-200">{t('collegeCoins.campusPayments.cards.resume.desc')}</p>
            </motion.div>

            {/* Card 11 - Mock Interview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-sky-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-sky-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 002-2h-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.interview.title')}</h3>
              <p className="text-sm text-sky-200">{t('collegeCoins.campusPayments.cards.interview.desc')}</p>
            </motion.div>

            {/* Card 12 - Campus Café */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-12 h-12 bg-amber-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('collegeCoins.campusPayments.cards.cafe.title')}</h3>
              <p className="text-sm text-amber-200">{t('collegeCoins.campusPayments.cards.cafe.desc')}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center max-w-3xl mx-auto"
          >
            <p className="text-lg text-purple-100">
              <Trans i18nKey="collegeCoins.campusPayments.footer" components={{ 0: <strong /> }} />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Student Use Cases - Section 3: Trading on Intuition Exchange */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-16 shadow-xl border border-slate-200">
            {/* 2-Column Hero Layout */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              {/* LEFT: Content */}
              <div>
                <div className="mb-6">
                  <img 
                    src="/images/intuition-logo.svg" 
                    alt="Intuition" 
                    className="h-12 md:h-14 mb-3"
                  />
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                    {t('collegeCoins.intuitionExchange.title')}
                  </h2>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                    <span className="text-purple-600">{t('collegeCoins.intuitionExchange.subtitle')}</span>
                  </h2>
                </div>
                
                <p className="text-xl text-slate-600 mb-6">
                  {t('collegeCoins.intuitionExchange.desc')}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700"><strong>{t('collegeCoins.intuitionExchange.features.seed')}</strong>{t('collegeCoins.intuitionExchange.features.seedDesc')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700"><strong>{t('collegeCoins.intuitionExchange.features.nonEdu')}</strong>{t('collegeCoins.intuitionExchange.features.nonEduDesc')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700"><strong>{t('collegeCoins.intuitionExchange.features.nonStudent')}</strong>{t('collegeCoins.intuitionExchange.features.nonStudentDesc')}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80 md:h-96">
                  <img 
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1920&auto=format&fit=crop" 
                    alt="Trading Interface" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Info card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">{t('collegeCoins.intuitionExchange.infoCard.label')}</p>
                        <p className="text-2xl font-bold text-slate-900">{t('collegeCoins.intuitionExchange.infoCard.value')}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 3 Feature Sections Horizontal with Dividers */}
            <div className="grid md:grid-cols-3 gap-8 md:divide-x divide-slate-200">
              {/* Buy & Sell */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{t('collegeCoins.intuitionExchange.buySell.title')}</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                  <span className="text-slate-600">{t('collegeCoins.intuitionExchange.buySell.items.0')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                  <span className="text-slate-600">{t('collegeCoins.intuitionExchange.buySell.items.1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                  <span className="text-slate-600">{t('collegeCoins.intuitionExchange.buySell.items.2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                  <span className="text-slate-600">{t('collegeCoins.intuitionExchange.buySell.items.3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                  <span className="text-slate-600">{t('collegeCoins.intuitionExchange.buySell.items.4')}</span>
                </li>
              </ul>
            </div>

              {/* Onramp */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{t('collegeCoins.intuitionExchange.onramp.title')}</h3>
              </div>
              <p className="text-slate-600 mb-6">
                {t('collegeCoins.intuitionExchange.onramp.desc')}
              </p>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">{t('collegeCoins.intuitionExchange.onramp.useCasesLabel')}</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-green-500">→</span>
                    {t('collegeCoins.intuitionExchange.onramp.useCases.0')}
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-green-500">→</span>
                    {t('collegeCoins.intuitionExchange.onramp.useCases.1')}
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-green-500">→</span>
                    {t('collegeCoins.intuitionExchange.onramp.useCases.2')}
                  </li>
                </ul>
              </div>
            </div>

              {/* Offramp */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{t('collegeCoins.intuitionExchange.offramp.title')}</h3>
              </div>
              <p className="text-slate-600 mb-6">
                {t('collegeCoins.intuitionExchange.offramp.desc')}
              </p>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">{t('collegeCoins.intuitionExchange.offramp.useCasesLabel')}</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-purple-500">→</span>
                    {t('collegeCoins.intuitionExchange.offramp.useCases.0')}
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-purple-500">→</span>
                    {t('collegeCoins.intuitionExchange.offramp.useCases.1')}
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-purple-500">→</span>
                    {t('collegeCoins.intuitionExchange.offramp.useCases.2')}
                  </li>
                </ul>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t('collegeCoins.pricingPlans.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('collegeCoins.pricingPlans.desc')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-white border-2 border-purple-200 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all">
                <div className="mb-8">
                  <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {t('collegeCoins.pricingPlans.free.badge')}
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-4">{t('collegeCoins.pricingPlans.free.title')}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{t('collegeCoins.pricingPlans.free.value')}</span>
                    <span className="text-2xl text-slate-600">{t('collegeCoins.pricingPlans.free.retention')}</span>
                  </div>
                  <p className="text-slate-500 mt-2">{t('collegeCoins.pricingPlans.free.note')}</p>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {t('collegeCoins.pricingPlans.free.featuresLabel')}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-slate-700">
                        <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.free.features.0')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.free.features.1')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.free.features.2')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.free.features.3')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.free.features.4')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <strong className="text-slate-900">{t('collegeCoins.pricingPlans.free.bestForLabel')}</strong> {t('collegeCoins.pricingPlans.free.bestFor')}
                    </p>
                  </div>
                </div>

                <a 
                  href="/auth/register/college" 
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all text-center"
                >
                  Get Started Free
                </a>
              </div>
            </motion.div>

            {/* Custom Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-10 shadow-2xl border border-purple-500/30 hover:shadow-purple-500/20 hover:shadow-3xl transition-all">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ {t('collegeCoins.pricingPlans.custom.badge')}
                  </div>
                </div>

                <div className="mb-8 mt-4">
                  <div className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {t('collegeCoins.pricingPlans.custom.tag')}
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-4">{t('collegeCoins.pricingPlans.custom.title')}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{t('collegeCoins.pricingPlans.custom.value')}</span>
                    <span className="text-2xl text-purple-200">{t('collegeCoins.pricingPlans.custom.retention')}</span>
                  </div>
                  <p className="text-purple-300 mt-2">{t('collegeCoins.pricingPlans.custom.note')}</p>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {t('collegeCoins.pricingPlans.custom.featuresLabel')}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-purple-100">
                        <svg className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.custom.features.0')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-purple-100">
                        <svg className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.custom.features.1')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-purple-100">
                        <svg className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.custom.features.2')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-purple-100">
                        <svg className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.custom.features.3')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-purple-100">
                        <svg className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('collegeCoins.pricingPlans.custom.features.4')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-purple-700/50">
                    <p className="text-sm text-purple-200 leading-relaxed">
                      <strong className="text-white">{t('collegeCoins.pricingPlans.custom.bestForLabel')}</strong> {t('collegeCoins.pricingPlans.custom.bestFor')}
                    </p>
                  </div>
                </div>

                <a 
                  href="/contact" 
                  className="block w-full bg-gradient-to-r from-purple-400 to-pink-400 text-slate-900 font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all text-center"
                >
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Network Visualization Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* LEFT: Animated Network Diagram */}
            <div className="relative">
              <svg viewBox="0 0 600 400" className="w-full h-full">
                <defs>
                  {/* Animated dashed line pattern */}
                  <style>
                    {`
                      @keyframes dash {
                        to {
                          stroke-dashoffset: -40;
                        }
                      }
                      .animated-line {
                        stroke-dasharray: 10 10;
                        animation: dash 1s linear infinite;
                      }
                    `}
                  </style>
                </defs>

                {/* Connection Lines with Marquee Animation */}
                {/* Top Row: Colleges to Intuition */}
                <line x1="100" y1="80" x2="300" y2="80" stroke="#94a3b8" strokeWidth="2" className="animated-line" />
                {/* Top Row: Intuition to Students */}
                <line x1="300" y1="80" x2="500" y2="80" stroke="#94a3b8" strokeWidth="2" className="animated-line" />
                
                {/* Bottom Row: CFC to L2 */}
                <line x1="100" y1="280" x2="300" y2="280" stroke="#3b82f6" strokeWidth="2" className="animated-line" />
                {/* Bottom Row: L2 to RFE */}
                <line x1="300" y1="280" x2="500" y2="280" stroke="#a855f7" strokeWidth="2" className="animated-line" />
                
                {/* Vertical: Colleges to CFC */}
                <line x1="100" y1="80" x2="100" y2="280" stroke="#f59e0b" strokeWidth="2" className="animated-line" />
                {/* Vertical: Intuition to L2 */}
                <line x1="300" y1="80" x2="300" y2="280" stroke="#10b981" strokeWidth="2" className="animated-line" />
                {/* Vertical: Students to RFE */}
                <line x1="500" y1="80" x2="500" y2="280" stroke="#ec4899" strokeWidth="2" className="animated-line" />

                {/* Animated Particles */}
                {/* Particle: Colleges to Intuition */}
                <motion.circle r="4" fill="#f59e0b" 
                  animate={{ cx: [100, 300], cy: [80, 80] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                {/* Particle: Students to RFE */}
                <motion.circle r="4" fill="#ec4899"
                  animate={{ cx: [500, 500], cy: [80, 280] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                />
                {/* Particle: CFC to L2 */}
                <motion.circle r="4" fill="#3b82f6"
                  animate={{ cx: [100, 300], cy: [280, 280] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                />

                {/* Top Row Nodes */}
                {/* Colleges */}
                <g>
                  <text x="100" y="90" textAnchor="middle" fontSize="32">🏛️</text>
                  <text x="100" y="120" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="600">{t('collegeCoins.networkVisualization.nodes.colleges')}</text>
                </g>

                {/* Intuition Exchange */}
                <g>
                  <image href="/images/intuition-logo.svg" x="275" y="55" width="50" height="50" />
                  <text x="300" y="118" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="600">{t('collegeCoins.networkVisualization.nodes.intuition')}</text>
                  <text x="300" y="131" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="600">{t('collegeCoins.networkVisualization.nodes.exchange')}</text>
                </g>

                {/* Students */}
                <g>
                  <text x="500" y="90" textAnchor="middle" fontSize="32">👥</text>
                  <text x="500" y="120" textAnchor="middle" fill="#831843" fontSize="11" fontWeight="600">{t('collegeCoins.networkVisualization.nodes.students')}</text>
                </g>

                {/* Bottom Row Nodes */}
                {/* CFC */}
                <g>
                  <image href="/images/CFC-white-icon-square-blue-bg.png" x="75" y="255" width="50" height="50" />
                  <text x="100" y="318" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="600">{t('collegeCoins.networkVisualization.nodes.cfc1')}</text>
                  <text x="100" y="331" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="600">{t('collegeCoins.networkVisualization.nodes.cfc2')}</text>
                </g>

                {/* CollegenZ L2 - Center */}
                <g>
                  <image href="/images/collegen-icon-blue-transparent-bg.svg" x="275" y="255" width="50" height="50" />
                  <text x="300" y="318" textAnchor="middle" fill="#6b21a8" fontSize="11" fontWeight="700">{t('collegeCoins.networkVisualization.nodes.l2')}</text>
                </g>

                {/* RFE */}
                <g>
                  <image href="/images/rfe-logo-colored-bg.svg" x="475" y="255" width="50" height="50" />
                  <text x="500" y="318" textAnchor="middle" fill="#6b21a8" fontSize="11" fontWeight="600">{t('collegeCoins.networkVisualization.nodes.rfe1')}</text>
                  <text x="500" y="331" textAnchor="middle" fill="#6b21a8" fontSize="11" fontWeight="600">{t('collegeCoins.networkVisualization.nodes.rfe2')}</text>
                </g>
              </svg>
            </div>

            {/* RIGHT: Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {t('collegeCoins.networkVisualization.ecosystem.title')}
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t('collegeCoins.networkVisualization.ecosystem.desc')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{t('collegeCoins.networkVisualization.ecosystem.items.0.title')}</h3>
                    <p className="text-slate-600">{t('collegeCoins.networkVisualization.ecosystem.items.0.desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{t('collegeCoins.networkVisualization.ecosystem.items.1.title')}</h3>
                    <p className="text-slate-600">{t('collegeCoins.networkVisualization.ecosystem.items.1.desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{t('collegeCoins.networkVisualization.ecosystem.items.2.title')}</h3>
                    <p className="text-slate-600">{t('collegeCoins.networkVisualization.ecosystem.items.2.desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{t('collegeCoins.networkVisualization.ecosystem.items.3.title')}</h3>
                    <p className="text-slate-600">{t('collegeCoins.networkVisualization.ecosystem.items.3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://unsplash.com/photos/FtJEat_S7Q4/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NjF8fGVkdWNhdGlvbnxlbnwwfHx8fDE3NjUxNzUwNTZ8Mg&force=true&w=1920)' }}
        ></div>
        
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            >
              {t('collegeCoins.cta.title')}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white mb-12 leading-relaxed drop-shadow-lg"
            >
              {t('collegeCoins.cta.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-row gap-4 justify-center"
            >
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-8 md:px-10 py-4 md:py-5 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all text-base md:text-lg shadow-xl hover:shadow-2xl hover:scale-105"
              >
                {t('collegeCoins.cta.primaryButton')}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              
              <a 
                href="/auth/register/college" 
                className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 font-bold px-8 md:px-10 py-4 md:py-5 rounded-xl hover:bg-white hover:scale-105 transition-all text-base md:text-lg shadow-xl hover:shadow-2xl border-2 border-white"
              >
                {t('collegeCoins.cta.secondaryButton')}
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollegeCoins;
