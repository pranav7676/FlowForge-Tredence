import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import type { Connection, Node, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import nodeTypes from './CustomNodes';

export const WorkflowCanvas: React.FC = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);

  const setEdges = useWorkflowStore((state) => state.setEdges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const selectNode = useWorkflowStore((state) => state.selectNode);

  const canvasNodes = useMemo(
    () =>
      nodes.map((node: Node) => ({
        ...node,
        selected: node.id === selectedNodeId,
      })),
    [nodes, selectedNodeId]
  );

  const canvasNodeTypes = useMemo(() => nodeTypes as NodeTypes, []);

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(connection, currentEdges as any) as any
      );
    },
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="flex-1 min-h-[280px] w-full">
      <ReactFlow
        style={{ width: '100%', height: '100%' }}
        nodes={canvasNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={canvasNodeTypes}
        fitView
      >
        <Background color="#f59e0b" gap={20} size={1} />
        <Controls />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => (node.selected ? '#f97316' : '#fbbf24')}
          maskColor="rgba(251, 191, 36, 0.18)"
        />
      </ReactFlow>
    </div>
  );
};
