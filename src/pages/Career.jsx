"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Filter, Briefcase, Building, Search } from "lucide-react";
import { JobPostingCard } from "../components/ui/job-posting-card";
import { JobDetailModal } from "../components/ui/job-detail-modal";
import { JobFilterSidebar } from "../components/ui/job-filter-sidebar";
import React from "react";
import axios from "axios";

// Sample job data as fallback
const sampleJobs = [
  {
    id: 792,
    title: "Recruiter and HR Business Partner",
    excerpt:
      "About Inspira Education: Inspira Education Group is one of the fastest-growing edtech startups in the US.",
    companyName: "Inspira Education",
    companyLogo:
      "https://cdn-images.himalayas.app/uteciie2465aqb3ga6jxivo5blsj",
    employmentType: "Full Time",
    minSalary: 100000,
    maxSalary: 130000,
    seniority: ["Mid-level"],
    locationRestrictions: ["United States"],
    timezoneRestrictions: ["-10", "-9", "-8", "-7", "-6", "-5", "14"],
    categories: [
      "HR-Business-Partner",
      "Human-Resources-Business-Partner",
      "People-Business-Partner",
      "Senior-HR-Business-Partner",
      "Talent-Acquisition-Partner",
      "Recruiter",
      "Recruitment-Manager",
    ],
    parentCategories: ["Human Resources"],
    description: `<h3>About Inspira Education</h3><p>Inspira Education Group is one of the fastest-growing edtech startups in the US. We started with a simple mission to democratize access to high-quality coaching so that every student in the world has an equal opportunity to access the best opportunities.</p><p>As the world's leading network of top admissions coaches in medical, legal, business, and college studies, we're building software and services in one place—disrupting long-entrenched application processes with products and experiences that strive to provide an equal platform for candidates from diverse backgrounds worldwide.</p><h3>The Role</h3><p>At Inspira Education, we recognize that our people are our greatest asset, and we are excited to grow our team! We are on the lookout for an exceptional full-cycle recruiter and HR business partner to join our dynamic talent acquisition team.</p>`,
    pubDate: 1746270462,
    expiryDate: 1751454462,
    applicationLink:
      "https://himalayas.app/companies/inspira-education/jobs/recruiter-and-hr-business-partner",
    guid: "https://himalayas.app/companies/inspira-education/jobs/recruiter-and-hr-business-partner",
    tags: [
      "recruiting",
      "startup",
      "data_management",
      "business_law",
      "data",
      "human_resources",
      "quality_management",
      "data_analysis",
    ],
  },
  {
    id: 793,
    title: "Senior Frontend Developer",
    excerpt:
      "Join our team to build cutting-edge web applications with modern technologies.",
    companyName: "TechVision",
    companyLogo: "/placeholder.svg?height=80&width=80",
    employmentType: "Full Time",
    minSalary: 120000,
    maxSalary: 160000,
    seniority: ["Senior"],
    locationRestrictions: ["Remote", "United States"],
    categories: ["Frontend", "React", "JavaScript", "TypeScript"],
    parentCategories: ["Software Development"],
    description: `<h3>About TechVision</h3><p>TechVision is a leading technology company specializing in creating innovative web applications. We're looking for a Senior Frontend Developer to join our growing team.</p><h3>The Role</h3><p>As a Senior Frontend Developer, you'll be responsible for building high-quality user interfaces using React, TypeScript, and other modern web technologies.</p>`,
    pubDate: 1746180462,
    expiryDate: 1751354462,
    applicationLink: "https://example.com/jobs/senior-frontend-developer",
    guid: "https://example.com/jobs/senior-frontend-developer",
    tags: ["react", "typescript", "frontend", "javascript", "web_development"],
  },
  {
    id: 794,
    title: "Data Scientist",
    excerpt:
      "Help us turn data into actionable insights that drive business decisions.",
    companyName: "DataCraft Analytics",
    companyLogo: "/placeholder.svg?height=80&width=80",
    employmentType: "Full Time",
    minSalary: 110000,
    maxSalary: 150000,
    seniority: ["Mid-level", "Senior"],
    locationRestrictions: ["New York", "Remote"],
    categories: ["Data Science", "Machine Learning", "Analytics"],
    parentCategories: ["Data"],
    description: `<h3>About DataCraft Analytics</h3><p>DataCraft Analytics is a data-driven company that helps businesses make better decisions through advanced analytics.</p><h3>The Role</h3><p>As a Data Scientist, you'll work with large datasets to extract insights and build predictive models.</p>`,
    pubDate: 1746090462,
    expiryDate: 1751254462,
    applicationLink: "https://example.com/jobs/data-scientist",
    guid: "https://example.com/jobs/data-scientist",
    tags: ["python", "machine_learning", "data_analysis", "statistics", "sql"],
  },
  {
    id: 795,
    title: "Product Manager",
    excerpt:
      "Lead product development from concept to launch in our fast-growing startup.",
    companyName: "InnovateCo",
    companyLogo: "/placeholder.svg?height=80&width=80",
    employmentType: "Full Time",
    minSalary: 115000,
    maxSalary: 145000,
    seniority: ["Mid-level"],
    locationRestrictions: ["San Francisco", "Remote"],
    categories: ["Product Management", "Product Strategy", "User Experience"],
    parentCategories: ["Product"],
    description: `<h3>About InnovateCo</h3><p>InnovateCo is a startup focused on creating innovative solutions for everyday problems.</p><h3>The Role</h3><p>As a Product Manager, you'll be responsible for the entire product lifecycle, from ideation to launch.</p>`,
    pubDate: 1746000462,
    expiryDate: 1751154462,
    applicationLink: "https://example.com/jobs/product-manager",
    guid: "https://example.com/jobs/product-manager",
    tags: [
      "product_management",
      "agile",
      "user_experience",
      "market_research",
      "strategy",
    ],
  },
];

