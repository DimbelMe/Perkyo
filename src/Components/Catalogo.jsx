import { useState } from "react";

function Catalogo({ categoriaSeleccionada }) {

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);

    const items = [
        {
          name: "ACE",
          categoria: "Anime",
          imgBack: "./img/ace-back.png",
          imgFront: "./img/ace-front.png"
        },
        {
          name: "BRIAN O'CONNER",
          categoria: "Peliculas",
          imgBack: "./img/chopper-back.png",
          imgFront: "./img/chopper-front.png"
        },
        {
          name: "LAW",
          categoria: "Anime",
          imgBack: "./img/death-back.png",
          imgFront: "./img/death-front.png"
        },
        {
          name: "ZORO",
          categoria: "Anime",
          imgBack: "./img/dk-back.png",
          imgFront: "./img/dk-front.png"
        },
        {
          name: "GUTS",
          categoria: "Anime",
          imgBack: "./img/guts-back.png",
          imgFront: "./img/guts-front.png"
        },
        {
          name: "KURAPIKA",
          categoria: "Anime",
          imgBack: "./img/kura-back.png",
          imgFront: "./img/kura-front.png"
        },
        {
          name: "GEAR 5",
          categoria: "Anime",
          imgBack: "./img/luffy-back.png",
          imgFront: "./img/luffy-front.png"
        },
        {
          name: "EREN",
          categoria: "Anime",
          imgBack: "./img/shingeki-back.png",
          imgFront: "./img/shingeki-front.png"
        },
        {
          name: "EREN TITAN",
          categoria: "Anime",
          imgBack: "./img/what-back.png",
          imgFront: "./img/what-front.png"
        },
        {
          name: "FIERROS",
          categoria: "Gym",
          imgBack: "./img/fierros.png",
          imgFront: "./img/gym-meme-front.png"
        },
        {
          name: "BULMA",
          categoria: "Gym",
          imgBack: "./img/bulma-saiyajin.png",
          imgFront: "./img/gym-front.png"
        },
        {
          name: "VEGETA",
          categoria: "Gym",
          imgBack: "./img/vegeta-saiyajin.png",
          imgFront: "./img/gym-front.png"
        },
        {
          name: "SAITAMA",
          categoria: "Gym",
          imgBack: "./img/saitama.png",
          imgFront: "./img/gym-front.png"
        },
        {
          name: "KIRBY",
          categoria: "Gym",
          imgBack: "./img/kirby.png",
          imgFront: "./img/gym-front.png"
        },
        {
          name: "PROTEINA",
          categoria: "Gym",
          imgBack: "./img/protein.png",
          imgFront: "./img/gym-front.png"
        },
        {
          name: "INDEPENDIENTE",
          categoria: "Gym",
          imgBack: "./img/mujer-independiente.png",
          imgFront: "./img/gym-meme-front.png"
        },
        {
          name: "RESULTADOS",
          categoria: "Gym",
          imgBack: "./img/resultado.png",
          imgFront: "./img/gym-meme-front.png"
        },
        {
          name: "DEADLIFT",
          categoria: "Gym",
          imgBack: "./img/deadlift.png",
          imgFront: "./img/gym-meme-front.png"
        },
        {
          name: "GOALS",
          categoria: "Gym",
          imgBack: "./img/goal.png",
          imgFront: "./img/gym-front.png"
        },
        {
          name: "MOTHER OF CATS",
          categoria: "Otros",
          imgBack: "./img/mother.png",
          imgFront: "./img/samurai-front.png"
        },
        {
          name: "SAMURAI",
          categoria: "Otros",
          imgBack: "./img/samurai-back.png",
          imgFront: "./img/samurai-front.png"
        },
        {
          name: "SKYLINE",
          categoria: "Otros",
          imgBack: "./img/skyline.png",
          imgFront: "./img/gtr-front.png"
        },
        {
          name: "BENDER",
          categoria: "Series",
          imgBack: "./img/bender.png",
          imgFront: "./img/samurai-front.png"
        },
        {
          name: "GTR",
          categoria: "Otros",
          imgBack: "./img/gtr-back.png",
          imgFront: "./img/gtr-front.png"
        },
        {
          name: "WINGS OF FIRE",
          categoria: "Otros",
          imgBack: "./img/Wings-Of-Fire-Back.png",
          imgFront: "./img/Wings-Of-Fire-Front.png"
        },
        {
          name: "WINGS OF FIRE 2",
          categoria: "Otros",
          imgBack: "./img/wings-of-fire-back-2.png",
          imgFront: "./img/wings-of-fire-front-2.png"
        }

    ];

    const itemsFiltrados =
        categoriaSeleccionada === "Todos"
            ? items
            : items.filter(
                (item) => item.categoria === categoriaSeleccionada
            );

    const openProduct = (product) => {
        setSelectedProduct(product);
        setCurrentImage(0);
    };

    const closeProduct = () => {
        setSelectedProduct(null);
    };

    return (
        <main className="catalogo">

            <section className="Cards">

                {itemsFiltrados.map((item) => (
                    <article
                        className="Card"
                        key={item.name}
                        onClick={() => openProduct(item)}
                    >
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


            {selectedProduct && (
                <div
                    className="lightbox"
                    onClick={closeProduct}
                >

                    <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="lightbox-close"
                            onClick={closeProduct}
                        >
                            ×
                        </button>


                        <button
                            className="carousel-arrow left"
                            onClick={() =>
                                setCurrentImage((prev) =>
                                    prev === 0 ? 1 : 0
                                )
                            }
                        >
                            ‹
                        </button>


                        <img
                            className="lightbox-image"
                            src={
                                currentImage === 0
                                    ? selectedProduct.imgBack
                                    : selectedProduct.imgFront
                            }
                            alt={selectedProduct.name}
                        />


                        <button
                            className="carousel-arrow right"
                            onClick={() =>
                                setCurrentImage((prev) =>
                                    prev === 0 ? 1 : 0
                                )
                            }
                        >
                            ›
                        </button>

                        <div className="lightbox-counter">
                            {currentImage + 1} / 2
                        </div>

                    </div>

                </div>
            )}

        </main>
    );
}

export default Catalogo;