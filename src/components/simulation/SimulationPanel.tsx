import React, { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { simulateWorkflow } from '../../api/mockApi';
import { validateWorkflow } from '../../utils/validation';


export const SimulationPanel: React.FC = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const simulationLogs = useWorkflowStore((state) => state.simulationLogs);
  const isSimulating = useWorkflowStore((state) => state.isSimulating);
  const setSimulationLogs = useWorkflowStore((state) => state.setSimulationLogs);
  const setIsSimulating = useWorkflowStore((state) => state.setIsSimulating);
  const setValidationErrors = useWorkflowStore((state) => state.setValidationErrors);

  const [showPanel, setShowPanel] = useState(false);

  const handleRunWorkflow = async () => {
    if (nodes.length === 0) {
      alert('No nodes in workflow');
      return;
    }

    // Validate workflow
    const errors = validateWorkflow({ nodes, edges });
    setValidationErrors(errors);

    if (errors.length > 0) {
      alert(`Workflow validation failed:\n${errors.map((e) => `- ${e.message}`).join('\n')}`);
      return;
    }

    setIsSimulating(true);
    setShowPanel(true);
    setSimulationLogs([
      {
        step: 0,
        node: 'Initializing',
        nodeType: 'start',
        status: 'pending',
        message: 'Preparing workflow execution...',
      },
    ]);

    try {
      const result = await simulateWorkflow({ nodes, edges });
      setSimulationLogs(result);
    } catch (error) {
      setSimulationLogs([
        {
          step: 1,
          node: 'Error',
          nodeType: 'start',
          status: 'failed',
          message: 'Failed to simulate workflow: ' + (error instanceof Error ? error.message : String(error)),
        },
      ]);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(
      {
        workflow: { nodes, edges },
        simulationLogs,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/json;charset=utf-8,${encodeURIComponent(data)}`
    );
    element.setAttribute('download', `workflow-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const statusColors: Record<string, string> = {
    success: 'text-orange-900 bg-amber-100 border-orange-500',
    completed: 'text-orange-900 bg-amber-100 border-orange-500',
    failed: 'text-neutral-900 bg-orange-100 border-orange-600',
    pending: 'text-neutral-900 bg-yellow-100 border-amber-500',
  };

  return (
    <>
      <div className="flex gap-2 p-4 bg-amber-100 border-t border-amber-300">
        <button
          onClick={handleRunWorkflow}
          disabled={isSimulating}
          className="px-4 py-2 bg-amber-300 text-neutral-900 border border-amber-500 rounded hover:bg-orange-300 disabled:bg-neutral-300 disabled:text-neutral-700 transition-colors font-medium"
        >
          {isSimulating ? 'Running...' : 'Run Workflow'}
        </button>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="px-4 py-2 bg-black text-amber-100 border border-black rounded hover:bg-neutral-800 transition-colors"
        >
          {showPanel ? 'Hide' : 'Show'} Logs
        </button>
        {simulationLogs.length > 1 && (
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-orange-300 text-neutral-900 border border-orange-500 rounded hover:bg-orange-400 transition-colors"
          >
            Export
          </button>
        )}
      </div>

      {showPanel && (
        <div className="bg-amber-50 border-t border-amber-300 max-h-64 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Execution Logs</h3>
            {simulationLogs.length === 0 ? (
              <p className="text-sm text-orange-900">No execution logs yet. Run the workflow to see results.</p>
            ) : (
              <div className="space-y-2">
                {simulationLogs.map((log) => (
                  <div
                    key={log.step}
                    className={`p-3 rounded border-l-4 ${statusColors[log.status] || 'text-neutral-800 bg-amber-50 border-amber-400'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{log.node}</span>
                      <span className="text-xs font-mono bg-amber-200 text-neutral-900 border border-amber-300 px-2 py-1 rounded">
                        Step {log.step}
                      </span>
                    </div>
                    {log.message && <p className="text-sm mt-1">{log.message}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
