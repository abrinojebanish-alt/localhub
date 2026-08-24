import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message?: string;
  closeable?: boolean;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  closeable = false,
  onClose,
}) => {
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-800',
    },
  };

  const styles = typeStyles[type];
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : type === 'warning' ? AlertTriangle : Info;

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 mb-4 flex items-start gap-3`}>
      <Icon className={`${styles.icon} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1">
        {title && <h3 className={`${styles.title} font-semibold mb-1`}>{title}</h3>}
        {message && <p className={`${styles.message} text-sm`}>{message}</p>}
      </div>
      {closeable && (
        <button
          onClick={onClose}
          className={`${styles.icon} flex-shrink-0 hover:opacity-70`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
