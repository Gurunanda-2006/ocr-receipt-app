import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { WordsPullUp, WordsPullUpMultiStyle } from '../components/animations/TextAnimations';
import { ScrollRevealText } from '../components/animations/ScrollRevealText';

const Navbar = () => {
  const navItems = ["Our story", "Collective", "Workshops", "Programs", "Inquiries"];
  return (
    <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14 border-x border-b border-white/10">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className="text-[10px] sm:text-xs md:text-sm transition-colors"
            style={{ color: 'rgba(225, 224, 204, 0.8)' }}
            onMouseEnter={(e) => e.target.style.color = '#E1E0CC'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(225, 224, 204, 0.8)'}
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="h-screen w-full p-4 md:p-6 relative overflow-hidden bg-black">
      <div className="w-full h-full relative rounded-2xl md:rounded-[2rem] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
        </video>
        
        <div className="noise-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
        
        <Navbar />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <WordsPullUp 
                text="Prisma" 
                showAsterisk={true}
                className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em]"
                style={{ color: '#E1E0CC' }}
              />
            </div>
            <div className="md:col-span-4 flex flex-col gap-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-primary/70 text-xs sm:text-sm md:text-base leading-tight"
              >
                Prisma is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status or labels but by passion and hunger to unlock potential through our unique perspectives.
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center self-start gap-2 bg-primary rounded-full px-1 py-1 pr-1.5 transition-all hover:gap-3"
              >
                <span className="text-black font-medium text-sm sm:text-base pl-5 pr-2">Join the lab</span>
                <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowRight size={20} color="#DEDBC8" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const segments = [
    { text: "I am Marcus Chen,", className: "font-normal" },
    { text: "a self-taught director.", className: "italic font-serif" },
    { text: "I have skills in color grading, visual effects, and narrative design.", className: "font-normal" }
  ];

  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto bg-[#101010] rounded-[2rem] p-12 md:p-24 text-center">
        <span className="text-primary text-[10px] sm:text-xs uppercase tracking-widest mb-8 block">Visual arts</span>
        
        <WordsPullUpMultiStyle 
          segments={segments}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] sm:leading-[0.9] text-center mb-12"
        />

        <ScrollRevealText 
          text="Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals."
          className="text-[#DEDBC8] text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
        />
      </div>
    </section>
  );
};

const FeatureCard = ({ number, title, icon, items, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#212121] rounded-3xl p-8 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-12 h-12 rounded-xl overflow-hidden">
          <img src={icon} alt="" className="w-full h-full object-cover" />
        </div>
        <span className="text-primary/30 text-sm font-medium">{number}</span>
      </div>
      
      <h3 className="text-primary text-xl font-medium mb-6">{title}</h3>
      
      <ul className="flex flex-col gap-4 mb-auto">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 items-start">
            <Check size={16} className="text-primary mt-1 shrink-0" />
            <span className="text-gray-400 text-sm leading-tight">{item}</span>
          </li>
        ))}
      </ul>

      <a href="#" className="group flex items-center gap-2 text-primary text-sm font-medium mt-8">
        Learn more
        <ArrowRight size={16} className="-rotate-45 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </a>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section className="min-h-screen bg-black py-24 px-6 bg-noise">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <WordsPullUpMultiStyle 
            segments={[
              { text: "Studio-grade workflows for visionary creators.", className: "text-primary" },
              { text: "\nBuilt for pure vision. Powered by art.", className: "text-gray-500" }
            ]}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:h-[520px]">
          {/* Card 1 - Video Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden group min-h-[300px] lg:h-full"
          >
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <p className="text-[#E1E0CC] text-lg font-medium">Your creative canvas.</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <FeatureCard 
            number="01"
            title="Project Storyboard."
            icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
            items={["Automated scene detection", "Asset management library", "Version control history", "Collaborative timelines"]}
            delay={0.25}
          />

          {/* Card 3 */}
          <FeatureCard 
            number="02"
            title="Smart Critiques."
            icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
            items={["AI composition analysis", "Real-time creative notes", "Adobe/DaVinci plugins", "Export-ready feedback"]}
            delay={0.4}
          />

          {/* Card 4 */}
          <FeatureCard 
            number="03"
            title="Immersion Capsule."
            icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
            items={["Deep focus notification block", "Generative soundscapes", "Biological clock syncing", "Focus intensity metrics"]}
            delay={0.55}
          />
        </div>
      </div>
    </section>
  );
};

export const LandingPage = () => {
  return (
    <main className="bg-black min-h-screen text-[#E1E0CC]">
      <Hero />
      <About />
      <Features />
      
      <footer className="py-12 border-t border-white/5 text-center bg-black">
        <p className="text-primary/30 text-xs">© 2026 Prisma Studio. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default LandingPage;
