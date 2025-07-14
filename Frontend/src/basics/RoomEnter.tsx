import { useSocket } from '@/SocketContext'
import { useEffect, useRef } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function RoomEnter() {
  const socket = useSocket()
  const usernameRef = useRef<HTMLInputElement>(null)
  const roomRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const makeRoomId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${timestamp}${randomPart}`
  }

  const joinRoom = () => {
    if (!socket) {
      toast.error('Socket is not connected!')
      return
    }
    const name = usernameRef.current?.value.trim() ?? ''
    const room = roomRef.current?.value.trim().toUpperCase() ?? ''
    if (!name || !room) {
      toast.error('Please enter both a username and a room ID!')
      return
    }
    navigate('/room', { state: { username: name, roomId: room } })
    roomRef.current!.value = ''
    usernameRef.current!.value = ''
  }

  const createRoom = () => {
    if (!socket) {
      toast.error('Socket is not connected!')
      return
    }
    const name = usernameRef.current?.value.trim() ?? ''
    if (!name) {
      toast.error('Please enter a username!')
      return
    }
    const newRoom = makeRoomId()
    navigate('/room', { state: { username: name, roomId: newRoom } })
    usernameRef.current!.value = ''
  }

  useEffect(() => {
    if (!socket) {
      toast.error('WebSocket is not connected')
      return
    }
    socket.onerror = () => toast.error('WebSocket error')
  }, [socket])

  return (
    <div className="min-h-screen flex flex-col bg-gray-900"> 
      <header className="w-full bg-gray-800 border-2 border-amber-400 px-6 py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400 font-mono">
          CrypTalk
        </h1>
      </header>

      {/* main part lol */}
      <main className="flex-grow flex items-center justify-center p-4 border-2 border-amber-400">
        <div className="bg-gray-800 border-4 border-amber-100 rounded-2xl p-6 w-full max-w-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center text-amber-400 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 md:w-14 md:h-14 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            <span className="text-2xl md:text-3xl font-bold">
              Real Time Chat Room
            </span>
          </div>

          <input
            ref={usernameRef}
            type="text"
            placeholder="Enter Your Username"
            className="w-full p-4 mb-4 text-amber-100 text-base md:text-lg bg-gray-700 border-2 border-amber-200 rounded-lg placeholder-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />

          <div className="flex flex-col sm:flex-row w-full mb-4">
            <input
              ref={roomRef}
              type="text"
              placeholder="Enter Room ID"
              className="flex-grow p-4 mb-2 sm:mb-0 sm:mr-2 text-amber-100 text-base md:text-lg bg-gray-700 border-2 border-amber-200 rounded-lg placeholder-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              onClick={joinRoom}
              className="w-full sm:w-auto py-4 px-6 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Join
            </button>
          </div>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-amber-200" />
            <span className="px-2 text-amber-200">or</span>
            <hr className="flex-grow border-t border-amber-200" />
          </div>

          <button
            onClick={createRoom}
            className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Create New Room
          </button>
        </div>
      </main>
 
      <footer className="w-full bg-gray-800 border-2 border-amber-400 px-6 py-2">
        <p className="text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} CrypTalk. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default RoomEnter
