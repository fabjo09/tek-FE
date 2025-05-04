import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  BookOpen,
  MapPin,
  Users,
  Globe,
  TrendingUp,
  DollarSign,
  Briefcase,
  ChevronRight,
  X,
  Loader2,
  ChevronLeft,
  Mail,
  Clock,
} from "lucide-react";
import { Separator } from "../components/ui/separator";
import { useToast } from "../components/ui/use-toast";
import axios from "axios";

export default function University() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [universities, setUniversities] = useState([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [universityPhotos, setUniversityPhotos] = useState([]);
  const tourIframeRef = useRef(null);
  const campusContentRef = useRef(null);
  const photoSliderInterval = useRef(null);
  const { toast } = useToast();

  // Campus photos array (fallback)
  const defaultCampusPhotos = [
    {
      src: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1974&auto=format&fit=crop",
      alt: "Campus main view",
    },
    {
      src: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop",
      alt: "University library",
    },
    {
      src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1976&auto=format&fit=crop",
      alt: "Student dormitories",
    },
    {
      src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=2070&auto=format&fit=crop",
      alt: "Sports facilities",
    },
  ];

  // Process banner images when a university is selected
  const processBannerImages = (university) => {
    if (university && university.banner) {
      // Split the banner string by commas and filter out empty strings
      const allImages = university.banner
        .split(",")
        .filter((url) => url.trim())
        .map((url) => url.trim());

      if (allImages.length > 0) {
        // Create a modified university object with the first image as the banner
        const firstImage = allImages[0];
        const updatedUniversity = {
          ...university,
          banner: firstImage,
        };

        // Use the remaining images for the slider (or default if none left)
        const sliderImages = allImages.slice(1).map((url, index) => ({
          src: url,
          alt: `${university.name} campus image ${index + 1}`,
        }));

        setUniversityPhotos(
          sliderImages.length > 0 ? sliderImages : defaultCampusPhotos
        );

        return updatedUniversity;
      }
    }

    setUniversityPhotos(defaultCampusPhotos);
    return university;
  };

  const handleUniversitySelect = (university) => {
    // Process images and update the selected university
    const processedUniversity = processBannerImages(university);
    setSelectedUniversity(processedUniversity);

    // Reset the current photo index when selecting a new university
    setCurrentPhotoIndex(0);
  };

  const handleVirtualTour = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowVirtualTour(true);
    }, 2500);
  };

  const handleCloseTour = () => {
    setShowVirtualTour(false);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === universityPhotos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? universityPhotos.length - 1 : prevIndex - 1
    );
  };

  // Add resize event listener for the iframe
  useEffect(() => {
    const handleResize = () => {
      if (tourIframeRef.current) {
        tourIframeRef.current.contentWindow.dispatchEvent(new Event("resize"));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle tab change to scroll to bottom when Campus Life is selected
  // and start auto-scrolling photo slider
  const handleTabChange = (value) => {
    if (value === "campus") {
      // Clear any existing interval
      if (photoSliderInterval.current) {
        clearInterval(photoSliderInterval.current);
      }

      // Start auto-scrolling the photo slider
      photoSliderInterval.current = setInterval(() => {
        nextPhoto();
      }, 5000);

      setTimeout(() => {
        if (campusContentRef.current) {
          campusContentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else {
      // Clear the interval when switching to other tabs
      if (photoSliderInterval.current) {
        clearInterval(photoSliderInterval.current);
        photoSliderInterval.current = null;
      }
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (photoSliderInterval.current) {
        clearInterval(photoSliderInterval.current);
      }
    };
  }, []);

  const MatchScore = ({ score }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 mb-2">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{Math.floor(score * 100)}%</span>
        </div>
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="transparent"
            stroke={
              score >= 0.49 ? "#10b981" : score >= 0.29 ? "#f59e0b" : "#ef4444"
            }
            strokeWidth="8"
            strokeDasharray={`${(2 * Math.PI * 36 * score).toFixed(2)} ${
              2 * Math.PI * 36 * (1 - score)
            }`}
          />
        </svg>
      </div>
      <span className="text-sm font-medium">Match Score</span>
    </div>
  );

  // Loading component with teal color
  const LoadingScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#00DDB3] mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Loading Virtual Tour</h3>
        <p className="text-gray-600">
          Preparing {selectedUniversity?.name || "University"} Virtual Tour
        </p>
      </div>
    </div>
  );

  // Fetch university data from API
  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoadingUniversities(true);
      try {
        const response = await axios.get(
          "/api/recommendations/majors/1?limit=50"
        );
        const apiData = response.data?.universities;
        setUniversities(apiData);
        setIsLoadingUniversities(false);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setIsLoadingUniversities(false);
        toast({
          title: "Error",
          description:
            "Failed to load university data. " +
            (error.response?.data?.message || error.message),
          variant: "destructive",
        });
      }
    };

    fetchUniversities();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {isLoading && <LoadingScreen />}

      {showVirtualTour ? (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {selectedUniversity?.name} Virtual Tour
            </h2>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={handleCloseTour}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div
            className="rounded-lg overflow-hidden bg-black shadow-xl mb-6 w-full"
            style={{ height: "calc(100vh - 180px)" }}
          >
            <iframe
              ref={tourIframeRef}
              src="/threejs/index.html"
              className="w-full h-full border-0"
              title={`${selectedUniversity?.name || "University"} Virtual Tour`}
              allow="accelerometer; autoplay; camera; fullscreen; gyroscope; magnetometer; microphone; xr-spatial-tracking"
            ></iframe>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">University Explorer</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* University List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Universities</h2>
                  <p className="text-sm text-gray-500">
                    Find your perfect match
                  </p>
                </div>
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {isLoadingUniversities ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#00DDB3] mx-auto mb-4" />
                      <p className="text-gray-500">Loading universities...</p>
                    </div>
                  ) : (
                    universities.map((university) => (
                      <div
                        key={university.id}
                        onClick={() => handleUniversitySelect(university)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 flex items-center ${
                          selectedUniversity?.id === university.id
                            ? "bg-blue-50"
                            : ""
                        }`}
                      >
                        <div className="flex-shrink-0 w-12 h-12 mr-4">
                          <img
                            src={university.logo}
                            alt={university.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{university.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {university.location}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MatchScore score={university.score || 0.5} />
                          <ChevronRight className="w-5 h-5 ml-2 text-gray-400" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* University Details */}
            <div className="lg:col-span-2">
              {selectedUniversity ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64 rounded-t-lg overflow-hidden mb-4">
                    <img
                      src={selectedUniversity.banner}
                      alt={selectedUniversity.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultCampusPhotos[0].src;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h2 className="text-3xl font-bold mb-1">
                          {selectedUniversity.name}
                        </h2>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant="outline"
                            className="bg-white/20 text-white"
                          >
                            Private
                          </Badge>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {selectedUniversity.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* University Content */}
                  <Tabs
                    defaultValue="overview"
                    className="bg-white rounded-lg shadow"
                    onValueChange={handleTabChange}
                  >
                    <TabsList className="border-b p-0 w-full justify-start rounded-none">
                      <TabsTrigger
                        value="overview"
                        className="rounded-none py-3 px-6"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="programs"
                        className="rounded-none py-3 px-6"
                      >
                        Programs
                      </TabsTrigger>
                      <TabsTrigger
                        value="campus"
                        className="rounded-none py-3 px-6"
                      >
                        Campus Life
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2">
                          <h3 className="text-xl font-semibold mb-3">About</h3>
                          <p className="text-gray-700 mb-6">
                            {selectedUniversity.description}
                          </p>

                          <h3 className="text-xl font-semibold mb-3">
                            Key Facts
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                              <div>
                                <p className="text-sm text-gray-500">Ranking</p>
                                <p className="font-medium">
                                  #{selectedUniversity.ranking} National
                                  Universities
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-5 h-5 mr-2 text-green-500" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  Acceptance Rate
                                </p>
                                <p className="font-medium">
                                  {selectedUniversity.acceptance_rate}%
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-5 h-5 mr-2 text-amber-500" />
                              <div>
                                <p className="text-sm text-gray-500">Tuition</p>
                                <p className="font-medium">
                                  {selectedUniversity.tuition} EUR
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Globe className="w-5 h-5 mr-2 text-purple-500" />
                              <div>
                                <p className="text-sm text-gray-500">Website</p>
                                <a
                                  href={
                                    selectedUniversity.website.startsWith(
                                      "http"
                                    )
                                      ? selectedUniversity.website
                                      : `https://${selectedUniversity.website}`
                                  }
                                  className="font-medium text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {selectedUniversity.website ||
                                    "university.edu"}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Card className="mt-4">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                Contact Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-sm">
                                <div className="flex">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>{selectedUniversity.location}</span>
                                </div>
                                <div className="flex">
                                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                  <a
                                    href={`mailto:${selectedUniversity.email}`}
                                    className="hover:underline text-blue-600"
                                  >
                                    {selectedUniversity.email ||
                                      "admissions@university.edu"}
                                  </a>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="programs" className="p-6">
                      <h3 className="text-xl font-semibold mb-4">
                        Popular Programs
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedUniversity?.majors ? (
                          selectedUniversity.majors.map((major, index) => (
                            <Card key={index}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                  {major.name}
                                </CardTitle>
                                <CardDescription>
                                  Bachelor's Degree
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center mb-2">
                                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="text-sm">4 years</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="text-sm">
                                    {major.job_placement_rate || "90%"} Job
                                    Placement
                                  </span>
                                </div>
                                <div className="flex items-center mb-4">
                                  <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="text-sm">
                                    Avg. Starting Salary:{" "}
                                    {major.average_salary || "$75,000"}
                                  </span>
                                </div>

                                {major.subjects &&
                                  major.subjects.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2 text-[#00DDB3]">
                                        Key Subjects:
                                      </h4>
                                      <div className="grid grid-cols-2 gap-1">
                                        {major.subjects
                                          .slice(0, 6)
                                          .map((subject, idx) => (
                                            <div
                                              key={idx}
                                              className="text-xs text-gray-600 flex items-center"
                                            >
                                              <div className="w-1.5 h-1.5 rounded-full bg-[#00DDB3] mr-1.5"></div>
                                              {subject.name}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-10 text-gray-500">
                            No program data available
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="campus"
                      className="p-0"
                      ref={campusContentRef}
                    >
                      {/* Full-width Photo Slider with Navigation Arrows */}
                      <div className="relative w-full">
                        {/* Main Image Container */}
                        <div className="aspect-[16/9] bg-gray-200 w-full">
                          <img
                            src={universityPhotos[currentPhotoIndex]?.src}
                            alt={universityPhotos[currentPhotoIndex]?.alt}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultCampusPhotos[0].src;
                            }}
                          />
                        </div>

                        {/* Only show navigation if there's more than one image */}
                        {universityPhotos.length > 1 && (
                          <>
                            {/* Left Transparent Gradient Overlay */}
                            <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black/50 to-transparent pointer-events-none"></div>

                            {/* Right Transparent Gradient Overlay */}
                            <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black/50 to-transparent pointer-events-none"></div>

                            {/* Left Arrow */}
                            <button
                              onClick={prevPhoto}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-20"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft className="h-6 w-6" />
                            </button>

                            {/* Right Arrow */}
                            <button
                              onClick={nextPhoto}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-20"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="h-6 w-6" />
                            </button>

                            {/* Photo Indicator Dots */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                              {universityPhotos.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentPhotoIndex(index)}
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    currentPhotoIndex === index
                                      ? "bg-[#00DDB3]"
                                      : "bg-white/60 hover:bg-white/80"
                                  }`}
                                  aria-label={`Go to slide ${index + 1}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Virtual Tour Button */}
                      <div className="flex justify-center p-8">
                        <Button
                          className="px-8 py-6 text-lg bg-[#00DDB3] hover:bg-[#00DDB3]/80 text-black"
                          onClick={handleVirtualTour}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin text-black" />
                              Loading Tour...
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-5 h-5 mr-2" />
                              Start Virtual Tour
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center bg-white rounded-lg shadow p-12">
                  <div className="text-center">
                    <div className="bg-[#00DDB3]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-[#00DDB3]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Select a University
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Choose a university from the list to view detailed
                      information about programs, admission requirements, and
                      campus life.
                    </p>
                    <Button className="bg-[#00DDB3] hover:bg-[#00DDB3]/80 text-black border-none">
                      Browse All Universities
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
