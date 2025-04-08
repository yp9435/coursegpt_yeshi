import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 to-white flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-pink-600 mb-4">CourseGPT</h1>
      <p className="text-xl text-gray-700 max-w-xl mb-8">
        Create, organize, and enhance educational content effortlessly with the power of AI.
      </p>
      <Link
        href="/create-course"
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition duration-200"
      >
        Start Creating
      </Link>
    </main>
  );
}
