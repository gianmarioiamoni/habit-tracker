import React, { createContext, useContext, useState } from 'react';

// Context definition
export interface MessageType {
    messageType: 'ERROR' | 'INFO' | 'SUCCESS' | 'WARNING';
    message: string;
}
interface MessageContextType {
    message: MessageType;
    setSuccessMessage: (msg: string) => void;
    setErrorMessage: (msg: string) => void;
    setWarningMessage: (msg: string) => void;
    setInfoMessage: (msg: string) => void;
    showToast: boolean;
}

// Context creation 
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Context provider
export function MessageProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [message, setMessage] = useState<MessageType>({
        messageType: 'INFO',
        message: '',
    })
    const [showToast, setShowToast] = useState<boolean>(false);

    const setSuccessMessage = (msg: string) => {
        setShowToast(true);
        setMessage({ messageType: 'SUCCESS', message: msg });
        // Remove toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const setErrorMessage = (msg: string) => {
        setShowToast(true);
        setMessage({ messageType: 'ERROR', message: msg });
        // Remove toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const setWarningMessage = (msg: string) => {
        setShowToast(true);
        setMessage({ messageType: 'WARNING', message: msg });
        // Remove toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const setInfoMessage = (msg: string) => {
        setShowToast(true);
        setMessage({ messageType: 'INFO', message: msg });
        // Remove toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };


    return (
        <MessageContext.Provider value={{
            message,
            setErrorMessage,
            setWarningMessage,
            setInfoMessage,
            setSuccessMessage, showToast
        }}>
            {children}
        </MessageContext.Provider>
    );
};

// Hook to use the context
export const useMessage = () => {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
