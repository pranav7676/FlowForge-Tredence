import type { Node, Edge } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface NodeData {
  label: string;
  nodeType: NodeType;
  title?: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: KeyValuePair[];
  metadata?: KeyValuePair[];
  approverRole?: string;
  autoApproveThreshold?: number;
  actionId?: string;
  params?: KeyValuePair[];
  message?: string;
}

export type WorkflowNode = Node<NodeData, NodeType>;
export type WorkflowEdge = Edge;

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  step: number;
  node: string;
  nodeType: NodeType;
  status: 'success' | 'failed' | 'completed' | 'pending';
  message?: string;
}

export interface WorkflowJSON {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface ValidationError {
  type: string;
  message: string;
  nodeIds?: string[];
}
