import { useRef } from 'react'
import { FaPlus } from 'react-icons/fa';

function UserData() {

    const usernameRef = useRef<HTMLInputElement | null>(null);
    const roomRef = useRef<HTMLInputElement | null>(null);

    return (
        <main className="flex-grow overflow-auto flex font-mono items-center justify-center p-4 border-2 border-amber-400">
            
            <div className="bg-gray-800 border-4 border-amber-100 rounded-2xl p-6 w-full max-w-xl shadow-lg flex flex-col">
            {/* title */}
            <div className="flex items-center text-amber-400 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle mr-3">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                </svg>
                <span className="text-3xl font-bold">Real Time Chat Room</span>
            </div>

            {/* input username */}
            <input
                ref={usernameRef}
                type="text"
                placeholder="Enter Your Username"
                className="w-full p-4 mb-4 text-amber-100 text-lg bg-gray-700 border-2 border-amber-200 rounded-lg placeholder-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />

            {/* room id stuff */}
            <div className="flex w-full mb-4">
                <input
                ref={roomRef}
                type="text"
                placeholder="Enter room ID"
                className="flex-grow p-4 text-amber-100 text-lg bg-gray-700 border-2 border-amber-200 rounded-l-lg placeholder-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                className="p-4 w-1/4 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-r-lg transition-colors"
                >
                Join
                </button>
            </div>

            {/* or */}
            <div className="flex items-center my-4">
                <hr className="flex-grow border-t border-amber-200" />
                <span className="px-2 text-amber-200">or</span>
                <hr className="flex-grow border-t border-amber-200" />
            </div>

            {/* create room */}
            <button
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
                <FaPlus className="mr-2" />
                Create New Room
            </button>
            </div>
        </main>
    )
}

export default UserData