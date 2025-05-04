"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Medal } from "lucide-react";

export function TieredAchievementProgress({
  achievement,
  height = "h-2",
  showValue = true,
}) {
  const [progress, setProgress] = useState(0);

  // Get current tier information
  const currentTierIndex = achievement.currentTier - 1;
  const currentTier =
    currentTierIndex >= 0 ? achievement.tiers[currentTierIndex] : null;

  // Get next tier information
  const nextTierIndex =
    achievement.currentTier < 3 ? achievement.currentTier : null;
  const nextTier =
    nextTierIndex !== null ? achievement.tiers[nextTierIndex] : null;

  // Calculate progress percentage within the current tier
  const calculateProgress = () => {
    // If not started yet, show progress toward bronze
    if (achievement.currentTier === 0) {
      return (achievement.progress / achievement.tiers[0].required) * 100;
    }

    // If completed all tiers, show 100%
    if (achievement.currentTier === 3) {
      return 100;
    }

    // Otherwise show progress within current tier
    return (achievement.tierProgress / achievement.tierTotal) * 100;
  };

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => {
      setProgress(calculateProgress());
    }, 300);

    return () => clearTimeout(timer);
  }, [achievement]);

  // Get color based on current tier
  const getProgressColor = () => {
    if (achievement.currentTier === 0) return "#6b7280"; // gray-500
    if (currentTier) return currentTier.color;
    return "#6b7280";
  };

  // Get the next tier name
  const getNextTierName = () => {
    if (achievement.currentTier === 0) return "Bronze";
    if (achievement.currentTier === 1) return "Silver";
    if (achievement.currentTier === 2) return "Gold";
    return "Completed";
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Base progress bar */}
        <div
          className={`${height} bg-gray-700 rounded-full overflow-hidden w-full`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: getProgressColor() }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Current tier indicator - Medal icon */}
        {achievement.currentTier > 0 && (
          <motion.div
            className="absolute -top-1 -left-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="relative flex items-center justify-center">
              <Medal
                size={16}
                className="drop-shadow-md"
                style={{
                  color: currentTier?.color || "#6b7280",
                  stroke: "#000",
                  strokeWidth: 1,
                  fill: currentTier?.color || "#6b7280",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Next tier goal indicator - Medal icon */}
        {achievement.currentTier < 3 && (
          <motion.div
            className="absolute -top-1 -right-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <div className="relative flex items-center justify-center">
              <Medal
                size={16}
                className="opacity-50 drop-shadow-sm"
                style={{
                  color: nextTier?.color || "#6b7280",
                  stroke: "#000",
                  strokeWidth: 1,
                  fill: nextTier?.color || "#6b7280",
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress text */}
      {showValue && (
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{achievement.tierProgress}</span>
          <span className="text-xs">
            {achievement.currentTier < 3 ? (
              <>
                <span className="text-white">Next: </span>
                <span style={{ color: nextTier?.color || "#6b7280" }}>
                  {getNextTierName()}
                </span>
              </>
            ) : (
              <span style={{ color: currentTier?.color || "#ffd700" }}>
                Completed
              </span>
            )}
          </span>
          <span>{achievement.tierTotal}</span>
        </div>
      )}
    </div>
  );
}
