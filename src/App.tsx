/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Text, MeshDistortMaterial, Sphere, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Terminal, 
  Cpu, 
  Globe, 
  Palette, 
  Code2, 
  Zap, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink,
  ChevronRight,
  Monitor,
  Database,
  Layers,
  Play
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 3D Background Components ---

const ParticleField = () => {
  const count = 2000;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00f2ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const FloatingObjects = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-10, 5, -10]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#bc13fe" wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[12, -8, -15]}>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={3}>
        <mesh position={[0, 10, -20]}>
          <octahedronGeometry args={[2, 0]} />
          <MeshDistortMaterial color="#ff00ff" speed={2} distort={0.4} />
        </mesh>
      </Float>
    </>
  );
};

const Scene3D = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#bc13fe" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ParticleField />
        <FloatingObjects />
      </Canvas>
    </div>
  );
};

// --- UI Components ---

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
          scale: isPointer ? 2.5 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-cyan-400/50 rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePos.x - 20,
          y: mousePos.y - 20,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 150, mass: 0.8 }}
      />
    </>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const bootLogs = [
    "Initializing Digital Galaxy Core...",
    "Mounting Imagination Engine...",
    "Calibrating Creative Flux...",
    "Synchronizing Neural Interface...",
    "Loading Apurva's Universe...",
    "System Ready."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
        setProgress(prev => Math.min(prev + 100 / bootLogs.length, 100));
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-8 font-mono"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-cyan-400 text-sm">
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-1"
            >
              <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </motion.div>
          ))}
        </div>
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.8)]"
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
          <span>Booting System</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

