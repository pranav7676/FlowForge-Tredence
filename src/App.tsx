import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from './store/workflowStore';
import { validateWorkflow } from './utils/validation';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodePalette } from './components/sidebar/NodePalette';
import { NodeConfigPanel } from './components/panel/NodeConfigPanel';
import { SimulationPanel } from './components/simulation/SimulationPanel';
import { ValidationDisplay } from './components/common';

function AppContent() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const addNode = useWorkflowStore((state) => state.addNode);
  const setValidationErrors = useWorkflowStore((state) => state.setValidationErrors);
  const clearWorkflow = useWorkflowStore((state) => state.clearWorkflow);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const nodeType = e.dataTransfer.getData('application/reactflow');
    if (!nodeType) return;

    // Get canvas position relative to viewport
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addNode(nodeType as any, { x, y });
  };

  const handleValidate = () => {
    const errors = validateWorkflow({ nodes, edges });
    setValidationErrors(errors);
    if (errors.length === 0) {
      alert('✓ Workflow is valid!');
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the entire workflow?')) {
      clearWorkflow();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-amber-50 text-neutral-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-300 to-orange-300 text-neutral-950 p-4 shadow-md border-b border-amber-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">FlowForge</h1>
            <p className="text-sm text-orange-900">HR Workflow Designer</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-black text-amber-100 border border-amber-300 px-3 py-1 rounded">
              {nodes.length} nodes
            </span>
            <span className="bg-black text-amber-100 border border-amber-300 px-3 py-1 rounded">
              {edges.length} connections
            </span>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      <ValidationDisplay />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <NodePalette />

        {/* Canvas Area */}
        <div
          className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-amber-50 to-orange-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <WorkflowCanvas />
          
          {/* Bottom Controls */}
          <div className="bg-orange-50 border-t border-amber-300 p-3 flex gap-2 flex-wrap">
            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-amber-300 text-neutral-900 rounded border border-amber-500 hover:bg-orange-300 transition-colors font-medium"
            >
              ✓ Validate
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-black text-amber-100 rounded border border-black hover:bg-neutral-800 transition-colors font-medium"
            >
              Clear
            </button>
            <div className="flex-1" />
            <span className="text-sm text-orange-900 py-2">
              Drag nodes from the palette to create workflow
            </span>
          </div>
        </div>

        {/* Right Sidebar */}
        <NodeConfigPanel />
      </div>

      {/* Bottom Simulation Panel */}
      <SimulationPanel />
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}

export default App;
