"use client"

import React, { useState, useImperativeHandle, forwardRef } from "react"
import { Filter, Search, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

export interface JobFilterSidebarProps {
  className?: string
  onFilterChange?: (filters: JobFilters) => void
  isMobile?: boolean
  onClose?: () => void
}

export interface JobFilters {
  search?: string
  employmentTypes?: string[]
  locations?: string[]
  salaryRange?: [number | null, number | null]
  seniority?: string[]
  categories?: string[]
}

const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Contract", "Internship", "Freelance"]
const LOCATIONS = ["United States", "Canada", "Europe", "Asia", "Remote", "Worldwide"]
const SENIORITY_LEVELS = ["Entry-level", "Mid-level", "Senior", "Lead", "Manager", "Director", "Executive"]
const CATEGORIES = [
  "Software Development",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Human Resources",
  "Finance",
  "Product",
  "Data",
  "Engineering",
]

export const JobFilterSidebar = forwardRef<
  { clearFilters: () => void },
  JobFilterSidebarProps
>(({ className, onFilterChange, isMobile = false, onClose }, ref) => {
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    employmentTypes: [],
    locations: [],
    salaryRange: [null, null],
    seniority: [],
    categories: [],
  })

  const [minSalary, setMinSalary] = useState<string>("")
  const [maxSalary, setMaxSalary] = useState<string>("")

  useImperativeHandle(ref, () => ({
    clearFilters: () => {
      setFilters({
        search: "",
        employmentTypes: [],
        locations: [],
        salaryRange: [null, null],
        seniority: [],
        categories: [],
      })
      setMinSalary("")
      setMaxSalary("")
    }
  }))

  const handleFilterChange = (newFilters: Partial<JobFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange?.(updatedFilters)
  }

  const handleCheckboxChange = (category: keyof JobFilters, value: string, checked: boolean) => {
    if (!filters[category]) return

    const currentValues = filters[category] as string[]
    const newValues = checked ? [...currentValues, value] : currentValues.filter((v) => v !== value)

    handleFilterChange({ [category]: newValues })
  }

  const handleSalaryChange = () => {
    const min = minSalary ? Number.parseInt(minSalary) : null
    const max = maxSalary ? Number.parseInt(maxSalary) : null
    handleFilterChange({ salaryRange: [min, max] })
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      employmentTypes: [],
      locations: [],
      salaryRange: [null, null],
      seniority: [],
      categories: [],
    })
    setMinSalary("")
    setMaxSalary("")
    onFilterChange?.({
      search: "",
      employmentTypes: [],
      locations: [],
      salaryRange: [null, null],
      seniority: [],
      categories: [],
    })
  }

  const activeFilterCount = [
    filters.employmentTypes?.length || 0,
    filters.locations?.length || 0,
    filters.seniority?.length || 0,
    filters.categories?.length || 0,
    filters.salaryRange?.[0] || filters.salaryRange?.[1] ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
            {activeFilterCount > 0 && <Badge className="ml-2 bg-[#00DDB3]">{activeFilterCount}</Badge>}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="p-4">
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
          />
        </div>

        {activeFilterCount > 0 && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} applied
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-[#00DDB3]">
              Clear all
            </Button>
          </div>
        )}

        <Accordion type="multiple" defaultValue={["employment", "location", "salary", "seniority", "category"]}>
          <AccordionItem value="employment">
            <AccordionTrigger className="text-sm font-medium">Employment Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {EMPLOYMENT_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`employment-${type}`}
                      checked={filters.employmentTypes?.includes(type)}
                      onCheckedChange={(checked) => handleCheckboxChange("employmentTypes", type, checked as boolean)}
                    />
                    <Label htmlFor={`employment-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location">
            <AccordionTrigger className="text-sm font-medium">Location</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {LOCATIONS.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.locations?.includes(location)}
                      onCheckedChange={(checked) => handleCheckboxChange("locations", location, checked as boolean)}
                    />
                    <Label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="salary">
            <AccordionTrigger className="text-sm font-medium">Salary Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="min-salary" className="text-xs mb-1 block">
                      Minimum
                    </Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2.5 text-gray-500">$</span>
                      <Input
                        id="min-salary"
                        type="number"
                        placeholder="0"
                        className="pl-7"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="max-salary" className="text-xs mb-1 block">
                      Maximum
                    </Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2.5 text-gray-500">$</span>
                      <Input
                        id="max-salary"
                        type="number"
                        placeholder="Any"
                        className="pl-7"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full bg-[#00DDB3] hover:bg-[#00A285] text-white" onClick={handleSalaryChange}>
                  Apply Salary Range
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="seniority">
            <AccordionTrigger className="text-sm font-medium">Seniority Level</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {SENIORITY_LEVELS.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`seniority-${level}`}
                      checked={filters.seniority?.includes(level)}
                      onCheckedChange={(checked) => handleCheckboxChange("seniority", level, checked as boolean)}
                    />
                    <Label htmlFor={`seniority-${level}`} className="text-sm cursor-pointer">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category">
            <AccordionTrigger className="text-sm font-medium">Job Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories?.includes(category)}
                      onCheckedChange={(checked) => handleCheckboxChange("categories", category, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
})

// Add a displayName for better debugging and React DevTools support
JobFilterSidebar.displayName = "JobFilterSidebar"
