import type { WorkflowJSON } from '../types/workflow';

/**
 * Serialize workflow to JSON string
 */
export const serializeWorkflow = (workflow: WorkflowJSON): string => {
  return JSON.stringify(
    {
      nodes: workflow.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges: workflow.edges,
    },
    null,
    2
  );
};

/**
 * Deserialize workflow from JSON string
 */
export const deserializeWorkflow = (jsonString: string): WorkflowJSON | null => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.nodes || !parsed.edges) {
      return null;
    }
    return parsed as WorkflowJSON;
  } catch {
    return null;
  }
};

/**
 * Download workflow as JSON file
 */
export const downloadWorkflowJSON = (workflow: WorkflowJSON, filename: string = 'workflow.json') => {
  const jsonString = serializeWorkflow(workflow);
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(jsonString)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Create downloadable workflow with execution logs
 */
export const downloadWorkflowWithLogs = (
  workflow: WorkflowJSON,
  logs: string[],
  filename: string = 'workflow-execution.json'
) => {
  const data = {
    workflow: {
      nodes: workflow.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges: workflow.edges,
    },
    executionLogs: logs,
    exportedAt: new Date().toISOString(),
  };

  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Get workflow statistics
 */
export const getWorkflowStats = (workflow: WorkflowJSON) => {
  const nodeTypes: Record<string, number> = {};
  workflow.nodes.forEach((n) => {
    const type = n.data.nodeType;
    nodeTypes[type] = (nodeTypes[type] || 0) + 1;
  });

  return {
    totalNodes: workflow.nodes.length,
    totalEdges: workflow.edges.length,
    nodeTypes,
    complexity: calculateComplexity(workflow),
  };
};

/**
 * Calculate workflow complexity
 */
function calculateComplexity(workflow: WorkflowJSON): 'low' | 'medium' | 'high' {
  const nodeCount = workflow.nodes.length;
  const edgeCount = workflow.edges.length;
  const cyclomatic = edgeCount - nodeCount + 2;

  if (nodeCount <= 5 && cyclomatic <= 2) return 'low';
  if (nodeCount <= 15 && cyclomatic <= 5) return 'medium';
  return 'high';
}
