"use client"

import type React from "react"
import { Code, BookOpen, Briefcase, Cloud, Gamepad } from "lucide-react"

interface CategorySelectorProps {
  selectedCategory: string
  customCategory: string
  onSelectCategory: (category: string) => void
  onCustomCategoryChange: (category: string) => void
}

interface CategoryOption {
  id: string
  name: string
  icon: React.ElementType
}

export function CategorySelector({
  selectedCategory,
  customCategory,
  onSelectCategory,
  onCustomCategoryChange,
}: CategorySelectorProps) {
  const categories: CategoryOption[] = [
    { id: "Programming", name: "Programming", icon: Code },
    { id: "Development", name: "Development", icon: BookOpen },
    { id: "Interview", name: "Interview Preparation", icon: Briefcase },
    { id: "Deployment", name: "Deployment", icon: Cloud },
    { id: "Others", name: "Others", icon: Gamepad },
  ]

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Select a Category</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.id}
              className={`nes-container is-rounded cursor-pointer p-4 transition-all hover:bg-gray-100 ${
                selectedCategory === category.id ? "is-dark" : ""
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              <div className="flex flex-col items-center justify-center">
                <Icon className="mb-2 h-8 w-8" />
                <span className="text-center text-sm">{category.name}</span>
              </div>
            </div>
          )
        })}
      </div>

      {selectedCategory === "Others" && (
        <div className="mt-6">
          <label htmlFor="custom-category" className="mb-2 block text-sm font-medium">
            Enter Custom Category
          </label>
          <input
            id="custom-category"
            type="text"
            value={customCategory}
            onChange={(e) => onCustomCategoryChange(e.target.value)}
            placeholder="e.g., Data Science, Machine Learning, etc."
            className="nes-input w-full"
          />
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Select a category that best describes your course. This will help users find your course more easily.
        </p>
      </div>
    </div>
  )
}
