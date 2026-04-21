import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, KeyValueFields } from './FormFields';

const inputClass =
  'w-full px-3 py-2 border border-amber-300 bg-amber-50 text-neutral-900 rounded focus:outline-none focus:ring-2 focus:ring-amber-300';

export const StartNodeForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField label="Title" required error={errors.title?.message as string}>
        <input
          {...register('title', { required: 'Title is required' })}
          className={inputClass}
        />
      </FormField>
      <KeyValueFields fieldName="metadata" label="Metadata" />
    </div>
  );
};

export const TaskNodeForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField label="Title" required error={errors.title?.message as string}>
        <input
          {...register('title', { required: 'Title is required' })}
          className={inputClass}
        />
      </FormField>
      <FormField label="Description">
        <textarea
          {...register('description')}
          className={inputClass}
          rows={3}
        />
      </FormField>
      <FormField label="Assignee">
        <input
          {...register('assignee')}
          placeholder="e.g., john.doe@company.com"
          className={inputClass}
        />
      </FormField>
      <FormField label="Due Date">
        <input
          {...register('dueDate')}
          type="date"
          className={inputClass}
        />
      </FormField>
      <KeyValueFields fieldName="customFields" label="Custom Fields" />
    </div>
  );
};

export const ApprovalNodeForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField label="Title" required error={errors.title?.message as string}>
        <input
          {...register('title', { required: 'Title is required' })}
          className={inputClass}
        />
      </FormField>
      <FormField label="Approver Role">
        <select
          {...register('approverRole')}
          className={inputClass}
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="CEO">CEO</option>
        </select>
      </FormField>
      <FormField label="Auto-Approve Threshold (days)">
        <input
          {...register('autoApproveThreshold', { valueAsNumber: true })}
          type="number"
          className={inputClass}
        />
      </FormField>
    </div>
  );
};

export const AutomatedNodeForm: React.FC<{ actions: Array<{ id: string; label: string; params: string[] }> }> = ({
  actions,
}) => {
  const { register, watch, formState: { errors } } = useFormContext();
  const selectedActionId = watch('actionId');
  const selectedAction = actions.find((a) => a.id === selectedActionId);

  return (
    <div className="space-y-4">
      <FormField label="Title" required error={errors.title?.message as string}>
        <input
          {...register('title', { required: 'Title is required' })}
          className={inputClass}
        />
      </FormField>
      <FormField label="Action">
        <select
          {...register('actionId')}
          className={inputClass}
        >
          <option value="">Select an action</option>
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
      </FormField>
      {selectedAction && selectedAction.params.length > 0 && (
        <KeyValueFields fieldName="params" label={`${selectedAction.label} Parameters`} />
      )}
    </div>
  );
};

export const EndNodeForm: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField label="Message">
        <textarea
          {...register('message')}
          className={inputClass}
          rows={3}
          placeholder="Message displayed when workflow completes"
        />
      </FormField>
    </div>
  );
};
