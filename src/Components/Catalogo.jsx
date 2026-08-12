function Catalogo({ categoriaSeleccionada }) {

    const categorias = [
    "Anime",
    "Peliculas",
    "Series",
    "Videojuegos",
    "Otros"
    ];

    const items = [
  {
    name: "Ace",
    categoria: "Anime",
    imgBack: "./img/ace-back.png",
    imgFront: "./img/ace-front.png"
  },
  {
    name: "Chopper",
    categoria: "Anime",
    imgBack: "./img/chopper-back.png",
    imgFront: "./img/chopper-front.png"
  },
  {
    name: "Death",
    categoria: "Anime",
    imgBack: "./img/death-back.png",
    imgFront: "./img/death-front.png"
  },
  {
    name: "DK",
    categoria: "Peliculas",
    imgBack: "./img/dk-back.png",
    imgFront: "./img/dk-front.png"
  },
  {
    name: "Guts",
    categoria: "Anime",
    imgBack: "./img/guts-back.png",
    imgFront: "./img/guts-front.png"
  },
  {
    name: "Kurapika",
    categoria: "Anime",
    imgBack: "./img/kura-back.png",
    imgFront: "./img/kura-front.png"
  },
  {
    name: "Luffy",
    categoria: "Anime",
    imgBack: "./img/luffy-back.png",
    imgFront: "./img/luffy-front.png"
  },
  {
    name: "Shingeki",
    categoria: "Anime",
    imgBack: "./img/shingeki-back.png",
    imgFront: "./img/shingeki-front.png"
  },
  {
    name: "?????",
    categoria: "Otros",
    imgBack: "./img/what-back.png",
    imgFront: "./img/what-front.png"
  }
  
];

    const itemsFiltrados =
        categoriaSeleccionada === "Todos"
            ? items
            : items.filter(
                (item) => item.categoria === categoriaSeleccionada
            );

    return (
        <main className="catalogo">
            <section className="Cards">
                {itemsFiltrados.map((item) => (
                    <article className="Card" key={item.name}>
                        <div className="CardImage">
                            <img
                                className="CardBack"
                                src={item.imgBack}
                                alt={item.name}
                            />
                            {item.imgFront && (
                                <img
                                    className="CardFront"
                                    src={item.imgFront}
                                    alt=""
                                />
                            )}
                        </div>
                        <span>{item.name}</span>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default Catalogo;