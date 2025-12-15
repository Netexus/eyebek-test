'use client';

import { useState, useEffect } from 'react';

// tipos para el componente
type AlertType = 'success' | 'error';

interface AlertProps {
  type: AlertType;
  message: string;
  title?: string;
  duration?: number;  
  isVisible?: boolean;
  onClose?: () => void;
}

// Componente Alert
export const Alert: React.FC<AlertProps> = ({ 
  type, 
  message,
  title,
  duration = 5000,  
  isVisible = true,
  onClose 
}) => {
  const [visible, setVisible] = useState(isVisible);

  // Función para cerrar la alerta
  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  
  useEffect(() => {
    
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    
    return () => {
      clearTimeout(timer);
    };
  }, [duration]); 

  
  if (!visible) {
    return null;
  }

  // Estilos dinámicos según el tipo de alerta
  const alertStyles = {
    success: {
      container: 'bg-green-50 border-green-200 border-l-4 border-l-green-500',
      text: 'text-green-800',
      icon: '✓'
    },
    error: {
      container: 'bg-red-50 border-red-200 border-l-4 border-l-red-500',
      text: 'text-red-800',
      icon: '✕'
    }
  };

  const currentStyle = alertStyles[type];

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${currentStyle.container}`}>
      <span className={`text-xl font-bold ${currentStyle.text}`}>
        {currentStyle.icon}
      </span>
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold mb-1 ${currentStyle.text}`}>
            {title}
          </h4>
        )}
        <p className={`text-sm ${currentStyle.text}`}>
          {message}
        </p>
      </div>
    </div>
  );
};