import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import GetAllCategories from './components/Categories/GetAllCategories'
import GetSpecificCategory from './components/Categories/GetSpecificCategory'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GetSpecificCategory/>
    </>
  )
}

export default App
