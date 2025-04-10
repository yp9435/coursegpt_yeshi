'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b-4 border-black bg-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-shrink-0">
            <i className="snes-jp-logo mr-4"></i>
            <span className="text-xl md:text-2xl font-bold">CourseGPT</span>
          </div>
          <div>
            {user ? (
              <Link
                href="/dashboard"
                className="nes-btn is-primary"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="nes-btn is-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
          <div className="p-20 max-w-7xl mx-auto px-4 py-10 sm:px-6 text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <i className="snes-jp-logo text-5xl"></i>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide">
                CourseGPT
              </h1>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-800 mb-6 leading-snug">
              Create AI-generated courses in <span className="text-pink-600">minutes!</span>
            </h2>

            <p className="text-sm sm:text-base max-w-xl mx-auto text-gray-700 mb-10">
              Powered by Gemini AI and YT API!
            </p>

            <div className="mt-6">
              <Link
                href={user ? "/dashboard" : "/sign-in"}
                className="nes-btn is-primary"
              >
                {user ? "Go to Dashboard" : "Join CourseGPT"}
              </Link>
            </div>
          </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="nes-container is-dark with-title pixel-shadow">
              <p className="title">CourseGPT Guide</p>
              <div className="space-y-6 p-2">
                <div className="flex items-start">
                  <div className="mr-4">
                    <i className="nes-icon coin"></i>
                  </div>
                  <div>
                    <h3 className="text-base mb-1">1. Define your topic</h3>
                    <p className="text-xs">
                      Enter your subject and Gemini AI will create a course structure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4">
                    <i className="nes-icon coin"></i>
                  </div>
                  <div>
                    <h3 className="text-base mb-1">2. Customize content</h3>
                    <p className="text-xs">
                      Edit AI-generated content and add YouTube videos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4">
                    <i className="nes-icon coin"></i>
                  </div>
                  <div>
                    <h3 className="text-base mb-1">3. Publish and share</h3>
                    <p className="text-xs">
                      Share your course with students.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <Image
                  src="/cat.gif"
                  alt="Pixel art animation"
                  className="mx-auto mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-4 border-black py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
        <a 
            href="https://www.linkedin.com/in/yeshaswiprakash/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
          <p className="text-sm mb-2 text-gray-600 underline">
            &copy; 2025 Created by Yeshaswi      
            <i className="nes-icon is-small ml-3 heart"></i>
          </p>
          </a>
        </div>
      </footer>
    </div>
  );
}