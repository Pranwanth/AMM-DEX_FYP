import './global.css'

import Navbar from './components/Navbar'
import Swap from './components/Swap'

const App = () => {
  return (
    <main className="flex flex-col w-screen h-screen bg-black text-white">
      <Navbar />
      <Swap />
    </main>
  )
}

export default App