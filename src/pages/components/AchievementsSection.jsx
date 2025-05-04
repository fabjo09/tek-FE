"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { AchievementCard } from "./AchievementCard";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Star, Trophy, BookOpen, Clock, Flame } from "lucide-react";
import { TieredAchievementProgress } from "./TieredAchievementProgress";

// Sample achievement data with tiers
const sampleAchievements = [
  {
    id: "daily-streak",
    name: "Start a streak",
    description: "Complete daily lessons in a row",
    progress: 0,
    total: 9, // Total across all tiers
    icon: "flame",
    iconColor: "#f97316", // orange-500
    backgroundColor: "bg-gray-900",
    completed: false,
    type: "daily",
    hoursLeft: 12,
    tiers: [
      { name: "bronze", required: 1, color: "#cd7f32", completed: false },
      { name: "silver", required: 3, color: "#c0c0c0", completed: false },
      { name: "gold", required: 5, color: "#ffd700", completed: false },
    ],
    currentTier: 0, // Not started
    tierProgress: 0,
    tierTotal: 1, // First tier requires 1
  },
  {
    id: "perfect-score",
    name: "Score 80% or higher",
    description: "Get high scores in quizzes",
    progress: 0,
    total: 10, // Total across all tiers
    icon: "star",
    iconColor: "#3b82f6", // blue-500
    backgroundColor: "bg-gray-900",
    completed: false,
    type: "daily",
    hoursLeft: 12,
    tiers: [
      { name: "bronze", required: 1, color: "#cd7f32", completed: false },
      { name: "silver", required: 5, color: "#c0c0c0", completed: false },
      { name: "gold", required: 10, color: "#ffd700", completed: false },
    ],
    currentTier: 0, // Not started
    tierProgress: 0,
    tierTotal: 1, // First tier requires 1
  },
  {
    id: "study-time",
    name: "Read Article",
    description: "Read articles from the news section",
    progress: 0,
    total: 10, // Total across all tiers
    icon: "book",
    iconColor: "#eab308", // yellow-500
    backgroundColor: "bg-gray-900",
    completed: false,
    type: "daily",
    hoursLeft: 12,
    tiers: [
      { name: "bronze", required: 1, color: "#cd7f32", completed: false },
      { name: "silver", required: 5, color: "#c0c0c0", completed: false },
      { name: "gold", required: 10, color: "#ffd700", completed: false },
    ],
    currentTier: 0, // Not started
    tierProgress: 0,
    tierTotal: 1, // First tier requires 1
  },
  {
    id: "complete-course",
    name: "Course Champion",
    description: "Complete full courses",
    progress: 0,
    total: 5, // Total across all tiers
    icon: "trophy",
    iconColor: "#8b5cf6", // purple-500
    backgroundColor: "bg-gray-900",
    completed: false,
    type: "challenge",
    daysLeft: 28,
    tiers: [
      { name: "bronze", required: 1, color: "#cd7f32", completed: false },
      { name: "silver", required: 3, color: "#c0c0c0", completed: false },
      { name: "gold", required: 5, color: "#ffd700", completed: false },
    ],
    currentTier: 0, // Not started
    tierProgress: 0,
    tierTotal: 1, // First tier requires 1
  },
  {
    id: "math-genius",
    name: "Math Genius",
    description: "Solve complex math problems",
    progress: 0,
    total: 10, // Total across all tiers
    icon: "lightbulb",
    iconColor: "#10b981", // green-500
    backgroundColor: "bg-gray-900",
    completed: false,
    type: "milestone",
    tiers: [
      { name: "bronze", required: 3, color: "#cd7f32", completed: false },
      { name: "silver", required: 7, color: "#c0c0c0", completed: false },
      { name: "gold", required: 10, color: "#ffd700", completed: false },
    ],
    currentTier: 0, // Not started
    tierProgress: 0,
    tierTotal: 3, // First tier requires 3
  },
];

