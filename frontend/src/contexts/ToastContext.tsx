// ToastContext.tsx
import { createContext, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const ToastContext = createContext({
    showError: (message: string) => { },
    showWarning: (message: string) => { },
    showInfo: (message: string) => { },
    showSuccess: (message: string) => { },
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const showError = (message: string) => {
        toast.error(message, {
            className: 'bg-red-500 text-white !important',
            progressClassName: 'bg-red-700 !important',
        });
    };

    const showWarning = (message: string) => {
        toast.warn(message, {
            className: 'bg-orange-400 text-white',
            progressClassName: 'bg-orange-600',
        });
    };

    const showInfo = (message: string) => {
        toast.info(message, {
            className: 'bg-blue-500 text-white',
            progressClassName: 'bg-blue-700',
        });
    };

    const showSuccess = (message: string) => {
        toast.success(message, {
            className: 'bg-green-500 text-white',
            progressClassName: 'bg-green-700',
        });
    };

    return (
        <ToastContext.Provider value={{ showError, showWarning, showInfo, showSuccess }}>
            {children}
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
        </ToastContext.Provider>
    );
};
