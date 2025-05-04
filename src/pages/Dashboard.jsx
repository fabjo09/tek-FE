"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  X,
  Share2,
  ExternalLink,
  CheckCircle2,
  Trophy,
  Award,
  Flame,
  LightbulbIcon,
} from "lucide-react";
import { AchievementsSection } from "./components/AchievementsSection";
import { AchievementProgress } from "../pages/components/AchievementProgress";
import axios from "axios";

// Static array of image URLs for random assignment to news items
const articleImages = [
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop",
  "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/128867/coins-currency-investment-insurance-128867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg",
  "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/714699/pexels-photo-714699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

// Static array of avatar URLs for random assignment to authors
const avatarImages = [
  "https://randomuser.me/api/portraits/women/1.jpg",
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
  "https://randomuser.me/api/portraits/men/2.jpg",
  "https://randomuser.me/api/portraits/women/3.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
  "https://randomuser.me/api/portraits/men/4.jpg",
  "https://randomuser.me/api/portraits/women/5.jpg",
  "https://randomuser.me/api/portraits/men/5.jpg",
  "https://randomuser.me/api/portraits/women/6.jpg",
  "https://randomuser.me/api/portraits/men/6.jpg",
];

// Get a random image from the article images array
const getRandomArticleImage = () => {
  const randomIndex = Math.floor(Math.random() * articleImages.length);
  return articleImages[randomIndex];
};

// Get a random avatar from the avatar images array
const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarImages.length);
  return avatarImages[randomIndex];
};

// Sample achievement data
const sampleAchievements = [
  {
    id: "daily-streak",
    name: "Start a streak",
    description: "Complete your first daily lesson",
    progress: 0,
    total: 1,
    icon: "flame",
    iconColor: "#f97316", // orange-500
    backgroundColor: "bg-gray-900",
    chestColor: "#cd7f32", // bronze
    completed: false,
    type: "daily",
    hoursLeft: 12,
  },
  {
    id: "perfect-score",
    name: "Score 80% or higher",
    description: "Get a high score in 3 lessons",
    progress: 0,
    total: 3,
    icon: "star",
    iconColor: "#3b82f6", // blue-500
    backgroundColor: "bg-gray-900",
    chestColor: "#c0c0c0", // silver
    completed: false,
    type: "daily",
    hoursLeft: 12,
  },
  {
    id: "study-time",
    name: "Read Article",
    description: "Read articles from the news section",
    progress: 0,
    total: 10,
    icon: "book",
    iconColor: "#eab308", // yellow-500
    backgroundColor: "bg-gray-900",
    chestColor: "#cd7f32", // bronze
    completed: false,
    type: "daily",
    hoursLeft: 12,
  },
  {
    id: "complete-course",
    name: "Course Champion",
    description: "Complete your first full course",
    progress: 0,
    total: 20,
    icon: "trophy",
    iconColor: "#8b5cf6", // purple-500
    backgroundColor: "bg-gray-900",
    chestColor: "#ffd700", // gold
    completed: false,
    type: "challenge",
    daysLeft: 28,
  },
  {
    id: "math-genius",
    name: "Math Genius",
    description: "Solve 10 complex math problems",
    progress: 0,
    total: 10,
    icon: "lightbulb",
    iconColor: "#10b981", // green-500
    backgroundColor: "bg-gray-900",
    chestColor: "#ffd700", // gold
    completed: false,
    type: "milestone",
  },
];

// Removed mock news items

