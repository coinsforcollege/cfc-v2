import mongoose from 'mongoose';
import College from '../models/College.js';
import dotenv from 'dotenv';

dotenv.config();

const colleges = [
  {
    name: "Massachusetts Institute of Technology",
    shortName: "MIT",
    country: "USA",
    state: "Massachusetts",
    city: "Cambridge",
    type: "University",
    establishedYear: 1861,
    logo: "/images/college-logo-1.webp",
    coverImage: "/images/college-1.avif",
    tagline: "Mind and Hand",
    description: "A world-renowned research university dedicated to advancing knowledge in science, technology, and other areas of scholarship.",
    about: `The Massachusetts Institute of Technology (MIT) is a private research university located in Cambridge, Massachusetts. Established in 1861, MIT has since become one of the world's preeminent institutions for scientific and technological research and education.

MIT's campus spans 168 acres along the Charles River, featuring iconic architecture including the Great Dome and the distinctive Stata Center. The Institute is organized into five schools and one college, containing a total of 32 academic departments with a strong emphasis on scientific, engineering, and technological research.

The university is known for its rigorous academic programs, groundbreaking research, and entrepreneurial culture. MIT has produced numerous Nobel laureates, Fields Medalists, and Turing Award winners. The institution's research expenditures exceed $1.8 billion annually, making it one of the largest research budgets of any university.

MIT's educational philosophy emphasizes hands-on problem-solving and innovation. Students are encouraged to engage in research from their first year, working alongside world-class faculty on projects that address real-world challenges. The Institute's UROP (Undergraduate Research Opportunities Program) is one of the most comprehensive undergraduate research programs in the nation.

Beyond academics, MIT fosters a vibrant campus life with over 500 student organizations, Division III athletics, and a strong commitment to public service. The MIT Innovation Initiative and the Martin Trust Center for Entrepreneurship support students in transforming their ideas into viable businesses, contributing to MIT's reputation as a hub of innovation and entrepreneurship.`,
    mission: "To advance knowledge and educate students in science, technology, and other areas of scholarship that will best serve the nation and the world in the 21st century.",
    vision: "To be the premier institution of higher education, fostering excellence in teaching, research, and innovation while preparing students to tackle the world's greatest challenges.",
    website: "https://web.mit.edu",
    email: "admissions@mit.edu",
    phone: "+1-617-253-1000",
    socialMedia: {
      facebook: "https://facebook.com/MIT",
      twitter: "https://twitter.com/MIT",
      instagram: "https://instagram.com/mitpics",
      linkedin: "https://linkedin.com/school/massachusetts-institute-of-technology"
    },
    campusSize: { value: 168, unit: "acres" },
    departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Physics", "Mathematics", "Chemistry", "Biology", "Economics", "Architecture", "Aerospace Engineering", "Chemical Engineering", "Materials Science"],
    studentLife: {
      totalStudents: 11934,
      internationalStudents: 3748,
      studentToFacultyRatio: "3:1",
      clubs: 500,
      sports: ["Football", "Basketball", "Soccer", "Swimming", "Rowing", "Track and Field"],
      housing: {
        available: true,
        capacity: 4000,
        description: "Campus housing available for all undergraduates"
      }
    },
    admissions: {
      acceptanceRate: 3.2,
      applicationDeadline: "January 1",
      requirements: "SAT/ACT, Essays, Recommendations",
      tuitionFee: {
        domestic: 57986,
        international: 57986,
        currency: "USD"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Stanford University",
    shortName: "Stanford",
    country: "USA",
    state: "California",
    city: "Stanford",
    type: "University",
    establishedYear: 1885,
    logo: "/images/college-logo-2.jpg",
    coverImage: "/images/college-2.webp",
    tagline: "The Wind of Freedom Blows",
    description: "A leading research university known for its entrepreneurial character and proximity to Silicon Valley.",
    about: `Stanford University, officially Leland Stanford Junior University, is a private research university in Stanford, California. Founded in 1885 by Leland and Jane Stanford in memory of their only child, the university is one of the world's leading teaching and research institutions.

Located in the heart of California's Silicon Valley, Stanford's 8,180-acre campus is one of the largest in the United States. The university is organized into seven schools: Humanities and Sciences, Engineering, Earth Sciences, Education, Business, Law, and Medicine.

Stanford is renowned for its academic strength, wealth, selectivity, and proximity to Silicon Valley. The university has produced numerous successful entrepreneurs and is associated with more than 30 living billionaires and 17 astronauts. Its faculty and alumni have founded many companies including Google, Yahoo, Netflix, and Instagram.

The university's research enterprise is one of the largest in the world, with an annual research budget exceeding $1.9 billion. Stanford is particularly strong in engineering, business, law, and medicine, and is consistently ranked among the top universities globally.

Student life at Stanford is vibrant and diverse, with over 650 student organizations and 36 varsity sports teams. The university is known for its commitment to undergraduate education and provides extensive research opportunities for undergraduate students. Stanford's honor code and culture of collaboration foster an environment of academic integrity and innovation.`,
    mission: "To qualify students for personal success and direct usefulness in life; and to promote the public welfare by exercising an influence on behalf of humanity and civilization.",
    vision: "To be a leading research and teaching university, preparing students to make meaningful contributions to society while advancing knowledge across all fields of study.",
    website: "https://www.stanford.edu",
    email: "admission@stanford.edu",
    phone: "+1-650-723-2300",
    socialMedia: {
      facebook: "https://facebook.com/stanford",
      twitter: "https://twitter.com/Stanford",
      instagram: "https://instagram.com/stanford",
      linkedin: "https://linkedin.com/school/stanford-university"
    },
    campusSize: { value: 8180, unit: "acres" },
    departments: ["Computer Science", "Engineering", "Business", "Medicine", "Law", "Education", "Earth Sciences", "Humanities", "Social Sciences", "Natural Sciences", "Mathematics", "Physics"],
    studentLife: {
      totalStudents: 17249,
      internationalStudents: 3879,
      studentToFacultyRatio: "5:1",
      clubs: 650,
      sports: ["Football", "Basketball", "Swimming", "Tennis", "Golf", "Volleyball"],
      housing: {
        available: true,
        capacity: 12000,
        description: "Guaranteed for 4 years"
      }
    },
    admissions: {
      acceptanceRate: 3.7,
      applicationDeadline: "January 5",
      requirements: "SAT/ACT, Essays, Recommendations",
      tuitionFee: {
        domestic: 58416,
        international: 58416,
        currency: "USD"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Harvard University",
    shortName: "Harvard",
    country: "USA",
    state: "Massachusetts",
    city: "Cambridge",
    type: "University",
    establishedYear: 1636,
    logo: "/images/college-logo-3.png",
    coverImage: "/images/college-3.webp",
    tagline: "Veritas",
    description: "The oldest institution of higher learning in the United States, renowned for excellence across all academic disciplines.",
    about: `Harvard University, established in 1636, is the oldest institution of higher education in the United States and one of the most prestigious universities globally. Located in Cambridge, Massachusetts, Harvard has shaped countless leaders in various fields including politics, business, science, and the arts.

The university comprises Harvard College, 12 graduate and professional schools, and the Radcliffe Institute for Advanced Study. With an endowment exceeding $50 billion, Harvard has unparalleled resources to support teaching, research, and financial aid.

Harvard's faculty includes numerous Nobel laureates, Pulitzer Prize winners, and members of prestigious academies. The university's libraries contain over 18 million volumes, making it the largest academic library system in the world. Harvard's research enterprise spans from fundamental discoveries in science to innovative solutions for global challenges.

The undergraduate experience at Harvard combines rigorous academics with a vibrant residential college system. Students have access to over 400 student organizations, world-class museums, and extensive opportunities for research and internships. The university's global reach includes centers and programs on six continents, fostering international collaboration and understanding.

Harvard's commitment to financial aid ensures that students from all backgrounds can afford to attend, with over half of students receiving need-based scholarships. The university's alumni network of over 400,000 graduates provides lifelong connections and opportunities for personal and professional growth.`,
    mission: "To educate citizens and citizen-leaders for our society through the transformative power of a liberal arts and sciences education.",
    vision: "To be a preeminent research university, advancing human knowledge while preparing students to be engaged citizens and leaders addressing society's greatest challenges.",
    website: "https://www.harvard.edu",
    email: "college@fas.harvard.edu",
    phone: "+1-617-495-1000",
    socialMedia: {
      facebook: "https://facebook.com/Harvard",
      twitter: "https://twitter.com/Harvard",
      instagram: "https://instagram.com/harvard",
      linkedin: "https://linkedin.com/school/harvard-university"
    },
    campusSize: { value: 209, unit: "acres" },
    departments: ["Arts and Humanities", "Biological Sciences", "Engineering", "Physical Sciences", "Social Sciences", "Medicine", "Law", "Business", "Public Health", "Education", "Government", "Economics"],
    studentLife: {
      totalStudents: 23731,
      internationalStudents: 5341,
      studentToFacultyRatio: "6:1",
      clubs: 450,
      sports: ["Crew", "Football", "Hockey", "Lacrosse", "Basketball", "Soccer"],
      housing: {
        available: true,
        capacity: 6700,
        description: "Guaranteed for all undergraduates"
      }
    },
    admissions: {
      acceptanceRate: 3.4,
      applicationDeadline: "January 1",
      requirements: "SAT/ACT, Essays, Recommendations",
      tuitionFee: {
        domestic: 57261,
        international: 57261,
        currency: "USD"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Tokyo",
    shortName: "UTokyo",
    country: "Japan",
    city: "Tokyo",
    type: "University",
    establishedYear: 1877,
    logo: "/images/college-logo-4.jpg",
    coverImage: "/images/college-10.jpg",
    tagline: "Excellence in Research and Education",
    description: "Japan's premier university, known for its cutting-edge research and academic excellence across all disciplines.",
    about: `The University of Tokyo, commonly known as UTokyo or Todai, is Japan's first national university and one of Asia's most prestigious institutions. Founded in 1877, it has played a pivotal role in Japan's modernization and continues to be at the forefront of global academic research.

The university spans five campuses in Tokyo and boasts 10 faculties, 15 graduate schools, and numerous research institutes. UTokyo is particularly renowned for its programs in engineering, natural sciences, medicine, and economics, consistently ranking among the top universities in Asia and the world.

UTokyo's research output is extraordinary, with faculty and alumni including Nobel laureates, Fields Medalists, and numerous Japanese prime ministers. The university receives the highest research funding in Japan, driving innovations in robotics, artificial intelligence, materials science, and life sciences.

The main Hongo campus features beautiful ginkgo tree-lined paths and historic architecture alongside modern research facilities. The university's commitment to internationalization has led to increasing numbers of international students and English-taught programs, making it more accessible to global talent.`,
    mission: "To contribute to human knowledge and society through world-class education and research.",
    vision: "To be a world-leading research university that creates new knowledge and develops future leaders.",
    website: "https://www.u-tokyo.ac.jp/en/",
    email: "admissions@u-tokyo.ac.jp",
    phone: "+81-3-5841-2111",
    socialMedia: {
      facebook: "https://facebook.com/UniversityofTokyo",
      twitter: "https://twitter.com/UTokyo_News_en",
      instagram: "https://instagram.com/utokyo_official",
      linkedin: "https://linkedin.com/school/university-of-tokyo"
    },
    campusSize: { value: 280, unit: "acres" },
    departments: ["Engineering", "Science", "Medicine", "Law", "Economics", "Letters", "Education", "Agriculture", "Pharmaceutical Sciences", "Mathematical Sciences"],
    studentLife: {
      totalStudents: 28000,
      internationalStudents: 4200,
      studentToFacultyRatio: "9:1",
      clubs: 400,
      sports: ["Baseball", "Soccer", "Rugby", "Judo", "Kendo", "Swimming"],
      housing: {
        available: true,
        capacity: 3500,
        description: "Limited on-campus housing available"
      }
    },
    admissions: {
      acceptanceRate: 34.0,
      applicationDeadline: "February",
      requirements: "EJU, TOEFL/IELTS, Essays, Interviews",
      tuitionFee: {
        domestic: 535800,
        international: 535800,
        currency: "JPY"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "National University of Singapore",
    shortName: "NUS",
    country: "Singapore",
    city: "Singapore",
    type: "University",
    establishedYear: 1905,
    logo: "/images/college-logo-5.png",
    coverImage: "/images/college-11.jpeg",
    tagline: "A global university centered in Asia",
    description: "Asia's leading university with a global approach to education, research and entrepreneurship.",
    about: `The National University of Singapore (NUS) is Singapore's flagship university and consistently ranks among the world's top universities. With roots dating back to 1905, NUS has evolved into a comprehensive research university with 17 faculties and schools across three campuses.

NUS excels across multiple disciplines, from engineering and computer science to business, medicine, and law. The university is particularly strong in STEM fields, with world-class facilities and research centers in areas such as quantum technology, advanced materials, and biomedical sciences.

As a global university centered in Asia, NUS attracts top students and faculty from around the world while maintaining strong ties to Asian cultures and economies. The university's strategic location in Singapore, a major global business and innovation hub, provides unique opportunities for industry collaboration and entrepreneurship.

NUS has established partnerships with leading universities worldwide, including joint degree programs with Yale, Duke, and other prestigious institutions. The university's research output is prolific, with numerous patents and spin-off companies emerging from its labs.

Campus life at NUS is vibrant and diverse, with students from over 100 countries. The university offers extensive co-curricular activities, including over 90 student clubs, competitive sports programs, and community service initiatives. The residential college system fosters close-knit communities and interdisciplinary learning.`,
    mission: "To transform the way people think and do things through education, research and service.",
    vision: "A leading global university shaping the future.",
    website: "https://www.nus.edu.sg",
    email: "admissions@nus.edu.sg",
    phone: "+65-6516-6666",
    socialMedia: {
      facebook: "https://facebook.com/nus.singapore",
      twitter: "https://twitter.com/NUSingapore",
      instagram: "https://instagram.com/nussingapore",
      linkedin: "https://linkedin.com/school/national-university-of-singapore"
    },
    campusSize: { value: 370, unit: "acres" },
    departments: ["Computing", "Engineering", "Business", "Medicine", "Law", "Science", "Arts and Social Sciences", "Design and Environment", "Public Health", "Continuing and Lifelong Education"],
    studentLife: {
      totalStudents: 40000,
      internationalStudents: 8000,
      studentToFacultyRatio: "12:1",
      clubs: 90,
      sports: ["Basketball", "Soccer", "Badminton", "Swimming", "Dragon Boat", "Tennis"],
      housing: {
        available: true,
        capacity: 12000,
        description: "Guaranteed for first-year students"
      }
    },
    admissions: {
      acceptanceRate: 5.0,
      applicationDeadline: "March 20",
      requirements: "A-Levels, SAT/ACT, Essays, Portfolio (for some programs)",
      tuitionFee: {
        domestic: 8200,
        international: 29950,
        currency: "SGD"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Imperial College London",
    shortName: "Imperial",
    country: "United Kingdom",
    city: "London",
    type: "University",
    establishedYear: 1907,
    logo: "/images/college-logo-7.png",
    coverImage: "/images/college-12.png",
    tagline: "Science for the benefit of humanity",
    description: "A science-focused institution renowned for engineering, medicine, and business programs.",
    about: `Imperial College London is a world-class university dedicated to science, engineering, medicine, and business. Consistently ranked among the top universities globally, Imperial is renowned for its academic excellence, cutting-edge research, and entrepreneurial culture.

Founded in 1907, Imperial has evolved from several institutions including the Royal School of Mines and the City and Guilds College. Today, it stands as a unique institution in the UK, focusing exclusively on science, technology, engineering, medicine, and business.

Imperial's research has global impact, from developing new cancer treatments and renewable energy technologies to advancing artificial intelligence and space exploration. The university's faculty includes numerous Nobel laureates, Fellows of the Royal Society, and world-leading researchers.

Located in the heart of London, Imperial's main South Kensington campus is surrounded by world-class museums and cultural institutions. The university also operates the White City Campus, a major expansion focused on innovation and translation of research into real-world applications.

Imperial fosters a culture of innovation and entrepreneurship, with one of the most successful technology transfer operations in Europe. The university has spawned numerous successful startups and maintains strong links with industry, providing students with exceptional career opportunities.`,
    mission: "To achieve enduring excellence in research and education in science, engineering, medicine and business for the benefit of society.",
    vision: "To be the UK's top university for research and innovation, making a distinctive contribution to solving global challenges.",
    website: "https://www.imperial.ac.uk",
    email: "registry@imperial.ac.uk",
    phone: "+44-20-7589-5111",
    socialMedia: {
      facebook: "https://facebook.com/imperialcollegelondon",
      twitter: "https://twitter.com/imperialcollege",
      instagram: "https://instagram.com/imperialcollege",
      linkedin: "https://linkedin.com/school/imperial-college-london"
    },
    campusSize: { value: 80, unit: "acres" },
    departments: ["Engineering", "Medicine", "Natural Sciences", "Business School", "Computing", "Mathematics", "Physics", "Chemistry", "Life Sciences", "Bioengineering"],
    studentLife: {
      totalStudents: 20000,
      internationalStudents: 9000,
      studentToFacultyRatio: "11:1",
      clubs: 370,
      sports: ["Rugby", "Cricket", "Soccer", "Rowing", "Tennis", "Netball"],
      housing: {
        available: true,
        capacity: 4000,
        description: "Guaranteed for first-year undergraduates"
      }
    },
    admissions: {
      acceptanceRate: 14.3,
      applicationDeadline: "January 15",
      requirements: "A-Levels, IB, Essays, Interviews (for some programs)",
      tuitionFee: {
        domestic: 9250,
        international: 35100,
        currency: "GBP"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Technical University of Munich",
    shortName: "TUM",
    country: "Germany",
    city: "Munich",
    type: "University",
    establishedYear: 1868,
    logo: "/images/college-logo-8.webp",
    coverImage: "/images/college-15.avif",
    tagline: "The Entrepreneurial University",
    description: "Germany's leading technical university with excellence in engineering, natural sciences, and innovation.",
    about: `The Technical University of Munich (TUM) is one of Europe's top universities, excelling in engineering, natural sciences, life sciences, and medicine. Founded in 1868, TUM has become Germany's most entrepreneurial university, with strong ties to industry and a thriving startup ecosystem.

TUM comprises 15 schools and departments across three major campuses in Munich, Garching, and Freising. The university is particularly renowned for its programs in mechanical engineering, electrical engineering, computer science, and biotechnology. TUM consistently ranks as the top technical university in Germany and among the best in Europe.

Research at TUM is world-class, with the university being part of the German Universities Excellence Initiative. TUM researchers have made groundbreaking contributions in fields ranging from quantum computing and robotics to renewable energy and cancer research. The university maintains over 200 partnerships with leading companies worldwide.

TUM's international orientation is evident in its numerous international programs, including the TUM Asia campus in Singapore and exchange programs with top universities globally. The university offers many English-taught master's programs, attracting talented students from around the world.

The entrepreneurial spirit at TUM is fostered through initiatives like UnternehmerTUM, one of Europe's leading innovation and business creation centers. The university has produced numerous successful startups and maintains strong connections with Munich's thriving tech industry, including partnerships with BMW, Siemens, and other global companies.`,
    mission: "To create lasting value for society through excellence in research and teaching, innovation and entrepreneurship.",
    vision: "To be the European leading university for responsible excellence in technology and innovation.",
    website: "https://www.tum.de/en/",
    email: "studium@tum.de",
    phone: "+49-89-289-01",
    socialMedia: {
      facebook: "https://facebook.com/TU.Muenchen",
      twitter: "https://twitter.com/TU_Muenchen",
      instagram: "https://instagram.com/tu.muenchen",
      linkedin: "https://linkedin.com/school/tu-muenchen"
    },
    campusSize: { value: 1400, unit: "acres" },
    departments: ["Mechanical Engineering", "Electrical Engineering", "Computer Science", "Physics", "Chemistry", "Mathematics", "Architecture", "Medicine", "Management", "Aerospace Engineering", "Civil Engineering", "Biotechnology"],
    studentLife: {
      totalStudents: 45000,
      internationalStudents: 14000,
      studentToFacultyRatio: "13:1",
      clubs: 250,
      sports: ["Soccer", "Volleyball", "Basketball", "Skiing", "Climbing", "Swimming"],
      housing: {
        available: true,
        capacity: 10000,
        description: "Student housing available through Munich Student Union"
      }
    },
    admissions: {
      acceptanceRate: 8.0,
      applicationDeadline: "May 31 / November 30",
      requirements: "Abitur or equivalent, Language proficiency (German or English)",
      tuitionFee: {
        domestic: 0,
        international: 0,
        currency: "EUR"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Toronto",
    shortName: "U of T",
    country: "Canada",
    state: "Ontario",
    city: "Toronto",
    type: "University",
    establishedYear: 1827,
    logo: "/images/college-logo-9.png",
    coverImage: "/images/college-14.jpg",
    tagline: "Boundless possibilities",
    description: "Canada's top university with global recognition for research excellence and innovation.",
    about: `The University of Toronto is Canada's leading institution of learning, discovery, and knowledge creation. Founded in 1827, U of T has evolved into one of the world's top research-intensive universities, with three distinctive campuses spanning the Greater Toronto Area.

U of T comprises 11 colleges, 19 faculties, and over 80 professional institutes and research centers. The university excels across all disciplines, from humanities and social sciences to engineering, medicine, and law. It is particularly renowned for groundbreaking discoveries, including insulin, stem cells, and the theory of quantum computing.

The university's research output is prodigious, with U of T ranking first in Canada and among the top globally in research impact. Faculty and alumni include Nobel laureates, Rhodes Scholars, and leaders in every field of human endeavor. The university's proximity to numerous hospitals creates an exceptional environment for medical and health sciences research.

U of T's downtown campus in the heart of Toronto is surrounded by the city's vibrant cultural scene, financial district, and innovation ecosystem. The university maintains strong partnerships with industry and government, contributing significantly to Toronto's emergence as a global tech hub, particularly in artificial intelligence and machine learning.

With students from over 160 countries, U of T provides a truly global educational experience. The university's college system creates intimate learning communities within the larger university, while hundreds of student organizations ensure a rich campus life. U of T's alumni network spans the globe, with graduates making significant contributions in every field.`,
    mission: "To be an internationally significant research university with excellent programs in learning, discovery, and engagement.",
    vision: "To be one of the world's top public research universities, enriching the intellectual, cultural and economic life of Canada and the world.",
    website: "https://www.utoronto.ca",
    email: "admissions.help@utoronto.ca",
    phone: "+1-416-978-2011",
    socialMedia: {
      facebook: "https://facebook.com/uoft",
      twitter: "https://twitter.com/UofT",
      instagram: "https://instagram.com/uoft",
      linkedin: "https://linkedin.com/school/university-of-toronto"
    },
    campusSize: { value: 180, unit: "acres" },
    departments: ["Engineering", "Computer Science", "Medicine", "Law", "Business", "Arts and Science", "Architecture", "Music", "Pharmacy", "Social Work", "Public Health", "Education"],
    studentLife: {
      totalStudents: 95000,
      internationalStudents: 24000,
      studentToFacultyRatio: "14:1",
      clubs: 800,
      sports: ["Hockey", "Basketball", "Soccer", "Swimming", "Track and Field", "Rowing"],
      housing: {
        available: true,
        capacity: 16000,
        description: "Guaranteed for first-year students"
      }
    },
    admissions: {
      acceptanceRate: 43.0,
      applicationDeadline: "January 13",
      requirements: "High school diploma, English proficiency, Supplementary application (for some programs)",
      tuitionFee: {
        domestic: 6590,
        international: 59320,
        currency: "CAD"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Australian National University",
    shortName: "ANU",
    country: "Australia",
    city: "Canberra",
    type: "University",
    establishedYear: 1946,
    logo: "/images/college-logo-10.webp",
    coverImage: "/images/college-16.jpg",
    tagline: "First among equals",
    description: "Australia's leading research university with a focus on discovery and education.",
    about: `The Australian National University (ANU) is Australia's national university, located in the capital city of Canberra. Established in 1946, ANU was created specifically to be a world-class research institution focused on addressing national and international challenges.

ANU consistently ranks as the top university in Australia and among the best in the world. The university comprises seven academic colleges and is particularly renowned for its programs in international relations, political science, physics, astronomy, and earth sciences.

As the only Australian member of the International Alliance of Research Universities (IARU), ANU maintains close partnerships with institutions including Oxford, Cambridge, Yale, and UC Berkeley. The university's research output is exceptional, with numerous Nobel laureates among its faculty and alumni.

The campus is uniquely located near Australia's national institutions, including Parliament House, the High Court, and national museums, providing unparalleled opportunities for students to engage with policy-makers and national leaders. ANU's Mount Stromlo Observatory is one of Australia's premier astronomical research facilities.

ANU fosters a close-knit academic community with a high proportion of students living on campus. The university's residential colleges create intimate learning environments, while its location in Canberra offers students a unique perspective on Australian governance and international relations.`,
    mission: "To conduct research and provide education at the highest international standards.",
    vision: "To be a world-leading research university, renowned for its contribution to national and international public policy.",
    website: "https://www.anu.edu.au",
    email: "info@anu.edu.au",
    phone: "+61-2-6125-5111",
    socialMedia: {
      facebook: "https://facebook.com/TheAustralianNationalUniversity",
      twitter: "https://twitter.com/ANUmedia",
      instagram: "https://instagram.com/australiannationaluniversity",
      linkedin: "https://linkedin.com/school/australian-national-university"
    },
    campusSize: { value: 370, unit: "acres" },
    departments: ["Arts and Social Sciences", "Asia and the Pacific", "Business and Economics", "Engineering and Computer Science", "Law", "Medicine", "Biology and Environment", "Physical and Mathematical Sciences"],
    studentLife: {
      totalStudents: 25000,
      internationalStudents: 7000,
      studentToFacultyRatio: "10:1",
      clubs: 180,
      sports: ["Cricket", "Rugby", "Soccer", "Rowing", "Australian Rules Football", "Tennis"],
      housing: {
        available: true,
        capacity: 5000,
        description: "Strong residential college system"
      }
    },
    admissions: {
      acceptanceRate: 35.0,
      applicationDeadline: "December 15",
      requirements: "ATAR, SAT/ACT (international), English proficiency, Personal statement",
      tuitionFee: {
        domestic: 0,
        international: 45000,
        currency: "AUD"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Tsinghua University",
    shortName: "THU",
    country: "China",
    city: "Beijing",
    type: "University",
    establishedYear: 1911,
    logo: "/images/college-logo-11.png",
    coverImage: "/images/college-17.jpg",
    tagline: "Self-Discipline and Social Commitment",
    description: "China's premier university for engineering and technology, with growing strength across all disciplines.",
    about: `Tsinghua University, located in Beijing, China, is one of the world's leading universities and China's most prestigious institution of higher learning. Founded in 1911, Tsinghua has evolved from a preparatory school for students going abroad to a comprehensive research university.

The university is particularly renowned for its engineering and computer science programs, consistently ranking among the world's best. Tsinghua has produced numerous Chinese leaders, including President Xi Jinping, and countless innovators and entrepreneurs who have shaped China's technological development.

Tsinghua's campus is one of the most beautiful in China, featuring traditional Chinese architecture alongside modern research facilities. The university comprises 21 schools and 59 departments, with strong programs not only in STEM fields but also in economics, law, and humanities.

Research at Tsinghua is world-class, with the university receiving substantial government funding and maintaining partnerships with leading institutions globally. The university has established joint programs and research centers with MIT, Stanford, and other top universities.

As China has emerged as a global power, Tsinghua has become increasingly international, attracting top students and faculty from around the world. The university offers numerous English-taught programs and maintains a growing network of international partnerships and exchange programs.`,
    mission: "To cultivate high-level talents with international perspectives and innovation capabilities.",
    vision: "To become a world-class university and contribute to the progress of human civilization.",
    website: "https://www.tsinghua.edu.cn/en/",
    email: "admission@tsinghua.edu.cn",
    phone: "+86-10-6278-2051",
    socialMedia: {
      facebook: "https://facebook.com/TsinghuaUniversity",
      twitter: "https://twitter.com/Tsinghua_Uni",
      instagram: "https://instagram.com/tsinghua_university",
      linkedin: "https://linkedin.com/school/tsinghua-university"
    },
    campusSize: { value: 980, unit: "acres" },
    departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Architecture", "Economics", "Law", "Public Policy", "Physics", "Chemistry", "Mathematics", "Life Sciences", "Materials Science"],
    studentLife: {
      totalStudents: 50000,
      internationalStudents: 4000,
      studentToFacultyRatio: "8:1",
      clubs: 300,
      sports: ["Basketball", "Soccer", "Swimming", "Table Tennis", "Badminton", "Martial Arts"],
      housing: {
        available: true,
        capacity: 25000,
        description: "On-campus housing for most students"
      }
    },
    admissions: {
      acceptanceRate: 2.0,
      applicationDeadline: "March 31",
      requirements: "Gaokao (Chinese), HSK (language), International exams (for international students)",
      tuitionFee: {
        domestic: 5000,
        international: 30000,
        currency: "CNY"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "École Polytechnique Fédérale de Lausanne",
    shortName: "EPFL",
    country: "Switzerland",
    city: "Lausanne",
    type: "University",
    establishedYear: 1853,
    logo: "/images/college-logo-12.png",
    coverImage: "/images/college-18.jpg",
    tagline: "Innovation in science and technology",
    description: "Switzerland's leading technical university on the shores of Lake Geneva.",
    about: `École Polytechnique Fédérale de Lausanne (EPFL) is one of Europe's most dynamic and cosmopolitan technical universities. Located on the shores of Lake Geneva in Lausanne, Switzerland, EPFL has established itself as a global leader in science and technology education and research.

Founded in 1853, EPFL has grown from a small engineering school to a comprehensive technical university with over 350 laboratories and research groups. The university is particularly renowned for its work in microengineering, robotics, computer science, life sciences, and renewable energy.

EPFL's modern campus features cutting-edge facilities, including the stunning Rolex Learning Center, a futuristic library and learning space that has become an architectural icon. The university maintains close ties with CERN, the European Organization for Nuclear Research, and other leading research institutions.

The university's research has led to numerous breakthroughs and the creation of many successful startups. EPFL's Innovation Park hosts over 100 companies and provides support for student entrepreneurs. The university's technology transfer program is one of the most successful in Europe.

With over 120 nationalities represented on campus, EPFL offers a truly international environment. Instruction is primarily in French for bachelor's programs and in English for master's and doctoral programs, attracting top talent from around the world.`,
    mission: "To train engineers and scientists at the highest international level through excellence in education, research, and innovation.",
    vision: "To be a world-leading technical university that shapes the future through scientific excellence and innovation.",
    website: "https://www.epfl.ch/en/",
    email: "info@epfl.ch",
    phone: "+41-21-693-1111",
    socialMedia: {
      facebook: "https://facebook.com/epflcampus",
      twitter: "https://twitter.com/EPFL_en",
      instagram: "https://instagram.com/epflcampus",
      linkedin: "https://linkedin.com/school/epfl"
    },
    campusSize: { value: 136, unit: "acres" },
    departments: ["Computer Science", "Communication Systems", "Electrical Engineering", "Mechanical Engineering", "Materials Science", "Physics", "Chemistry", "Life Sciences", "Architecture", "Civil Engineering", "Environmental Engineering", "Mathematics"],
    studentLife: {
      totalStudents: 12000,
      internationalStudents: 6000,
      studentToFacultyRatio: "9:1",
      clubs: 120,
      sports: ["Skiing", "Sailing", "Soccer", "Volleyball", "Climbing", "Swimming"],
      housing: {
        available: true,
        capacity: 1600,
        description: "Limited on-campus housing, external options nearby"
      }
    },
    admissions: {
      acceptanceRate: 10.0,
      applicationDeadline: "April 30",
      requirements: "Matura or equivalent, Language proficiency (French/English), Entrance exam (for some programs)",
      tuitionFee: {
        domestic: 1266,
        international: 1266,
        currency: "CHF"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Korea Advanced Institute of Science and Technology",
    shortName: "KAIST",
    country: "South Korea",
    city: "Daejeon",
    type: "University",
    establishedYear: 1971,
    logo: "/images/college-logo-13.jpeg",
    coverImage: "/images/college-19.jpg",
    tagline: "Creative Challenge and Shared Growth",
    description: "South Korea's premier science and technology university, driving innovation in Asia.",
    about: `The Korea Advanced Institute of Science and Technology (KAIST) is South Korea's first research-oriented science and engineering institution. Founded in 1971 with significant support from the Korean government, KAIST was established to develop human resources in science and technology for Korea's rapid industrialization.

KAIST has played a pivotal role in Korea's transformation into a global technology leader. The university has produced numerous innovators and entrepreneurs who have founded or led major Korean technology companies. KAIST is particularly strong in electrical engineering, computer science, mechanical engineering, and materials science.

The university's main campus in Daejeon features state-of-the-art research facilities and has become a hub for Korea's technology sector. KAIST maintains close relationships with industry, ensuring that its research addresses real-world challenges and creates economic value.

KAIST's research output is impressive, with the university consistently ranking among the top institutions globally for citation impact. The university has made significant contributions to fields ranging from artificial intelligence and robotics to biotechnology and renewable energy.

The international character of KAIST is growing, with all courses taught in English and an increasing number of international students and faculty. The university's commitment to innovation extends beyond research, with numerous programs to support student entrepreneurship and technology commercialization.`,
    mission: "To educate, research, and innovate for the betterment of the human condition.",
    vision: "To be a world-leading research university driving future innovations and creating global value.",
    website: "https://www.kaist.ac.kr/en/",
    email: "admission@kaist.ac.kr",
    phone: "+82-42-350-2114",
    socialMedia: {
      facebook: "https://facebook.com/kaistofficial",
      twitter: "https://twitter.com/kaist_official",
      instagram: "https://instagram.com/kaist_official",
      linkedin: "https://linkedin.com/school/kaist"
    },
    campusSize: { value: 340, unit: "acres" },
    departments: ["Electrical Engineering", "Computer Science", "Mechanical Engineering", "Chemical Engineering", "Biological Sciences", "Physics", "Chemistry", "Mathematics", "Industrial Design", "Business and Technology Management", "Aerospace Engineering", "Nuclear Engineering"],
    studentLife: {
      totalStudents: 11000,
      internationalStudents: 1200,
      studentToFacultyRatio: "7:1",
      clubs: 150,
      sports: ["Soccer", "Basketball", "Baseball", "Taekwondo", "E-sports", "Badminton"],
      housing: {
        available: true,
        capacity: 6000,
        description: "On-campus housing for most undergraduates"
      }
    },
    admissions: {
      acceptanceRate: 15.0,
      applicationDeadline: "November 30",
      requirements: "High school diploma, TOEFL/IELTS, Academic transcripts, Essays, Interviews",
      tuitionFee: {
        domestic: 0,
        international: 4000000,
        currency: "KRW"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of São Paulo",
    shortName: "USP",
    country: "Brazil",
    state: "São Paulo",
    city: "São Paulo",
    type: "University",
    establishedYear: 1934,
    logo: "/images/college-logo-6.png",
    coverImage: "/images/college-4.jpg",
    tagline: "Knowledge transforms",
    description: "Latin America's largest and most prestigious university, leading research and education in Brazil.",
    about: `The University of São Paulo (USP) is Brazil's and Latin America's most prestigious university, consistently ranking as the top institution in the region. Founded in 1934, USP has grown into a comprehensive public research university with multiple campuses across São Paulo state.

USP comprises 42 academic units across various locations, including the main campus in São Paulo city, and offers programs in virtually every field of knowledge. The university is particularly renowned for its programs in engineering, medicine, law, economics, and humanities. With over 90,000 students, USP is one of the largest universities in Latin America.

Research at USP is prolific, accounting for a significant portion of Brazil's scientific output. The university operates numerous research centers and maintains partnerships with leading institutions worldwide. USP has played a crucial role in addressing Brazil's development challenges, from public health to sustainable agriculture and environmental conservation.

The university's main campus, Cidade Universitária, spans over 1,700 acres and includes world-class facilities, museums, and cultural centers. USP maintains strong ties with Brazilian industry and government, contributing significantly to the country's economic and social development.

As a public university, USP provides free education to all admitted students, maintaining a strong commitment to social mobility and educational access. The university's entrance exam, the Fuvest, is one of the most competitive in Latin America, attracting the brightest students from across Brazil.`,
    mission: "To promote and develop all forms of knowledge through teaching, research, and extension services.",
    vision: "To be a world-class public university committed to excellence in teaching and research while serving Brazilian society.",
    website: "https://www5.usp.br/",
    email: "internacional@usp.br",
    phone: "+55-11-3091-3116",
    socialMedia: {
      facebook: "https://facebook.com/usponline",
      twitter: "https://twitter.com/usponline",
      instagram: "https://instagram.com/usponline",
      linkedin: "https://linkedin.com/school/university-of-sao-paulo"
    },
    campusSize: { value: 1750, unit: "acres" },
    departments: ["Engineering", "Medicine", "Law", "Economics", "Architecture", "Arts", "Philosophy", "Physics", "Chemistry", "Biology", "Mathematics", "Public Health", "Veterinary Medicine", "Pharmacy", "Dentistry"],
    studentLife: {
      totalStudents: 95000,
      internationalStudents: 3000,
      studentToFacultyRatio: "15:1",
      clubs: 400,
      sports: ["Soccer", "Basketball", "Volleyball", "Swimming", "Judo", "Capoeira"],
      housing: {
        available: true,
        capacity: 2000,
        description: "Limited on-campus housing available"
      }
    },
    admissions: {
      acceptanceRate: 3.5,
      applicationDeadline: "November",
      requirements: "Fuvest entrance exam, ENEM, High school completion",
      tuitionFee: {
        domestic: 0,
        international: 0,
        currency: "BRL"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Melbourne",
    shortName: "UMelb",
    country: "Australia",
    state: "Victoria",
    city: "Melbourne",
    type: "University",
    establishedYear: 1853,
    logo: "/images/college-logo-10.webp",
    coverImage: "/images/college-10.jpg",
    tagline: "Postera Crescam Laude (I shall grow in the esteem of future generations)",
    description: "A leading public research university located in Melbourne, Australia, known for excellence across all disciplines.",
    about: `The University of Melbourne is Australia's second oldest university and consistently ranks among the leading universities in the world. Founded in 1853, it has a rich history of academic excellence and innovation spanning over 160 years.

Located in the heart of Melbourne, one of the world's most liveable cities, the university's main campus in Parkville is an architectural blend of historic sandstone buildings and modern facilities. The university comprises 10 separate academic units and is associated with numerous prestigious research institutes.

Melbourne is particularly renowned for its graduate schools of Law, Medicine, and Business, all ranking among the best globally. The university has produced four Australian Prime Ministers, five Governors-General, and nine Nobel laureates. Its research output is consistently rated among the best in Australia.

The Melbourne Model, introduced in 2008, restructured undergraduate and graduate education to provide students with broad foundational knowledge before specialization. This innovative approach has been influential in shaping higher education policy across Australia.

Student life at Melbourne is vibrant and diverse, with over 200 clubs and societies, comprehensive sports programs, and a strong commitment to sustainability and social justice. The university's cultural precinct includes museums, galleries, and performance spaces that enrich the academic experience.`,
    mission: "To benefit society through the transformative impact of education and research.",
    vision: "To be one of the finest universities in the world, known for the excellence of our teaching, research and scholarship.",
    website: "https://www.unimelb.edu.au",
    email: "admissions@unimelb.edu.au",
    phone: "+61-3-9035-5511",
    socialMedia: {
      facebook: "https://facebook.com/unimelb",
      twitter: "https://twitter.com/unimelb",
      instagram: "https://instagram.com/unimelb",
      linkedin: "https://linkedin.com/school/university-of-melbourne"
    },
    campusSize: { value: 65, unit: "hectares" },
    departments: ["Medicine", "Law", "Business", "Engineering", "Arts", "Science", "Education", "Architecture", "Veterinary Science", "Music"],
    studentLife: {
      totalStudents: 51000,
      internationalStudents: 18000,
      studentToFacultyRatio: "14:1",
      clubs: 200,
      sports: ["Australian Football", "Cricket", "Rowing", "Soccer", "Tennis", "Swimming"],
      housing: {
        available: true,
        capacity: 8000,
        description: "Multiple residential colleges and university apartments"
      }
    },
    admissions: {
      acceptanceRate: 70.0,
      applicationDeadline: "October 31",
      requirements: "ATAR/IB, English proficiency, Personal statement",
      tuitionFee: {
        domestic: 12000,
        international: 45000,
        currency: "AUD"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of California, Berkeley",
    shortName: "UC Berkeley",
    country: "USA",
    state: "California",
    city: "Berkeley",
    type: "University",
    establishedYear: 1868,
    logo: "/images/college-logo-11.png",
    coverImage: "/images/college-11.jpeg",
    tagline: "Fiat Lux (Let there be light)",
    description: "The flagship institution of the University of California system, renowned for academic excellence and groundbreaking research.",
    about: `The University of California, Berkeley, commonly referred to as UC Berkeley or Cal, is a public research university in Berkeley, California. Established in 1868, it is the flagship campus of the University of California system and one of the most prestigious universities in the world.

Berkeley is known for its rigorous academics, distinguished faculty, and culture of free speech and political activism. The campus has been the birthplace of numerous scientific breakthroughs, including the discovery of 16 chemical elements, the development of the wetsuit, and key contributions to the Manhattan Project.

The university has 110 Nobel laureates associated with it, more than any other public university in the United States. Its faculty includes numerous Fields Medalists, Turing Award winners, and Pulitzer Prize recipients. Berkeley consistently ranks among the top universities globally for research output and impact.

Berkeley's 1,232-acre campus sits in the Berkeley Hills, offering stunning views of San Francisco Bay. The campus features iconic landmarks like the Campanile (Sather Tower), which offers panoramic views, and the Bancroft Library, home to extensive special collections and archives.

Student life at Berkeley is characterized by intellectual discourse, social activism, and diverse cultural expression. With over 1,000 student organizations, Division I athletics, and a strong entrepreneurial ecosystem, Berkeley provides a comprehensive university experience. The university's proximity to Silicon Valley makes it a prime destination for technology and innovation.`,
    mission: "To serve society as a center of higher learning, providing long-term societal benefits through transmitting advanced knowledge, discovering new knowledge, and functioning as an active working repository of organized knowledge.",
    vision: "To be recognized as the world's premier public university, transforming lives and society through education, research, and public service.",
    website: "https://www.berkeley.edu",
    email: "admissions@berkeley.edu",
    phone: "+1-510-642-6000",
    socialMedia: {
      facebook: "https://facebook.com/UCBerkeley",
      twitter: "https://twitter.com/UCBerkeley",
      instagram: "https://instagram.com/ucberkeley",
      linkedin: "https://linkedin.com/school/uc-berkeley"
    },
    campusSize: { value: 1232, unit: "acres" },
    departments: ["Computer Science", "Engineering", "Business", "Economics", "Political Science", "Chemistry", "Physics", "Mathematics", "Biology", "Psychology", "Law", "Public Policy"],
    studentLife: {
      totalStudents: 45057,
      internationalStudents: 7347,
      studentToFacultyRatio: "20:1",
      clubs: 1000,
      sports: ["Football", "Basketball", "Swimming", "Track", "Rugby", "Rowing"],
      housing: {
        available: true,
        capacity: 13000,
        description: "Guaranteed housing for freshmen and transfer students"
      }
    },
    admissions: {
      acceptanceRate: 11.4,
      applicationDeadline: "November 30",
      requirements: "SAT/ACT, Essays, Transcripts, Extracurriculars",
      tuitionFee: {
        domestic: 14312,
        international: 44066,
        currency: "$"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Yale University",
    shortName: "Yale",
    country: "USA",
    state: "Connecticut",
    city: "New Haven",
    type: "University",
    establishedYear: 1701,
    logo: "/images/college-logo-12.png",
    coverImage: "/images/college-12.png",
    tagline: "Lux et Veritas (Light and Truth)",
    description: "One of America's oldest and most prestigious Ivy League universities, known for its residential college system and liberal arts education.",
    about: `Yale University is a private Ivy League research university in New Haven, Connecticut. Founded in 1701, it is the third-oldest institution of higher education in the United States and one of the nine Colonial Colleges chartered before the American Revolution.

Yale is organized into fourteen constituent schools, including the original undergraduate college, the Yale Graduate School of Arts and Sciences, and twelve professional schools. The university is particularly renowned for its drama and music programs, with the Yale School of Drama producing numerous Pulitzer Prize and Tony Award winners.

The university has produced five U.S. Presidents, 19 U.S. Supreme Court Justices, and numerous foreign heads of state. Yale's alumni network includes leaders in virtually every field, from business and law to arts and sciences. The university's faculty includes 65 members of the National Academy of Sciences and over 55 Nobel laureates.

Yale's residential college system, modeled after the universities at Oxford and Cambridge, divides undergraduates into 14 residential colleges, each with its own facilities, dining hall, and community. This system fosters close faculty-student interaction and creates tight-knit communities within the larger university.

The Yale campus features Gothic Revival architecture that has become iconic in American higher education. Sterling Memorial Library, one of the largest university libraries in the world, houses over 12 million volumes. The Yale University Art Gallery and Peabody Museum are among the finest university museums globally.`,
    mission: "To improve the world today and for future generations through outstanding research and scholarship, education, preservation, and practice.",
    vision: "To be a community united by a commitment to exemplary teaching, learning, and research, and bound by a common dedication to service.",
    website: "https://www.yale.edu",
    email: "admissions@yale.edu",
    phone: "+1-203-432-9300",
    socialMedia: {
      facebook: "https://facebook.com/YaleUniversity",
      twitter: "https://twitter.com/Yale",
      instagram: "https://instagram.com/yale",
      linkedin: "https://linkedin.com/school/yale-university"
    },
    campusSize: { value: 1015, unit: "acres" },
    departments: ["Political Science", "History", "Economics", "English", "Psychology", "Biology", "Chemistry", "Computer Science", "Mathematics", "Drama", "Music", "Law"],
    studentLife: {
      totalStudents: 14567,
      internationalStudents: 2843,
      studentToFacultyRatio: "6:1",
      clubs: 400,
      sports: ["Football", "Rowing", "Lacrosse", "Hockey", "Soccer", "Basketball"],
      housing: {
        available: true,
        capacity: 12000,
        description: "Guaranteed housing for all four years in residential colleges"
      }
    },
    admissions: {
      acceptanceRate: 4.6,
      applicationDeadline: "January 2",
      requirements: "SAT/ACT, Essays, Recommendations, Interview",
      tuitionFee: {
        domestic: 62250,
        international: 62250,
        currency: "$"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Columbia University",
    shortName: "Columbia",
    country: "USA",
    state: "New York",
    city: "New York City",
    type: "University",
    establishedYear: 1754,
    logo: "/images/college-logo-13.jpeg",
    coverImage: "/images/college-13.bin",
    tagline: "In lumine Tuo videbimus lumen (In Thy light shall we see light)",
    description: "An Ivy League research university in the heart of New York City, known for its Core Curriculum and world-class journalism school.",
    about: `Columbia University is a private Ivy League research university in New York City. Established in 1754 as King's College, it is the oldest institution of higher education in New York and the fifth oldest in the United States. Columbia's main campus occupies more than six city blocks in Morningside Heights.

Columbia is renowned for its rigorous Core Curriculum, which exposes all undergraduates to foundational texts and ideas across the humanities, sciences, and social sciences. This commitment to liberal arts education sets Columbia apart and ensures all graduates share a common intellectual experience.

The university has graduated 101 Nobel Prize laureates, more than any other university in the world. Columbia's faculty and alumni include five Founding Fathers of the United States, nine U.S. Supreme Court Justices, and 43 Nobel laureates currently on faculty—more than any other university globally.

Columbia's location in New York City provides unparalleled access to cultural institutions, corporate headquarters, international organizations, and diverse communities. Students regularly engage with the city through internships, research, and cultural activities, making New York an extension of the campus.

The university comprises 20 schools, including Columbia College, Columbia Engineering, and renowned professional schools in journalism, business, law, medicine, and international affairs. The Graduate School of Journalism administers the Pulitzer Prizes, one of journalism's highest honors.`,
    mission: "To attract and engage the best minds in pursuit of greater human understanding, pioneering new discoveries, and service to society.",
    vision: "To be the premier urban research university, advancing knowledge in all fields while maintaining deep engagement with New York City.",
    website: "https://www.columbia.edu",
    email: "admissions@columbia.edu",
    phone: "+1-212-854-1754",
    socialMedia: {
      facebook: "https://facebook.com/columbia",
      twitter: "https://twitter.com/Columbia",
      instagram: "https://instagram.com/columbia",
      linkedin: "https://linkedin.com/school/columbia-university"
    },
    campusSize: { value: 36, unit: "acres" },
    departments: ["Political Science", "Economics", "History", "English", "Computer Science", "Engineering", "Journalism", "Business", "Law", "Medicine", "International Affairs", "Architecture"],
    studentLife: {
      totalStudents: 33413,
      internationalStudents: 8932,
      studentToFacultyRatio: "6:1",
      clubs: 500,
      sports: ["Football", "Basketball", "Fencing", "Rowing", "Soccer", "Track"],
      housing: {
        available: true,
        capacity: 11000,
        description: "Guaranteed housing for all undergraduates"
      }
    },
    admissions: {
      acceptanceRate: 3.7,
      applicationDeadline: "January 1",
      requirements: "SAT/ACT, Essays, Recommendations, Supplemental materials",
      tuitionFee: {
        domestic: 65524,
        international: 65524,
        currency: "$"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Oxford",
    shortName: "Oxford",
    country: "United Kingdom",
    city: "Oxford",
    type: "University",
    establishedYear: 1096,
    logo: "/images/college-logo-5.png",
    coverImage: "/images/college-14.jpg",
    tagline: "Dominus Illuminatio Mea (The Lord is my Light)",
    description: "The oldest university in the English-speaking world, known for its tutorial system and historic colleges.",
    about: `The University of Oxford is a collegiate research university in Oxford, England. There is evidence of teaching as early as 1096, making it the oldest university in the English-speaking world and the world's second-oldest university in continuous operation.

Oxford comprises 39 semi-autonomous constituent colleges, four permanent private halls, and a range of academic departments organised into four divisions. All students are members of a college, which provides a close-knit community and personalized tutorial instruction—a distinctive feature of Oxford education.

The university has educated 28 British Prime Ministers, including 13 of the last 20, and numerous heads of state from around the world. Oxford has produced 72 Nobel Prize winners, more than 150 Olympic medallists, and countless leaders in every field imaginable.

Oxford's tutorial system pairs students with leading academics for intensive one-on-one or small group instruction. This personalized approach to education develops critical thinking, articulate expression, and deep subject knowledge. Each tutorial is typically a weekly meeting where students present essays and engage in rigorous discussion.

The university's libraries, including the Bodleian, hold over 13 million items, making them among the largest library systems in the world. Oxford's museums, including the Ashmolean Museum (Britain's oldest public museum), contain world-class collections spanning art, archaeology, and natural history.`,
    mission: "To aim for world-class excellence in research and education, for the benefit of society on a national and global scale.",
    vision: "To remain a world-leading centre of learning, teaching and research.",
    website: "https://www.ox.ac.uk",
    email: "admissions@ox.ac.uk",
    phone: "+44-1865-270000",
    socialMedia: {
      facebook: "https://facebook.com/theuniversityofoxford",
      twitter: "https://twitter.com/UniofOxford",
      instagram: "https://instagram.com/oxford_uni",
      linkedin: "https://linkedin.com/school/university-of-oxford"
    },
    campusSize: { value: 1300, unit: "acres" },
    departments: ["Medicine", "Mathematical, Physical and Life Sciences", "Humanities", "Social Sciences", "Law", "Politics", "Philosophy", "English", "History", "Economics"],
    studentLife: {
      totalStudents: 26000,
      internationalStudents: 9500,
      studentToFacultyRatio: "11:1",
      clubs: 400,
      sports: ["Rowing", "Rugby", "Cricket", "Football", "Lacrosse", "Hockey"],
      housing: {
        available: true,
        capacity: 15000,
        description: "College accommodation for most students"
      }
    },
    admissions: {
      acceptanceRate: 17.5,
      applicationDeadline: "October 15",
      requirements: "A-levels/IB, Admissions tests, Interviews, Written work",
      tuitionFee: {
        domestic: 9250,
        international: 26770,
        currency: "£"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "ETH Zurich",
    shortName: "ETH",
    country: "Switzerland",
    city: "Zurich",
    type: "University",
    establishedYear: 1855,
    logo: "/images/college-logo-14.png",
    coverImage: "/images/college-15.avif",
    tagline: "Science and technology for the benefit of humankind",
    description: "Switzerland's premier science and technology university, known for excellence in engineering and natural sciences.",
    about: `ETH Zurich (Swiss Federal Institute of Technology) is a public research university in Zurich, Switzerland. Founded in 1855, ETH has become one of the world's leading universities in science and technology, producing 21 Nobel Prize laureates including Albert Einstein.

ETH is consistently ranked among the top universities globally for engineering, technology, and natural sciences. The institution comprises 16 departments covering subjects from architecture and civil engineering to management and technology. Research at ETH spans fundamental science to applied engineering.

The university's research achievements include groundbreaking work in quantum computing, robotics, materials science, and sustainable energy. ETH maintains strong partnerships with industry, leading to numerous technology transfers and successful startups. The ETH spin-off ecosystem has created over 400 companies.

ETH's two campuses—the historic center-city campus and the modern Science City on Hönggerberg hill—provide state-of-the-art facilities for teaching and research. The university's emphasis on practical application alongside theoretical knowledge prepares students for both academic and industry careers.

The international character of ETH is reflected in its student body, with students from over 120 countries. Most master's programs and doctoral studies are conducted in English, while undergraduate programs are primarily in German. This multilingual environment, combined with Switzerland's central European location, offers unique cultural and professional opportunities.`,
    mission: "To create knowledge and disseminate it to society, to serve the country, and to contribute to addressing global challenges.",
    vision: "To be a globally leading university for science and technology, renowned for excellent research, innovative education, and successful knowledge transfer.",
    website: "https://ethz.ch",
    email: "admissions@ethz.ch",
    phone: "+41-44-632-1111",
    socialMedia: {
      facebook: "https://facebook.com/ETHZurich",
      twitter: "https://twitter.com/ETH",
      instagram: "https://instagram.com/ethzurich",
      linkedin: "https://linkedin.com/school/eth-zurich"
    },
    campusSize: { value: 200, unit: "acres" },
    departments: ["Architecture", "Engineering", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Earth Sciences", "Materials Science", "Robotics"],
    studentLife: {
      totalStudents: 23494,
      internationalStudents: 9500,
      studentToFacultyRatio: "12:1",
      clubs: 200,
      sports: ["Skiing", "Hiking", "Soccer", "Swimming", "Climbing", "Rowing"],
      housing: {
        available: true,
        capacity: 5000,
        description: "Limited student housing with priority for international students"
      }
    },
    admissions: {
      acceptanceRate: 27.0,
      applicationDeadline: "April 30",
      requirements: "High school diploma, Entrance exams (for some programs), Language proficiency",
      tuitionFee: {
        domestic: 1460,
        international: 1460,
        currency: "CHF"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Edinburgh",
    shortName: "Edinburgh",
    country: "United Kingdom",
    state: "Scotland",
    city: "Edinburgh",
    type: "University",
    establishedYear: 1583,
    logo: "/images/college-logo-15.jpg",
    coverImage: "/images/college-16.jpg",
    tagline: "The learned can see twice",
    description: "Scotland's premier university and one of the UK's ancient universities, known for research excellence and historic significance.",
    about: `The University of Edinburgh is a public research university founded in 1583, making it the sixth-oldest university in the English-speaking world. Located in Scotland's capital city, Edinburgh combines historic traditions with cutting-edge research and innovation.

Edinburgh has been at the forefront of intellectual achievement for centuries. Alumni and faculty include Charles Darwin, Alexander Graham Bell, David Hume, Adam Smith, and numerous Nobel Prize winners. The university played a crucial role in the Scottish Enlightenment, establishing Edinburgh as a center of learning and culture.

The university comprises three colleges covering humanities and social sciences, science and engineering, and medicine and veterinary medicine. Edinburgh is particularly strong in informatics, where it runs Europe's largest informatics research center, and in artificial intelligence research.

Edinburgh's campus is spread across the historic city, with buildings ranging from medieval architecture to modern facilities. The main George Square campus sits in the heart of the city, while specialized facilities like the Royal Observatory and veterinary school occupy other locations. This integration with the city creates a vibrant urban university experience.

Student life benefits from Edinburgh's status as a UNESCO World Heritage site and cultural capital. The city hosts the world's largest arts festival every August, and students have access to world-class museums, theaters, and music venues. With over 300 student societies and competitive sports programs, Edinburgh offers comprehensive extracurricular opportunities.`,
    mission: "To make a significant, sustainable and socially responsible contribution to Scotland, the UK and the world, promoting health and wellbeing, cultural understanding, and social and economic development.",
    vision: "To be a globally leading university, making a positive impact on the world through research, teaching, and knowledge exchange.",
    website: "https://www.ed.ac.uk",
    email: "admissions@ed.ac.uk",
    phone: "+44-131-650-1000",
    socialMedia: {
      facebook: "https://facebook.com/EdinburghUniversity",
      twitter: "https://twitter.com/EdinburghUni",
      instagram: "https://instagram.com/edinburghuniversity",
      linkedin: "https://linkedin.com/school/university-of-edinburgh"
    },
    campusSize: { value: 350, unit: "acres" },
    departments: ["Informatics", "Medicine", "Engineering", "Business", "Law", "Arts", "Science", "Veterinary Medicine", "Social Sciences", "Divinity"],
    studentLife: {
      totalStudents: 35000,
      internationalStudents: 13000,
      studentToFacultyRatio: "13:1",
      clubs: 300,
      sports: ["Rugby", "Football", "Rowing", "Skiing", "Cricket", "Hockey"],
      housing: {
        available: true,
        capacity: 8000,
        description: "Guaranteed first-year accommodation"
      }
    },
    admissions: {
      acceptanceRate: 40.0,
      applicationDeadline: "January 15",
      requirements: "A-levels/IB, Personal statement, References",
      tuitionFee: {
        domestic: 1820,
        international: 27550,
        currency: "£"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of British Columbia",
    shortName: "UBC",
    country: "Canada",
    state: "British Columbia",
    city: "Vancouver",
    type: "University",
    establishedYear: 1908,
    logo: "/images/college-logo-16.webp",
    coverImage: "/images/college-17.jpg",
    tagline: "Tuum Est (It is yours)",
    description: "Canada's third-largest university, renowned for research excellence and stunning Pacific coastal location.",
    about: `The University of British Columbia is a public research university with campuses in Vancouver and Kelowna, British Columbia. Founded in 1908, UBC has grown to become one of Canada's leading universities and consistently ranks among the top 40 universities worldwide.

UBC's Vancouver campus is situated on a spectacular peninsula surrounded by forest and ocean, offering one of the most beautiful university settings in the world. The 400-hectare campus features beaches, gardens, and forests alongside world-class academic and recreational facilities. This unique setting provides students with opportunities for both rigorous academics and outdoor activities.

The university is particularly strong in sustainability research, Asian studies, forestry, ocean sciences, and biotechnology. UBC houses over 200 research centers and institutes, including the renowned Peter Wall Institute for Advanced Studies and TRIUMF, Canada's national laboratory for particle and nuclear physics.

UBC has produced eight Nobel laureates and 71 Rhodes Scholars. The university's research funding exceeds $600 million annually, supporting groundbreaking work in areas from climate change to Indigenous health. UBC's commitment to Aboriginal reconciliation and Indigenous engagement is reflected in its curriculum and partnerships.

Campus life at UBC is diverse and dynamic, with students from over 160 countries. The university offers over 700 degree programs, more than 400 student clubs, and extensive athletics and recreation facilities. UBC's spirit of innovation extends beyond academics to social entrepreneurship and sustainability initiatives.`,
    mission: "To create an exceptional learning environment that fosters global citizenship, advances a civil and sustainable society, and supports outstanding research.",
    vision: "To be one of the world's best universities, transforming health, society and the environment through excellence in research, learning and engagement.",
    website: "https://www.ubc.ca",
    email: "admissions@ubc.ca",
    phone: "+1-604-822-2211",
    socialMedia: {
      facebook: "https://facebook.com/universityofbc",
      twitter: "https://twitter.com/ubc",
      instagram: "https://instagram.com/universityofbc",
      linkedin: "https://linkedin.com/school/university-of-british-columbia"
    },
    campusSize: { value: 400, unit: "hectares" },
    departments: ["Medicine", "Engineering", "Business", "Forestry", "Science", "Arts", "Law", "Education", "Land and Food Systems", "Applied Science"],
    studentLife: {
      totalStudents: 66000,
      internationalStudents: 17000,
      studentToFacultyRatio: "18:1",
      clubs: 400,
      sports: ["Ice Hockey", "Soccer", "Swimming", "Rowing", "Basketball", "Skiing"],
      housing: {
        available: true,
        capacity: 11000,
        description: "Guaranteed housing for first-year students"
      }
    },
    admissions: {
      acceptanceRate: 52.4,
      applicationDeadline: "January 15",
      requirements: "High school completion, English proficiency, Personal profile",
      tuitionFee: {
        domestic: 5900,
        international: 43000,
        currency: "CAD"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Peking University",
    shortName: "PKU",
    country: "China",
    city: "Beijing",
    type: "University",
    establishedYear: 1898,
    logo: "/images/college-logo-17.png",
    coverImage: "/images/college-18.jpg",
    tagline: "Patriotism, Progress, Democracy, Science",
    description: "China's first national comprehensive university, known as the 'cradle of Chinese democracy and science'.",
    about: `Peking University, commonly abbreviated as PKU and colloquially known as Beida, is a public university in Beijing, China. Established in 1898 as the Imperial University of Peking, it was the first modern national university in China and has played an important role in the country's development.

PKU is consistently ranked as the top university in China and among the best in Asia. The university has been at the center of progressive thought and movements throughout modern Chinese history, including the May Fourth Movement of 1919 and subsequent political and cultural developments.

The university comprises 30 colleges and 12 departments covering humanities, social sciences, natural sciences, and engineering. PKU is particularly renowned for its programs in Chinese literature, mathematics, physics, economics, and law. The university's research output is prolific, with significant contributions to fields ranging from archaeology to quantum computing.

PKU's campus features traditional Chinese architecture alongside modern facilities, creating a unique blend of heritage and innovation. The Weiming Lake and Boya Tower are iconic landmarks, and the campus gardens provide peaceful environments for study and reflection. The university library houses over 11 million volumes.

As China has opened to the world, PKU has established extensive international partnerships and welcomes thousands of international students annually. English-taught programs and summer schools attract students globally, while Chinese language and culture programs help international students engage deeply with China.`,
    mission: "To cultivate high-level talents who combine patriotism with democratic awareness and scientific spirit, and to advance scientific research and cultural inheritance.",
    vision: "To build a world-class university with Chinese characteristics and global influence.",
    website: "https://www.pku.edu.cn",
    email: "admissions@pku.edu.cn",
    phone: "+86-10-6275-1230",
    socialMedia: {
      facebook: "https://facebook.com/pekingu",
      twitter: "https://twitter.com/pku1898",
      instagram: "https://instagram.com/pku1898",
      linkedin: "https://linkedin.com/school/peking-university"
    },
    campusSize: { value: 274, unit: "hectares" },
    departments: ["Mathematics", "Physics", "Chemistry", "Biology", "Chinese Literature", "History", "Philosophy", "Economics", "Law", "International Relations"],
    studentLife: {
      totalStudents: 45000,
      internationalStudents: 7000,
      studentToFacultyRatio: "15:1",
      clubs: 200,
      sports: ["Table Tennis", "Badminton", "Basketball", "Soccer", "Swimming", "Martial Arts"],
      housing: {
        available: true,
        capacity: 20000,
        description: "On-campus dormitories for most students"
      }
    },
    admissions: {
      acceptanceRate: 0.1,
      applicationDeadline: "February",
      requirements: "Gaokao exam (domestic), HSK/TOEFL (international), Interview",
      tuitionFee: {
        domestic: 5000,
        international: 30000,
        currency: "CNY"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Seoul National University",
    shortName: "SNU",
    country: "South Korea",
    city: "Seoul",
    type: "University",
    establishedYear: 1946,
    logo: "/images/college-logo-2.jpg",
    coverImage: "/images/college-19.jpg",
    tagline: "Veritas Lux Mea (Truth is My Light)",
    description: "South Korea's flagship national university, renowned for academic excellence and producing national leaders.",
    about: `Seoul National University is a national research university located in Seoul, South Korea. Founded in 1946, SNU is widely considered the most prestigious university in South Korea and is often compared to the Ivy League universities in the United States.

SNU was established by merging ten institutions of higher education around Seoul, with the first academic programs beginning in 1946. The university has since grown to become Korea's premier research institution, producing more than one-third of Korea's senior executives, judges, and members of parliament.

The university comprises 16 colleges and graduate schools covering comprehensive academic disciplines. SNU is particularly strong in engineering, natural sciences, business, and medicine. The university's research output is substantial, with extensive funding from government and industry supporting cutting-edge research in semiconductors, biotechnology, and artificial intelligence.

SNU's main campus is located at the foot of Gwanak Mountain in southern Seoul, covering over 4.1 million square meters. The campus features modern facilities, research centers, and the university's medical center, one of the largest hospitals in Korea. The beautiful natural setting provides a conducive environment for academic pursuits.

International engagement is a priority, with numerous exchange programs, English-taught courses, and research collaborations with leading universities worldwide. SNU attracts top students from across Asia and globally, creating a diverse and competitive academic environment. The university's alumni network is powerful, with graduates holding influential positions across Korean society and internationally.`,
    mission: "To create and disseminate knowledge for the public good, to foster creativity and innovation, and to develop leaders for Korea and the global community.",
    vision: "To be a world-class university that contributes to humanity through creative research and excellent education.",
    website: "https://www.snu.ac.kr",
    email: "admissions@snu.ac.kr",
    phone: "+82-2-880-5114",
    socialMedia: {
      facebook: "https://facebook.com/snukr",
      twitter: "https://twitter.com/snunow",
      instagram: "https://instagram.com/snuofficial",
      linkedin: "https://linkedin.com/school/seoul-national-university"
    },
    campusSize: { value: 410, unit: "hectares" },
    departments: ["Engineering", "Natural Sciences", "Business", "Medicine", "Law", "Liberal Arts", "Social Sciences", "Agriculture", "Nursing", "Pharmacy"],
    studentLife: {
      totalStudents: 28000,
      internationalStudents: 3500,
      studentToFacultyRatio: "12:1",
      clubs: 350,
      sports: ["Taekwondo", "Baseball", "Soccer", "Basketball", "E-sports", "Rowing"],
      housing: {
        available: true,
        capacity: 6500,
        description: "Limited on-campus housing, priority for international and first-year students"
      }
    },
    admissions: {
      acceptanceRate: 16.0,
      applicationDeadline: "September (Fall), April (Spring)",
      requirements: "CSAT (Suneung) for domestic, TOPIK/TOEFL for international, Interviews",
      tuitionFee: {
        domestic: 4000000,
        international: 6000000,
        currency: "KRW"
      }
    },
    isActive: true,
    isOnWaitlist: false
  },
  // 100 Small Tier Colleges
  {
    name: "Arizona State University",
    shortName: "ASU",
    country: "USA",
    state: "Arizona",
    city: "Tempe",
    type: "University",
    establishedYear: 1885,
    logo: "/images/college-logo-3.png",
    coverImage: "/images/college-2.webp",
    tagline: "Innovation for Tomorrow",
    description: "A public research university known for innovation and accessibility.",
    about: "Arizona State University is one of the largest public universities in the United States, known for its innovative approach to education and research.",
    mission: "To provide accessible, excellent education and advance research.",
    vision: "To be a leader in innovation and inclusive excellence.",
    website: "https://www.asu.edu",
    email: "admissions@asu.edu",
    phone: "+1-480-965-9011",
    socialMedia: { facebook: "https://facebook.com/asu", twitter: "https://twitter.com/asu", instagram: "https://instagram.com/arizonastateuniversity", linkedin: "https://linkedin.com/school/asu" },
    campusSize: { value: 660, unit: "acres" },
    departments: ["Business", "Engineering", "Arts", "Science", "Education"],
    studentLife: { totalStudents: 77000, internationalStudents: 8500, studentToFacultyRatio: "19:1", clubs: 1100, sports: ["Football", "Basketball"], housing: { available: true, capacity: 15000, description: "Multiple residence halls" } },
    admissions: { acceptanceRate: 88.0, applicationDeadline: "February 1", requirements: "High school diploma, GPA", tuitionFee: { domestic: 11338, international: 29438, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Florida",
    shortName: "UF",
    country: "USA",
    state: "Florida",
    city: "Gainesville",
    type: "University",
    establishedYear: 1853,
    logo: "/images/college-logo-6.png",
    coverImage: "/images/college-3.webp",
    tagline: "Go Gators",
    description: "A top-ranked public research university in Florida.",
    about: "The University of Florida is a leading public research institution with strong programs across multiple disciplines.",
    mission: "To enable our students to lead and inspire.",
    vision: "To be a premier university that the state, nation and world look to for leadership.",
    website: "https://www.ufl.edu",
    email: "admissions@ufl.edu",
    phone: "+1-352-392-3261",
    socialMedia: { facebook: "https://facebook.com/uflorida", twitter: "https://twitter.com/UF", instagram: "https://instagram.com/uflorida", linkedin: "https://linkedin.com/school/uf" },
    campusSize: { value: 2000, unit: "acres" },
    departments: ["Medicine", "Law", "Engineering", "Business", "Agriculture"],
    studentLife: { totalStudents: 56000, internationalStudents: 7200, studentToFacultyRatio: "17:1", clubs: 950, sports: ["Football", "Basketball", "Swimming"], housing: { available: true, capacity: 11000, description: "On-campus housing available" } },
    admissions: { acceptanceRate: 31.0, applicationDeadline: "November 1", requirements: "SAT/ACT, Essays", tuitionFee: { domestic: 6380, international: 28658, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Washington",
    shortName: "UW",
    country: "USA",
    state: "Washington",
    city: "Seattle",
    type: "University",
    establishedYear: 1861,
    logo: "/images/college-logo-7.png",
    coverImage: "/images/college-4.jpg",
    tagline: "Lux Sit",
    description: "A premier public research university in the Pacific Northwest.",
    about: "The University of Washington is renowned for its research output and beautiful campus in Seattle.",
    mission: "To educate leaders and advance human knowledge.",
    vision: "To reach new heights in teaching, research, and service.",
    website: "https://www.washington.edu",
    email: "admissions@uw.edu",
    phone: "+1-206-543-2100",
    socialMedia: { facebook: "https://facebook.com/uw", twitter: "https://twitter.com/UW", instagram: "https://instagram.com/uw", linkedin: "https://linkedin.com/school/uw" },
    campusSize: { value: 703, unit: "acres" },
    departments: ["Computer Science", "Medicine", "Engineering", "Business", "Public Health"],
    studentLife: { totalStudents: 48000, internationalStudents: 6500, studentToFacultyRatio: "21:1", clubs: 950, sports: ["Football", "Rowing"], housing: { available: true, capacity: 10000, description: "Campus residences" } },
    admissions: { acceptanceRate: 52.0, applicationDeadline: "November 15", requirements: "Transcripts, Essays", tuitionFee: { domestic: 11465, international: 39461, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Georgia Institute of Technology",
    shortName: "Georgia Tech",
    country: "USA",
    state: "Georgia",
    city: "Atlanta",
    type: "University",
    establishedYear: 1885,
    logo: "/images/college-logo-8.webp",
    coverImage: "/images/college-5.webp",
    tagline: "Progress and Service",
    description: "A leading technology and research university.",
    about: "Georgia Tech is one of the nation's top research universities, distinguished by its commitment to improving the human condition through advanced science and technology.",
    mission: "To develop leaders who advance technology and improve the human condition.",
    vision: "To define the technological research university of the 21st century.",
    website: "https://www.gatech.edu",
    email: "admissions@gatech.edu",
    phone: "+1-404-894-2000",
    socialMedia: { facebook: "https://facebook.com/georgiatech", twitter: "https://twitter.com/GeorgiaTech", instagram: "https://instagram.com/georgiatech", linkedin: "https://linkedin.com/school/gatech" },
    campusSize: { value: 400, unit: "acres" },
    departments: ["Engineering", "Computing", "Sciences", "Business", "Design"],
    studentLife: { totalStudents: 36000, internationalStudents: 5400, studentToFacultyRatio: "18:1", clubs: 500, sports: ["Football", "Basketball"], housing: { available: true, capacity: 9000, description: "On-campus housing" } },
    admissions: { acceptanceRate: 21.0, applicationDeadline: "January 1", requirements: "SAT/ACT, Essays, Recommendations", tuitionFee: { domestic: 12682, international: 33794, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Illinois Urbana-Champaign",
    shortName: "UIUC",
    country: "USA",
    state: "Illinois",
    city: "Champaign",
    type: "University",
    establishedYear: 1867,
    logo: "/images/college-logo-9.png",
    coverImage: "/images/college-6.jpeg",
    tagline: "Learning and Labor",
    description: "A world-class public research university.",
    about: "The University of Illinois Urbana-Champaign is a world leader in research, teaching and public engagement.",
    mission: "To transform lives and serve society.",
    vision: "To be the preeminent public research university with a land-grant mission.",
    website: "https://illinois.edu",
    email: "admissions@illinois.edu",
    phone: "+1-217-333-1000",
    socialMedia: { facebook: "https://facebook.com/uiuc", twitter: "https://twitter.com/Illinois_Alma", instagram: "https://instagram.com/illinois1867", linkedin: "https://linkedin.com/school/uiuc" },
    campusSize: { value: 1783, unit: "acres" },
    departments: ["Engineering", "Computer Science", "Business", "Agriculture", "Liberal Arts"],
    studentLife: { totalStudents: 52000, internationalStudents: 10000, studentToFacultyRatio: "20:1", clubs: 1600, sports: ["Football", "Basketball"], housing: { available: true, capacity: 11000, description: "Multiple residence halls" } },
    admissions: { acceptanceRate: 60.0, applicationDeadline: "January 5", requirements: "SAT/ACT, Transcripts", tuitionFee: { domestic: 16866, international: 34316, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Texas at Austin",
    shortName: "UT Austin",
    country: "USA",
    state: "Texas",
    city: "Austin",
    type: "University",
    establishedYear: 1883,
    logo: "/images/college-logo-10.webp",
    coverImage: "/images/college-7.jpeg",
    tagline: "What starts here changes the world",
    description: "Texas's flagship public university.",
    about: "UT Austin is a major center for research and one of the largest universities in the nation.",
    mission: "To achieve excellence in education, research, and public service.",
    vision: "To transform lives for the benefit of society.",
    website: "https://www.utexas.edu",
    email: "admissions@utexas.edu",
    phone: "+1-512-471-3434",
    socialMedia: { facebook: "https://facebook.com/utaustin", twitter: "https://twitter.com/UTAustin", instagram: "https://instagram.com/utaustin", linkedin: "https://linkedin.com/school/utaustin" },
    campusSize: { value: 437, unit: "acres" },
    departments: ["Engineering", "Business", "Liberal Arts", "Natural Sciences", "Communication"],
    studentLife: { totalStudents: 51000, internationalStudents: 5200, studentToFacultyRatio: "18:1", clubs: 1300, sports: ["Football", "Basketball"], housing: { available: true, capacity: 7100, description: "On-campus dorms" } },
    admissions: { acceptanceRate: 32.0, applicationDeadline: "December 1", requirements: "SAT/ACT, Essays", tuitionFee: { domestic: 11448, international: 40032, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Pennsylvania State University",
    shortName: "Penn State",
    country: "USA",
    state: "Pennsylvania",
    city: "University Park",
    type: "University",
    establishedYear: 1855,
    logo: "/images/college-logo-11.png",
    coverImage: "/images/college-8.jpeg",
    tagline: "Making Life Better",
    description: "A leading public research university.",
    about: "Penn State is a major research university serving Pennsylvania and the global community.",
    mission: "To create, preserve, and disseminate knowledge.",
    vision: "To be a leading public university with a global reach.",
    website: "https://www.psu.edu",
    email: "admissions@psu.edu",
    phone: "+1-814-865-4700",
    socialMedia: { facebook: "https://facebook.com/pennstate", twitter: "https://twitter.com/penn_state", instagram: "https://instagram.com/pennstate", linkedin: "https://linkedin.com/school/penn-state-university" },
    campusSize: { value: 8556, unit: "acres" },
    departments: ["Engineering", "Business", "Agriculture", "Science", "Liberal Arts"],
    studentLife: { totalStudents: 46000, internationalStudents: 6500, studentToFacultyRatio: "16:1", clubs: 1000, sports: ["Football", "Wrestling"], housing: { available: true, capacity: 14000, description: "Multiple residence halls" } },
    admissions: { acceptanceRate: 55.0, applicationDeadline: "November 30", requirements: "SAT/ACT, Transcripts", tuitionFee: { domestic: 18454, international: 36476, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "Ohio State University",
    shortName: "OSU",
    country: "USA",
    state: "Ohio",
    city: "Columbus",
    type: "University",
    establishedYear: 1870,
    logo: "/images/college-logo-12.png",
    coverImage: "/images/college-9.webp",
    tagline: "Education for Citizenship",
    description: "One of America's largest university campuses.",
    about: "Ohio State is a world-class public research university and a leading American institution.",
    mission: "To educate students for a diverse society and economy.",
    vision: "To be a model 21st century public, land grant, research, urban university.",
    website: "https://www.osu.edu",
    email: "admissions@osu.edu",
    phone: "+1-614-292-6446",
    socialMedia: { facebook: "https://facebook.com/osu", twitter: "https://twitter.com/OhioState", instagram: "https://instagram.com/theohiostateuniversity", linkedin: "https://linkedin.com/school/ohio-state-university" },
    campusSize: { value: 1665, unit: "acres" },
    departments: ["Engineering", "Business", "Medicine", "Agriculture", "Arts and Sciences"],
    studentLife: { totalStudents: 61000, internationalStudents: 6900, studentToFacultyRatio: "19:1", clubs: 1400, sports: ["Football", "Basketball"], housing: { available: true, capacity: 13000, description: "Residence halls" } },
    admissions: { acceptanceRate: 57.0, applicationDeadline: "February 1", requirements: "SAT/ACT, Essays", tuitionFee: { domestic: 11936, international: 35019, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of Wisconsin-Madison",
    shortName: "UW-Madison",
    country: "USA",
    state: "Wisconsin",
    city: "Madison",
    type: "University",
    establishedYear: 1848,
    logo: "/images/college-logo-13.jpeg",
    coverImage: "/images/college-10.jpg",
    tagline: "Forward",
    description: "A leading public research university.",
    about: "UW-Madison is a world-renowned public research university with a strong tradition of inquiry and collaboration.",
    mission: "To create, integrate, transfer and apply knowledge.",
    vision: "To be a premier research university.",
    website: "https://www.wisc.edu",
    email: "admissions@wisc.edu",
    phone: "+1-608-262-1234",
    socialMedia: { facebook: "https://facebook.com/uwmadison", twitter: "https://twitter.com/UWMadison", instagram: "https://instagram.com/uwmadison", linkedin: "https://linkedin.com/school/uwmadison" },
    campusSize: { value: 933, unit: "acres" },
    departments: ["Engineering", "Letters and Science", "Agriculture", "Business", "Education"],
    studentLife: { totalStudents: 44000, internationalStudents: 4600, studentToFacultyRatio: "17:1", clubs: 900, sports: ["Football", "Hockey"], housing: { available: true, capacity: 8500, description: "Campus housing" } },
    admissions: { acceptanceRate: 54.0, applicationDeadline: "February 1", requirements: "SAT/ACT, Essays", tuitionFee: { domestic: 10720, international: 38608, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  },
  {
    name: "University of North Carolina at Chapel Hill",
    shortName: "UNC",
    country: "USA",
    state: "North Carolina",
    city: "Chapel Hill",
    type: "University",
    establishedYear: 1789,
    logo: "/images/college-logo-14.png",
    coverImage: "/images/college-11.jpeg",
    tagline: "Lux Libertas",
    description: "America's first public university.",
    about: "UNC-Chapel Hill is the nation's first public university and a leader in research and education.",
    mission: "To serve as a center for research, scholarship, and creativity.",
    vision: "To be a light to lead the way for all public universities.",
    website: "https://www.unc.edu",
    email: "admissions@unc.edu",
    phone: "+1-919-962-2211",
    socialMedia: { facebook: "https://facebook.com/unc", twitter: "https://twitter.com/UNC", instagram: "https://instagram.com/uncchapelhill", linkedin: "https://linkedin.com/school/unc" },
    campusSize: { value: 729, unit: "acres" },
    departments: ["Arts and Sciences", "Medicine", "Business", "Education", "Public Health"],
    studentLife: { totalStudents: 30000, internationalStudents: 1200, studentToFacultyRatio: "13:1", clubs: 800, sports: ["Basketball", "Football"], housing: { available: true, capacity: 9000, description: "Residence halls" } },
    admissions: { acceptanceRate: 22.0, applicationDeadline: "January 15", requirements: "SAT/ACT, Essays", tuitionFee: { domestic: 9018, international: 36776, currency: "$" } },
    isActive: true,
    isOnWaitlist: false
  }
];

// Helper function to generate remaining 90 colleges
const generateSmallTierColleges = () => {
  const colleges = [];
  const names = [
    "State University", "Tech University", "College of Arts", "Institute of Technology", 
    "Community College", "Regional University", "College of Science", "Metropolitan University",
    "Valley College", "Highland University", "Coastal University", "Prairie College",
    "Mountain State University", "River Valley College", "Central University", "Northern College",
    "Southern Institute", "Eastern University", "Western College", "Midland University"
  ];
  
  const states = [
    { state: "California", city: "Sacramento" }, { state: "New York", city: "Albany" },
    { state: "Texas", city: "Dallas" }, { state: "Florida", city: "Miami" },
    { state: "Michigan", city: "Detroit" }, { state: "Georgia", city: "Atlanta" },
    { state: "Virginia", city: "Richmond" }, { state: "Massachusetts", city: "Boston" },
    { state: "Oregon", city: "Portland" }, { state: "Colorado", city: "Denver" }
  ];
  
  const countries = [
    { country: "USA", states: states },
    { country: "Canada", states: [{ state: "Ontario", city: "Toronto" }, { state: "Quebec", city: "Montreal" }] },
    { country: "Australia", states: [{ state: "NSW", city: "Sydney" }, { state: "Victoria", city: "Melbourne" }] },
    { country: "UK", states: [{ state: "England", city: "London" }, { state: "Scotland", city: "Glasgow" }] }
  ];
  
  const logos = Array.from({length: 17}, (_, i) => `/images/college-logo-${i + 1}.${i < 3 ? 'webp' : i < 10 ? 'png' : 'jpg'}`);
  const covers = Array.from({length: 19}, (_, i) => `/images/college-${i + 1}.${i % 3 === 0 ? 'jpg' : i % 3 === 1 ? 'webp' : 'jpeg'}`);
  
  for (let i = 0; i < 90; i++) {
    const location = countries[i % countries.length];
    const stateInfo = location.states[Math.floor(i / 4) % location.states.length];
    const baseName = names[i % names.length];
    const year = 1850 + (i % 150);
    
    colleges.push({
      name: `${stateInfo.city} ${baseName}`,
      shortName: `${stateInfo.city.substring(0, 3).toUpperCase()}`,
      country: location.country,
      state: stateInfo.state,
      city: stateInfo.city,
      type: i % 3 === 0 ? "College" : "University",
      establishedYear: year,
      logo: logos[i % logos.length],
      coverImage: covers[i % covers.length],
      tagline: "Excellence in Education",
      description: `A ${location.country} institution focused on quality education and student success.`,
      about: `${stateInfo.city} ${baseName} is committed to providing accessible, high-quality education to students.`,
      mission: "To provide quality education and foster student success.",
      vision: "To be a leading educational institution in the region.",
      website: `https://www.${stateInfo.city.toLowerCase().replace(/\s/g, '')}${baseName.toLowerCase().replace(/\s/g, '')}.edu`,
      email: `admissions@${stateInfo.city.toLowerCase().replace(/\s/g, '')}uni.edu`,
      phone: `+${i % 2 === 0 ? '1' : '44'}-${200 + i}-${100 + i}-${1000 + i}`,
      socialMedia: {
        facebook: `https://facebook.com/${stateInfo.city.toLowerCase()}uni`,
        twitter: `https://twitter.com/${stateInfo.city.toLowerCase()}uni`,
        instagram: `https://instagram.com/${stateInfo.city.toLowerCase()}uni`,
        linkedin: `https://linkedin.com/school/${stateInfo.city.toLowerCase()}-university`
      },
      campusSize: { value: 100 + (i * 10), unit: "acres" },
      departments: ["Business", "Engineering", "Arts", "Science", "Education"].slice(0, 3 + (i % 3)),
      studentLife: {
        totalStudents: 5000 + (i * 500),
        internationalStudents: 200 + (i * 20),
        studentToFacultyRatio: `${15 + (i % 10)}:1`,
        clubs: 50 + (i * 5),
        sports: ["Soccer", "Basketball", "Swimming"].slice(0, 2 + (i % 2)),
        housing: {
          available: true,
          capacity: 1000 + (i * 100),
          description: "Campus housing available"
        }
      },
      admissions: {
        acceptanceRate: 50.0 + (i % 40),
        applicationDeadline: i % 2 === 0 ? "February 1" : "March 15",
        requirements: "High school diploma, Transcripts",
        tuitionFee: {
          domestic: 8000 + (i * 200),
          international: 15000 + (i * 300),
          currency: location.country === "USA" ? "$" : location.country === "UK" ? "£" : location.country === "Canada" ? "CAD" : "AUD"
        }
      },
      isActive: true,
      isOnWaitlist: false
    });
  }
  
  return colleges;
};

const allColleges = [...colleges, ...generateSmallTierColleges()];

// Function to seed database
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert only colleges that don't already exist
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const college of allColleges) {
      const exists = await College.findOne({ name: college.name });
      if (!exists) {
        await College.create(college);
        addedCount++;
        console.log(`Added: ${college.name}`);
      } else {
        skippedCount++;
        console.log(`Skipped (already exists): ${college.name}`);
      }
    }
    
    console.log(`\nSummary: Added ${addedCount} colleges, Skipped ${skippedCount} colleges (Total in seed: ${allColleges.length})`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
