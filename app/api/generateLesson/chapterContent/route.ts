import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateCourseContent } from "@/lib/gemini"

/**
 * Handles the POST request to generate educational content for a specific chapter in a course.
 *
 * @param {NextRequest} request - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} A JSON response containing the generated chapter content or an error message.
 *
 * @throws {Error} Returns a 400 status if required fields are missing in the request body.
 * @throws {Error} Returns a 404 status if the specified course does not exist.
 * @throws {Error} Returns a 403 status if the user is not authorized to modify the course.
 * @throws {Error} Returns a 500 status if there is an error parsing the generated JSON or updating the database.
 *
 * The request body must include the following fields:
 * - `userId` (string): The ID of the user making the request.
 * - `courseId` (string): The ID of the course to which the chapter belongs.
 * - `chapterIndex` (number): The index of the chapter to update.
 * - `chapterName` (string): The name of the chapter.
 * - `courseTopic` (string): The topic of the course.
 * - `difficulty` (string): The difficulty level of the chapter.
 *
 * The function performs the following steps:
 * 1. Validates the request body to ensure all required fields are present.
 * 2. Fetches the course document from the database and verifies its existence.
 * 3. Checks if the user is authorized to modify the course.
 * 4. Generates educational content for the chapter using a prompt-based AI model.
 * 5. Parses the generated content into JSON format.
 * 6. Updates the course document in the database with the new chapter content.
 * 7. Returns the updated chapter content in the response.
 */
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
