'use client'

/**
 * Butterfly Framework UI component for expandable trajectory cards.
 * Displays career path options (Plan A, B, C) in an expandable format.
 */
import React, { useState } from 'react'

interface PathStep {
  profession: string
  skill: string
  training?: string
  duration_months: number
}

interface CareerPathData {
  plan_id: string
  steps: PathStep[]
  total_cost: number
  total_time_months: number
  expected_salary_gain: number
  roi: number
}

interface ButterflyPathCardProps {
  path: CareerPathData
  variant: 'A' | 'B' | 'C'
}

const variantColors = {
  A: 'border-blue-500 bg-blue-50',
  B: 'border-green-500 bg-green-50',
  C: 'border-purple-500 bg-purple-50',
}

export default function ButterflyPathCard({ path, variant }: ButterflyPathCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
        variantColors[variant]
      } ${expanded ? 'shadow-lg' : 'shadow'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Plan {variant}</h3>
        <span className="text-sm text-gray-600">
          {expanded ? '▼' : '▶'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Total Cost</p>
          <p className="text-lg font-semibold">${path.total_cost.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Time</p>
          <p className="text-lg font-semibold">{path.total_time_months} months</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Salary Gain</p>
          <p className="text-lg font-semibold text-green-600">
            +${path.expected_salary_gain.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">ROI</p>
          <p className="text-lg font-semibold">{(path.roi * 100).toFixed(1)}%</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2">Career Steps:</h4>
          <ol className="list-decimal list-inside space-y-2">
            {path.steps.map((step, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium">{step.profession}</span>
                {step.training && (
                  <span className="text-gray-600"> (Training: {step.training})</span>
                )}
                <span className="text-gray-500"> - {step.duration_months} months</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
