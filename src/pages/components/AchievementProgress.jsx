"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function AchievementProgress({
  value = 0,
  max = 100,
  color = "#00DDB3", // Updated to mascot teal color
  height = "h-2",
  showValue = true,
  completed = false,
  chestColor = "#b79268", // Default to bronze
}) {
  const [progress, setProgress] = useState(0);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full">
      <div className="relative">
        <div
          className={`${height} bg-gray-700 rounded-full overflow-hidden w-full`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Progress Markers */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
          <motion.div
            className={`absolute ${height} bg-gray-600 w-[2px] rounded-full opacity-70`}
            style={{ left: "33%" }}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />
          <motion.div
            className={`absolute ${height} bg-gray-600 w-[2px] rounded-full opacity-70`}
            style={{ left: "66%" }}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ delay: 0.7, duration: 0.3 }}
          />
        </div>

        {/* Chest/Trophy Icon at the end */}
        <div className="absolute -right-1 -top-3 transform translate-y-px">
          <div
            className={`relative w-7 h-7 ${
              completed ? "opacity-100" : "opacity-80"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <motion.path
                d="M5,16 v3 h14 v-3 l-2,-10 h-10 l-2,10 z"
                fill={chestColor}
                strokeWidth="1"
                stroke="#000"
                strokeOpacity="0.3"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
              <motion.path
                d="M8,6 v-2 h8 v2"
                fill="none"
                strokeWidth="2"
                stroke={chestColor}
                strokeOpacity="0.6"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
              {completed && (
                <motion.circle
                  cx="12"
                  cy="11"
                  r="2"
                  fill="#fde047"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [0, 1, 0.8, 1],
                  }}
                  transition={{
                    delay: 1.2,
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    repeatDelay: 2,
                  }}
                />
              )}
            </svg>

            {completed && (
              <motion.div
                className="absolute -top-1 -right-1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
              >
                <CheckCircle2 className="h-3 w-3 text-green-500 bg-black rounded-full" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {showValue && (
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{value}</span>
          <span>/</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
