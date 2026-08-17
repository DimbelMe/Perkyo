import { FaInstagram } from "react-icons/fa";

function Navbar() {
    return (
        <header className="navbar">
            <section className="logo">
                <img src="./img/logo-no-bg-white.png" alt="Logo navegación" />
            </section>
            <nav>
                <img src="./img/perkyo.png" alt="" />
            </nav>
            <div className="profile">
                <span>
                    <a href="https://www.instagram.com/perkyo.store/" target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                        PERKYŌ
                    </a>
                </span>
            </div>
        </header>
    );
}

export default Navbar;