const TypingText = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <span className="text-cyan-400 font-mono">
      {texts[index].substring(0, subIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const AboutCube = () => {
  return (
    <div className="h-[400px] w-full max-w-md mx-auto">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh rotation={[0.5, 0.5, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#bc13fe" wireframe />
          </mesh>
        </Float>
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
};

const SkillIcon = ({ icon: Icon, name, delay }: { icon: any, name: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, type: 'spring' }}
    className="group relative flex flex-col items-center"
  >
    <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-cyan-400 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all duration-300">
      <Icon size={32} />
    </div>
    <span className="mt-2 text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-cyan-400 transition-colors">
      {name}
    </span>
  </motion.div>
);

const ProjectCard = ({ 
  title, 
  description, 
  tags, 
  delay, 
  image = "https://picsum.photos/seed/project/800/450",
  githubUrl = "#",
  liveUrl,
  videoUrl
}: { 
  title: string, 
  description: string, 
  tags: string[], 
  delay: number,
  image?: string,
  githubUrl?: string,
  liveUrl?: string,
  videoUrl?: string
}) => {
  const demoUrl = videoUrl || liveUrl || "#";
  // Smart detection for video links if videoUrl isn't explicitly provided
  const isVideo = !!videoUrl || (!!liveUrl && (
    liveUrl.includes('drive.google.com') || 
    liveUrl.includes('youtube.com') || 
    liveUrl.includes('youtu.be') || 
    liveUrl.includes('loom.com') ||
    liveUrl.endsWith('.mp4')
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="glass-panel rounded-3xl group cursor-pointer relative overflow-hidden flex flex-col h-full border border-white/10 hover:border-cyan-400/50 transition-colors"
    >
      {/* Project Image */}
      <div className="relative h-52 overflow-hidden border-b border-white/5">
        <img 
          src={image} 
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-115 group-hover:rotate-1"
        />
        {/* Subtle overlay that darkens on hover to make buttons pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Floating Action Buttons (Mobile/Hover) */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-cyan-400 hover:text-black transition-all"
          >
            <Github size={18} />
          </a>
          <a 
            href={demoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-cyan-400 hover:text-black transition-all"
          >
            {isVideo ? <Play size={18} /> : <ExternalLink size={18} />}
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">{title}</h3>
        </div>
        
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-cyan-400/5 border border-cyan-400/10 text-cyan-400/70 uppercase tracking-wider font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <a 
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-xl bg-cyan-400 text-black text-xs font-bold text-center hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              {isVideo ? <Play size={14} /> : <ExternalLink size={14} />}
              {isVideo ? "Play Demo" : "Live Demo"}
            </a>
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Github size={14} />
              Source
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="relative bg-[#050505] min-h-screen selection:bg-cyan-400/30">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <CustomCursor />
      <Scene3D />

      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-400 z-[9999] origin-left"
        style={{ scaleX }}
      />

      {/* Futuristic Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-[9998] px-6 py-4 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="glass-panel px-8 py-3 rounded-full flex items-center gap-8 pointer-events-auto border-cyan-500/20"
        >
          <a href="#" className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold hover:text-white transition-colors">Apurva.</a>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex gap-6">
            {[
              { name: 'About', href: '#about' },
              { name: 'Skills', href: '#skills' },
              { name: 'Projects', href: '#projects' },
              { name: 'Contact', href: '#contact' }
            ].map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      </nav>

      <main 
        ref={containerRef}
        className="relative z-10 h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center p-6 snap-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-center max-w-4xl"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-8 border-2 border-dashed border-cyan-400/30 rounded-full flex items-center justify-center"
            >
              <Zap size={40} className="text-cyan-400" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
              Hello, I’m <span className="text-cyan-400 neon-text-cyan">Apurva</span> — <br />
              <span className="text-zinc-500">A Curious Mind Exploring the Universe of Technology.</span>
            </h1>
            <div className="text-xl md:text-2xl font-light text-zinc-400 h-8">
              <TypingText texts={["Tech Voyager", "Creative Thinker", "Future Developer", "Problem Solver"]} />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <div className="w-px h-16 bg-gradient-to-b from-cyan-400 to-transparent" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/50">Scroll to Explore</span>
            </motion.div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center justify-center p-6 snap-start">
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              {/* PHOTO SECTION - EDIT THE URL BELOW */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative aspect-square bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10">
                  <img 
                    src="https://raw.githubusercontent.com/Apurva654/portfolio-assets/main/PROFESSIONAL%20PIC.jpeg"// <-- REPLACE THIS WITH YOUR PHOTO URL
                    alt="Apurva - VJTI Student" 
                    className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <p className="text-cyan-400 font-mono text-xs tracking-[0.2em]">STUDENT ID: 251091013</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-10 rounded-[2rem] border-purple-500/20"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                    <Monitor size={24} />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">The Explorer's Mind</h2>
                </div>
                <div className="space-y-6 text-zinc-400 leading-relaxed">
                  <p>
                    I am <span className="text-white font-bold underline decoration-cyan-400/30 underline-offset-4">Apurva</span>, a <span className="text-cyan-400 font-medium">Electronics and telecommunication Engineering</span> student at <span className="text-white font-bold underline decoration-cyan-400/30 underline-offset-4">Veermata Jijabai Technological Institute (VJTI)</span> driven by curiosity and a passion for building meaningful technology. 
                    I bridge the gap between complex logic and human-centric design, weaving code into immersive digital experiences. 
                
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                        <Mail size={14} />
                      </div>
                      <span className="text-xs">apurvalambat42@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center text-purple-400">
                        <Globe size={14} />
                      </div>
                      <span className="text-xs"> Mumbai,India</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-cyan-400/50 transition-colors">
                      <div className="text-cyan-400 font-bold text-2xl mb-1">First Year</div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500">2029</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-purple-400/50 transition-colors">
                      <div className="text-purple-400 font-bold text-2xl mb-1">B.Tech</div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500"> EXTC Degree Program</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-400/60">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                     Currently exploring the intersection of  Generative AI • Visual Design • Digital Creativity
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="min-h-screen flex flex-col items-center justify-center p-6 snap-start">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Expertise & Skills</h2>
            <p className="text-zinc-500 tracking-widest uppercase text-xs">Technical Proficiency</p>
          </div>

          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* TECH STACK - Focus: Engineering */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group/skill">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                  Programming & Analytics
                </div>
                <span className="text-xs text-zinc-500 font-mono">70%</span>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400/50 w-[75%] group-hover/skill:bg-cyan-400 transition-all duration-500" />
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">Python, C++ Programming, HTML & CSS, Data Analysis, Power BI, Git & GitHub</p>
              </div>
            </div>

            {/* DESIGN - Focus: Visuals */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group/skill">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs uppercase tracking-[0.2em] text-purple-400 font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]" />
                  Creative Design
                </div>
                <span className="text-xs text-zinc-500 font-mono">70%</span>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400/50 w-[80%] group-hover/skill:bg-purple-400 transition-all duration-500" />
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">Graphic & Visual Design, Video Editing & Production, UI/UX Design</p>
              </div>
            </div>

            {/* AI & DATA - Focus: Innovation */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group/skill">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                  AI & Emerging Tech
                </div>
                <span className="text-xs text-zinc-500 font-mono">65%</span>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400/50 w-[65%] group-hover/skill:bg-emerald-400 transition-all duration-500" />
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">LLM Prompt Design, Generative AI Fundamentals, AI Prototyping, Blockchain & Crypto Basics</p>
              </div>
            </div>

            {/* LEADERSHIP - Focus: Strategy */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group/skill">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                  Leadership
                </div>
                <span className="text-xs text-zinc-500 font-mono">85%</span>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400/50 w-[85%] group-hover/skill:bg-amber-400 transition-all duration-500" />
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">Team Coordination, Event Execution, Adaptability, Active Listening, Strong Work Ethic, Communication & Articulation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen flex flex-col items-center justify-center p-6 snap-start">
          <div className="max-w-6xl w-full">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl font-bold mb-2">Project Galaxy</h2>
                <p className="text-zinc-500 text-sm">Floating through my digital creations</p>
              </div>
              <div className="hidden md:flex gap-2">
                <div className="w-12 h-1 bg-cyan-400 rounded-full" />
                <div className="w-4 h-1 bg-zinc-800 rounded-full" />
                <div className="w-4 h-1 bg-zinc-800 rounded-full" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProjectCard 
                title="Agentic AI HoneyPot for Scam Intelligence" 
                description="AI-powered honeypot that detects scam intent, engages scammers with an autonomous agent, and extracts intelligence to analyze phishing tactics."
                tags={["API Integration", "Scam Detection", "LLM Prompting", "Cybersecurity"]}
                image="https://raw.githubusercontent.com/Apurva654/portfolio-assets/main/Screenshot%202026-03-16%20015657.png"
                githubUrl="https://github.com/Apurva654/honeycomb_agentic_AI"
                liveUrl="https://honeycomb-agentic-ai.onrender.com"
                delay={0.1}
              />
              <ProjectCard 
                title="433 MHz RF Walkie-Talkie Communication System" 
                description="Designed and built a two-way RF walkie-talkie system operating at 433 MHz using transmitter and receiver modules for half-duplex wireless voice communication."
                tags={["RF Communication","Analog Electronics","433 MHz Module"]}
                image="https://raw.githubusercontent.com/Apurva654/portfolio-assets/main/WALKIE%20TALKIE.jpeg"
                githubUrl="https://github.com/Apurva654/RF_WALKIE-TALKIE_MODULE"
                liveUrl="https://drive.google.com/file/d/1JYHYspcOOWaz-ZVI7autP-OfhVrTrubK/view?usp=drivesdk"
                delay={0.2}
              />
              <ProjectCard 
                title="Wall-E Self-Balancing & Line-Following Robot" 
                description="ESP32-based self-balancing and line-following robot built during the SRA VJTI robotics workshop, using PID control, IMU sensing, and FreeRTOS for real-time motor control."
                tags={["Robotics","ESP32","PID Control","Embedded Systems"]}
                image="https://raw.githubusercontent.com/Apurva654/portfolio-assets/main/Screenshot%202026-03-16%20034741.png"
                githubUrl="https://github.com/SRA-VJTI/Wall-E"
                liveUrl="https://drive.google.com/file/d/1gfXscz1JYTwO7Th3CC579Z7S1dum3bC6/view?usp=drivesdk"
                delay={0.3}
              />
          
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center justify-center p-6 snap-start">
          <div className="max-w-4xl w-full glass-panel p-12 rounded-[3rem] border-cyan-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Initiate Transmission</h2>
              <p className="text-zinc-500 text-sm">Send a message across the digital galaxy</p>
            </div>
            <form className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Identification</label>
                  <input 
                    type="text" 
                    placeholder="Enter Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div className="relative">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Frequency (Email)</label>
                  <input 
                    type="email" 
                    placeholder="Enter Email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="relative h-full">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Encrypted Message</label>
                  <textarea 
                    placeholder="Type your message..."
                    className="w-full h-[124px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-center mt-8">
                <button className="group relative px-12 py-4 bg-cyan-400 text-black font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,242,255,0.5)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Send Transmission <ChevronRight size={18} />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                  />
                </button>
              </div>
            </form>
            
            <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col items-center md:items-start gap-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/60 font-bold">Secure Connection Links</span>
                <div className="flex gap-4">
                  {/* GITHUB */}
                  <a 
                    href="https://github.com/Apurva654" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 group relative"
                  >
                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    <Github size={22} className="relative z-10" />
                  </a>
                  
                  {/* LINKEDIN */}
                  <a 
                    href="https://www.linkedin.com/in/apurva-lambat-03016a368?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 group relative"
                  >
                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    <Linkedin size={22} className="relative z-10" />
                  </a>
                  
                  {/* EMAIL */}
                  <a 
                    href="mailto:apurvalambat42@gmail.com" 
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 group relative"
                  >
                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    <Mail size={22} className="relative z-10" />
                  </a>
                </div>
              </div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest text-center md:text-right">
                Apurva © 2026 • Digital Galaxy Interface<br/>
                <span className="text-zinc-800 mt-1 block">System Status: Online</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
