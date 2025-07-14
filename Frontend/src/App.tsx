import './App.css' 
import { Outlet } from 'react-router';

function App() {
  return(
    <div className="bg-gray-900 h-screen overflow-hidden flex flex-col select-none"> 
      <Outlet></Outlet> 
    </div>
  )
}

export default App;