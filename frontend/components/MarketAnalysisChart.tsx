'use client'

/**
 * D3.js component for market trend analysis visualization.
 * Displays salary distributions, demand trends, and automation risks.
 */
import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface MarketData {
  profession: string
  salary: number
  demand: number
  automationRisk: number
}

interface MarketAnalysisChartProps {
  data: MarketData[]
  width?: number
  height?: number
}

export default function MarketAnalysisChart({
  data,
  width = 800,
  height = 400,
}: MarketAnalysisChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.profession))
      .range([0, innerWidth])
      .padding(0.2)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.salary) || 0])
      .range([innerHeight, 0])

    // Color scale for automation risk
    const colorScale = d3
      .scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateRdYlGn)

    // Bars
    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.profession) || 0)
      .attr('y', (d) => yScale(d.salary))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => innerHeight - yScale(d.salary))
      .attr('fill', (d) => colorScale(1 - d.automationRisk))
      .attr('opacity', 0.8)

    // X Axis
    svg
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')

    // Y Axis
    svg.append('g').call(d3.axisLeft(yScale))

    // Y Axis Label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Average Salary ($)')

  }, [data, width, height])

  return (
    <div className="market-analysis-chart">
      <svg ref={svgRef}></svg>
    </div>
  )
}
