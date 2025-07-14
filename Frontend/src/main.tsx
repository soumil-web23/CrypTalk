import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RouterProvider, createBrowserRouter } from "react-router";
import RoomEnter from './basics/RoomEnter.tsx';
import ChatRoom from './basics/ChatRoom.tsx';
import { Toaster } from "@/components/ui/sonner"
import { SocketProvider } from './SocketContext.tsx';

const router = createBrowserRouter([
  {
    element: <App />,
    children:[
      {
        path: "/",
        element: <RoomEnter/>
      },
      {
        path: "/room",
        element: <ChatRoom/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
      <Toaster richColors></Toaster>
    </SocketProvider>
  </StrictMode>,
)
