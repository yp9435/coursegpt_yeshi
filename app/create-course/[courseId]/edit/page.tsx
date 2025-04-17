"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Editor } from "@/components/course/Editor";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Chapter {
  chapterName: string;
  about: string;
  duration: string;
  content?: {
    title: string;
    explanation: string;
    codeExample?: string;
  }[];
  youtubeVideos?: string[];
}

interface CourseData {
  id: string;
  userId: string;
  courseName: string;
  description: string;
  category: string;
  topic: string;
  level: string;
  duration: string;
  noOfChapters: number;
  chapters: Chapter[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EditCoursePageProps {
  params: Promise<{ courseId: string }>;
}

/**
 * EditCoursePage component is responsible for rendering the course editor page
 * where users can edit the details and chapters of a specific course.
 *
 * @param props - The properties passed to the component.
 *
 * @remarks
 * - This component fetches the course data from Firestore based on the `courseId` parameter.
 * - It ensures that only the owner of the course can edit it.
 * - Provides functionality to update chapters, generate content, and fetch YouTube videos for chapters.
 * - Includes error handling and user feedback using toast notifications.
 *
 * @returns A JSX element representing the course editor page.
 *
 * @component
 * @example
 * ```tsx
 * <EditCoursePage props={props} />
 * ```
 *
 * @requires useAuth - Custom hook to get the authenticated user.
 * @requires useToast - Custom hook to display toast notifications.
 * @requires useRouter - Next.js router for navigation.
 * @requires useState - React hook for managing component state.
 * @requires useEffect - React hook for side effects.
 * @requires Editor - A child component for editing individual chapters.
 *
 * @function handleChapterChange
 * Updates the active chapter index when a chapter is selected.
 *
 * @function handleUpdateChapter
 * Updates the content of a specific chapter in the course state.
 *
 * @function handleSaveCourse
 * Saves the updated course data to Firestore.
 *
 * @function handleGenerateContent
 * Generates content for a specific chapter using an API call.
 *
 * @function handleFetchYoutubeVideos
 * Fetches YouTube video suggestions for a specific chapter using an API call.
 *
 * @function fetchCourse
 * Fetches the course data from Firestore and validates user permissions.
 *
 * @state isLoading - Indicates whether the course data is being loaded.
 * @state isSaving - Indicates whether the course data is being saved.
 * @state course - The course data being edited.
 * @state activeChapter - The index of the currently active chapter.
 *
 * @errorHandling
 * - Redirects unauthorized users to the sign-in page.
 * - Displays error messages for failed API calls or invalid course data.
 */
export default function EditCoursePage(props: EditCoursePageProps) {
  const params = use(props.params); // Unwrap the params Promise
  const courseId = params.courseId; // Access the courseId
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      try {
        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          const courseData = courseSnap.data() as CourseData;

          if (courseData.userId !== user.uid) {
            toast({
              title: "Access denied",
              description: "You don't have permission to edit this course",
              variant: "destructive",
            });
            router.push("/dashboard");
            return;
          }

          setCourse({ ...courseData, id: courseSnap.id });
        } else {
          toast({
            title: "Course not found",
            description: "The requested course could not be found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error loading course",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router, toast, user]);

  const handleChapterChange = (index: number) => {
    setActiveChapter(index);
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    if (!course) return;

    const updatedChapters = [...course.chapters];
    updatedChapters[activeChapter] = updatedChapter;

    setCourse({
      ...course,
      chapters: updatedChapters,
    });
  };

  const handleSaveCourse = async () => {
    if (!course || !user) return;

    try {
      setIsSaving(true);

      const courseRef = doc(db, "courses", courseId);

      await updateDoc(courseRef, {
        chapters: course.chapters,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Course saved successfully!",
      });
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error saving course",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateContent = async (chapterIndex: number) => {
    if (!course || !user) return;

    try {
      setIsSaving(true);

      const chapter = course.chapters[chapterIndex];

      const response = await fetch("/api/generateLesson/chapterContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          courseId,
          chapterIndex,
          chapterName: chapter.chapterName,
          courseTopic: course.topic,
          difficulty: course.level,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate chapter content");
      }

      const data = await response.json();

      const updatedChapters = [...course.chapters];
      updatedChapters[chapterIndex] = {
        ...chapter,
        content: data.content,
      };

      setCourse({
        ...course,
        chapters: updatedChapters,
      });

      toast({
        title: "Content generated successfully!",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error generating content",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchYoutubeVideos = async (chapterIndex: number) => {
    if (!course || !user) return;

    try {
      setIsSaving(true);

      const chapter = course.chapters[chapterIndex];

      const response = await fetch("/api/fetchYoutube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          courseId,
          chapterIndex,
          chapterName: chapter.chapterName,
          courseTopic: course.topic,
          difficulty: course.level,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch YouTube videos");
      }

      const data = await response.json();

      const updatedChapters = [...course.chapters];
      updatedChapters[chapterIndex] = {
        ...chapter,
        youtubeVideos: data.videoIds,
      };

      setCourse({
        ...course,
        chapters: updatedChapters,
      });

      toast({
        title: "YouTube videos fetched successfully!",
      });
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      toast({
        title: "Error fetching YouTube videos",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="nes-text is-primary text-center">
          <div className="nes-badge">
            <span className="is-dark">Loading</span>
          </div>
          <p className="mt-4">Loading course editor...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="nes-container is-rounded with-title">
        <p className="title">Error</p>
        <p>Course not found. Please try again or create a new course.</p>
        <button
          onClick={() => router.push("/create-course")}
          className="nes-btn is-primary mt-4"
        >
          Create New Course
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="nes-container with-title is-rounded mb-6">
        <p className="title bg-white px-2">{course.courseName}</p>
        <p className="mb-4 text-sm italic">{course.description}</p>
        
        <div className="mb-4 flex items-center gap-2">
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
      </div>

      <div className="nes-container is-rounded">
        <div className="mb-6">
          <h3 className="nes-text mb-4 border-b border-b-gray-700 pb-2 text-lg font-bold">Chapters</h3>
          
          <div className="nes-container is-rounded grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 overflow-hidden">
            {course.chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => handleChapterChange(index)}
                className={`nes-btn ${
                  activeChapter === index ? "is-primary" : ""
                } h-full w-full overflow-hidden py-2 px-3 text-left`}
              >
                <div className="flex items-center">
                  <span className="nes-text is-error mr-2">{index + 1}</span>
                  <span className="truncate">{chapter.chapterName}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {course.chapters[activeChapter] && (
          <div className="nes-container is-rounded with-title mb-6">
            <p className="title bg-white px-2">
              Chapter {activeChapter + 1}: {course.chapters[activeChapter]?.chapterName}
            </p>
            <Editor
              chapter={course.chapters[activeChapter]}
              onUpdateChapter={handleUpdateChapter}
              onGenerateContent={() => handleGenerateContent(activeChapter)}
              onFetchYoutubeVideos={() => handleFetchYoutubeVideos(activeChapter)}
            />
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => router.push(`/create-course/${courseId}`)}
            className="nes-btn is-primary"
          >
            ← Preview
          </button>

          <div className="space-x-2">
            <button
              onClick={handleSaveCourse}
              disabled={isSaving}
              className={`nes-btn ${isSaving ? "is-disabled" : "is-warning"}`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => router.push(`/create-course/${courseId}/finish`)}
              className="nes-btn is-success"
            >
              Finish →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}