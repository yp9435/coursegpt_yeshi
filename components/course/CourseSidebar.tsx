"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Home, BookOpen } from "lucide-react"

interface Chapter {
  chapterName: string
  about: string
  duration: string
}

interface CourseData {
  id: string
  courseName: string
  chapters: Chapter[]
}

interface CourseSidebarProps {
  course: CourseData
  activePage?: string
  activeChapter?: number
}

export function CourseSidebar({ course, activePage = "", activeChapter = -1 }: CourseSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={`bg-gray-100 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64 md:w-80"
      } flex-shrink-0 border-r border-gray-200`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          {!isCollapsed && <h2 className="text-lg font-bold">Course Menu</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="nes-btn is-small"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!isCollapsed && (
            <>
              <Link
                href={`/course/${course.id}`}
                className={`mb-2 flex items-center rounded-md p-2 ${
                  activePage === "overview" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Course Overview</span>
              </Link>

              <div className="mt-4">
                <h3 className="mb-2 font-bold">Chapters</h3>
                <ul className="space-y-1">
                  {course.chapters.map((chapter, index) => (
                    <li key={index}>
                      <Link
                        href={`/course/${course.id}/chapters/${index}`}
                        className={`flex items-center rounded-md p-2 ${
                          activeChapter === index ? "bg-gray-200" : "hover:bg-gray-200"
                        }`}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span className="line-clamp-1">
                          {index + 1}. {chapter.chapterName}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {isCollapsed && (
            <div className="flex flex-col items-center space-y-4">
              <Link
                href={`/course/${course.id}`}
                className={`flex h-8 w-8 items-center justify-center rounded-md ${
                  activePage === "overview" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Home className="h-4 w-4" />
              </Link>

              {course.chapters.map((_, index) => (
                <Link
                  key={index}
                  href={`/course/${course.id}/chapters/${index}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    activeChapter === index ? "bg-gray-200" : "hover:bg-gray-200"
                  }`}
                >
                  <span>{index + 1}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4">
          {!isCollapsed ? (
            <Link href="/dashboard" className="nes-btn is-primary w-full">
              Back to Dashboard
            </Link>
          ) : (
            <Link href="/dashboard" className="flex justify-center">
              <Home className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