const iconMap = {
  star: <Star className="h-5 w-5 text-white" />,
  award: <Award className="h-5 w-5 text-white" />,
  flame: <Flame className="h-5 w-5 text-white" />,
  book: <BookOpen className="h-5 w-5 text-white" />,
  check: <CheckCircle2 className="h-5 w-5 text-white" />,
  lightbulb: <LightbulbIcon className="h-5 w-5 text-white" />,
  trophy: <Trophy className="h-5 w-5 text-white" />,
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [showMilestoneAnimation, setShowMilestoneAnimation] = useState(false);
  const [completedMilestoneId, setCompletedMilestoneId] = useState(null);
  const [achievements, setAchievements] = useState(sampleAchievements);
  const [showSection, setShowSection] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [justEarnedAchievement, setJustEarnedAchievement] = useState(null);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [showMilestoneInfoModal, setShowMilestoneInfoModal] = useState(false);
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      name: "Quiz Completed",
      completed: true,
      current: false,
      icon: <CheckCircle2 className="h-6 w-6" />,
    },
    {
      id: 2,
      name: "Read First Article",
      completed: false,
      current: true,
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      id: 3,
      name: "Complete Assessment",
      completed: false,
      current: false,
      icon: <Star className="h-6 w-6" />,
    },
    {
      id: 4,
      name: "Earn Certificate",
      completed: false,
      current: false,
      icon: <Trophy className="h-6 w-6" />,
    },
    {
      id: 5,
      name: "Join Community",
      completed: false,
      current: false,
      icon: <Users className="h-6 w-6" />,
    },
  ]);
  const [newsItems, setNewsItems] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Calculate total completion percentage
  const totalProgress = achievements.reduce(
    (sum, item) => sum + item.progress / item.total,
    0
  );
  const totalCompletion = Math.round(
    (totalProgress / achievements.length) * 100
  );

  // Complete an achievement
  const completeAchievement = (id) => {
    setAchievements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, progress: item.total, completed: true };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    // Simulate loading in of achievements section
    const timer = setTimeout(() => {
      setShowSection(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle voting on news items
  const handleVote = (id, direction) => {
    setUserVotes((prev) => {
      // If already voted the same way, remove the vote
      if (prev[id] === direction) {
        const newVotes = { ...prev };
        delete newVotes[id];
        return newVotes;
      }
      // Otherwise set the vote
      return { ...prev, [id]: direction };
    });
  };

  // Calculate adjusted vote count based on user votes
  const getAdjustedVotes = (id, type, originalVotes) => {
    // No user vote, return original count
    if (!userVotes[id]) return originalVotes;

    // Upvote calculation
    if (type === "up") {
      return userVotes[id] === "up" ? originalVotes + 1 : originalVotes;
    }
    // Downvote calculation
    else {
      return userVotes[id] === "down" ? originalVotes + 1 : originalVotes;
    }
  };

  // Handle clicking on a milestone
  const handleMilestoneClick = (milestone) => {
    if (milestone.completed) {
      // If already completed, show a different message
      setCompletedMilestoneId(milestone.id);
      setShowMilestoneAnimation(true);

      // Reset animation after it completes
      setTimeout(() => {
        setShowMilestoneAnimation(false);
      }, 3000);
    } else {
      // If not completed, show info modal about how to complete it
      setSelectedMilestone(milestone);
      setShowMilestoneInfoModal(true);
    }
  };

  // This function is now only used when explicitly calling it from a user interaction
  const completeMilestone = (id) => {
    setCompletedMilestoneId(id);
    setShowMilestoneAnimation(true);

    // Update the milestones using state
    setMilestones((currentMilestones) =>
      currentMilestones.map((milestone) => {
        if (milestone.id === id) {
          return { ...milestone, completed: true, current: false };
        }
        if (milestone.id === id + 1) {
          return { ...milestone, current: true };
        }
        return milestone;
      })
    );

    // Reset animation after it completes
    setTimeout(() => {
      setShowMilestoneAnimation(false);
    }, 3000);
  };

  // Handle news image click in the news modal
  const handleNewsImageClick = (newsItem) => {
    if (newsItem.link) {
      window.open(newsItem.link, "_blank");

      // Update the "Read Article" achievement
      setAchievements((prev) =>
        prev.map((item) => {
          if (item.id === "study-time") {
            // Get the current progress
            const currentProgress = item.progress || 0;
            const newProgress = currentProgress + 1;

            // Define tier thresholds
            const bronzeTier = 1;
            const silverTier = 5;
            const goldTier = 10;

            // Calculate the current tier before the update
            const currentTier =
              currentProgress >= goldTier
                ? 3
                : currentProgress >= silverTier
                ? 2
                : currentProgress >= bronzeTier
                ? 1
                : 0;

            // Calculate the new tier after the update
            const newTier =
              newProgress >= goldTier
                ? 3
                : newProgress >= silverTier
                ? 2
                : newProgress >= bronzeTier
                ? 1
                : 0;

            // Only set achievement as earned if tier changed
            const reachedNewTier = newTier > currentTier;

            // Create a complete tiered achievement structure
            const updatedAchievement = {
              ...item,
              progress: newProgress,
              completed: newProgress >= goldTier, // Only fully complete at gold
              currentTier: newTier,
              tierProgress: newProgress,
              tierTotal:
                newTier === 2
                  ? goldTier
                  : newTier === 1
                  ? silverTier
                  : bronzeTier,
              // Ensure tiers are properly structured
              tiers: [
                {
                  name: "bronze",
                  required: bronzeTier,
                  color: "#cd7f32",
                  completed: newProgress >= bronzeTier,
                },
                {
                  name: "silver",
                  required: silverTier,
                  color: "#c0c0c0",
                  completed: newProgress >= silverTier,
                },
                {
                  name: "gold",
                  required: goldTier,
                  color: "#ffd700",
                  completed: newProgress >= goldTier,
                },
              ],
            };

            // Only set the achievement as just earned if we reached a new tier
            if (reachedNewTier) {
              setJustEarnedAchievement(updatedAchievement);
            }

            return updatedAchievement;
          }
          return item;
        })
      );

      // Mark the "First Course" milestone as completed in the state
      // but don't automatically show the animation
      setMilestones((currentMilestones) =>
        currentMilestones.map((milestone) => {
          if (milestone.id === 2) {
            return { ...milestone, completed: true, current: false };
          }
          if (milestone.id === 3) {
            return { ...milestone, current: true };
          }
          return milestone;
        })
      );
    }
  };

  // Add an effect to handle the congratulations modal
  useEffect(() => {
    if (justEarnedAchievement && !selectedNews) {
      // Show congratulations modal when news modal closes and we've earned an achievement
      setShowCongratulationsModal(true);
      // Clear the just earned achievement to prevent showing multiple times
      setJustEarnedAchievement(null);
    }
  }, [selectedNews, justEarnedAchievement]);

  // Fetch news items from API
  useEffect(() => {
    const fetchNewsItems = async () => {
      setIsLoadingNews(true);
      try {
        const response = await axios.get(
          "/api/recommendations/articles/1?limit=8"
        );
        const apiData = response.data;

        // Transform API data to match the component's expected format
        const transformedData = apiData.map((item, index) => ({
          id: index + 1,
          title: item.name,
          description: item.info.description,
          image: getRandomArticleImage(), // Use random image if none provided
          author: {
            name: item.info.author?.name || "Tablla Author",
            handle: item.info.author?.handle || "@tablla",
            avatar: getRandomAvatar(), // Assign a random avatar
          },
          date: item.info.date,
          readTime: item.info.readTime,
          upvotes: item.info.upvotes,
          downvotes: item.info.downvotes,
          comments: item.info.comments,
          tags: [item.info.keyword].filter(Boolean), // Convert keyword to tag array
          source: item.info.source,
          link: item.url,
        }));

        setNewsItems(transformedData);
        setIsLoadingNews(false);
      } catch (error) {
        console.error("Error fetching news articles:", error);
        setIsLoadingNews(false);
      }
    };

    fetchNewsItems();
  }, []);

  return (
    <div className="space-y-6">
      {/* Milestone Progress Bar */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 overflow-hidden">
          {/* Progress Bar Section */}
          <div className="mb-8 px-4 pt-4">
            <div className="relative mx-auto max-w-5xl">
              <div className="h-4 bg-gray-100 rounded-full mb-14 relative">
                <div
                  className="h-full bg-teal-500 rounded-full absolute top-0 left-0 transition-all duration-500"
                  style={{
                    width: `${
                      (milestones.filter((m) => m.completed).length /
                        milestones.length) *
                      100
                    }%`,
                  }}
                />

                {/* Milestone Markers */}
                <div className="absolute top-[50%] left-0 w-full flex justify-between transform -translate-y-1/2">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="relative cursor-pointer"
                      onClick={() => handleMilestoneClick(milestone)}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center z-10 relative shadow-md transition-all duration-300",
                          milestone.completed
                            ? "bg-gradient-to-br from-[#00DDB3] to-teal-600 text-white"
                            : milestone.current
                            ? "bg-white border-4 border-[#00DDB3] shadow-teal-200"
                            : "bg-gray-200 hover:bg-gray-300"
                        )}
                      >
                        <span className="text-xl">{milestone.icon}</span>

                        {/* Current milestone highlight */}
                        {milestone.current && (
                          <AnimatePresence>
                            {showMilestoneAnimation &&
                            completedMilestoneId === milestone.id ? (
                              <motion.div
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                exit={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 1, repeat: 2 }}
                                className="absolute inset-0 rounded-full bg-[#00DDB3]"
                              />
                            ) : (
                              <motion.div
                                animate={{
                                  scale: [1, 1.1, 1],
                                  opacity: [1, 0.8, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="absolute inset-0 rounded-full bg-teal-200 -z-10"
                              />
                            )}
                          </AnimatePresence>
                        )}
                      </div>

                      {/* Milestone Label */}
                      <div
                        className="absolute top-16 transform -translate-x-1/2"
                        style={{ left: "50%", width: "120px" }}
                      >
                        <p
                          className={cn(
                            "text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis font-semibold",
                            milestone.completed
                              ? "text-[#00DDB3]"
                              : milestone.current
                              ? "text-teal-800"
                              : "text-gray-600"
                          )}
                        >
                          {milestone.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Heading Section */}
          <div
            className={`mt-16 w-full flex justify-between items-center bg-gray-50 p-5 rounded-${
              showAchievements ? "t-lg" : "lg"
            } shadow-sm ${!showAchievements ? "mb-8" : "mb-0"}`}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Your Learning Journey
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAchievements(!showAchievements)}
              className="text-sm font-medium px-4 text-black bg-[#00DDB3] border-[#00DDB3] hover:bg-[#00DDB3]/80"
            >
              {showAchievements ? "Hide Achievements" : "View Achievements"}
            </Button>
          </div>

          {/* Achievements Section */}
          {showAchievements && (
            <div className="mt-6">
              <AchievementsSection externalAchievements={achievements} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Feed - Direct (No Tabs) */}
      <Card>
        <CardHeader>
          <CardTitle>Latest News & Updates</CardTitle>
          <CardDescription>
            Stay informed with the latest articles and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingNews ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00DDB3]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {newsItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-[#00DDB3] flex flex-col"
                  onClick={() => setSelectedNews(item)}
                >
                  {item.image && (
                    <div className="h-28 relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  <div className="flex-1 flex flex-col p-3 overflow-hidden">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <img
                          src={item.author.avatar || "/placeholder.svg"}
                          alt={item.author.name}
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium truncate">
                          {item.author.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.author.handle}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-base font-bold mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span>{item.date}</span>
                      <span className="mx-1">•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>

                  <div className="border-t bg-gray-50 p-2 flex justify-between mt-auto">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "p-1 h-7 rounded-md flex items-center",
                          userVotes[item.id] === "up"
                            ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                            : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(item.id, "up");
                        }}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">
                          {getAdjustedVotes(item.id, "up", item.upvotes)}
                        </span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "p-1 h-7 rounded-md flex items-center",
                          userVotes[item.id] === "down"
                            ? "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(item.id, "down");
                        }}
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">
                          {getAdjustedVotes(item.id, "down", item.downvotes)}
                        </span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-7 rounded-md flex items-center text-gray-600 hover:bg-teal-50 hover:text-[#00DDB3]"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">
                          {item.comments}
                        </span>
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-7 rounded-md text-gray-500 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share functionality would go here
                      }}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Item Modal */}
      <Dialog
        open={!!selectedNews}
        onOpenChange={(open) => !open && setSelectedNews(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                {selectedNews?.author.avatar && (
                  <img
                    src={selectedNews.author.avatar || "/placeholder.svg"}
                    alt={selectedNews.author.name}
                    width={40}
                    height={40}
                  />
                )}
              </div>
              <div>
                <DialogTitle className="text-lg">
                  {selectedNews?.author.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedNews?.author.handle}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-2">
            <h2 className="text-xl font-bold mb-3">{selectedNews?.title}</h2>

            {selectedNews?.image && (
              <div
                className="relative h-48 mb-3 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleNewsImageClick(selectedNews)}
              >
                <img
                  src={selectedNews.image || "/placeholder.svg"}
                  alt={selectedNews.title}
                  className="object-cover w-full h-full"
                />
                {selectedNews.link && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white text-black px-4 py-2 rounded-full font-medium">
                      View Article
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="max-h-24 overflow-y-auto mb-3 pr-2 text-gray-700 text-sm border rounded-md p-3 bg-gray-50">
              <p>{selectedNews?.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {selectedNews?.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-xs text-gray-600">
                <span className="font-medium mr-2">Source:</span>
                <a
                  href={selectedNews?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedNews?.source}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="text-xs text-gray-600">
                {selectedNews?.date} • {selectedNews?.readTime}
              </div>
            </div>

            <div className="border-t pt-3 mt-3">
              <h3 className="font-medium mb-2 text-sm">Best discussions</h3>

              <div className="space-y-2">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">
                      This is really insightful!
                    </p>
                    <span className="text-xs text-gray-500">8 Comments</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    The research on digital twins in civil engineering is
                    promising for sustainable construction practices.
                  </p>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">
                      How does this integrate with existing BIM workflows?
                    </p>
                    <span className="text-xs text-gray-500">5 Comments</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    I'm curious about implementation costs for medium-sized
                    engineering firms.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "p-1 h-6 rounded-md flex items-center",
                    selectedNews && userVotes[selectedNews.id] === "up"
                      ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                  )}
                  onClick={() =>
                    selectedNews && handleVote(selectedNews.id, "up")
                  }
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">
                    {selectedNews &&
                      getAdjustedVotes(
                        selectedNews.id,
                        "up",
                        selectedNews.upvotes
                      )}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "p-1 h-6 rounded-md flex items-center",
                    selectedNews && userVotes[selectedNews.id] === "down"
                      ? "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  )}
                  onClick={() =>
                    selectedNews && handleVote(selectedNews.id, "down")
                  }
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">
                    {selectedNews &&
                      getAdjustedVotes(
                        selectedNews.id,
                        "down",
                        selectedNews.downvotes
                      )}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 rounded-md flex items-center text-gray-600 hover:bg-teal-50 hover:text-[#00DDB3]"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">
                    {selectedNews?.comments}
                  </span>
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <Share2 className="h-3 w-3" />
                </Button>

                {selectedNews?.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 rounded-md text-gray-500 hover:bg-gray-100"
                    onClick={() => handleNewsImageClick(selectedNews)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Congratulations Modal */}
      <AnimatePresence>
        {showCongratulationsModal && (
          <Dialog
            open={showCongratulationsModal}
            onOpenChange={setShowCongratulationsModal}
          >
            <DialogContent
              className="border border-[#00DDB3]/50 rounded-lg overflow-hidden bg-gradient-to-br from-[#001a17] to-[#008575] p-0 max-w-md"
              style={{
                boxShadow: "inset 0 0 20px rgba(0, 221, 179, 0.15)",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-center p-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-2 text-gray-200">
                    Congratulations!
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-center text-lg">
                    {justEarnedAchievement?.currentTier === 3
                      ? "You've earned a Gold Medal!"
                      : justEarnedAchievement?.currentTier === 2
                      ? "You've earned a Silver Medal!"
                      : "You've earned a Bronze Medal!"}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-6 flex flex-col items-center">
                  {/* Achievement medal animation */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="relative mb-6"
                  >
                    <div
                      className={`w-32 h-32 rounded-full flex items-center justify-center ${
                        justEarnedAchievement?.currentTier === 3
                          ? "bg-gradient-to-br from-[#00DDB3] to-[#008575]"
                          : justEarnedAchievement?.currentTier === 2
                          ? "bg-gradient-to-br from-gray-400 to-gray-300"
                          : "bg-gradient-to-br from-amber-700 to-yellow-600"
                      }`}
                    >
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center ${
                          justEarnedAchievement?.currentTier === 3
                            ? "bg-gradient-to-br from-[#008575] to-[#00DDB3]"
                            : justEarnedAchievement?.currentTier === 2
                            ? "bg-gradient-to-br from-gray-300 to-gray-400"
                            : "bg-gradient-to-br from-yellow-600 to-amber-700"
                        }`}
                      >
                        <BookOpen className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute -inset-4"
                      animate={{
                        background: [
                          "radial-gradient(circle, rgba(0, 221, 179, 0.3) 0%, transparent 70%)",
                          "radial-gradient(circle, rgba(0, 221, 179, 0.1) 0%, transparent 70%)",
                          "radial-gradient(circle, rgba(0, 221, 179, 0.3) 0%, transparent 70%)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  </motion.div>

                  {/* Achievement text */}
                  <h3 className="text-xl font-bold text-[#00DDB3] mb-2">
                    Read Article
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {justEarnedAchievement?.currentTier === 3
                      ? "You've reached the Gold tier! You've mastered this achievement."
                      : justEarnedAchievement?.currentTier === 2
                      ? "You've reached the Silver tier! Keep reading articles to progress to Gold."
                      : "You've reached the Bronze tier! Keep reading articles to progress to Silver."}
                  </p>

                  {/* Progress indicator */}
                  <div className="w-full mb-6 px-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        {justEarnedAchievement?.currentTier === 3
                          ? "Achievement Complete!"
                          : justEarnedAchievement?.currentTier === 2
                          ? "Progress to Gold"
                          : "Progress to Silver"}
                      </span>
                      <span className="font-medium text-gray-300">
                        {justEarnedAchievement?.progress || 1}/
                        {justEarnedAchievement?.currentTier === 2 ? 10 : 5}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          justEarnedAchievement?.currentTier === 3
                            ? "bg-gradient-to-r from-[#008575] to-[#00DDB3]"
                            : justEarnedAchievement?.currentTier === 2
                            ? "bg-gradient-to-r from-gray-400 to-gray-300"
                            : "bg-gradient-to-r from-amber-500 to-yellow-400"
                        }`}
                        style={{
                          width: `${
                            justEarnedAchievement?.currentTier === 3
                              ? "100%"
                              : justEarnedAchievement?.currentTier === 2
                              ? `${
                                  (justEarnedAchievement?.progress || 1 / 10) *
                                  100
                                }%`
                              : `${
                                  (justEarnedAchievement?.progress || 1 / 5) *
                                  100
                                }%`
                          }`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Action button */}
                  <Button
                    onClick={() => setShowCongratulationsModal(false)}
                    className="relative overflow-hidden bg-transparent border border-[#00DDB3]/50 hover:bg-[#00DDB3]/10 text-white group"
                    style={{
                      boxShadow: "0 0 15px rgba(0, 221, 179, 0.2)",
                    }}
                  >
                    <span className="relative z-10">Continue Learning</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00DDB3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </Button>
                </div>

                {/* Completion Animation */}
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
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Milestone completion animation */}
      <AnimatePresence>
        {showMilestoneAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-xl p-8 text-center shadow-xl"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 1 }}
                className="w-20 h-20 bg-[#00DDB3] rounded-full flex items-center justify-center mx-auto mb-4"
              >
                {completedMilestoneId &&
                  (milestones.find((m) => m.id === completedMilestoneId)
                    ?.icon || <Star className="h-10 w-10 text-white" />)}
              </motion.div>

              <motion.h2
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-2xl font-bold mb-2"
              >
                {milestones.find((m) => m.id === completedMilestoneId)
                  ?.completed
                  ? "Milestone Achieved!"
                  : "Milestone Completed!"}
              </motion.h2>

              <p className="text-gray-600 mb-4">
                {milestones.find((m) => m.id === completedMilestoneId)
                  ?.completed
                  ? `You've already achieved the "${
                      (completedMilestoneId &&
                        milestones.find((m) => m.id === completedMilestoneId)
                          ?.name) ||
                      "milestone"
                    }"!`
                  : `You've completed the "${
                      (completedMilestoneId &&
                        milestones.find((m) => m.id === completedMilestoneId)
                          ?.name) ||
                      "milestone"
                    }"!`}
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={() => setShowMilestoneAnimation(false)}
                  className="bg-[#00DDB3] hover:bg-teal-600"
                >
                  Continue Learning
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Info Modal */}
      <Dialog
        open={showMilestoneInfoModal}
        onOpenChange={setShowMilestoneInfoModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          {selectedMilestone && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedMilestone.name}
                </DialogTitle>
                <DialogDescription>
                  How to complete this milestone
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    {selectedMilestone.icon}
                  </div>
                  <div>
                    <p className="font-medium">{selectedMilestone.name}</p>
                  </div>
                </div>

                {selectedMilestone.id === 2 && (
                  <div className="space-y-4">
                    <p>
                      To complete the <strong>First Course</strong> milestone:
                    </p>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-medium text-teal-800 mb-2">
                        Read an Article
                      </h4>
                      <p className="text-sm text-gray-700">
                        Click on any news article in the Feed tab and read the
                        article. This will complete your first course and earn
                        you a bronze achievement.
                      </p>
                    </div>

                    <Button
                      className="w-full mt-2 bg-[#00DDB3] hover:bg-teal-600"
                      onClick={() => {
                        setShowMilestoneInfoModal(false);
                        setActiveTab("feed");
                      }}
                    >
                      Go to Feed
                    </Button>
                  </div>
                )}

                {selectedMilestone.id === 3 && (
                  <div className="space-y-4">
                    <p>
                      To complete the <strong>Assessment</strong> milestone:
                    </p>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-medium text-teal-800 mb-2">
                        Complete a Course Quiz
                      </h4>
                      <p className="text-sm text-gray-700">
                        Go to one of your courses and complete the final
                        assessment to earn this milestone.
                      </p>
                    </div>

                    <Button
                      className="w-full mt-2 bg-[#00DDB3] hover:bg-teal-600"
                      onClick={() => {
                        setShowMilestoneInfoModal(false);
                        setActiveTab("courses");
                      }}
                    >
                      Go to My Courses
                    </Button>
                  </div>
                )}

                {selectedMilestone.id === 4 && (
                  <div className="space-y-4">
                    <p>
                      To <strong>Earn a Certificate</strong>:
                    </p>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-medium text-teal-800 mb-2">
                        Complete All Course Material
                      </h4>
                      <p className="text-sm text-gray-700">
                        Finish all the modules in any course to earn a
                        completion certificate.
                      </p>
                    </div>

                    <Button
                      className="w-full mt-2 bg-[#00DDB3] hover:bg-teal-600"
                      onClick={() => {
                        setShowMilestoneInfoModal(false);
                        setActiveTab("courses");
                      }}
                    >
                      Go to My Courses
                    </Button>
                  </div>
                )}

                {selectedMilestone.id === 5 && (
                  <div className="space-y-4">
                    <p>
                      To <strong>Join the Community</strong>:
                    </p>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-medium text-teal-800 mb-2">
                        Connect with Other Learners
                      </h4>
                      <p className="text-sm text-gray-700">
                        Join our learning community to connect with other
                        students and experts in the field.
                      </p>
                    </div>

                    <Button className="w-full mt-2 bg-[#00DDB3] hover:bg-teal-600">
                      Join Community
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
