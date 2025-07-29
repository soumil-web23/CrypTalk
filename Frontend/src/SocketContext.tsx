import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

const SocketContext = createContext<WebSocket | null>(null)
 
export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    // const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
    // const ws = new WebSocket(`wss://CrypTalk.onrender.com`)
    const ws = new WebSocket('https://cryptalk-backend-1.onrender.com')
    ws.onerror = () => toast.error("WebSocket error")
    setSocket(ws) 
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
