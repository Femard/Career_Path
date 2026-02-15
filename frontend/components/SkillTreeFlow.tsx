'use client'

/**
 * React Flow component for visualizing skill trees and career pathways.
 * Nodes represent skills/professions, edges represent transitions.
 */
import React, { useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface SkillTreeFlowProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onNodeClick?: (node: Node) => void
}

const defaultNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Current Position' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Skill A' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Skill B' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Target Position' },
    position: { x: 250, y: 200 },
  },
]

const defaultEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
]

export default function SkillTreeFlow({
  initialNodes = defaultNodes,
  initialEdges = defaultEdges,
  onNodeClick,
}: SkillTreeFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        onNodeClick(node)
      }
    },
    [onNodeClick]
  )

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