export default function Career() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = React.useRef(null);

  // Fetch jobs data from API
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "/api/recommendations/jobs/1?limit=50"
        );
        const jobsData = response.data || [];
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Using sample data instead.");
        // Fallback to sample data
        setJobs(sampleJobs);
        setFilteredJobs(sampleJobs);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Apply filters to jobs
    let filtered = [...jobs];

    // Search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchTerm) ||
          job.companyName?.toLowerCase().includes(searchTerm) ||
          job.excerpt?.toLowerCase().includes(searchTerm)
      );
    }

    // Employment type filter
    if (newFilters.employmentTypes && newFilters.employmentTypes.length > 0) {
      filtered = filtered.filter(
        (job) =>
          job.employmentType &&
          newFilters.employmentTypes?.includes(job.employmentType)
      );
    }

    // Location filter
    if (newFilters.locations && newFilters.locations.length > 0) {
      filtered = filtered.filter((job) =>
        job.locationRestrictions?.some((loc) =>
          newFilters.locations?.includes(loc)
        )
      );
    }

    // Salary range filter
    if (
      newFilters.salaryRange &&
      (newFilters.salaryRange[0] || newFilters.salaryRange[1])
    ) {
      const [min, max] = newFilters.salaryRange;
      filtered = filtered.filter((job) => {
        if (min && !job.minSalary) return false;
        if (max && !job.maxSalary) return false;
        if (min && job.minSalary && job.minSalary < min) return false;
        if (max && job.maxSalary && job.maxSalary > max) return false;
        return true;
      });
    }

    // Seniority filter
    if (newFilters.seniority && newFilters.seniority.length > 0) {
      filtered = filtered.filter((job) =>
        job.seniority?.some((level) => newFilters.seniority?.includes(level))
      );
    }

    // Category filter
    if (newFilters.categories && newFilters.categories.length > 0) {
      filtered = filtered.filter((job) =>
        job.parentCategories?.some((cat) =>
          newFilters.categories?.includes(cat)
        )
      );
    }

    setFilteredJobs(filtered);
  };

  const clearAllFilters = () => {
    // Reset the filters state
    setFilters({});

    // Reset the sidebar state if the ref is available
    if (sidebarRef.current && sidebarRef.current.clearFilters) {
      sidebarRef.current.clearFilters();
    }

    // Show all jobs
    setFilteredJobs(jobs);
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Career Opportunities</h1>
        </div>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px] sm:w-[350px]">
            <JobFilterSidebar
              ref={sidebarRef}
              onFilterChange={handleFilterChange}
              isMobile={true}
              onClose={() => setIsFilterOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <Tabs
        defaultValue="jobs"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="[&>[data-state=active]]:bg-[#00DDB3] [&>[data-state=active]]:text-white [&>*:hover]:text-[#00DDB3] [&>[data-state=active]:hover]:text-white">
          <TabsTrigger value="jobs">All Jobs</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
        </TabsList>

        <div className="flex gap-6">
          {/* Sidebar for desktop */}
          <div className="hidden lg:block w-[280px] border rounded-lg overflow-hidden bg-white">
            <JobFilterSidebar
              ref={sidebarRef}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <TabsContent value="jobs" className="space-y-4 mt-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {filteredJobs.length} jobs
                  </Badge>
                </div>
              </div>

              {isLoading ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00DDB3] mb-4"></div>
                    <p className="text-gray-500">Loading jobs...</p>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-red-500 mb-2">{error}</p>
                    <p className="text-gray-500">
                      Showing sample jobs instead.
                    </p>
                  </CardContent>
                </Card>
              ) : filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Search className="h-10 w-10 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                    <p className="text-gray-500 text-center max-w-md mb-4">
                      We couldn't find any jobs matching your current filters.
                      Try adjusting your search criteria.
                    </p>
                    <Button
                      onClick={clearAllFilters}
                      className="bg-[#00DDB3] hover:bg-[#00A285] text-white"
                    >
                      Clear all filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map((job) => (
                    <JobPostingCard
                      key={job.id}
                      job={job}
                      onClick={() => openJobDetails(job)}
                      featured={job.id === filteredJobs[0]?.id} // Mark the first job as featured
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommended" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Jobs</CardTitle>
                  <CardDescription>
                    Based on your skills, experience, and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {jobs.slice(0, 2).map((job) => (
                      <JobPostingCard
                        key={job.id}
                        job={job}
                        onClick={() => openJobDetails(job)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Jobs</CardTitle>
                  <CardDescription>Jobs you've saved for later</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Briefcase className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No saved jobs yet
                  </h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">
                    When you find a job you're interested in, save it to come
                    back to it later.
                  </p>
                  <Button
                    onClick={() => setActiveTab("jobs")}
                    className="bg-[#00DDB3] hover:bg-[#00A285] text-white"
                  >
                    Browse jobs
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applied" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Applied Jobs</CardTitle>
                  <CardDescription>Track your job applications</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Building className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No applications yet
                  </h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">
                    When you apply for jobs, they'll appear here so you can
                    track your applications.
                  </p>
                  <Button
                    onClick={() => setActiveTab("jobs")}
                    className="bg-[#00DDB3] hover:bg-[#00A285] text-white"
                  >
                    Browse jobs
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
