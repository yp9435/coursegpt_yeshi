"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CourseCard } from "@/components/course/CourseCard"
import { Search, Filter } from "lucide-react"

interface CourseData {
  id: string
  userId: string
  courseName: string
  description: string
  category: string
  topic: string
  level: string
  duration: string
  noOfChapters: number
  status: string
  createdAt: any
  updatedAt: any
}

export default function ExplorePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<CourseData[]>([])
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([])

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")
  const [durationFilter, setDurationFilter] = useState("")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesQuery = query(
          collection(db, "courses"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc")
        )

        const querySnapshot = await getDocs(coursesQuery)
        const fetchedCourses: CourseData[] = []

        querySnapshot.forEach((doc) => {
          fetchedCourses.push({
            id: doc.id,
            ...doc.data(),
          } as CourseData)
        })

        setCourses(fetchedCourses)
        setFilteredCourses(fetchedCourses)
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast({
          title: "Error loading courses",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [toast])

  useEffect(() => {
    let result = [...courses]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (course) =>
          course.courseName.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.topic.toLowerCase().includes(query)
      )
    }

    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((course) => course.category === categoryFilter)
    }

    if (difficultyFilter && difficultyFilter !== "all") {
      result = result.filter((course) => course.level === difficultyFilter)
    }

    if (durationFilter && durationFilter !== "all") {
      result = result.filter((course) => course.duration === durationFilter)
    }

    setFilteredCourses(result)
  }, [searchQuery, categoryFilter, difficultyFilter, durationFilter, courses])

  const categories = [...new Set(courses.map((course) => course.category))]
  const difficulties = [...new Set(courses.map((course) => course.level))]
  const durations = [...new Set(courses.map((course) => course.duration))]

  const resetFilters = () => {
    setSearchQuery("")
    setCategoryFilter("")
    setDifficultyFilter("")
    setDurationFilter("")
  }

  return (
    <div className="min-h-screen p-6 text-black">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold">Explore Courses</h1>
          <p className="text-gray-700">Discover AI-generated courses on various topics</p>
        </div>

        <div className="mb-8">
          <div className="nes-container bg-white is-rounded with-title">
            <p className="title">Filters</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="nes-input pl-8 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm">Category</label>
                <div className="nes-select w-full">
                  <select
                    className="nes-input w-full"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm">Difficulty</label>
                <div className="nes-select w-full">
                  <select
                    className="nes-input w-full"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                  >
                    <option value="">All Levels</option>
                    {difficulties.map((dif) => (
                      <option key={dif} value={dif}>
                        {dif}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm">Duration</label>
                <div className="nes-select w-full">
                  <select
                    className="nes-input w-full"
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                  >
                    <option value="">Any Duration</option>
                    {durations.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={resetFilters} className="nes-btn is-warning flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="nes-text is-primary">Loading courses...</div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="nes-container is-rounded">
            <div className="py-12 text-center">
              <h2 className="mb-4 text-xl font-bold">No courses found</h2>
              <p className="mb-6">Try adjusting your filters or search query</p>
              <button onClick={resetFilters} className="nes-btn is-primary">
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
