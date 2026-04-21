import type { WorkflowJSON, ValidationError } from '../types/workflow';

/**
 * Validate workflow structure
 * Rules:
 * - Only one Start node allowed
 * - At least one End node required
 * - All nodes must be connected
 * - No cycles in graph
 */
export const validateWorkflow = (workflow: WorkflowJSON): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check for start nodes
  const startNodes = workflow.nodes.filter((n) => n.data.nodeType === 'start');
  if (startNodes.length === 0) {
    errors.push({
      type: 'NO_START_NODE',
      message: 'Workflow must have exactly one Start node',
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: 'MULTIPLE_START_NODES',
      message: 'Only one Start node is allowed',
      nodeIds: startNodes.map((n) => n.id),
    });
  }

  // Check for end nodes
  const endNodes = workflow.nodes.filter((n) => n.data.nodeType === 'end');
  if (endNodes.length === 0) {
    errors.push({
      type: 'NO_END_NODE',
      message: 'Workflow must have at least one End node',
    });
  }

  // Check if all nodes are connected
  const { connected, disconnected } = checkConnectivity(workflow);
  if (!connected && workflow.nodes.length > 0) {
    errors.push({
      type: 'DISCONNECTED_NODES',
      message: `${disconnected.length} node(s) are not connected to the main flow`,
      nodeIds: disconnected,
    });
  }

  // Check for cycles
  const hasCycles = detectCycles(workflow);
  if (hasCycles) {
    errors.push({
      type: 'CYCLE_DETECTED',
      message: 'Workflow contains a cycle (circular dependency)',
    });
  }

  return errors;
};

/**
 * Check if all nodes are connected
 */
function checkConnectivity(
  workflow: WorkflowJSON
): { connected: boolean; disconnected: string[] } {
  if (workflow.nodes.length === 0) return { connected: true, disconnected: [] };

  // Find start node
  const startNode = workflow.nodes.find((n) => n.data.nodeType === 'start');
  if (!startNode) return { connected: false, disconnected: workflow.nodes.map((n) => n.id) };

  // BFS from start node
  const visited = new Set<string>();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    // Find all outgoing edges
    const nextNodes = workflow.edges
      .filter((e) => e.source === nodeId)
      .map((e) => e.target);

    queue.push(...nextNodes.filter((id) => !visited.has(id)));
  }

  const disconnected = workflow.nodes
    .map((n) => n.id)
    .filter((id) => !visited.has(id));

  return {
    connected: disconnected.length === 0,
    disconnected,
  };
}

/**
 * Detect cycles in the graph using DFS
 */
function detectCycles(workflow: WorkflowJSON): boolean {
  const visited = new Set<string>();
  const recStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    recStack.add(nodeId);

    // Find all adjacent nodes
    const nextNodes = workflow.edges
      .filter((e) => e.source === nodeId)
      .map((e) => e.target);

    for (const nextId of nextNodes) {
      if (!visited.has(nextId)) {
        if (hasCycle(nextId)) return true;
      } else if (recStack.has(nextId)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  };

  for (const node of workflow.nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) return true;
    }
  }

  return false;
}

/**
 * Topological sort for workflow ordering
 */
export const topologicalSort = (workflow: WorkflowJSON): string[] | null => {
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  // Initialize
  for (const node of workflow.nodes) {
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);
  }

  // Build adjacency list and calculate in-degrees
  for (const edge of workflow.edges) {
    adjacencyList.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  // Kahn's algorithm
  const queue = Array.from(workflow.nodes)
    .filter((n) => inDegree.get(n.id) === 0)
    .map((n) => n.id);

  const sorted: string[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    sorted.push(nodeId);

    for (const neighbor of adjacencyList.get(nodeId) || []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 1) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If sorted list doesn't include all nodes, there's a cycle
  if (sorted.length !== workflow.nodes.length) {
    return null;
  }

  return sorted;
};
