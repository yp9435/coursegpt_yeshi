import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateCourseContent } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId, chapterIndex, chapterName, courseTopic, difficulty } = body

    if (!userId || !courseId || chapterIndex === undefined || !chapterName || !courseTopic || !difficulty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const courseRef = doc(db, "courses", courseId)
    const courseSnap = await getDoc(courseRef)

    if (!courseSnap.exists()) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const courseData = courseSnap.data()
    if (courseData.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const prompt = `
      Create detailed educational content for a chapter in a course with the following details:
      
      Course Topic: ${courseTopic}
      Chapter Name: ${chapterName}
      Difficulty Level: ${difficulty}
      
      Please generate a JSON response with the following structure:
      {
        "content": [
          {
            "title": "Section title",
            "explanation": "Detailed explanation of the concept",
            "codeExample": "Code example if applicable"
          },
          ...more sections
        ]
      }
      
      Create 3-5 sections that cover the chapter topic thoroughly.
      Make sure the content is educational, informative, and appropriate for the specified difficulty level.
      If code examples are relevant, include them in the codeExample field.
      For non-programming topics, you can omit the codeExample field or use it for formulas/examples.
      The explanation should be comprehensive but easy to understand.
    `

    const responseText = await generateCourseContent(prompt)

    let chapterContent
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        chapterContent = JSON.parse(jsonMatch[0])
      } else {
        chapterContent = JSON.parse(responseText)
      }
    } catch (error) {
      console.error("Error parsing JSON:", error)
      return NextResponse.json({ error: "Failed to parse chapter content" }, { status: 500 })
    }

    const chapters = [...courseData.chapters]
    chapters[chapterIndex] = {
      ...chapters[chapterIndex],
      content: chapterContent.content,
    }

    await updateDoc(courseRef, {
      chapters,
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      courseId,
      chapterIndex,
      ...chapterContent,
    })
  } catch (error) {
    console.error("Error generating chapter content:", error)
    return NextResponse.json({ error: "Failed to generate chapter content" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
