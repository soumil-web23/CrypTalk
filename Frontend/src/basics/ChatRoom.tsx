import { useSocket } from '@/SocketContext'
import { useEffect, useRef, useState } from 'react'
import { FaPaperPlane, FaCopy, FaSignOutAlt, FaBars } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FaTimes } from 'react-icons/fa'

interface ServerMessage {
  type: 'self-joined' | 'joined' | 'chat-history' | 'chat-new' | 'users' | 'left'
  payload: any
}

interface Message {
  id: string
  from: string
  text: string
  timestamp?: string
}

export default function ChatRoom() {
  const location = useLocation()
  const navigate = useNavigate()
  const username = (location.state as any)?.username || 'Anonymous'
  const roomId = (location.state as any)?.roomId || 'default-room'
  const socket = useSocket()

  const [users, setUsers] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [showUsers, setShowUsers] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
  const hasSelfJoined = useRef(false)
  const joinedUsers = useRef<Set<string>>(new Set())
  const leftUsers = useRef<Set<string>>(new Set())

  // scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // setup socket listeners once
  useEffect(() => {
    if (!socket) return

    const handleMessage = (evt: MessageEvent) => {
      const msg: ServerMessage = JSON.parse(evt.data)
      switch (msg.type) {
        case 'chat-history':
          setMessages(
            msg.payload.messages.map((m: any, i: number) => ({
              id: `h${i}`,
              from: m.from,
              text: m.message,
              timestamp: new Date(m.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }))
          )
          break

        case 'chat-new':
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              from: msg.payload.from,
              text: msg.payload.message,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          ])
          break

        case 'users':
          setUsers(msg.payload.users)
          break

        case 'self-joined':
          if (!hasSelfJoined.current) {
            toast.success(`You joined room ${msg.payload.roomId} as ${msg.payload.username}`)
            hasSelfJoined.current = true
          }
          break

        case 'joined':
          if (!joinedUsers.current.has(msg.payload.username)) {
            toast.success(`${msg.payload.username} joined`)
            joinedUsers.current.add(msg.payload.username)
            // if they rejoin after leaving, clear from leftUsers
            leftUsers.current.delete(msg.payload.username)
          }
          break

        case 'left':
          if (!leftUsers.current.has(msg.payload.username)) {
            toast.info(`${msg.payload.username} left`)
            leftUsers.current.add(msg.payload.username)
            // allow future join-toast again
            joinedUsers.current.delete(msg.payload.username)
          }
          break
      }
    }

    socket.addEventListener('message', handleMessage)

    // join when open
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'join', payload: { roomId, username } }))
    } else {
      socket.addEventListener(
        'open',
        () => {
          socket.send(JSON.stringify({ type: 'join', payload: { roomId, username } }))
        },
        { once: true }
      )
    }

    return () => {
      socket.removeEventListener('message', handleMessage)
    }
  }, [socket, roomId, username])

  const sendMessage = () => {
    if (input.trim() && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'chat', payload: { message: input, from: username } }))
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          from: username,
          text: input,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ])
      setInput('')
    }
  }

  const copyRoomId = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => toast.success('Room ID copied!'))
      .catch(() => toast.error('Copy failed'))
  }

  const exitRoom = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'exit', payload: { roomId, username } }))
    }
    navigate('/')
  }

  return (
    <div className="flex font-mono flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* header */}
      <header className="px-4 py-3 bg-gray-800 flex items-center justify-between border-2 border-amber-400">
        <div className="flex items-center space-x-3">
          {/* Hamburger */}
          <button
            className="md:hidden text-amber-200 hover:text-amber-100 text-2xl"
            onClick={() => setShowUsers((v) => !v)}
          >
            <FaBars />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400">CrypTalk</h1>
        </div>
        <button
          onClick={exitRoom}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-md transition"
        >
          <FaSignOutAlt />
          <span>Exit</span>
        </button>
      </header>

      {/* Room ID bar */}
      <div className="flex-shrink-0 bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-lg p-2 md:p-3 border-2 border-amber-400 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div
          className="flex flex-wrap items-center space-x-2 cursor-pointer"
          onClick={copyRoomId}
        >
          <span className="text-xl md:text-2xl text-amber-200">Room ID:</span>
          <span className="text-lg md:text-xl text-amber-100 font-bold break-all">{roomId}</span>
          <FaCopy className="text-amber-200 hover:text-amber-100 transition text-xl md:text-2xl" />
          <span className="text-amber-200 text-xs md:text-sm">(click to copy)</span>
        </div>
      </div>

      <main className="flex flex-1 overflow-hidden relative">
        {/*sidebar*/}
        <aside
          className={`
            fixed top-0 left-0 h-full bg-gray-700 p-4 border-2 border-amber-400
            transform transition-transform duration-200
            ${showUsers ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:w-64 w-3/4 z-20
          `}
        >
          {/* close button for mobile */}
          <div className="flex justify-end md:hidden mb-4">
            <button
              className="text-amber-200 hover:text-amber-100 text-2xl"
              onClick={() => setShowUsers(false)}
            >
              <FaTimes />
            </button>
          </div>

          <h2 className="text-xl md:text-2xl text-amber-100 font-bold mb-4">Online users</h2>
          <ul className="space-y-2 overflow-y-auto max-h-full">
            {users.map((u) => (
              <li
                key={u}
                className={`p-2 text-base md:text-lg font-semibold rounded-lg transition ${
                  u === username
                    ? 'bg-amber-400 text-gray-800 hover:bg-amber-300'
                    : 'bg-gray-500 text-amber-100 hover:bg-gray-300 hover:text-gray-900'
                }`}
              >
                {u}
              </li>
            ))}
          </ul>
        </aside>

        {/* chat area */}
        <section className="flex flex-col flex-1 p-2 md:p-4 min-h-0">
          <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 min-h-0">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === username ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`select-text max-w-full md:max-w-md p-2 rounded-lg shadow-md transition ${
                    m.from === username ? 'bg-amber-400 text-gray-900' : 'bg-gray-700 text-amber-100'
                  }`}
                >
                  <div className="flex select-none justify-between items-center mb-2">
                    <span className="text-sm md:text-md font-bold">{m.from}</span>
                    {m.timestamp && <span className="text-xs font-bold ml-2 opacity-60">{m.timestamp}</span>}
                  </div>
                  <p className="font-semibold text-base md:text-xl break-words">{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mt-2 md:mt-4 flex items-center bg-gray-800 p-2 md:p-3 rounded-xl shadow-inner border-2 border-amber-400">
            <input
              className="flex-1 bg-transparent text-amber-100 placeholder-amber-300 focus:outline-none px-2 md:px-3 text-sm md:text-base"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-3 md:p-4 bg-amber-500 hover:bg-amber-600 rounded-full shadow transition"
            >
              <FaPaperPlane className="text-gray-900 text-lg md:text-xl" />
            </button>
          </div>
        </section>
      </main>

      <footer className="px-4 md:px-6 py-1 font-mono bg-gray-800 text-center text-gray-400 text-xs md:text-sm border-2 border-amber-400">
        &copy; {new Date().getFullYear()} CrypTalk. All rights reserved.
      </footer>
    </div>
  )
}
