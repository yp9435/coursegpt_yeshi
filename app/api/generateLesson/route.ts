import { type NextRequest, NextResponse } from "next/server"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateCourseContent } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, category, topic, description, difficulty, duration, includeYoutube, chapterCount } = body

    if (!userId || !category || !topic || !difficulty || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const prompt = `
      Create a detailed course structure for an educational course with the following details:
      
      Category: ${category}
      Topic: ${topic}
      Description: ${description || "No description provided"}
      Difficulty Level: ${difficulty}
      Duration: ${duration}
      Number of Chapters: ${chapterCount}
      
      Please generate a JSON response with the following structure:
      {
        "courseName": "A catchy name for the course",
        "description": "A comprehensive description of the course",
        "chapters": [
          {
            "chapterName": "Name of chapter 1",
            "about": "Brief description of what this chapter covers",
            "duration": "Estimated time to complete this chapter"
          },
          ...more chapters
        ]
      }
      
      Make sure the content is educational, informative, and appropriate for the specified difficulty level.
      The chapter names should be logical and follow a progressive learning path.
      Each chapter should have a clear focus and build upon previous chapters.
    `

    const responseText = await generateCourseContent(prompt)

    let courseStructure: {
      courseName: string
      description: string
      chapters: Array<{
        chapterName: string
        about: string
        duration: string
      }>
    }
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        courseStructure = JSON.parse(jsonMatch[0])
      } else {
        courseStructure = JSON.parse(responseText)
      }
    } catch (error) {
      console.error("Error parsing JSON:", error)
      return NextResponse.json({ error: "Failed to parse course structure" }, { status: 500 })
    }

    const courseData = {
      userId,
      courseName: courseStructure.courseName,
      description: courseStructure.description || description,
      category,
      topic,
      level: difficulty,
      duration,
      noOfChapters: chapterCount,
      chapters: courseStructure.chapters,
      includeYoutube,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const courseRef = await addDoc(collection(db, "courses"), courseData)

    return NextResponse.json({
      courseId: courseRef.id,
      ...courseData,
    })
  } catch (error) {
    console.error("Error generating course:", error)
    return NextResponse.json({ error: "Failed to generate course" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
