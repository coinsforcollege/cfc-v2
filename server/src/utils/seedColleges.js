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
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert only colleges that don't already exist
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const college of colleges) {
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
    
    console.log(`\nSummary: Added ${addedCount} colleges, Skipped ${skippedCount} colleges`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
