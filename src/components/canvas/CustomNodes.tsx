import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { NodeData } from '../../types/workflow';

const nodeColors: Record<string, { bg: string; border: string; icon: string }> = {
  start: { bg: 'bg-amber-50', border: 'border-amber-500', icon: '▶' },
  task: { bg: 'bg-orange-50', border: 'border-orange-500', icon: '□' },
  approval: { bg: 'bg-yellow-100', border: 'border-yellow-500', icon: '✓' },
  automated: { bg: 'bg-amber-100', border: 'border-orange-600', icon: '⚙' },
  end: { bg: 'bg-orange-100', border: 'border-neutral-900', icon: '■' },
};

export const StartNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  const style = nodeColors.start;
  return (
    <div className={`px-4 py-2 rounded border-2 shadow-md ${style.bg} ${style.border}`}>
      <Handle type="source" position={Position.Bottom} />
      <div className="text-center">
        <div className="text-lg font-bold text-amber-700">{style.icon}</div>
        <div className="text-sm font-semibold text-neutral-900">{data.label}</div>
        {data.title && <div className="text-xs text-orange-900">{data.title}</div>}
      </div>
    </div>
  );
};

export const TaskNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  const style = nodeColors.task;
  return (
    <div className={`px-4 py-2 rounded border-2 shadow-md ${style.bg} ${style.border} w-48`}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div className="text-lg font-bold text-orange-700 text-center">{style.icon}</div>
        <div className="text-sm font-semibold text-neutral-900">{data.title || data.label}</div>
        {data.description && <div className="text-xs text-orange-900 line-clamp-2">{data.description}</div>}
        {data.assignee && <div className="text-xs text-neutral-700">👤 {data.assignee}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export const ApprovalNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  const style = nodeColors.approval;
  return (
    <div className={`px-4 py-2 rounded border-2 shadow-md ${style.bg} ${style.border} w-48`}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div className="text-lg font-bold text-amber-700 text-center">{style.icon}</div>
        <div className="text-sm font-semibold text-neutral-900">{data.title || data.label}</div>
        {data.approverRole && <div className="text-xs text-orange-900">Role: {data.approverRole}</div>}
        {data.autoApproveThreshold !== undefined && (
          <div className="text-xs text-neutral-700">Auto: {data.autoApproveThreshold}d</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export const AutomatedNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  const style = nodeColors.automated;
  return (
    <div className={`px-4 py-2 rounded border-2 shadow-md ${style.bg} ${style.border} w-48`}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div className="text-lg font-bold text-orange-800 text-center">{style.icon}</div>
        <div className="text-sm font-semibold text-neutral-900">{data.title || data.label}</div>
        {data.actionId && <div className="text-xs text-orange-900">Action: {data.actionId}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export const EndNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  const style = nodeColors.end;
  return (
    <div className={`px-4 py-2 rounded border-2 shadow-md ${style.bg} ${style.border}`}>
      <Handle type="target" position={Position.Top} />
      <div className="text-center">
        <div className="text-lg font-bold text-neutral-900">{style.icon}</div>
        <div className="text-sm font-semibold text-neutral-900">{data.label}</div>
        {data.title && <div className="text-xs text-orange-900">{data.title}</div>}
      </div>
    </div>
  );
};

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

export default nodeTypes;
