import { FaInstagram } from "react-icons/fa";

function Navbar() {
    return (
        <header className="navbar">
            <section className="logo">
                <img src="/img/logo-no-bg.png" alt="Logo navegación" />
            </section>
            <nav>
                <a href="#">Inicio</a>
                <div className="divisor"></div>
                <a href="#">Catalogo</a>
            </nav>
            <div className="profile">
                <span>
                    <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                        
                        PERKYŌ
                    </a>
                </span>
            </div>
        </header>
    );
}

export default Navbar;