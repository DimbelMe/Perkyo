import { useState } from "react";

function Catalogo({ categoriaSeleccionada }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const objectFiles = import.meta.glob("../Content/Objects/*.json", {
    eager: true,
    import: "default",
  });

  const items = Object.values(objectFiles);

  const itemsFiltrados =
    categoriaSeleccionada === "Todos"
      ? items
      : items.filter((item) => item.categoria === categoriaSeleccionada);

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
              <img className="CardBack" src={item.imgBack} alt={item.name} />

              {item.imgFront && (
                <img className="CardFront" src={item.imgFront} alt="" />
              )}
            </div>

            <span>{item.name}</span>
          </article>
        ))}
      </section>

      {selectedProduct && (
        <div className="lightbox" onClick={closeProduct}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeProduct}>
              ×
            </button>

            <button
              className="carousel-arrow left"
              onClick={() => setCurrentImage((prev) => (prev === 0 ? 1 : 0))}
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
              onClick={() => setCurrentImage((prev) => (prev === 0 ? 1 : 0))}
            >
              ›
            </button>

            <div className="lightbox-counter">{currentImage + 1} / 2</div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Catalogo;
