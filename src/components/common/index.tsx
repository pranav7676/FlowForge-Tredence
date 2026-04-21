import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';

export const ValidationDisplay: React.FC = () => {
  const validationErrors = useWorkflowStore((state) => state.validationErrors);

  if (validationErrors.length === 0) return null;

  return (
    <div className="bg-orange-100 border-t border-orange-300 p-4">
      <h3 className="font-bold text-neutral-900 mb-2">Validation Errors</h3>
      <ul className="space-y-1">
        {validationErrors.map((error, index) => (
          <li key={index} className="text-sm text-orange-900">
            • {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <button
    className={`px-4 py-2 rounded font-medium transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Modal: React.FC<{
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
}> = ({ isOpen, title, children, onClose, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-amber-50 border border-amber-300 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-amber-100 border-b border-amber-300 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-orange-900 hover:text-neutral-900 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
        {actions && <div className="bg-orange-50 border-t border-amber-300 p-4 flex gap-2 justify-end">{actions}</div>}
      </div>
    </div>
  );
};
