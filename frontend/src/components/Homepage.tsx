import { useAuth } from '../contexts/AuthContext';

export default function Homepage(): JSX.Element {
    const { isLoggedIn, user } = useAuth();

    const BACKGROUND_IMG_PATH = "/background.png";

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${BACKGROUND_IMG_PATH})` }}>
            <div className="absolute inset-0 bg-black opacity-60"></div> {/* Dark Overlay */}

            <div className="relative flex flex-col items-center justify-center h-full text-white p-6 text-center space-y-6">
                {/* Slogan */}
                <h1 className="text-4xl md:text-6xl font-bold">Track Your Progress, Reach Your Goals</h1>
                <p className="text-lg md:text-2xl max-w-lg">Stay focused on what matters and build habits that last</p>

                {/* Conditional rendering based on login status */}
                {isLoggedIn ? (
                    <div>
                        <p className="mb-4 text-xl">Welcome back, {user?.name}!</p>
                        <a
                            href="/dashboard"
                            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-lg transition"
                        >
                            Go to Your Habit Dashboard
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-xl">Join us to start building great habits!</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/signup"
                                className="px-8 py-3 bg-green-500 hover:bg-green-400 rounded-lg font-semibold text-lg transition"
                            >
                                Sign Up
                            </a>
                            <a
                                href="/login"
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold text-lg transition"
                            >
                                Log In
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
