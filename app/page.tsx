'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="border-b-4 border-black bg-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl md:text-2xl font-bold">CourseGPT</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="hover:opacity-70 pixel-transition">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:opacity-70 pixel-transition">
              How it Works
            </Link>
            <Link href="#pricing" className="hover:opacity-70 pixel-transition">
              Pricing
            </Link>
          </nav>
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

      {/* Hero section */}
      <main>
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:py-24">
            <div className="text-center mb-16">
              <h1 className="text-3xl mb-8 sm:text-4xl md:text-5xl">
                <span className="block mb-4">Create AI-powered</span>
                <span className="block">courses in minutes</span>
              </h1>
              
              <div className="nes-container with-title is-dark my-8 max-w-3xl mx-auto">
                <p className="title">ABOUT</p>
                <p className="text-sm md:text-base mb-4">
                  CourseGPT combines the power of AI with curated YouTube content to build engaging courses on any topic.
                </p>
                <p className="text-sm md:text-base">
                  Perfect for teachers, trainers, and knowledge workers.
                </p>
              </div>
              
              <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href={user ? "/dashboard" : "/sign-in"}
                  className="nes-btn is-primary"
                >
                  {user ? "Go to Dashboard" : "Start Game"}
                </Link>
                <Link
                  href="#how-it-works"
                  className="nes-btn"
                >
                  Tutorial
                </Link>
              </div>
            </div>

            <div className="nes-container is-rounded pixel-shadow bg-white max-w-4xl mx-auto">
              <div className="p-4 text-center">
                <i className="nes-icon is-large star"></i>
                <p className="mt-4 text-sm md:text-base">
                  Level up your teaching skills with our AI sidekick!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div id="features" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl mb-4">Game Features</h2>
              <p className="text-base">
                Everything you need to create amazing courses
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="nes-container is-rounded with-title pixel-shadow bg-white">
                <p className="title">AI Power</p>
                <div className="text-center mb-4">
                  <i className="nes-icon is-medium star"></i>
                </div>
                <p className="text-xs md:text-sm">
                  Generate course outlines, lesson plans, and content with AI assistance.
                </p>
              </div>

              <div className="nes-container is-rounded with-title pixel-shadow bg-white">
                <p className="title">YouTube</p>
                <div className="text-center mb-4">
                  <i className="nes-icon is-medium heart"></i>
                </div>
                <p className="text-xs md:text-sm">
                  Automatically find and embed relevant YouTube content.
                </p>
              </div>

              <div className="nes-container is-rounded with-title pixel-shadow bg-white">
                <p className="title">Structure</p>
                <div className="text-center mb-4">
                  <i className="nes-icon is-medium like"></i>
                </div>
                <p className="text-xs md:text-sm">
                  Organize content into modules and chapters for optimal learning.
                </p>
              </div>

              <div className="nes-container is-rounded with-title pixel-shadow bg-white">
                <p className="title">Share</p>
                <div className="text-center mb-4">
                  <i className="nes-icon is-medium trophy"></i>
                </div>
                <p className="text-xs md:text-sm">
                  Share courses with students or colleagues with a simple link.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div id="how-it-works" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl mb-4">Tutorial</h2>
              <p className="text-base">
                Create a course in three easy steps
              </p>
            </div>

            <div className="nes-container is-dark with-title pixel-shadow max-w-4xl mx-auto mb-12">
              <p className="title">Game Guide</p>
              <div className="space-y-8 px-2 py-4">
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <div className="mr-4 mb-2 md:mb-0">
                    <i className="nes-icon is-medium coin"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg mb-2">1. Define your topic</h3>
                    <p className="text-xs md:text-sm">
                      Enter the subject you want to teach and our AI will generate a detailed course structure.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <div className="mr-4 mb-2 md:mb-0">
                    <i className="nes-icon is-medium coin"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg mb-2">2. Customize content</h3>
                    <p className="text-xs md:text-sm">
                      Edit the AI-generated content and enhance it with YouTube videos.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <div className="mr-4 mb-2 md:mb-0">
                    <i className="nes-icon is-medium coin"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg mb-2">3. Publish and share</h3>
                    <p className="text-xs md:text-sm">
                      Publish your course and share it with your students or audience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div id="pricing" className="py-16">
          <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="nes-container is-rounded pixel-shadow bg-white p-6">
              <i className="nes-icon is-large medal"></i>
              <h2 className="text-xl md:text-2xl mt-4 mb-4">
                Ready to start creating?
              </h2>
              <p className="text-sm md:text-base mb-6">
                Join thousands of educators who are revolutionizing how they create content.
              </p>
              <Link
                href={user ? "/dashboard" : "/sign-in"}
                className="nes-btn is-primary"
              >
                {user ? "Continue Game" : "Start Free Trial"}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm mb-4">Game Menu</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#features" className="text-xs hover:opacity-70 pixel-transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-xs hover:opacity-70 pixel-transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-xs hover:opacity-70 pixel-transition">
                    Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs hover:opacity-70 pixel-transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-xs hover:opacity-70 pixel-transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs hover:opacity-70 pixel-transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-xs hover:opacity-70 pixel-transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-xs hover:opacity-70 pixel-transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t-2 text-center">
            <p className="text-xs">
              &copy; 2025 CourseGPT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}