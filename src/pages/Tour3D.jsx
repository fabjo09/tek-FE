import React, { useState } from "react";
import { Button } from "../components/ui/button";

export default function Tour3D() {
  const [currentView, setCurrentView] = useState("entrance");

  // Simulated 3D tour views
  const views = {
    entrance: {
      title: "Main Entrance",
      description:
        "Welcome to our virtual campus tour. This is the main entrance to the university.",
      image: "https://via.placeholder.com/800x500?text=Main+Entrance",
    },
    library: {
      title: "Library",
      description:
        "Our state-of-the-art library with over 1 million books and digital resources.",
      image: "https://via.placeholder.com/800x500?text=Library",
    },
    cafeteria: {
      title: "Cafeteria",
      description:
        "The main dining hall where students gather for meals and socializing.",
      image: "https://via.placeholder.com/800x500?text=Cafeteria",
    },
    classroom: {
      title: "Classroom",
      description:
        "Modern classrooms equipped with the latest technology for interactive learning.",
      image: "https://via.placeholder.com/800x500?text=Classroom",
    },
    dorms: {
      title: "Dormitories",
      description:
        "Comfortable student housing with all amenities for a great college experience.",
      image: "https://via.placeholder.com/800x500?text=Dormitories",
    },
  };

  // Get current view data
  const currentViewData = views[currentView];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">3D Campus Tour</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="relative">
          {/* Image placeholder for 3D view */}
          <img
            src={currentViewData.image}
            alt={currentViewData.title}
            className="w-full h-[500px] object-cover"
          />

          {/* Navigation circles */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4">
              {currentView !== "entrance" && (
                <div
                  className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center cursor-pointer hover:bg-white"
                  onClick={() => setCurrentView("entrance")}
                >
                  <span className="text-xs">Entrance</span>
                </div>
              )}

              {currentView !== "library" && (
                <div
                  className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center cursor-pointer hover:bg-white"
                  onClick={() => setCurrentView("library")}
                >
                  <span className="text-xs">Library</span>
                </div>
              )}

              {currentView !== "cafeteria" && (
                <div
                  className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center cursor-pointer hover:bg-white"
                  onClick={() => setCurrentView("cafeteria")}
                >
                  <span className="text-xs">Cafeteria</span>
                </div>
              )}

              {currentView !== "classroom" && (
                <div
                  className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center cursor-pointer hover:bg-white"
                  onClick={() => setCurrentView("classroom")}
                >
                  <span className="text-xs">Classroom</span>
                </div>
              )}

              {currentView !== "dorms" && (
                <div
                  className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center cursor-pointer hover:bg-white"
                  onClick={() => setCurrentView("dorms")}
                >
                  <span className="text-xs">Dorms</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{currentViewData.title}</h2>
          <p className="text-gray-600 mb-4">{currentViewData.description}</p>

          <div className="flex flex-wrap gap-2">
            {Object.keys(views).map((view) => (
              <Button
                key={view}
                variant={currentView === view ? "default" : "outline"}
                onClick={() => setCurrentView(view)}
              >
                {views[view].title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Tour Information</h2>
          <p className="text-gray-600 mb-4">
            This virtual tour gives you an interactive look at our campus
            facilities. Navigate between different locations to explore the
            university environment.
          </p>
          <Button className="w-full">Book an In-Person Tour</Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Additional Resources</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Campus Map (PDF)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Student Accommodation Guide
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Facilities Overview
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Virtual Events Calendar
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
