"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Star, BookOpen, Trophy, LightbulbIcon } from "lucide-react";

export function AnimatedAchievementIcon({ achievement, animate = true }) {
  const [isAnimating, setIsAnimating] = useState(animate);
  const currentTierIndex = achievement.currentTier - 1;
  const currentTier =
    currentTierIndex >= 0 ? achievement.tiers[currentTierIndex] : null;
  const nextTierIndex =
    achievement.currentTier < 3 ? achievement.currentTier : null;
  const nextTier =
    nextTierIndex !== null ? achievement.tiers[nextTierIndex] : null;

  useEffect(() => {
    if (!animate) return;

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [animate]);

  const getBackgroundColor = () => {
    if (achievement.currentTier === 0) return "rgba(75, 85, 99, 0.3)"; // gray-600 with opacity
    if (currentTier) return currentTier.color;
    return achievement.iconColor;
  };

  // Get glow color based on current tier
  const getGlowColor = () => {
    if (achievement.currentTier === 0) return "rgba(75, 85, 99, 0.1)"; // gray-600 with opacity
    if (currentTier) return currentTier.color;
    return achievement.iconColor;
  };

  const renderFlameIcon = () => {
    const flameSize =
      achievement.currentTier === 0
        ? "h-5 w-5"
        : achievement.currentTier === 1
        ? "h-6 w-6"
        : achievement.currentTier === 2
        ? "h-7 w-7"
        : "h-8 w-8";

    const flameColor =
      achievement.currentTier === 0 ? "text-gray-400" : "text-white";

    return (
      <div className="relative">
        <Flame className={`${flameSize} ${flameColor}`} />

        {/* Fire effect that grows with tier */}
        {achievement.currentTier > 0 && (
          <>
            {/* Inner flame */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 opacity-50 z-[-1]"
              animate={{
                width: [
                  `${achievement.currentTier * 10}px`,
                  `${achievement.currentTier * 14}px`,
                  `${achievement.currentTier * 10}px`,
                ],
                height: [
                  `${achievement.currentTier * 12}px`,
                  `${achievement.currentTier * 16}px`,
                  `${achievement.currentTier * 12}px`,
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Flame particles */}
            {Array.from({ length: achievement.currentTier * 2 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-orange-500"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  left: "50%",
                  bottom: "20%",
                }}
                animate={{
                  y: [
                    0,
                    -(20 + achievement.currentTier * 10) - Math.random() * 10,
                  ],
                  x: [0, (Math.random() - 0.5) * 20],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  // Specialized star icon with dynamic shine effect
  const renderStarIcon = () => {
    const starSize =
      achievement.currentTier === 0
        ? "h-5 w-5"
        : achievement.currentTier === 1
        ? "h-6 w-6"
        : achievement.currentTier === 2
        ? "h-7 w-7"
        : "h-8 w-8";

    const starColor =
      achievement.currentTier === 0 ? "text-gray-400" : "text-white";

    return (
      <div className="relative">
        <Star className={`${starSize} ${starColor}`} />

        {/* Star shine effect that increases with tier */}
        {achievement.currentTier > 0 && (
          <>
            {/* Glow */}
            <motion.div
              className="absolute top-1 left-1 inset-0 rounded-full bg-yellow-200 opacity-50 z-[-1]"
              animate={{
                width: [
                  `${achievement.currentTier * 12}px`,
                  `${achievement.currentTier * 16}px`,
                  `${achievement.currentTier * 12}px`,
                ],
                height: [
                  `${achievement.currentTier * 12}px`,
                  `${achievement.currentTier * 16}px`,
                  `${achievement.currentTier * 12}px`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Star rays */}
            {Array.from({ length: 4 * achievement.currentTier }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-yellow-100"
                style={{
                  width: 1 + achievement.currentTier,
                  height: 5 + achievement.currentTier * 3,
                  left: "50%",
                  top: "50%",
                  transformOrigin: "center",
                  transform: `rotate(${
                    i * (360 / (4 * achievement.currentTier))
                  }deg) translateY(-${10 + achievement.currentTier * 2}px)`,
                }}
                animate={{
                  height: [
                    5 + achievement.currentTier * 3,
                    8 + achievement.currentTier * 4,
                    5 + achievement.currentTier * 3,
                  ],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                  repeatType: "reverse",
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const renderBookIcon = () => {
    const bookSize =
      achievement.currentTier === 0
        ? "h-5 w-5"
        : achievement.currentTier === 1
        ? "h-6 w-6"
        : achievement.currentTier === 2
        ? "h-7 w-7"
        : "h-8 w-8";

    const bookColor =
      achievement.currentTier === 0 ? "text-gray-400" : "text-white";

    return (
      <div className="relative">
        <BookOpen className={`${bookSize} ${bookColor}`} />

        {/* Book page turning effect */}
        {achievement.currentTier > 0 && (
          <>
            {/* Page glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-100 opacity-30 z-[-1]"
              style={{
                width: `${10 + achievement.currentTier * 5}px`,
                height: `${12 + achievement.currentTier * 5}px`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Floating text lines */}
            {Array.from({ length: achievement.currentTier }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 bg-blue-200 rounded-full"
                style={{
                  width: 6 + achievement.currentTier * 2,
                  left: "50%",
                  top: `${40 + i * 20}%`,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: [0, achievement.currentTier * 5],
                  width: [
                    6 + achievement.currentTier * 2,
                    10 + achievement.currentTier * 3,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                  repeatType: "reverse",
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const renderTrophyIcon = () => {
    const trophySize =
      achievement.currentTier === 0
        ? "h-5 w-5"
        : achievement.currentTier === 1
        ? "h-6 w-6"
        : achievement.currentTier === 2
        ? "h-7 w-7"
        : "h-8 w-8";

    const trophyColor =
      achievement.currentTier === 0 ? "text-gray-400" : "text-white";

    return (
      <div className="relative">
        <Trophy className={`${trophySize} ${trophyColor}`} />

        {/* Trophy shine effect */}
        {achievement.currentTier > 0 && (
          <>
            {/* Trophy glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 z-[-1]"
              style={{
                width: `${12 + achievement.currentTier * 6}px`,
                height: `${12 + achievement.currentTier * 6}px`,
                background: `radial-gradient(circle, ${
                  currentTier?.color || "#ffd700"
                } 0%, transparent 70%)`,
              }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Trophy shine lines */}
            <motion.div
              className="absolute top-0 left-1/2 w-0.5 -translate-x-1/2 bg-yellow-100"
              style={{
                height: 0,
              }}
              animate={{
                height: [0, 8 + achievement.currentTier * 2, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
            />

            {/* Trophy sparkles */}
            {Array.from({ length: achievement.currentTier * 2 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-yellow-200"
                style={{
                  width: 2,
                  height: 2,
                  left: "50%",
                  top: "20%",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 20],
                  y: [0, -(5 + Math.random() * 15)],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const renderLightbulbIcon = () => {
    const bulbSize =
      achievement.currentTier === 0
        ? "h-5 w-5"
        : achievement.currentTier === 1
        ? "h-6 w-6"
        : achievement.currentTier === 2
        ? "h-7 w-7"
        : "h-8 w-8";

    const bulbColor =
      achievement.currentTier === 0 ? "text-gray-400" : "text-white";

    return (
      <div className="relative">
        <LightbulbIcon className={`${bulbSize} ${bulbColor}`} />

        {/* Lightbulb glow effect */}
        {achievement.currentTier > 0 && (
          <>
            {/* Bulb glow */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-0 rounded-full z-[-1]"
              style={{
                width: `${10 + achievement.currentTier * 8}px`,
                height: `${10 + achievement.currentTier * 8}px`,
                background: `radial-gradient(circle, rgba(255,255,0,0.7) 0%, transparent 70%)`,
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Light rays */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-yellow-100"
                style={{
                  width: 1 + achievement.currentTier * 0.5,
                  height: 5 + achievement.currentTier * 4,
                  left: "50%",
                  top: "0%",
                  transformOrigin: "center bottom",
                  transform: `rotate(${i * 60}deg) translateY(-${
                    8 + achievement.currentTier * 3
                  }px)`,
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  height: [
                    5 + achievement.currentTier * 4,
                    8 + achievement.currentTier * 5,
                    5 + achievement.currentTier * 4,
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  repeatType: "reverse",
                }}
              />
            ))}

            {/* Idea particles */}
            {achievement.currentTier > 1 &&
              Array.from({ length: achievement.currentTier * 2 }).map(
                (_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full bg-yellow-200"
                    style={{
                      width: 2,
                      height: 2,
                      left: "50%",
                      top: "0%",
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 20],
                      y: [0, -(10 + Math.random() * 10)],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                  />
                )
              )}
          </>
        )}
      </div>
    );
  };

  const renderIcon = () => {
    switch (achievement.icon) {
      case "flame":
        return renderFlameIcon();
      case "star":
        return renderStarIcon();
      case "book":
        return renderBookIcon();
      case "trophy":
        return renderTrophyIcon();
      case "lightbulb":
        return renderLightbulbIcon();
      default:
        // Default icon with basic animation
        const size =
          achievement.currentTier === 0
            ? "h-5 w-5"
            : achievement.currentTier === 1
            ? "h-6 w-6"
            : achievement.currentTier === 2
            ? "h-7 w-7"
            : "h-8 w-8";
        const color =
          achievement.currentTier === 0 ? "text-gray-400" : "text-white";
        return <Award className={`${size} ${color}`} />;
    }
  };

  const variants = {
    idle: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.15, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 1.5,
        repeat: achievement.completed ? 0 : Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        repeatDelay: 2,
      },
    },
    completed: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.8 },
    },
  };
  return (
    <div className="relative">
      {/* Glow effect for completed achievements */}
      {achievement.completed && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: getGlowColor() }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      )}

      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full p-4"
        style={{ backgroundColor: getBackgroundColor() }}
        initial="idle"
        animate={
          achievement.completed ? "completed" : isAnimating ? "animate" : "idle"
        }
        whileHover="animate"
        variants={variants}
      >
        {renderIcon()}
      </motion.div>
    </div>
  );
}
