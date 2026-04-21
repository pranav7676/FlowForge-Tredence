import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { NodeType } from '../../types/workflow';

const NODE_PALETTE: Array<{ type: NodeType; label: string; description: string; icon: string }> = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: '▶',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Human task assignment',
    icon: '□',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Manager approval step',
    icon: '✓',
  },
  {
    type: 'automated',
    label: 'Automated',
    description: 'System-triggered action',
    icon: '⚙',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow completion',
    icon: '■',
  },
];

export const NodePalette: React.FC = () => {
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', nodeType);
  };

  return (
    <div className="w-64 bg-amber-50 border-r border-amber-300 shadow-sm overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Node Types</h2>
        <div className="space-y-2">
          {NODE_PALETTE.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded cursor-move hover:shadow-md hover:border-orange-300 hover:from-amber-100 hover:to-orange-100 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{node.icon}</span>
                <span className="font-semibold text-neutral-900">{node.label}</span>
              </div>
              <p className="text-xs text-orange-900">{node.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-amber-300 p-4 mt-4">
        <h3 className="font-semibold text-neutral-900 mb-2 text-sm">Quick Actions</h3>
        <button
          onClick={() => {
            // Quick add start node
            addNode('start', { x: 100, y: 100 });
          }}
          className="w-full px-3 py-2 text-sm bg-amber-300 text-neutral-900 border border-amber-500 rounded hover:bg-orange-300 transition-colors"
        >
          + New Start Node
        </button>
      </div>
    </div>
  );
};
