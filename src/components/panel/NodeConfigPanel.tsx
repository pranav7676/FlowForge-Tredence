import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useWorkflowStore } from '../../store/workflowStore';
import { getAutomationActions } from '../../api/mockApi';
import type { AutomationAction, NodeData } from '../../types/workflow';
import {
  StartNodeForm,
  TaskNodeForm,
  ApprovalNodeForm,
  AutomatedNodeForm,
  EndNodeForm,
} from '../../forms/NodeForms';

export const NodeConfigPanel: React.FC = () => {
  const selectedNode = useWorkflowStore((state) => state.getSelectedNode());
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const selectNode = useWorkflowStore((state) => state.selectNode);

  const [automationActions, setAutomationActions] = useState<AutomationAction[]>([]);
  const [, setIsLoading] = useState(false);

  const methods = useForm<NodeData>({
    mode: 'onChange',
    values: (selectedNode?.data || {
      label: '',
      nodeType: 'task',
    }) as NodeData,
  });

  // Load automation actions
  useEffect(() => {
    const loadActions = async () => {
      setIsLoading(true);
      const actions = await getAutomationActions();
      setAutomationActions(actions);
      setIsLoading(false);
    };
    loadActions();
  }, []);

  const onSubmit = (data: any) => {
    if (selectedNode) {
      updateNode(selectedNode.id, data);
    }
  };

  const handleDelete = () => {
    if (selectedNode && confirm('Are you sure you want to delete this node?')) {
      deleteNode(selectedNode.id);
      selectNode(null);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-amber-50 border-l border-amber-300 shadow-sm overflow-y-auto">
        <div className="p-6 text-center text-orange-900">
          <p className="text-sm">Select a node to configure</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-amber-50 border-l border-amber-300 shadow-sm overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900">Configuration</h2>
          <button
            onClick={handleDelete}
            className="px-2 py-1 text-sm bg-black text-amber-100 rounded border border-black hover:bg-neutral-800 transition-colors"
          >
            Delete
          </button>
        </div>

        <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded">
          <p className="text-xs text-orange-900">Node ID</p>
          <p className="text-sm font-mono text-neutral-900 break-all">{selectedNode.id}</p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {selectedNode.data.nodeType === 'start' && <StartNodeForm />}
            {selectedNode.data.nodeType === 'task' && <TaskNodeForm />}
            {selectedNode.data.nodeType === 'approval' && <ApprovalNodeForm />}
            {selectedNode.data.nodeType === 'automated' && (
              <AutomatedNodeForm actions={automationActions} />
            )}
            {selectedNode.data.nodeType === 'end' && <EndNodeForm />}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-orange-300 text-neutral-900 border border-orange-500 rounded hover:bg-orange-400 transition-colors font-medium"
            >
              Save Changes
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
