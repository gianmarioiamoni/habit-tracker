
interface HabitEditFormProps {
    newHabit: {
        title: string;
        description: string;
        frequency: string;
    };
    setNewHabit: React.Dispatch<React.SetStateAction<{
        title: string;
        description: string;
        frequency: string;
    }>>;
    handleAddHabit: (e: React.FormEvent) => void;
    onClose: () => void;
};

export default function HabitEditForm({newHabit, setNewHabit, handleAddHabit, onClose }: HabitEditFormProps): JSX.Element {

    const handleNewHabitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewHabit({ ...newHabit, [e.target.name]: e.target.value });
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Add New Habit</h3>
                <form onSubmit={handleAddHabit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Habit Title</label>
                        <input
                            type="text"
                            name="title"
                            value={newHabit.title}
                            onChange={handleNewHabitChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={newHabit.description}
                            onChange={handleNewHabitChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Frequency</label>
                        <input
                            type="text"
                            name="frequency"
                            value={newHabit.frequency}
                            onChange={handleNewHabitChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-400"
                            onClick={() => onClose()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                        >
                            Add Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}