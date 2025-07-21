import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Category from './components/Categories/Categories'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>Hello World</p>
      <Category/>
    </>
  )
}

export default App
