import { MessageType } from "../../contexts/MessageContext";

interface MessageToastProps {
    message: MessageType;
    showToast: boolean;

}
export default function MessageToast({ message, showToast }: MessageToastProps): JSX.Element {
    function getToastColor(): string {
        switch (message.messageType) {
            case 'SUCCESS':
                return 'bg-green-500';
            case 'ERROR':
                return 'bg-red-500';
            case 'WARNING': 
                return 'bg-orange-500';
            case 'INFO':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    }

    return (
        <>
            {showToast && message.messageType === 'SUCCESS' && (
                <div className={`fixed bottom-4 right-4 ${getToastColor()} text-white px-4 py-2 rounded shadow-lg}`}>
                    {message.message}
                </div>
            )}
            {showToast && message.messageType === 'ERROR' && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
                    {message.message}
                </div>
            )}
        </>
    )

}