const iconMap = {
  star: <Star className="h-10 w-10 text-white" />,
  book: <BookOpen className="h-10 w-10 text-white" />,
  trophy: <Trophy className="h-10 w-10 text-white" />,
  clock: <Clock className="h-10 w-10 text-white" />,
  flame: <Flame className="h-10 w-10 text-white" />,
};

// AnimatedAchievementIcon component
const AnimatedAchievementIcon = ({ achievement, animate }) => {
  const icon = iconMap[achievement.icon];
  const iconColor = achievement.iconColor;

  return (
    <motion.div
      className="relative"
      animate={{
        y: animate ? [0, -5, 0] : 0,
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      <div
        className="w-24 h-24 flex items-center justify-center rounded-full"
        style={{ backgroundColor: iconColor }}
      >
        {icon}
      </div>
    </motion.div>
  );
};

export function AchievementsSection({ externalAchievements }) {
  const [achievements, setAchievements] = useState(
    externalAchievements || sampleAchievements
  );
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showSection, setShowSection] = useState(true);

  // Update achievements when props change
  useEffect(() => {
    if (externalAchievements) {
      // Map external achievements to ensure they have all required properties
      const completeAchievements = externalAchievements.map((extAchiev) => {
        // Find matching sample achievement to use as base
        const sampleAchiev =
          sampleAchievements.find((s) => s.id === extAchiev.id) ||
          sampleAchievements[0];

        // Ensure the achievement has all required properties
        return {
          ...sampleAchiev, // Default properties from sample
          ...extAchiev, // Override with external data
          // Ensure tiers exist and are structured correctly
          tiers: extAchiev.tiers ||
            sampleAchiev.tiers || [
              {
                name: "bronze",
                required: 1,
                color: "#cd7f32",
                completed: false,
              },
              {
                name: "silver",
                required: 3,
                color: "#c0c0c0",
                completed: false,
              },
              { name: "gold", required: 5, color: "#ffd700", completed: false },
            ],
          // Ensure other required tier properties exist
          currentTier: extAchiev.currentTier ?? 0,
          tierProgress: extAchiev.tierProgress ?? 0,
          tierTotal: extAchiev.tierTotal ?? 1,
        };
      });

      setAchievements(completeAchievements);
    }
  }, [externalAchievements]);

  // Progress achievement to next tier
  const progressAchievement = (id) => {
    setAchievements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Calculate new progress
          const newProgress = Math.min(item.progress + 1, item.total);

          // Determine if we've reached a new tier
          let newCurrentTier = item.currentTier;
          let newTierProgress = item.tierProgress + 1;
          let newTierTotal = item.tierTotal;

          // Check if we've completed the current tier
          if (item.currentTier < 3 && newTierProgress >= newTierTotal) {
            newCurrentTier += 1;

            // Set progress for the next tier
            if (newCurrentTier < 3) {
              const prevTierRequired =
                item.currentTier === 0
                  ? 0
                  : item.tiers[item.currentTier - 1].required;
              const nextTierRequired = item.tiers[newCurrentTier - 1].required;
              newTierProgress = newProgress - prevTierRequired;
              newTierTotal = nextTierRequired - prevTierRequired;
            } else {
              // Gold tier completed
              newTierProgress = item.tiers[2].required;
              newTierTotal = item.tiers[2].required;
            }
          }

          // Update tiers completed status
          const newTiers = item.tiers.map((tier, index) => ({
            ...tier,
            completed: index < newCurrentTier,
          }));

          return {
            ...item,
            progress: newProgress,
            completed: newProgress >= item.total,
            currentTier: newCurrentTier,
            tierProgress: newTierProgress,
            tierTotal: newTierTotal,
            tiers: newTiers,
          };
        }
        return item;
      })
    );
  };

  return (
    <>
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {/* Achievement Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                <AchievementCard
                  achievement={achievement}
                  onClick={() => setSelectedAchievement(achievement)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievement Detail Modal */}
      <Dialog
        open={!!selectedAchievement}
        onOpenChange={(open) => !open && setSelectedAchievement(null)}
      >
        <DialogContent
          className="border border-[#00DDB3]/50 overflow-hidden bg-gradient-to-br from-[#001a17] to-[#008575] text-white max-w-md"
          style={{
            boxShadow: "inset 0 0 20px rgba(0, 221, 179, 0.15)",
          }}
        >
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center mb-2 text-gray-200">
                  {selectedAchievement.name}
                </DialogTitle>
                <DialogDescription className="text-gray-300 text-center">
                  {selectedAchievement.description}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center py-4">
                {/* Achievement icon with animation */}
                <motion.div
                  className="relative mb-6"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-24 h-24 flex items-center justify-center">
                    <AnimatedAchievementIcon
                      achievement={selectedAchievement}
                      animate={true}
                    />
                  </div>
                </motion.div>

                {/* Add completion animation similar to AchievementCard */}
                {selectedAchievement.completed && (
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

                {/* Current tier status */}
                <div className="w-full mb-4">
                  <div className="flex justify-center gap-2 text-sm">
                    <span className="text-gray-400">Current Tier:</span>
                    <span
                      className="font-medium"
                      style={{
                        color:
                          selectedAchievement.currentTier === 0
                            ? "#9ca3af"
                            : selectedAchievement.tiers &&
                              selectedAchievement.tiers[
                                selectedAchievement.currentTier - 1
                              ]
                            ? selectedAchievement.tiers[
                                selectedAchievement.currentTier - 1
                              ].color
                            : "#9ca3af",
                      }}
                    >
                      {selectedAchievement.currentTier === 0
                        ? "Not Started"
                        : selectedAchievement.currentTier === 1
                        ? "Bronze"
                        : selectedAchievement.currentTier === 2
                        ? "Silver"
                        : "Gold"}
                    </span>
                  </div>
                </div>

                {/* Progress details */}
                <div className="w-full mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Progress</span>
                    <span className="font-medium">
                      {selectedAchievement.tierProgress}/
                      {selectedAchievement.tierTotal}
                    </span>
                  </div>

                  <TieredAchievementProgress
                    achievement={selectedAchievement}
                    height="h-3"
                    showValue={false}
                  />
                </div>

                {/* Next goal */}
                {selectedAchievement.currentTier < 3 && (
                  <div className="w-full mb-4 p-3 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Next Goal</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{
                            backgroundColor:
                              selectedAchievement.currentTier === 0
                                ? selectedAchievement.tiers &&
                                  selectedAchievement.tiers[0]
                                  ? selectedAchievement.tiers[0].color
                                  : "#cd7f32"
                                : selectedAchievement.tiers &&
                                  selectedAchievement.tiers[
                                    selectedAchievement.currentTier
                                  ]
                                ? selectedAchievement.tiers[
                                    selectedAchievement.currentTier
                                  ].color
                                : "#c0c0c0",
                          }}
                        />
                        <span>
                          {selectedAchievement.currentTier === 0
                            ? "Bronze"
                            : selectedAchievement.currentTier === 1
                            ? "Silver"
                            : "Gold"}
                        </span>
                      </div>
                      <span>
                        {selectedAchievement.tierProgress}/
                        {selectedAchievement.tierTotal}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action button */}
                <Button
                  className="mt-6 relative overflow-hidden bg-transparent border border-[#00DDB3]/50 hover:bg-[#00DDB3]/10 text-white w-full group"
                  style={{
                    boxShadow: "0 0 15px rgba(0, 221, 179, 0.2)",
                  }}
                  onClick={() => {
                    progressAchievement(selectedAchievement.id);
                    setSelectedAchievement(null);
                  }}
                  disabled={selectedAchievement.completed}
                >
                  <span className="relative z-10">
                    {selectedAchievement.completed
                      ? "Achievement Completed!"
                      : "Progress Achievement"}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00DDB3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Add a named export specifically for AchievementSection to match the import
export const AchievementSection = AchievementsSection;
