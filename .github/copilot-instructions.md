# FlowForge - GitHub Copilot Instructions

## Project Overview
FlowForge is a production-quality HR Workflow Designer web application built with React (Vite + TypeScript), React Flow, Zustand, and React Hook Form. It enables HR users to visually create, configure, validate, and simulate workflows such as onboarding, approvals, and automated actions.

## Architecture

### Tech Stack
- **Build Tool**: Vite 5.x (for speed and HMR)
- **UI Framework**: React 18.x with functional components
- **Type Safety**: TypeScript 5.x (strict mode)
- **State Management**: Zustand 4.x (normalized store)
- **Canvas/Nodes**: React Flow 11.x
- **Forms**: React Hook Form 7.x
- **Styling**: Tailwind CSS 3.x
- **Utilities**: UUID 9.x for ID generation

### Folder Structure
```
src/
├── types/              # TypeScript interfaces (workflow.ts)
├── store/              # Zustand store (workflowStore.ts)
├── api/                # Mock API layer (mockApi.ts)
├── utils/              # Validation, serialization utilities
├── components/
│   ├── canvas/         # React Flow WorkflowCanvas, CustomNodes
│   ├── sidebar/        # NodePalette for drag-drop
│   ├── panel/          # NodeConfigPanel with forms
│   ├── simulation/     # SimulationPanel for execution logs
│   └── common/         # Reusable UI components
├── forms/              # React Hook Form implementations
├── App.tsx             # Main layout component
└── index.css           # Tailwind CSS directives
```

### Core Components

1. **Types** (`types/workflow.ts`)
   - NodeType union: 'start' | 'task' | 'approval' | 'automated' | 'end'
   - NodeData: interface with dynamic data per node type
   - WorkflowNode: extends React Flow's Node type
   - WorkflowEdge: extends React Flow's Edge type
   - SimulationStep: execution log entry
   - ValidationError: validation failure details

2. **Store** (`store/workflowStore.ts`)
   - State: nodes[], edges[], selectedNodeId, validationErrors[], simulationLogs[]
   - Actions: addNode, updateNode, deleteNode, selectNode, addEdge, deleteEdge, etc.
   - No side effects; pure state management

3. **Validation Engine** (`utils/validation.ts`)
   - Cycle detection (DFS algorithm)
   - Connectivity check (BFS algorithm)
   - Single Start node requirement
   - At least one End node requirement
   - Topological sort for DAG validation

4. **Custom Nodes** (5 types, each with distinct styling)
   - **StartNode**: Green, entry point (circle with play icon)
   - **TaskNode**: Blue, human task (square)
   - **ApprovalNode**: Orange, approval step (diamond)
   - **AutomatedNode**: Purple, system action (hexagon)
   - **EndNode**: Red, completion (square)

5. **Configuration Panel** (`components/panel/NodeConfigPanel.tsx`)
   - React Hook Form with dynamic field rendering
   - Node-specific form components
   - Auto-populated automation actions from mock API

6. **Simulation** (`components/simulation/SimulationPanel.tsx`)
   - Step-by-step workflow execution with logs
   - Validation before simulation
   - JSON export of results

## Development Guidelines

### Code Style
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused (< 200 lines)
- Use TypeScript strict mode always
- Name event handlers: `handle[Action]` (e.g., `handleNodeClick`)

### State Management
- All workflow state in Zustand store
- Actions should be pure functions (no side effects)
- Use normalized state structure for scalability
- Avoid deeply nested state

### Type Safety
- Define types in `types/workflow.ts` before using them
- Use type unions for discriminated unions (NodeType)
- Use interfaces for objects with known shapes
- Prefer `type` for complex unions, `interface` for object contracts

### Component Patterns
- **Custom Nodes**: Extend React Flow's Node with custom styling
- **Forms**: Use React Hook Form for controlled inputs
- **API Calls**: Use mock API in `api/mockApi.ts` (no actual backend)
- **Validation**: Call `validateWorkflow()` before simulation

### Adding New Features
1. Define types in `types/workflow.ts`
2. Add actions to Zustand store if needed
3. Create component in appropriate folder
4. Wire into App.tsx or parent component
5. Test in dev mode (`npm run dev`)

## Common Tasks

### Running Development Server
```bash
npm run dev
```
Opens http://localhost:5173/ with HMR enabled.

### Building for Production
```bash
npm run build
```
Outputs optimized bundle to `dist/` folder.

### Adding a New Node Type
1. Add to NodeType union in `types/workflow.ts`
2. Create `YourTypeNode` component in `components/canvas/CustomNodes.tsx`
3. Add form in `forms/NodeForms.tsx`
4. Update NodeConfigPanel to render new form
5. Update NodePalette description

### Modifying Validation Rules
Edit `utils/validation.ts` - `validateWorkflow()` function. Common validations:
- Cycle detection: `detectCycles(nodes, edges)`
- Connectivity: `checkConnectivity(nodes, edges)`
- Topology: `topologicalSort(nodes, edges)`

### Updating Mock API
Edit `api/mockApi.ts`:
- `getAutomationActions()`: Available automation types
- `simulateWorkflow()`: Simulation logic
- `validateWorkflow()`: Validation endpoint

## Testing Workflow Features

1. **Create Nodes**: Click "New Start Node" or drag from palette
2. **Connect**: Drag from source node's output handle to target's input
3. **Configure**: Click node to open right panel, edit properties
4. **Validate**: Click "✓ Validate" button to check workflow rules
5. **Simulate**: Click "Run Workflow" to execute and view logs
6. **Export**: Logs can be exported as JSON

## Troubleshooting

### React Flow Warnings
"nodeTypes/edgeTypes" warnings are normal - they suggest memoizing these objects for performance. Not critical for functionality.

### Type Errors
- Ensure imports use `import type` for TypeScript interfaces when `verbatimModuleSyntax` is enabled
- Check React Flow types compatibility with custom WorkflowNode/Edge types
- Use `as any` sparingly only for library type mismatches

### State Not Updating
- Verify Zustand actions are called correctly
- Check store imports in components
- Use React DevTools to inspect Zustand state

## Performance Optimization Tips
- Memoize nodeTypes and edgeTypes in WorkflowCanvas
- Use `useCallback` for event handlers
- Implement lazy loading for large workflows
- Consider virtualizing node palette for many node types

## Resources
- [React Flow Docs](https://reactflow.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Hook Form Docs](https://react-hook-form.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
