import type { AutomationAction, SimulationStep, WorkflowJSON } from '../types/workflow';

// Mock automation actions available
const AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient', 'format'],
  },
  {
    id: 'send_notification',
    label: 'Send Notification',
    params: ['channel', 'message', 'priority'],
  },
  {
    id: 'create_task',
    label: 'Create Task',
    params: ['title', 'assignee', 'dueDate'],
  },
  {
    id: 'update_record',
    label: 'Update Database Record',
    params: ['tableName', 'recordId', 'fields'],
  },
];

/**
 * GET /automations
 * Returns list of available automation actions
 */
export const getAutomationActions = async (): Promise<AutomationAction[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(AUTOMATION_ACTIONS);
    }, 300);
  });
};

/**
 * POST /simulate
 * Simulates workflow execution step by step
 */
export const simulateWorkflow = async (
  workflow: WorkflowJSON
): Promise<SimulationStep[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const steps: SimulationStep[] = [];
      let step = 1;

      // Find start node
      const startNode = workflow.nodes.find((n) => n.data.nodeType === 'start');
      if (startNode) {
        steps.push({
          step: step++,
          node: startNode.data.label || 'Start',
          nodeType: 'start',
          status: 'success',
          message: 'Workflow started',
        });
      }

      // Traverse through connected nodes
      const visited = new Set<string>();
      const getNextNodes = (nodeId: string): string[] => {
        return workflow.edges
          .filter((e) => e.source === nodeId)
          .map((e) => e.target);
      };

      const traverse = (nodeId: string) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const node = workflow.nodes.find((n) => n.id === nodeId);
        if (node && node.data.nodeType !== 'start') {
          steps.push({
            step: step++,
            node: node.data.label || node.data.title || node.id,
            nodeType: node.data.nodeType,
            status:
              node.data.nodeType === 'end'
                ? 'completed'
                : node.data.nodeType === 'approval'
                  ? 'pending'
                  : 'completed',
            message:
              node.data.nodeType === 'approval'
                ? 'Awaiting approval'
                : `${node.data.nodeType} completed`,
          });
        }

        const nextNodes = getNextNodes(nodeId);
        nextNodes.forEach(traverse);
      };

      // Start traversal from start node
      if (startNode) {
        const nextNodes = getNextNodes(startNode.id);
        nextNodes.forEach(traverse);
      }

      // If no steps were added (disconnected graph), return error
      if (steps.length === 0) {
        steps.push({
          step: 1,
          node: 'Workflow',
          nodeType: 'start',
          status: 'failed',
          message: 'Workflow has no connected nodes',
        });
      }

      resolve(steps);
    }, 500);
  });
};

/**
 * Validate workflow structure
 */
export const validateWorkflow = async (
  workflow: WorkflowJSON
): Promise<{ valid: boolean; errors: string[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const errors: string[] = [];

      const startNodes = workflow.nodes.filter((n) => n.data.nodeType === 'start');
      const endNodes = workflow.nodes.filter((n) => n.data.nodeType === 'end');

      if (startNodes.length === 0) {
        errors.push('At least one Start node is required');
      }
      if (startNodes.length > 1) {
        errors.push('Only one Start node is allowed');
      }
      if (endNodes.length === 0) {
        errors.push('At least one End node is required');
      }

      resolve({
        valid: errors.length === 0,
        errors,
      });
    }, 200);
  });
};
