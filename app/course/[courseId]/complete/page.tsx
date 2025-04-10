"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Trophy, Home, BookOpen } from "lucide-react"

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
  }[]
  status: string
  createdAt: any
  updatedAt: any
}

export default function CourseCompletePage({
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-black">
        <div className="nes-text is-primary">Loading...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="nes-container is-rounded with-title text-black bg-white">
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
    <div className="flex min-h-screen items-center justify-center bg-white p-6 text-black">
      <div className="w-full max-w-2xl">
        <div className="nes-container is-rounded with-title">
          <p className="title">Course Completed!</p>

          <div className="flex flex-col items-center py-8">
            <Trophy className="h-24 w-24 text-yellow-500" />

            <h1 className="mt-6 text-center text-2xl font-bold">Congratulations!</h1>

            <p className="mt-4 text-center">You've completed the course:</p>

            <h2 className="mt-2 text-center text-xl font-bold">{course.courseName}</h2>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="nes-badge">
                <span className="is-dark">{course.category}</span>
              </span>
              <span className="nes-badge">
                <span className="is-primary">{course.level}</span>
              </span>
              <span className="nes-badge">
                <span className="is-success">{course.duration}</span>
              </span>
            </div>

            <p className="mt-8 text-center">
              You've mastered {course.noOfChapters} chapters and gained valuable knowledge in {course.topic}.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="nes-btn flex items-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </button>

              <button
                onClick={() => router.push(`/course/${params.courseId}`)}
                className="nes-btn is-primary flex items-center"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Review Course
              </button>

              <button
                onClick={() => router.push("/explore")}
                className="nes-btn is-success"
              >
                Explore More Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
