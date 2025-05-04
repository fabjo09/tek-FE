"use client";

import { useEffect, useState } from "react";
import { AnimatedAchievementIcon } from "./AnimatedAchievementIcon";
import { TieredAchievementProgress } from "./TieredAchievementProgress";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export function AchievementCard({ achievement, onClick }) {
  const [animate, setAnimate] = useState(false);
  const currentTierIndex = achievement.currentTier - 1;
  const currentTier =
    currentTierIndex >= 0 ? achievement.tiers[currentTierIndex] : null;
  const nextTierIndex =
    achievement.currentTier < 3 ? achievement.currentTier : null;
  const nextTier =
    nextTierIndex !== null ? achievement.tiers[nextTierIndex] : null;

  useEffect(() => {
    // Random delay for staggering animations on mount
    const timer = setTimeout(() => {
      setAnimate(true);
    }, Math.random() * 500);

    return () => clearTimeout(timer);
  }, []);

  // Get tier name based on current tier
  const getTierName = () => {
    switch (achievement.currentTier) {
      case 1:
        return "Bronze";
      case 2:
        return "Silver";
      case 3:
        return "Gold";
      default:
        return "Not Started";
    }
  };

  // Get next tier name
  const getNextTierName = () => {
    switch (achievement.currentTier) {
      case 0:
        return "Bronze";
      case 1:
        return "Silver";
      case 2:
        return "Gold";
      case 3:
        return "Completed";
      default:
        return "Bronze";
    }
  };

  return (
    <motion.div
      className="relative border border-[#00DDB3]/50 rounded-lg overflow-hidden bg-gradient-to-br from-[#001a17] to-[#008575] p-4"
      style={{
        boxShadow: "inset 0 0 20px rgba(0, 221, 179, 0.15)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={onClick}
    >
      {/* Time Remaining Indicator */}
      {(achievement.daysLeft || achievement.hoursLeft) && (
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-400">
            {achievement.daysLeft
              ? `${achievement.daysLeft} DAYS`
              : achievement.hoursLeft
              ? `${achievement.hoursLeft} HOURS`
              : ""}
          </span>
        </div>
      )}

      <div className="flex mb-3">
        <div className="mr-3">
          <AnimatedAchievementIcon
            achievement={achievement}
            animate={animate}
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-200">{achievement.name}</h3>
          <p className="text-xs text-gray-400">{achievement.description}</p>

          {/* Current tier indicator */}
          <div className="mt-1 flex items-center">
            <span className="text-xs text-gray-400">
              {achievement.currentTier > 0 ? "Current: " : "Goal: "}
            </span>
            <span
              className="text-xs ml-1 font-medium"
              style={{
                color:
                  achievement.currentTier === 0
                    ? achievement.tiers[0].color
                    : currentTier?.color || "#9ca3af",
              }}
            >
              {achievement.currentTier === 0 ? "Bronze" : getTierName()}
            </span>
          </div>
        </div>
      </div>

      <TieredAchievementProgress achievement={achievement} />

      {/* Completion Animation */}
      {achievement.completed && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00DDB3]/20 to-transparent pointer-events-none"
          initial={{ x: "-100%", opacity: 0.5 }}
          animate={{ x: "100%", opacity: 0 }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            repeatDelay: 3,
          }}
        />
      )}
    </motion.div>
  );
}
