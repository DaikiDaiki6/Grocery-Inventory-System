import { useState } from 'react'
import GetAllCategories from './components/Categories/GetAllCategories'
import GetSpecificCategory from './components/Categories/GetSpecificCategory'
import PostCategory from './components/Categories/PostCategory'
import PatchCategory from './components/Categories/PatchCategory'
import DeleteCategory from './components/Categories/DeleteCategory'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <GetAllCategories/>
    <GetSpecificCategory/>
    <PostCategory/>
    <PatchCategory/>
    <DeleteCategory/>
    </>
  )
}

export default App
