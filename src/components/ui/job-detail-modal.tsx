"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Building,
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Calendar,
  Share2,
  ExternalLink,
  Globe,
  Tag,
  X,
} from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

// Define the JobPosting type
interface JobPosting {
  guid: string
  title: string
  companyName: string
  companyLogo?: string
  excerpt: string
  description: string
  pubDate: number
  expiryDate?: number
  employmentType?: string
  minSalary?: number
  maxSalary?: number
  locationRestrictions?: string[]
  applicationLink?: string
  categories?: string[]
  parentCategories?: string[]
  tags?: string[]
}

interface JobDetailModalProps {
  job: JobPosting
  isOpen: boolean
  onClose: () => void
}

export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const [activeTab, setActiveTab] = useState("details")

  // Format salary range
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Salary not specified"
    if (min && !max) return `$${min.toLocaleString()}+`
    if (!min && max) return `Up to $${max.toLocaleString()}`
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`
  }

  // Format publication date
  const formatPubDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp * 1000)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Recently"
    }
  }

  // Handle apply button click
  const handleApply = () => {
    if (job.applicationLink) {
      window.open(job.applicationLink, "_blank")
    }
  }

  // Handle share button click
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.companyName}`,
        text: job.excerpt,
        url: job.guid || job.applicationLink,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(job.guid || job.applicationLink || "")
      // You could show a toast notification here
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo || "/placeholder.svg"}
                    alt={job.companyName}
                    className="object-contain p-1 w-full h-full"
                  />
                ) : (
                  <Building className="h-10 w-10 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl">{job.title}</DialogTitle>
                <DialogDescription className="flex items-center mt-1">
                  <Building className="h-4 w-4 mr-1.5 inline" />
                  {job.companyName}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm">
              <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.employmentType || "Not specified"}</span>
            </div>

            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
            </div>

            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.locationRestrictions?.join(", ") || "Remote"}</span>
            </div>

            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>Posted {formatPubDate(job.pubDate)}</span>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full [&>[data-state=active]]:bg-[#00DDB3] [&>[data-state=active]]:text-white [&>*:hover]:text-[#00DDB3] [&>[data-state=active]:hover]:text-white">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="company" className="flex-1">
                Company
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex-1">
                Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-4">
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                <div className="relative h-24 w-24 rounded-md overflow-hidden bg-white mb-4 flex-shrink-0 border">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo || "/placeholder.svg"}
                      alt={job.companyName}
                      className="object-contain p-2 w-full h-full"
                    />
                  ) : (
                    <Building className="h-16 w-16 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{job.companyName}</h3>
                <p className="text-gray-600 mb-4">{job.excerpt}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(job.guid?.split("/jobs/")[0], "_blank")}
                  className="border-[#00DDB3] text-[#00DDB3] hover:bg-[#00DDB3]/10 hover:text-[#00A285]"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Company Profile
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-4">
              <div className="space-y-4">
                {job.parentCategories && job.parentCategories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Main Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.parentCategories.map((category) => (
                        <Badge
                          key={category}
                          className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {job.categories && job.categories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Specific Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        >
                          {category.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {job.tags && job.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Skills & Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                        >
                          {tag.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        <div className="p-4 flex justify-between items-center bg-gray-50">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1.5" />
            {job.expiryDate ? (
              <span>Expires in {formatDistanceToNow(new Date(job.expiryDate * 1000))}</span>
            ) : (
              <span>No expiration date</span>
            )}
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" onClick={handleApply} className="bg-[#00DDB3] hover:bg-[#00A285] text-white border-none">
              Apply Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
