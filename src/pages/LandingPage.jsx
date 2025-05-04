"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      color: ["#00DDB3", "#22D3EE", "#F0ABFC"][Math.floor(Math.random() * 3)],
    }));
    setParticles(newParticles);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-950"
    >
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="text-white font-light text-2xl tracking-tight">
          To Earn Knowledge
        </Link>
      </div>

      {/* Interactive Particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          initial={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: 0.6,
          }}
          animate={{
            left: `${particle.x + (mousePosition.x - 50) * 0.02}%`,
            top: `${particle.y + (mousePosition.y - 50) * 0.02}%`,
            opacity: [0.6, 0.8, 0.6],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Decorative Lines */}
      <motion.div
        className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#00DDB3]/30 to-transparent"
        style={{ top: "45%" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <motion.div
        className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-pink-300/30 to-transparent"
        style={{ top: "65%" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.7 }}
      />

      {/* Main Content */}
      <div className="z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Discover
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-[#00DDB3] via-teal-400 to-pink-300"
            >
              your mind's
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              potential
            </motion.span>
          </h1>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#00DDB3] to-pink-400 hover:from-teal-500 hover:to-pink-500 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleStartQuiz}
          >
            <span className="mr-2">Take the mind quiz</span>
            <motion.div
              animate={{ x: isHovering ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          className="absolute left-[20%] top-[40%] bg-[#00DDB3]/80 text-white text-xs px-2 py-1 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          24%
        </motion.div>

        <motion.div
          className="absolute right-[25%] top-[35%] bg-white/10 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm border border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.5 }}
        >
          while learning
        </motion.div>

        <motion.div
          className="absolute left-[30%] bottom-[30%] bg-white/10 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm border border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.5 }}
        >
          keep growing
        </motion.div>

        <motion.div
          className="absolute right-[30%] bottom-[25%] bg-pink-400/80 text-white text-xs px-2 py-1 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.5 }}
        >
          explore
        </motion.div>
      </div>
    </div>
  );
}
