"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  Target,
  BookOpen,
  Users,
  Lightbulb,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/ui/auth/AuthModal";
import axios from "axios";
import { DotLottiePlayer } from "@dotlottie/react-player";

// Mascot messages
const mascotMessages = {
  intro: {
    type: "mascot",
    title: "Welcome to the career pathfinder!",
    message:
      "Hi, I'm Tablla! I'll help you discover your ideal career path. Answer honestly for the best results. Ready to begin?",
    buttonText: "Let's Start",
  },
  motivation1: {
    type: "mascot",
    title: "You're doing great!",
    message:
      "I'm getting to know you better already! Your answers show you have a unique perspective. Let's continue exploring your potential.",
    buttonText: "Continue",
  },
  motivation2: {
    type: "mascot",
    title: "Almost there!",
    message:
      "Your answers are revealing a fascinating pattern. Just a few more questions to refine your career profile!",
    buttonText: "Keep Going",
  },
  congratulations: {
    type: "mascot",
    title: "Congratulations!",
    message:
      "You've completed the career pathfinder! I've gathered some amazing insights about your potential. Create an account to see your personalized career recommendations!",
    buttonText: "See Results",
  },
};

export default function Quiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // New state for API data
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  // State for mascot messages display
  const [currentDisplay, setCurrentDisplay] = useState("intro"); // "intro", "questions", "motivation1", etc.
  const [questionIndex, setQuestionIndex] = useState(0); // Tracks actual question index

  // Fetch quiz data from API using axios
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        // Using axios to fetch quiz data through the proxy to avoid CORS issues
        const response = await axios.get("/api/quizzes/type/evaluation");

        // Check if we have a valid response with data
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0 &&
          response.data.data[0].questions &&
          response.data.data[0].questions.length > 0
        ) {
          // Get the first quiz from the data array
          const quizData = response.data.data[0];
          setQuizData(quizData);

          // Initialize empty arrays for each question to store selected tags
          const initialTags = {};
          quizData.questions.forEach((q, index) => {
            initialTags[index] = [];
          });
          setSelectedTags(initialTags);
        } else {
          throw new Error("No quiz data available in the expected format");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch quiz data");
        console.error("Error fetching quiz data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  // Get the current question from the quiz data
  const currentQuestion = quizData?.questions?.[questionIndex];

  // Handle option selection
  const handleOptionSelect = (option, questionIndex) => {
    setSelectedOption(option);

    // Store tags when an option is selected
    const currentQuestionData = quizData?.questions[questionIndex];
    if (currentQuestionData) {
      const selectedAnswer = currentQuestionData.properties.answers.find(
        (ans) => ans.answer === option
      );

      if (selectedAnswer) {
        // Save the tags for this question's selected answer
        setSelectedTags((prev) => {
          const updatedTags = {
            ...prev,
            [questionIndex]: selectedAnswer.tags,
          };
          console.log("Selected tags updated:", updatedTags);
          return updatedTags;
        });
      }
    }
  };

  // Handle continue to next step
  const handleContinue = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Save answer if applicable and in question mode
    if (currentDisplay === "questions" && selectedOption) {
      setAnswers({ ...answers, [questionIndex]: selectedOption });
    }

    setTimeout(() => {
      // Determine what to show next based on current display
      switch (currentDisplay) {
        case "intro":
          setCurrentDisplay("questions");
          break;

        case "questions":
          // Move to next question or show mascot message
          if (questionIndex === 2) {
            // After first 3 questions, show first motivational message
            setCurrentDisplay("motivation1");
            setSelectedOption(null);
          } else if (questionIndex === 6) {
            // After 4 more questions (total 7), show second motivational message
            setCurrentDisplay("motivation2");
            setSelectedOption(null);
          } else if (questionIndex === quizData.questions.length - 1) {
            // After all questions, show congratulations message
            setCurrentDisplay("congratulations");
            setSelectedOption(null);
          } else {
            // Continue to next question
            setQuestionIndex(questionIndex + 1);
            setSelectedOption(null);
          }
          break;

        case "motivation1":
          // After first motivational message, go back to questions
          setCurrentDisplay("questions");
          setQuestionIndex(3); // Start from 4th question (index 3)
          break;

        case "motivation2":
          // After second motivational message, go back to questions
          setCurrentDisplay("questions");
          setQuestionIndex(7); // Start from 8th question (index 7)
          break;

        case "congratulations":
          // Quiz completed - flatten tags into a single array of unique tags
          const allTags = [...new Set(Object.values(selectedTags).flat())];
          console.log("Quiz completed, all unique tags:", allTags);

          // Store the flattened tags array to pass to the AuthModal
          localStorage.setItem("quiz_tags", JSON.stringify(allTags));

          setShowAuthModal(true);
          break;
      }
      setIsAnimating(false);
    }, 500);
  };

  // Handle back button
  const handleBack = () => {
    if (isAnimating) return;

    // Only allow going back in question mode
    if (currentDisplay !== "questions") return;

    setIsAnimating(true);
    setTimeout(() => {
      if (questionIndex > 0) {
        setQuestionIndex(questionIndex - 1);
        setSelectedOption(answers[questionIndex - 1] || null);
      } else if (currentDisplay === "questions" && questionIndex === 0) {
        // If on first question, go back to intro
        setCurrentDisplay("intro");
      }
      setIsAnimating(false);
    }, 500);
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!quizData) return 0;

    const totalSteps = quizData.questions.length + 4; // Questions + intro + 2 motivational messages + congrats
    let currentProgress = 0;

    if (currentDisplay === "intro") {
      currentProgress = 1;
    } else if (currentDisplay === "questions") {
      currentProgress = 2 + questionIndex; // Intro (1) + questions completed
    } else if (currentDisplay === "motivation1") {
      currentProgress = 5; // Intro + 3 questions + motivation1
    } else if (currentDisplay === "motivation2") {
      currentProgress = 10; // Intro + 3 questions + motivation1 + 4 questions + motivation2
    } else if (currentDisplay === "congratulations") {
      currentProgress = totalSteps - 1; // Everything except auth modal
    }

    return (currentProgress / totalSteps) * 100;
  };

  // Render mascot message screen
  const renderMascotMessage = (messageType) => {
    const message = mascotMessages[messageType];

    // Lottie animations for each message type
    const lottieUrls = {
      intro:
        "https://lottie.host/bb344871-d561-46b8-a8dc-417c0bff7727/Kb1TXfzcnl.lottie",
      motivation1:
        "https://lottie.host/dfb601f5-2670-4bbc-b2f0-c75a2f3f9bf7/XrMPZ32zoH.lottie",
      motivation2:
        "https://lottie.host/46f96490-906a-4505-b29f-4039178ebfe7/QoETpp5RiO.lottie",
      congratulations:
        "https://lottie.host/ae494b67-9ebb-4645-b893-a070aad4bed8/WH4l2aC3dj.lottie",
    };

    return (
      <div className="w-full max-w-xl mx-auto text-center">
        <>
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-1 relative">
            <p className="text-lg text-gray-700">{message.message}</p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-teal-50 border-r border-b border-teal-100"></div>
          </div>

          <div className="mb-6 mt-6 flex justify-center">
            <div className="w-80 h-80 flex items-center justify-center">
              <DotLottiePlayer src={lottieUrls[messageType]} autoplay loop />
            </div>
          </div>
        </>

        <Button
          onClick={handleContinue}
          className="mt-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-2 text-lg"
        >
          {message.buttonText}
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
        <p className="mt-4 text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {showAuthModal && (
        <AuthModal
          isOpen={true}
          onClose={() => setShowAuthModal(false)}
          quizAnswers={answers}
          quizTags={selectedTags}
        />
      )}

      {!showAuthModal && quizData && (
        <>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-100">
            <div
              className="h-full bg-green-500 transition-all duration-500 ease-in-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Back Button - only show in questions mode */}
          {currentDisplay === "questions" && questionIndex > 0 && (
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  currentDisplay === "questions"
                    ? `question-${questionIndex}`
                    : currentDisplay
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {currentDisplay === "intro" && renderMascotMessage("intro")}

                {currentDisplay === "motivation1" &&
                  renderMascotMessage("motivation1")}

                {currentDisplay === "motivation2" &&
                  renderMascotMessage("motivation2")}

                {currentDisplay === "congratulations" &&
                  renderMascotMessage("congratulations")}

                {currentDisplay === "questions" && currentQuestion && (
                  <div className="w-full">
                    <h2 className="text-xl font-medium text-center mb-6">
                      {currentQuestion.question}
                    </h2>

                    {/* Display question image if it exists */}
                    {currentQuestion.imageUrl && (
                      <div className="mb-6 flex justify-center">
                        <img
                          src={currentQuestion.imageUrl}
                          alt="Question illustration"
                          className="max-w-full h-auto rounded-lg max-h-60 object-contain"
                        />
                      </div>
                    )}

                    <div className="space-y-3 mt-6">
                      {currentQuestion.properties.answers.map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleOptionSelect(option.answer, questionIndex)
                            }
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              selectedOption === option.answer
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center">
                              <span>{option.answer}</span>
                            </div>
                          </button>
                        )
                      )}
                    </div>

                    {/* Continue button for questions */}
                    <div className="mt-8 flex justify-center">
                      <Button
                        onClick={handleContinue}
                        disabled={!selectedOption}
                        className={`bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-2 text-lg w-full max-w-xs ${
                          !selectedOption ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Continue Button - Only show for mascot messages */}
          {(currentDisplay === "intro" ||
            currentDisplay === "motivation1" ||
            currentDisplay === "motivation2" ||
            currentDisplay === "congratulations") && (
            <div className="p-4 flex justify-center opacity-0">
              {/* This is hidden because we already have a button in the mascot messages */}
              <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-2 text-lg w-full max-w-xs">
                Continue
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
