// import { useEffect } from "react";

import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast} from "../../contexts/ToastContext";

import { useHabits } from "../../hooks/habits/useHabits";

import HabitAddForm from "./HabitAddForm";
import HabitListItem from "./HabitListItem";


function HabitList(): JSX.Element {
    const { showInfo, showError } = useToast();
    const { user } = useAuth();

    // logic for the component
    const {
        habits,
        isLoading,
        isError,
        newHabit,
        setNewHabit,
        isModalOpen,
        setIsModalOpen,
        handleAddHabit,
        handleSaveEdit,
        handleDeleteHabit,
    } = useHabits();

    // isLoading && showInfo("Loading habits...");
    // isError && showError("Error while fetching habits.");
    useEffect(() => {
        if (isLoading) {
            showInfo("Loading habits...");
        }
    }, [isLoading, showInfo]);

    useEffect(() => {
        if (isError) {
            showError("Error while fetching habits.");
        }
    }, [isError, showError]);

    return (
        <div className="container mx-auto px-24 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Your Habits</h2>
                <button
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    + New Habit
                </button>
            </div>
            <h3 className="text-center mb-8 sm:text-left">Welcome, {user?.name}</h3>

            {isModalOpen && (
                <HabitAddForm
                    newHabit={newHabit}
                    setNewHabit={setNewHabit}
                    handleAddHabit={handleAddHabit}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Habit list section */}
            <div className="overflow-y-auto max-h-[70vh]">
                {habits?.length ? (
                    <ul className="space-y-4 mt-6">
                        {habits.map((habit) => (
                            <HabitListItem key={habit._id}
                                habit={habit}
                                onSaveEdit={handleSaveEdit}
                                onDeleteHabit={handleDeleteHabit}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500">No habits found</p>
                )}
            </div>
        </div>
    );
}

export default HabitList;



