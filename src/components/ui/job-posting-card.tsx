"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, MapPin, Clock, DollarSign, Briefcase, Building, Calendar } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { cn } from "../../lib/utils";

interface JobPosting {
  id: string
  title: string
  companyName: string
  companyLogo?: string
  employmentType?: string
  minSalary?: number
  maxSalary?: number
  locationRestrictions?: string[]
  pubDate: number
  excerpt: string
  seniority?: string[]
  parentCategories?: string[]
  expiryDate?: number
}

interface JobPostingCardProps {
  job: JobPosting
  onClick?: () => void
  featured?: boolean
}

export function JobPostingCard({ job, onClick, featured = false }: JobPostingCardProps) {
  const [isHovering, setIsHovering] = useState(false)

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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden transition-all duration-200 cursor-pointer",
          featured
            ? "border-l-0 shadow-none"
            : "",
          "hover:border-l-2 hover:border-l-[#00DDB3]/80 hover:shadow-md"
        )}
        onClick={onClick}
      >
        <CardContent className="p-5 flex-grow">
          {/* Company Logo and Info */}
          <div className="flex items-start mb-4">
            <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo || "/placeholder.svg"}
                  alt={job.companyName}
                  className="object-contain p-1 w-full h-full"
                />
              ) : (
                <Building className="h-8 w-8 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Building className="h-3.5 w-3.5 mr-1 inline" />
                {job.companyName}
              </p>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.employmentType || "Not specified"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.locationRestrictions?.join(", ") || "Remote"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>Posted {formatPubDate(job.pubDate)}</span>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-sm text-gray-700 line-clamp-2 mb-4">{job.excerpt}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {job.seniority?.map((level) => (
              <Badge key={level} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {level}
              </Badge>
            ))}
            {job.parentCategories?.slice(0, 2).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {job.expiryDate ? (
              <span>Expires in {formatDistanceToNow(new Date(job.expiryDate * 1000))}</span>
            ) : (
              <span>No expiration date</span>
            )}
          </div>

          <motion.div animate={{ scale: isHovering ? 1.05 : 1 }} transition={{ duration: 0.2 }}>
            <Button size="sm" variant="ghost" className="text-[#00DDB3] hover:text-[#00A285] hover:bg-[#00DDB3]/10">
              View Details
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
