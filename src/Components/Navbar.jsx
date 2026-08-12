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
                <span><a href="/login">Iniciar Sesión</a></span>
            </div>
        </header>
    );
}

export default Navbar;