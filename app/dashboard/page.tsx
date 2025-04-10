"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image";
import { CourseCard } from "@/components/course/CourseCard"

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
  createdAt: Date
  updatedAt: Date
}

export default function Dashboard() {
  const router = useRouter()
  const { user, userData } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [userCourses, setUserCourses] = useState<CourseData[]>([])

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!user?.uid) return

      try {
        const coursesQuery = query(
          collection(db, "courses"),
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc"),
        )

        const querySnapshot = await getDocs(coursesQuery)
        const fetchedCourses: CourseData[] = []

        querySnapshot.forEach((doc) => {
          fetchedCourses.push({
            id: doc.id,
            ...doc.data(),
          } as CourseData)
        })

        setUserCourses(fetchedCourses)
      } catch (error) {
        console.error("Error fetching user courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchUserCourses()
    }
  }, [user])

  if (isLoading) {
    return <p className="text-center mt-10">Loading your dashboard...</p>
  }

  return (
    <div className="space-y-8 px-4 py-8">
      <h1 className="text-xl md:text-2xl mb-6">Dashboard</h1>

      {userData && (
        <div className="nes-container is-dark with-title pixel-shadow">
          <p className="title">Player Profile</p>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 py-4">
            {userData.photoURL && (
              <div className="w-16 h-16 overflow-hidden border-4 border-black">
                <Image
                  src={userData.photoURL || "/placeholder.svg"}
                  alt={userData.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h2 className="text-base mb-2">{userData.displayName || "Player 1"}</h2>
              <p className="text-xs">{userData.email}</p>
              <p className="text-xs mt-2">
                Level: {userCourses.length > 5 ? "Expert" : userCourses.length > 2 ? "Intermediate" : "Beginner"}
              </p>
              <div className="mt-4">
                <progress
                  className="nes-progress is-primary"
                  value={Math.min(userCourses.length * 20, 100)}
                  max="100"
                ></progress>
                <p className="text-xs mt-1">XP: {Math.min(userCourses.length * 20, 100)}/100</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="nes-container with-title is-centered pixel-shadow bg-white">
          <p className="title">New Quest</p>
          <div className="py-4 text-center">
            <i className="nes-icon is-large star"></i>
            <h3 className="text-base mt-4 mb-4">Create a new course</h3>
            <p className="text-xs mb-6">Start making your own course with AI in a few clicks.</p>
            <Link href="/create-course" className="nes-btn is-primary">
              Start Quest
            </Link>
          </div>
        </div>

        <div className="nes-container with-title is-centered pixel-shadow bg-white">
          <p className="title">Your Inventory</p>
          <div className="py-4 text-center">
            {userCourses.length > 0 ? (
              <>
                <i className="nes-icon is-large heart"></i>
                <h3 className="text-base mt-4 mb-4">Your Courses</h3>
                <p className="text-xs mb-6">
                  You have created {userCourses.length} course{userCourses.length !== 1 ? "s" : ""}.
                </p>
                <button
                  onClick={() => router.push("/explore")}
                  className="nes-btn is-primary px-4 py-2 mt-2"
                >
                  View All Courses
                </button>
              </>
            ) : (
              <>
                <i className="nes-icon is-large heart is-empty"></i>
                <h3 className="text-base mt-4 mb-4">Your Courses</h3>
                <p className="text-xs mb-6">You haven&apos;t created any courses yet.</p>
                <button className="nes-btn is-disabled px-4 py-2 mt-2">View Inventory</button>
              </>
            )}
          </div>
        </div>
      </div>

      {userCourses.length > 0 && (
        <div className="nes-container with-title pixel-shadow bg-white mt-8">
          <p className="title">Your Courses</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {userCourses.slice(0, 4).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {userCourses.length > 4 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/explore?filter=my-courses")}
                className="nes-btn is-primary px-4 py-2"
              >
                View All Your Courses
              </button>
            </div>
          )}
        </div>
      )}

      <div className="nes-container is-rounded pixel-shadow bg-white mt-8">
        <div className="p-4">
          <h3 className="text-base mb-4">Daily Quests</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <i className="nes-icon is-small star mr-3 mt-1"></i>
              <div>
                <h4 className="text-sm">Create your first course</h4>
                <p className="text-xs text-gray-600">Reward: 50 XP</p>
              </div>
            </li>
            <li className="flex items-start">
              <i className="nes-icon is-small star mr-3 mt-1"></i>
              <div>
                <h4 className="text-sm">Complete your profile</h4>
                <p className="text-xs text-gray-600">Reward: 30 XP</p>
              </div>
            </li>
            <li className="flex items-start">
              <i className="nes-icon is-small star mr-3 mt-1"></i>
              <div>
                <h4 className="text-sm">Share a course with friends</h4>
                <p className="text-xs text-gray-600">Reward: 20 XP</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
