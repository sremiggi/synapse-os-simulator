import React from 'react';
import { motion } from 'motion/react';

interface BackgroundProps {
  tension: number;
  theme: 'dark' | 'light';
}

const Background: React.FC<BackgroundProps> = ({ tension, theme }) => {
  // Intensity factor based on tension (0-100)
  const intensity = tension / 100;
  
  // Base colors for blobs - more vibrant and higher opacity
  const colors = theme === 'dark' 
    ? ['rgba(139, 92, 246, 0.5)', 'rgba(236, 72, 153, 0.5)', 'rgba(59, 130, 246, 0.5)'] 
    : ['rgba(139, 92, 246, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(59, 130, 246, 0.3)'];

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700 ${
      theme === 'dark' ? 'bg-[#020408]' : 'bg-white'
    }`}>
      {/* Test Indicator - remove after confirmation */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full opacity-50 z-50" />

      {/* Animated Blobs */}
      <motion.div
        animate={{
          x: [0, 200, -150, 0],
          y: [0, -150, 200, 0],
          scale: [1, 1.5 + intensity * 0.8, 0.6, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12 / (1 + intensity * 2),
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-30%] left-[-30%] w-[100%] h-[100%] rounded-full blur-[40px] opacity-80"
        style={{ 
          backgroundColor: colors[0],
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply'
        }}
      />
      
      <motion.div
        animate={{
          x: [0, -200, 150, 0],
          y: [0, 200, -150, 0],
          scale: [1, 0.7, 1.6 + intensity * 0.7, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 15 / (1 + intensity * 2),
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-30%] right-[-30%] w-[90%] h-[90%] rounded-full blur-[40px] opacity-80"
        style={{ 
          backgroundColor: colors[1],
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply'
        }}
      />

      <motion.div
        animate={{
          x: [0, 150, -200, 0],
          y: [0, -200, 150, 0],
          scale: [1, 1.3, 0.5, 1.5 + intensity * 0.6],
        }}
        transition={{
          duration: 10 / (1 + intensity * 2),
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[0%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[50px] opacity-70"
        style={{ 
          backgroundColor: colors[2],
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply'
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5
          }}
          animate={{
            y: [null, '-=100'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className={`absolute w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-violet-500'}`}
        />
      ))}

      {/* Grid Overlay */}
      <div 
        className={`absolute inset-0 opacity-[0.03] ${theme === 'dark' ? 'invert' : ''}`}
        style={{ 
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Vignette */}
      <div className={`absolute inset-0 ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]' 
          : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]'
      }`} />
    </div>
  );
};

export default Background;
