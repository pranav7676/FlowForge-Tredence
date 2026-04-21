# FlowForge - HR Workflow Designer

A production-quality web application for designing, configuring, and simulating HR workflows. Built with React, Vite, TypeScript, React Flow, Zustand, and React Hook Form.

## Features

### Core Functionality

#### 1. **Visual Workflow Canvas** (React Flow)

- Drag-and-drop interface for building workflows
- Pan, zoom, and minimap controls
- Real-time node positioning
- Directional edges showing workflow flow

#### 2. **Node Types**

Five distinct node types with specialized behavior:

- **Start Node**: Workflow entry point with metadata support
- **Task Node**: Human task assignments with assignee, due date, and custom fields
- **Approval Node**: Manager/stakeholder approval steps with auto-approval thresholds
- **Automated Node**: System-triggered actions with dynamic parameters
- **End Node**: Workflow completion with custom messages

#### 3. **Smart Configuration Panel**

- React Hook Form with controlled inputs
- Dynamic forms based on selected node type
- Real-time validation
- Key-value pair management for custom fields
- Auto-save on form changes

#### 4. **Node Palette Sidebar**

- Draggable node types with descriptions
- Quick-add buttons for common nodes
- Visual indicators for each node type

#### 5. **Workflow Validation**

Comprehensive validation engine checks:

- Exactly one Start node required
- At least one End node required
- All nodes must be connected
- No circular dependencies (cycle detection via DFS)
- Visual error display

#### 6. **Simulation Engine**

- Step-by-step workflow execution
- Real-time execution logs with status indicators
- Success, failed, pending, completed states
- Export workflow results as JSON

#### 7. **State Management** (Zustand)

Centralized, normalized state for:

- Nodes with complete data
- Edges with source/target connections
- Selected node tracking
- Validation errors
- Simulation logs

#### 8. **Mock API Layer**

Two main endpoints:

**GET /automations**

```json
[
  {
    "id": "send_email",
    "label": "Send Email",
    "params": ["to", "subject", "body"]
  },
  {
    "id": "generate_doc",
    "label": "Generate Document",
    "params": ["template", "recipient", "format"]
  },
  {
    "id": "send_notification",
    "label": "Send Notification",
    "params": ["channel", "message", "priority"]
  },
  {
    "id": "create_task",
    "label": "Create Task",
    "params": ["title", "assignee", "dueDate"]
  },
  {
    "id": "update_record",
    "label": "Update Database Record",
    "params": ["tableName", "recordId", "fields"]
  }
]
```

**POST /simulate**

- Accepts workflow JSON
- Returns step-by-step execution results
- Includes success/failure status for each step

## Project Structure

```
src/
├── components/
│   ├── canvas/
│   │   ├── WorkflowCanvas.tsx      # React Flow container
│   │   └── CustomNodes.tsx         # 5 custom node components
│   ├── sidebar/
│   │   └── NodePalette.tsx         # Draggable node types
│   ├── panel/
│   │   └── NodeConfigPanel.tsx     # Node configuration form
│   ├── simulation/
│   │   └── SimulationPanel.tsx     # Workflow execution & logs
│   └── common/
│       └── index.tsx               # Reusable UI components
├── forms/
│   ├── FormFields.tsx              # Field components
│   └── NodeForms.tsx               # Node-specific forms
├── store/
│   └── workflowStore.ts            # Zustand state management
├── api/
│   └── mockApi.ts                  # Mock API endpoints
├── utils/
│   ├── validation.ts               # Workflow validation logic
│   └── serialization.ts            # JSON serialization/export
├── types/
│   └── workflow.ts                 # TypeScript type definitions
├── hooks/                          # Custom React hooks (extensible)
├── App.tsx                         # Main application component
├── main.tsx                        # Application entry point
└── index.css                       # Global styles & Tailwind
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd FlowForge

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Build

```bash
npm run build
```

Production build output is in the `dist/` directory.

### Development

```bash
npm run dev
```

Vite will reload the page on file changes (HMR).

## Usage

### Creating a Workflow

1. **Add Nodes**: Drag node types from the left sidebar onto the canvas
2. **Connect Nodes**: Draw edges between nodes to create flow
3. **Configure**: Click on a node and edit properties in the right panel
4. **Validate**: Click "Validate" button to check workflow validity
5. **Simulate**: Click "Run Workflow" to execute and see results

### Node Configuration

Each node type has specific fields:

**Start Node**

- Title (required)
- Metadata (key-value pairs)

**Task Node**

- Title (required)
- Description
- Assignee (email)
- Due Date
- Custom Fields (key-value pairs)

**Approval Node**

- Title (required)
- Approver Role (Manager, HRBP, Director, CEO)
- Auto-Approve Threshold (days)

**Automated Node**

- Title (required)
- Action (selected from available automations)
- Dynamic parameters based on action type

**End Node**

- Message (completion message)

### Workflow Validation

Validation rules ensure workflow integrity:

1. **Exactly one Start node** - Workflows must have a single entry point
2. **At least one End node** - Workflows must have completion point(s)
3. **Connected graph** - All nodes must be reachable from Start node
4. **No cycles** - Directed acyclic graph (DAG) requirement

### Exporting Workflows

After simulation, click "Export" to download:

- Complete workflow definition
- Execution logs
- Metadata including export timestamp

## Architecture

### Design Principles

1. **Separation of Concerns**: Canvas, forms, state, and API are isolated
2. **Unidirectional Data Flow**: Zustand as single source of truth
3. **Component Composition**: Small, reusable components with single responsibilities
4. **Type Safety**: Strict TypeScript without `any` abuse
5. **Controlled Forms**: React Hook Form for predictable form behavior

### State Management (Zustand)

```typescript
interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  simulationLogs: SimulationStep[];
  isSimulating: boolean;

  // Actions
  addNode(type, position): void;
  updateNode(id, data): void;
  deleteNode(id): void;
  // ... more actions
}
```

### Validation Engine

- **DFS-based cycle detection** - Detects circular dependencies
- **BFS-based connectivity check** - Ensures all nodes are reachable
- **Topological sort** - Validates DAG structure
- **Node count validation** - Enforces Start/End node rules

### Type System

Key types in `types/workflow.ts`:

```typescript
export type NodeType = "start" | "task" | "approval" | "automated" | "end";

