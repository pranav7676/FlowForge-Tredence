import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type {
  WorkflowNode,
  WorkflowEdge,
  NodeData,
  NodeType,
  SimulationStep,
  ValidationError,
} from '../types/workflow';
import type {
  NodeChange,
  EdgeChange,
} from 'reactflow';

type NodeSetter = WorkflowNode[] | ((nodes: WorkflowNode[]) => WorkflowNode[]);
type EdgeSetter = WorkflowEdge[] | ((edges: WorkflowEdge[]) => WorkflowEdge[]);

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  simulationLogs: SimulationStep[];
  isSimulating: boolean;

  // Node actions
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  getSelectedNode: () => WorkflowNode | undefined;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  // Edge actions
  addEdge: (source: string, target: string) => void;
  deleteEdge: (source: string, target: string) => void;
  setEdges: (edges: EdgeSetter) => void;
  setNodes: (nodes: NodeSetter) => void;

  // Workflow actions
  setValidationErrors: (errors: ValidationError[]) => void;
  setSimulationLogs: (logs: SimulationStep[]) => void;
  setIsSimulating: (isSimulating: boolean) => void;

  // Batch operations
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;

  // Clear
  clearWorkflow: () => void;
}

const createDefaultNodeData = (type: NodeType): NodeData => {
  const baseData: NodeData = {
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
    nodeType: type,
  };

  switch (type) {
    case 'start':
      return { ...baseData, title: 'Start', metadata: [] };
    case 'task':
      return {
        ...baseData,
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      };
    case 'approval':
      return {
        ...baseData,
        title: 'Approval',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      };
    case 'automated':
      return {
        ...baseData,
        title: 'Automated Action',
        actionId: '',
        params: [],
      };
    case 'end':
      return { ...baseData, title: 'End', message: 'Workflow completed' };
    default:
      return baseData;
  }
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  validationErrors: [],
  simulationLogs: [],
  isSimulating: false,

  addNode: (type: NodeType, position: { x: number; y: number }) => {
    const id = uuidv4();
    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data: createDefaultNodeData(type),
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  updateNode: (id: string, data: Partial<NodeData>) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    }));
  },

  deleteNode: (id: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  selectNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  getSelectedNode: () => {
    const state = get();
    return state.nodes.find((node) => node.id === state.selectedNodeId);
  },

  onNodesChange: (changes: NodeChange[]) => {
    set((state) => {
      const updatedNodes = applyNodeChanges(
        changes,
        state.nodes as any
      ) as WorkflowNode[];

      const selectedNodeId = updatedNodes.some(
        (node) => node.id === state.selectedNodeId
      )
        ? state.selectedNodeId
        : null;

      return {
        nodes: updatedNodes,
        selectedNodeId,
      };
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges as any) as WorkflowEdge[],
    }));
  },

  addEdge: (source: string, target: string) => {
    set((state) => {
      // Prevent duplicate edges
      if (state.edges.find((e) => e.source === source && e.target === target)) {
        return state;
      }
      return {
        edges: [...state.edges, { id: `${source}-${target}`, source, target }],
      };
    });
  },

  deleteEdge: (source: string, target: string) => {
    set((state) => ({
      edges: state.edges.filter((e) => !(e.source === source && e.target === target)),
    }));
  },

  setEdges: (edges: EdgeSetter) => {
    set((state) => ({
      edges: typeof edges === 'function' ? edges(state.edges) : edges,
    }));
  },

  setNodes: (nodes: NodeSetter) => {
    set((state) => ({
      nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes,
    }));
  },

  setValidationErrors: (errors: ValidationError[]) => {
    set({ validationErrors: errors });
  },

  setSimulationLogs: (logs: SimulationStep[]) => {
    set({ simulationLogs: logs });
  },

  setIsSimulating: (isSimulating: boolean) => {
    set({ isSimulating });
  },

  updateNodePosition: (id: string, position: { x: number; y: number }) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position } : node
      ),
    }));
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      validationErrors: [],
      simulationLogs: [],
    });
  },
}));
