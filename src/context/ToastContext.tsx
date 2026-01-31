import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Toast, ToastType } from '../components/Toast';

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');
    const [duration, setDuration] = useState(3000);

    const showToast = (msg: string, t: ToastType = 'info', d: number = 3000) => {
        setMessage(msg);
        setType(t);
        setDuration(d);
        setVisible(true);
    };

    const hideToast = () => {
        setVisible(false);
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <Toast
                visible={visible}
                message={message}
                type={type}
                duration={duration}
                onHide={() => setVisible(false)}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