export interface NodeData {
  label: string;
  nodeType: NodeType;
  title?: string;
  // ... node-specific fields
}

export type WorkflowNode = Node<NodeData, NodeType>;
export type WorkflowEdge = Edge;
```

## Technology Stack

| Technology      | Purpose          | Version |
| --------------- | ---------------- | ------- |
| React           | UI framework     | 18.x    |
| Vite            | Build tool       | 5.x     |
| TypeScript      | Type safety      | 5.x     |
| React Flow      | Canvas rendering | 11.x    |
| Zustand         | State management | 4.x     |
| React Hook Form | Form management  | 7.x     |
| Tailwind CSS    | Styling          | 3.x     |
| UUID            | ID generation    | 9.x     |

## Performance Considerations

1. **Memoization**: Components use React.memo for optimization
2. **Normalized State**: Zustand store maintains normalized data
3. **Selective Subscriptions**: Components subscribe only to needed state
4. **Lazy Forms**: Forms render only for selected node
5. **Virtual Canvas**: React Flow handles large graphs efficiently

## Known Limitations & Future Improvements

### Current Limitations

1. **No Undo/Redo**: Manual state management required
2. **No Auto-Layout**: Manual node positioning
3. **Single Workflow**: No workflow versioning
4. **Local Validation Only**: No backend validation
5. **No User Authentication**: Mock API only

### Future Enhancements

1. **Undo/Redo Stack**: Command pattern for state reversibility
2. **Auto-Layout Algorithms**: Dagre for hierarchical layout
3. **Workflow Templates**: Pre-built workflow patterns
4. **Batch Operations**: Multi-node selection and editing
5. **Real API Integration**: Replace mock API with backend
6. **Persistence**: Save/load workflows from database
7. **Collaboration**: Real-time multi-user editing (WebSockets)
8. **Advanced Simulation**: Branching logic, conditional paths
9. **Analytics Dashboard**: Workflow statistics and metrics
10. **Accessibility**: WCAG 2.1 AA compliance

## Design Trade-Offs

| Decision                    | Rationale                             | Alternative                    |
| --------------------------- | ------------------------------------- | ------------------------------ |
| Zustand over Redux          | Simpler API, less boilerplate         | Redux, MobX                    |
| React Hook Form over Formik | Better performance, smaller bundle    | Formik, React Final Form       |
| Tailwind over CSS Modules   | Rapid development, consistent styling | CSS Modules, Styled Components |
| Mock API over real backend  | Faster development, offline-first     | Real REST/GraphQL API          |
| Type-safe forms             | Catch errors at compile time          | Runtime validation only        |

## Code Quality

- ✅ Strong TypeScript typing throughout
- ✅ SOLID principles applied
- ✅ No monolithic components
- ✅ Reusable utilities and hooks
- ✅ Comprehensive type definitions
- ✅ Clear separation of concerns
- ✅ ESLint configuration included

## License

MIT License - See LICENSE file for details
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
