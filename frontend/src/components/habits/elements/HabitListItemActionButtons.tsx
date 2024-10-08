
interface HabitListItemActionButtonsProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleCompletion: () => void;
    handleCancel: () => void;
    handleSave: () => void;
    handleDelete: () => void;
}

export default function HabitListItemEditForm({isEditing, setIsEditing, handleCompletion, handleCancel, handleSave, handleDelete}: HabitListItemActionButtonsProps): JSX.Element {
    return (
        <>
            <div className="flex flex-row space-x-4 justify-end">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-xs sm:text-base"
                            aria-label="Save Changes"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-red-600 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-xs sm:text-base"
                            aria-label="Cancel Changes"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleCompletion}
                            className="bg-green-600 text-white p-1 sm:p-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            aria-label="Complete Habit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-6 sm:h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-indigo-600 text-white p-1 sm:p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            aria-label="Edit Habit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-6 sm:h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12l-9.293 9.293a1 1 0 00-.293.707V21a1 1 0 001 1h.293a1 1 0 00.707-.293L12 15m3 0l6.293-6.293a1 1 0 00.293-.707V8a1 1 0 00-1-1h-.293a1 1 0 00-.707.293L12 15"
                                />
                            </svg>
                        </button>
                        <button
                            className="text-red-500 hover:text-red-600 p-1 sm:p-2 rounded-full transition duration-300"
                            aria-label="Delete Habit"
                            onClick={handleDelete}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-6 sm:h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </>
    )
}