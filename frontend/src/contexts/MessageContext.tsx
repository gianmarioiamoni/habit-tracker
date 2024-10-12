import React, { createContext, useContext, useState, useEffect } from 'react';

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
    });
    const [showToast, setShowToast] = useState<boolean>(false);
    let timeoutId: ReturnType<typeof setTimeout> | null = null; // Per tenere traccia del timeout

    // Set the message and show the toast 
    const showMessage = (msg: string, type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO') => {
        setMessage({ messageType: type, message: msg });
        setShowToast(true);

        // Clean up the previous timeout before creating a new one
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Hide the toast after 3 sec
        timeoutId = setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    // Cleanup when the component unmounts
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    const setSuccessMessage = (msg: string) => showMessage(msg, 'SUCCESS');
    const setErrorMessage = (msg: string) => showMessage(msg, 'ERROR');
    const setWarningMessage = (msg: string) => showMessage(msg, 'WARNING');
    const setInfoMessage = (msg: string) => showMessage(msg, 'INFO');

    return (
        <MessageContext.Provider value={{
            message,
            setErrorMessage,
            setWarningMessage,
            setInfoMessage,
            setSuccessMessage,
            showToast,
        }}>
            {children}
        </MessageContext.Provider>
    );
};

// Hook to use the context
export const useMessage = () => {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};

