"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CourseSidebar } from "@/components/course/CourseSidebar"
import { CourseHeader } from "@/components/course/CourseHeader"
import { Clock, BookOpen, Award } from "lucide-react"

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
  chapters: {
    chapterName: string
    about: string
    duration: string
    content?: {
      title: string
      explanation: string
      codeExample?: string
    }[]
    youtubeVideos?: string[]
  }[]
  status: string
  createdAt: any
  updatedAt: any
}

export default function CoursePage({
  params,
}: {
  params: { courseId: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [course, setCourse] = useState<CourseData | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = doc(db, "courses", params.courseId)
        const courseSnap = await getDoc(courseRef)

        if (courseSnap.exists()) {
          const courseData = courseSnap.data() as CourseData

          if (courseData.status === "published" || (user && courseData.userId === user.uid)) {
            setCourse({ ...courseData, id: courseSnap.id })
          } else {
            toast({
              title: "Access denied",
              description: "This course is not published yet",
              variant: "destructive",
            })
            router.push("/explore")
          }
        } else {
          toast({
            title: "Course not found",
            description: "The requested course could not be found",
            variant: "destructive",
          })
          router.push("/explore")
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        toast({
          title: "Error loading course",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [params.courseId, router, toast, user])

  const handleStartCourse = () => {
    router.push(`/course/${params.courseId}/chapters/0`)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-black">
        <div className="nes-text is-primary">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="nes-container is-rounded with-title m-6 bg-white text-black">
        <p className="title">Error</p>
        <p>Course not found. Please try exploring other courses.</p>
        <button
          onClick={() => router.push("/explore")}
          className="nes-btn is-primary mt-4"
        >
          Explore Courses
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black md:flex-row">
      <CourseSidebar course={course} activePage="overview" />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <CourseHeader
            title={course.courseName}
            description={course.description}
            category={course.category}
            difficulty={course.level}
            duration={course.duration}
          />

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="nes-container is-rounded">
              <div className="flex flex-col items-center p-4 text-center">
                <Clock className="mb-2 h-8 w-8" />
                <h3 className="text-lg font-bold">Duration</h3>
                <p>{course.duration}</p>
              </div>
            </div>

            <div className="nes-container is-rounded">
              <div className="flex flex-col items-center p-4 text-center">
                <BookOpen className="mb-2 h-8 w-8" />
                <h3 className="text-lg font-bold">Chapters</h3>
                <p>{course.noOfChapters} Chapters</p>
              </div>
            </div>

            <div className="nes-container is-rounded">
              <div className="flex flex-col items-center p-4 text-center">
                <Award className="mb-2 h-8 w-8" />
                <h3 className="text-lg font-bold">Level</h3>
                <p>{course.level}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="nes-container is-rounded with-title">
              <p className="title">Course Overview</p>
              <p className="mb-4">{course.description}</p>
              <p className="mb-6">
                This course contains {course.noOfChapters} chapters that will guide you through {course.topic}. It's
                designed for {course.level.toLowerCase()} level learners and will take approximately{" "}
                {course.duration.toLowerCase()} to complete.
              </p>

              <div className="mt-6 text-center">
                <button onClick={handleStartCourse} className="nes-btn is-primary">
                  Start Learning
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="nes-container is-rounded with-title">
              <p className="title">What You'll Learn</p>
              <ul className="space-y-2">
                {course.chapters.map((chapter, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 inline-block h-6 w-6 flex-shrink-0 rounded-full bg-black text-center text-white">
                      {index + 1}
                    </span>
                    <span>
                      {chapter.chapterName} - {chapter.about}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {user && course.userId === user.uid && (
            <div className="mt-8">
              <div className="nes-container is-rounded with-title">
                <p className="title">Course Management</p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => router.push(`/create-course/${params.courseId}/edit`)}
                    className="nes-btn"
                  >
                    Edit Course
                  </button>
                  <button
                    onClick={() => router.push(`/create-course/${params.courseId}`)}
                    className="nes-btn is-primary"
                  >
                    Course Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
