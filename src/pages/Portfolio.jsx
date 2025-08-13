import React, { useEffect, useRef,useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FiExternalLink, FiGithub, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi';

// Animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.6, 0.01, 0, 0.95]
    } 
  }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const convertVideoLink = (url) => {
  if (!url) return ''; 
  
  
  if (url.includes('youtu.be') || url.includes('youtube.com')) {
    const youtubeId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1];
    return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : url;
  }

  if (url.includes('drive.google.com')) {
    const fileId = url.match(/\/d\/([^\/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
  }

  return url;
};


const projects = [
  {
    title: "IPTV Sales Platform",
    description: "A high-performance e-commerce solution for IPTV services featuring dynamic package customization, real-time streaming previews, and secure payment processing. Implemented advanced user analytics to track viewing preferences and optimize sales funnels.",
    tech: ["React", 'tailwind css'],
    align: "right",
    video: convertVideoLink("https://youtu.be/5AU0WgN45iQ"),
    poster: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=675&fit=crop&q=80",
    github: "#",
    live: "https://iptv-platform.com"
  },
  {
    title: "Enterprise Attendance System",
    description: "Comprehensive workforce management solution with facial recognition check-in, geofencing, and real-time reporting dashboard. Integrated with HR systems for automated leave management and payroll processing.",
    tech: ["laravel", 'tailwind css'],
    align: "left",
    video: convertVideoLink("https://youtu.be/IEMdel6zbIo"),
    poster: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=675&fit=crop&q=80",
    caseStudy: "/case-studies/attendance-system"
  },
  {
    title: "Reclamation Platform",
    description: "A web platform for managing complaints (reclamations) where users can create accounts, submit complaints with titles, descriptions, and images. Features real-time status tracking and admin response system with announcement publishing capabilities.",
    tech: ["laravel", 'tailwind css','reacte'],
    align: "right",
    video: convertVideoLink("https://youtu.be/1Q2GmEYBG58"),
    poster: "https://communemohammedia.com/wp-content/uploads/2024/06/53664054_2090133467701319_140868583642103808_n-1024x1024-1.png",
    github: "#",
    live: "https://ailearn.tech"
  },
  {
    title: "AI-Powered Learning Platform",
    description: "Next-generation e-learning ecosystem with personalized learning paths, AI-driven content recommendations, and interactive coding environments. Features live collaboration tools and automated assessment grading.",
    tech: ["laravel", 'tailwind css'],
    align: "left",
    video: convertVideoLink("https://youtu.be/qREm1ZPOTG0"),
    poster: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=675&fit=crop&q=80",
    github: "#",
    live: "https://ailearn.tech"
  },
  {
    title: "Quranic Explorer Pro",
    description: "Immersive Quran study application with advanced features including word-by-word translation and thematic search.",
    tech: ['html','css','javascipt'],
    align: "left",
      image: "data:image/jpeg;base64,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",
    live: "https://quran-sorah.vercel.app/",
    featured: true
  }
];
const technologies = [
  { name: "React", icon: "react.svg", mastery: 95 },
  { name: "javascript", icon: "typescript.svg", mastery: 90 },
  { name: "Node.js", icon: "nodejs.svg", mastery: 88 },
  { name: "Sql", icon: "graphql.svg", mastery: 85 },
  { name: "laravel", icon: "aws.svg", mastery: 80 },
  { name: "Docker", icon: "docker.svg", mastery: 85 }
];

const Portfolio = () => {
  const [loadingStates, setLoadingStates] = useState(
    projects.map(() => true)
  );
  
  const handleLoaded = (index) => {
    setLoadingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const formRef = useRef();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -75]);

  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await emailjs.sendForm(
        'service_wf3qhka',
        'template_rhfda5n',
        formRef.current,
        'EEdwl-g1lAOSWVwX7'
      );
      setSubmitStatus('success');
      setFormData({ from_name: '', from_email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadVideos = () => {
      document.querySelectorAll('video[data-src]').forEach(video => {
        video.src = video.getAttribute('data-src');
        video.removeAttribute('data-src');
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideos();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.video-container').forEach(container => {
      observer.observe(container);
    });

    return () => observer.disconnect();
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter antialiased selection:bg-blue-500/20 overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        :root {
          --primary-gradient: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          --secondary-gradient: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
          --glass-bg: rgba(255, 255, 255, 0.05);
          --glass-border: rgba(255, 255, 255, 0.1);
          --glow-blue: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        * {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .glassmorphic {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
        }

        .glow-hover:hover {
          box-shadow: var(--glow-blue);
        }

        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.5);
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 9999px;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 -z-10 opacity-10 pointer-events-none"
        style={{ y: y1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-900/20 blur-3xl animate-[float_12s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-cyan-900/15 blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
      </motion.div>

      {/* Navigation */}
          <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full bg-gray-950/90 backdrop-blur-xl z-[9999] border-b border-gray-800/30 glassmorphic"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.a
          href="#"
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center"
        >
          <span className="mr-2">WR</span>
          <span className="text-xs font-mono text-blue-300 hidden sm:inline">
            / Portfolio
          </span>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {["About", "Expertise", "Projects", "Contact"].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ y: -3, color: "#3b82f6" }}
              className="text-gray-200 hover:text-blue-400 transition-all duration-300 font-medium relative group"
            >
              <span className="font-mono text-blue-300 text-xs mr-2">
                0{index + 1}.
              </span>
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}
          <motion.a
            href="/resume.pdf"
            target="_blank"
            whileHover={{ y: -3 }}
            className="ml-6 px-4 py-2 border border-blue-400/30 text-blue-300 rounded-lg text-sm font-mono hover:bg-blue-900/10 transition-all duration-300 glassmorphic glow-hover"
          >
            Resume
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-800/30 transition-colors"
        >
          <svg
            className="h-6 w-6 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800/30 px-6 py-4 space-y-4">
          {["About", "Expertise", "Projects", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-gray-200 hover:text-blue-400 transition-all duration-300 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            className="block px-4 py-2 border border-blue-400/30 text-blue-300 rounded-lg text-sm font-mono hover:bg-blue-900/10 transition-all duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Resume
          </a>
        </div>
      )}
    </motion.nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="pt-36 pb-24 md:pt-56 md:pb-36 container mx-auto px-6 relative overflow-hidden"
      >
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl relative z-10"
        >
          <motion.div 
            variants={fadeIn}
            className="mb-8 flex items-center"
          >
            <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 mr-4"></div>
            <span className="text-blue-300 font-mono text-sm tracking-wide">Hi, my name is</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
          >
            <span className="block bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">Oualid Rouihi.</span>
            <span className="block bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-3">
              Architecting Digital Futures.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-xl text-gray-300 mb-12 max-w-3xl leading-relaxed"
          >
            I specialize in crafting <span className="text-blue-300">high-performance</span>, scalable web applications with cutting-edge technologies. Leading digital innovation , I transform visions into reality for startups and enterprises alike.
          </motion.p>
          
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a 
              href="#contact"
              whileHover={{ scale: 1.03, boxShadow: 'var(--glow-blue)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 glassmorphic"
            >
              Start a Project
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a 
              href="#projects"
              whileHover={{ scale: 1.03, boxShadow: 'var(--glow-blue)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-gray-700/50 hover:bg-gray-800/20 rounded-xl font-medium text-gray-200 transition-all duration-300 hover:border-blue-400/30 flex items-center justify-center gap-2 glassmorphic"
            >
              Explore Case Studies
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-br from-blue-900/15 to-cyan-900/10 rounded-full blur-3xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        />
      </section>

      {/* About Section */}
      <section 
        id="about" 
        ref={aboutRef}
        className="py-32 scroll-mt-20 relative"
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row gap-16 items-start"
          >
            <div className="lg:w-1/2">
              <motion.h2 
                variants={slideUp}
                className="text-4xl font-bold mb-10 flex items-center"
              >
                <span className="text-blue-300 font-mono mr-4">01.</span>
                About Me
                <span className="hidden md:block ml-6 w-32 h-0.5 bg-gray-800/50"></span>
              </motion.h2>
              
              <motion.div 
                variants={staggerContainer}
                className="space-y-6"
              >
<motion.p 
            variants={slideUp}
            className="text-gray-300 leading-relaxed text-lg"
          >
            I'm a passionate <span className="text-blue-300 font-medium">Full-Stack Developer</span> with 3 years of experience building dynamic and scalable web applications. Holding a diploma in développement digital option web full stack, I specialize in creating user-centric solutions that blend performance, functionality, and modern design.
          </motion.p>
          
         
          <motion.p 
            variants={slideUp}
            className="text-gray-300 leading-relaxed text-lg"
          >
            From crafting responsive interfaces to optimizing server-side logic, I thrive on solving complex challenges with clean, efficient code. When I'm not coding, I’m exploring new tech trends, contributing to open-source communities, or mentoring aspiring developers to inspire the next generation of innovators.
          </motion.p>
                
                <motion.div 
                  variants={slideUp}
                  className="pt-6"
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">Core Competencies:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      "System Architecture",
                      "Performance Optimization",
                      "Cloud Infrastructure",
                      "CI/CD Pipelines",
                      "Technical Leadership",
                      "UX Engineering"
                    ].map((skill) => (
                      <div key={skill} className="flex items-start">
                        <svg className="w-4 h-4 text-blue-300 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-200 text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-md mx-auto"
              >
                <div className="absolute inset-0 border-2 border-blue-400/20 rounded-xl translate-x-6 translate-y-6 z-0 glassmorphic"></div>
                <div className="relative bg-gray-900/50 rounded-xl overflow-hidden group z-10 h-[480px] glassmorphic glow-hover">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                    alt="Walid Rouihi" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                    <div className="glassmorphic p-4 rounded-lg border border-gray-800/30">
                      <h4 className="font-bold text-lg mb-1 text-gray-100">Currently Working On</h4>
                      <p className="text-gray-300 text-sm">Building an AI-powered code review system that reduces bugs by 40%</p>
                      <div className="mt-3 pt-3 border-t border-gray-800/30 flex items-center justify-between">
                        <span className="text-xs font-mono text-blue-300">InnovateTech Labs</span>
                        <span className="text-xs text-gray-400">Remote</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-gray-900/80 border border-gray-800/30 rounded-full p-3 shadow-lg z-20 glassmorphic"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                </motion.div>
                
                <motion.div 
                  className="absolute -top-6 -right-6 bg-gray-900/80 border border-gray-800/30 rounded-full p-3 shadow-lg z-20 glassmorphic"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-32 bg-gradient-to-b from-gray-900/30 to-gray-950 scroll-mt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/grid-pattern.svg')] bg-repeat"></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl font-bold mb-16 flex items-center"
          >
            <span className="text-blue-300 font-mono mr-4">02.</span>
            Technical Expertise
            <span className="hidden md:block ml-6 w-32 h-0.5 bg-gray-800/50"></span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <h3 className="text-xl font-semibold mb-8 text-blue-300">Technologies I Master</h3>
              
              <div className="space-y-6">
                {technologies.map((tech, index) => (
                  <motion.div 
                    key={tech.name}
                    variants={slideUp}
                    className="glassmorphic p-4 rounded-lg border border-gray-800/30 hover:border-blue-400/20 transition-all duration-300 glow-hover"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        
                        <span className="font-medium text-gray-100">{tech.name}</span>
                      </div>
                      <span className="text-xs font-mono text-blue-300">{tech.mastery}%</span>
                    </div>
                    <div className="w-full bg-gray-800/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${tech.mastery}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <h3 className="text-xl font-semibold mb-8 text-cyan-300">Development Approach</h3>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Architecture First",
                    description: "Designing scalable system architectures to ensure long-term maintainability and performance.",
                    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  },
                  {
                    title: "Data-Driven Decisions",
                    description: "Leveraging analytics and A/B testing to prioritize development and validate feature impact.",
                    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  },
                  {
                    title: "Security by Design",
                    description: "Embedding security best practices across infrastructure and application layers.",
                    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={slideUp}
                    className="glassmorphic p-5 rounded-lg border border-gray-800/30 hover:border-cyan-400/20 transition-all duration-300 group glow-hover"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-900/20 group-hover:bg-cyan-900/20 p-2 rounded-lg mr-4 border border-blue-800/20 group-hover:border-cyan-800/20 transition-all duration-300">
                        <svg className="w-6 h-6 text-blue-300 group-hover:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-100 mb-1">{item.title}</h4>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      
      <section
      id="projects"
      className="py-32 scroll-mt-20 relative bg-gradient-to-b from-neutral-950 to-neutral-900"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-blue-300 font-mono text-sm mb-4 block">03.</span>
          <h2 className="text-4xl font-bold mb-6 text-neutral-100 flex items-center justify-center">
            Featured Projects
            <span className="hidden md:block ml-6 w-32 h-0.5 bg-gray-800/50"></span>
          </h2>
        </div>

        <div className="space-y-32">
          {projects.map((project, index) => {
            const videoUrl = convertVideoLink(project.video);

            const isYoutubeOrDrive =
              videoUrl.includes("youtube.com/embed") ||
              videoUrl.includes("drive.google.com");

            return (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-8 items-center group ${
                  index % 2 !== 0 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div
                  className={`relative rounded-xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 ${
                    project.featured ? "ring-2 ring-blue-400/30" : ""
                  }`}
                >
                  {project.video ? (
                    <div className="video-container aspect-video bg-gray-900 relative">
                      {isYoutubeOrDrive ? (
                        <>
                          <iframe
                            src={videoUrl}
                            title={project.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full object-cover relative z-10"
                            loading="lazy"
                            onLoad={() => handleLoaded(index)}
                            onError={() => handleLoaded(index)}
                          />
                          {loadingStates[index] && (
                            <div className="loading-overlay absolute inset-0 flex items-center justify-center bg-gray-900/90 z-20">
                              <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse mb-3">
                                  <svg
                                    className="w-8 h-8 text-blue-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-gray-400 text-sm">
                                  Loading video...
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <video
                          controls
                          muted
                          playsInline
                          preload="metadata"
                          poster={project.poster}
                          className="w-full h-full object-cover relative z-10"
                          onLoadedData={() => handleLoaded(index)}
                          onError={() => handleLoaded(index)}
                        >
                          <source src={videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ) : (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 group-hover:scale-105 transition-transform duration-500"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </a>
                  )}
                </div>

                <div
                  className={`relative z-10 ${
                    project.align === "right" ? "md:text-right" : "md:text-left"
                  }`}
                >
                  {project.featured && (
                    <span className="absolute -top-8 left-0 md:left-auto md:right-0 text-xs font-mono px-3 py-1 bg-blue-900/20 text-blue-300 rounded-full border border-blue-800/20">
                      Featured Project
                    </span>
                  )}

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-100 hover:text-blue-300 transition-colors duration-200">
                    {project.live ? (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline decoration-blue-400/30 decoration-2 underline-offset-4"
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>

                  <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-6 border border-gray-800/30 hover:border-blue-400/20 transition-all duration-500">
                    <p className="text-gray-300 text-base leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div
                    className={`flex flex-wrap gap-3 mb-6 ${
                      project.align === "right" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {project.tech.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-xs px-3 py-1 bg-gray-800/30 text-gray-200 rounded-full border border-gray-700/50 hover:bg-blue-900/20 hover:text-blue-300 hover:border-blue-400/20 transition-all duration-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`flex gap-4 ${
                      project.align === "right" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {project.github && project.github !== "#" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-300 transition-colors duration-300 hover:-translate-y-1"
                        aria-label="GitHub repository"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-300 transition-all duration-300 flex items-center gap-1 text-sm hover:-translate-y-1"
                      >
                        <span>Live Demo</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                    {project.caseStudy && (
                      <a
                        href={project.caseStudy}
                        className="text-gray-400 hover:text-cyan-300 transition-all duration-300 flex items-center gap-1 text-sm hover:-translate-y-1"
                      >
                        <span>Case Study</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <a
            href="/projects"
            className="inline-flex items-center px-6 py-3 border border-gray-700/50 hover:border-blue-400/30 rounded-lg font-medium text-gray-200 transition-all duration-300 hover:bg-gray-900/20 gap-2 hover:scale-105"
          >
            View All Projects
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  
{/* Testimonials Section */}
<section className="py-20 bg-gradient-to-b from-neutral-900/50 to-neutral-950 scroll-mt-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl font-bold mb-16 text-center"
          >
            <span className="text-blue-400 font-mono mr-2">04.</span>
            Client Testimonials
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {[
              {
                quote: "Walid transformed our e-commerce platform, resulting in a 150% increase in conversion rates. His attention to detail and technical expertise are unmatched.",
                author: "Sarah Johnson",
                role: "CEO, TechSolutions Inc.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "The system Walid architected handles our 10,000+ daily users with zero downtime. His solutions are not just functional but future-proof.",
                author: "Michael Chen",
                role: "CTO, StartupHub",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                className="bg-neutral-900/50 backdrop-blur-sm p-8 rounded-xl border border-neutral-800/50 hover:border-blue-400/30 transition-colors duration-300"
              >
                <svg className="w-8 h-8 text-blue-400 mb-6 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-neutral-300 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-blue-400/30"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-neutral-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    
      {/* Contact Section */}
      <section id="contact" className="relative py-36 overflow-hidden scroll-mt-20 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-900/10 blur-3xl animate-[float_12s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-cyan-900/10 blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[3%]"></div>
        </div>

        <div className="container relative mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <span className="inline-block font-mono text-sm text-blue-300 mb-4 tracking-widest">
              <span className="text-blue-300/70 mr-2">//</span> 05. Connect
            </span>
            
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 leading-tight"
            >
              Let's Create <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">Digital Excellence</span>
            </motion.h2>
            
            <motion.p 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Ready to elevate your digital presence? Let's transform your vision into a masterpiece.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 -z-10"></div>
            
            <div className="glassmorphic p-8 md:p-10 rounded-2xl border border-gray-800/30 group-hover:border-blue-400/20 transition-all duration-500">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="from_name"
                    value={formData.from_name}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 py-3 bg-gray-800/20 border-b border-gray-700/50 rounded-t-lg focus:border-blue-400 text-gray-100 placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-300"
                    placeholder="Your Name"
                  />
                  <label 
                    htmlFor="name" 
                    className="absolute left-4 -top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-300"
                  >
                    Your Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="from_email"
                    value={formData.from_email}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 py-3 bg-gray-800/20 border-b border-gray-700/50 rounded-t-lg focus:border-blue-400 text-gray-100 placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-300"
                    placeholder="Your Email"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute left-4 -top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-300"
                  >
                    Your Email
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="peer w-full px-4 py-3 bg-gray-800/20 border-b border-gray-700/50 rounded-t-lg focus:border-blue-400 text-gray-100 placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-300 custom-scroll"
                    placeholder="Your Vision"
                  />
                  <label 
                    htmlFor="message" 
                    className="absolute left-4 -top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-300"
                  >
                    Your Vision
                  </label>
                </div>

                <div className="pt-6">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03, boxShadow: 'var(--glow-blue)' }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium text-white overflow-hidden group hover:shadow-[0_10px_30px_-5px_rgba(59,130,246,0.3)] transition-all duration-300 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? 'Sending...' : 'Launch Project'}
                      <FiArrowRight className="transition-all duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-2 text-green-400"
                    >
                      <FiCheck /> Message sent successfully!
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-2 text-red-400"
                    >
                      <FiAlertCircle /> Failed to send message. Please try again.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <motion.div variants={slideUp}>
              <a 
                href="#" 
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
              >
                WR
              </a>
            </motion.div>
            
            <motion.div 
              variants={slideUp}
              className="flex space-x-6"
            >
              {[
                {
                  name: "GitHub",
                  url: "https://github.com/Oualid-rouihi",
                  icon: <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                },
                {
                  name: "LinkedIn",
                  url: "https://www.linkedin.com/in/oualid-rouihi-48ba04340?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
                  icon: <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                },
                {
                  name: "instagram",
                  url: "https://www.instagram.com/rh__oualid?igsh=MXJyMmN0c2RwM2ttOA==",
                  icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.627.074-3.083.414-4.242 1.573C1.652 2.804 1.312 4.26 1.238 5.887c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.074 1.627.414 3.083 1.573 4.242 1.159 1.159 2.615 1.499 4.242 1.573 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.627-.074 3.083-.414 4.242-1.573 1.159-1.159 1.499-2.615 1.573-4.242.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.074-1.627-.414-3.083-1.573-4.242-1.159-1.159-2.615-1.499-4.242-1.573-1.28-.058-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                },
                {
                  name: "whatsapp",
                  url: "https://wa.me/+212703596921",
                  icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.297-.347.446-.52.149-.173.198-.297.297-.445.099-.149.099-.347-.001-.496-.099-.149-.446-.566-.689-.87-.243-.297-.396-.641-.494-.98-.099-.338.024-.637.322-.737.297-.099.607-.099.911-.099.304 0 .669.099.892.346.223.248.347.644.347 1.036 0 .396-.124.793-.346 1.14-.223.346-.52.69-.869.986-.347.297-.892.793-1.015 1.288-.124.496-.05 1.015.223 1.413.273.396.644.892 1.364 1.413.718.52 1.387.793 1.931.892.545.099 1.015.05 1.413-.198.396-.248.793-.595.892-.892.099-.297.198-.496.297-.595.099-.099.198-.149.297-.099.099.05.471.248.718.446.248.198.496.396.595.595.099.198.05.446-.05.644-.099.198-.396.347-.793.446zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /> }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={slideUp}
                  whileHover={{ y: -4, color: '#3b82f6' }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 transition-colors"
                  aria-label={social.name}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {social.icon}
                  </svg>
                </motion.a>
              ))}
            </motion.div>
            
            <motion.div 
              variants={slideUp}
              className="text-center md:text-right"
            >
              <p className="text-gray-400 text-sm font-mono">
                Designed & Built by Walid Rouihi
              </p>
              <p className="text-gray-500 text-xs mt-1">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;