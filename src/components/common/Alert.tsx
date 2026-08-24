import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  closeable?: boolean;
}

const getAlertStyles = (type: AlertType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800';
  }
};

const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <AlertCircle size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'info':
    default:
      return <Info size={20} />;
  }
};

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  closeable = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className={`border rounded-lg p-4 flex gap-3 ${getAlertStyles(type)}`}>
      <div className="flex-shrink-0">{getAlertIcon(type)}</div>
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
      {closeable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-xl hover:opacity-70"
        >
          ×
        </button>
      )}
    </div>
  );
};
