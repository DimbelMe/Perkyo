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
      <section className="Main-Container">
        <Hero
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
        />
        <Catalogo
          categoriaSeleccionada={categoriaSeleccionada}
        />
      </section>
      
    </>
  )
}

export default App
