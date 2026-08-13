function Hero({ setCategoriaSeleccionada }) {

    const categorias = [
        "Anime",
        "Peliculas",
        "Series",
        "Videojuegos",
        "Otros"
    ];

    return (
        <section className="Main-Container">
            <div className="Banner">
                <img src="./img/banner.png" alt="" />
            </div>
            <div className="Categorias">
                <button
                    onClick={() => setCategoriaSeleccionada("Todos")}
                >
                    Todos
                </button>
                {categorias.map((categoria) => (
                    <button
                        key={categoria}
                        onClick={() => setCategoriaSeleccionada(categoria)}
                    >
                        {categoria}
                    </button>
                ))}
            </div>
        </section>
    );
}
export default Hero;