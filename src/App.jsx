import { useState } from 'react'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import './Style/login.css'
import Catalogo from './Components/Catalogo'

function App() {
  const [count, setCount] = useState(0)

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  return (
    <>
      <Navbar/>
      <Hero
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />
      <Catalogo
        categoriaSeleccionada={categoriaSeleccionada}
      />
    </>
  )
}

export default App
