import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { KeyValuePair } from '../types/workflow';

interface KeyValueFieldsProps {
  fieldName: 'metadata' | 'customFields' | 'params';
  label: string;
}

export const KeyValueFields: React.FC<KeyValueFieldsProps> = ({ fieldName, label }) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-900">{label}</label>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`${fieldName}.${index}.key`)}
              placeholder="Key"
              className="flex-1 px-2 py-1 text-sm border border-amber-300 bg-amber-50 text-neutral-900 rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <input
              {...register(`${fieldName}.${index}.value`)}
              placeholder="Value"
              className="flex-1 px-2 py-1 text-sm border border-amber-300 bg-amber-50 text-neutral-900 rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              onClick={() => remove(index)}
              className="px-2 py-1 text-sm text-orange-900 hover:bg-orange-100 border border-orange-200 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => append({ key: '', value: '' } as KeyValuePair)}
        className="px-3 py-1 text-sm bg-amber-300 text-neutral-900 border border-amber-500 rounded hover:bg-orange-300"
      >
        + Add {label}
      </button>
    </div>
  );
};

export const FormField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, error, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-neutral-900">
      {label}
      {required && <span className="text-orange-700 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-sm text-orange-700">{error}</p>}
  </div>
);
