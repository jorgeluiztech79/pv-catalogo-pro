import "./FeaturedProducts.css";

import ProductCard from "../ProductCard/ProductCard";
import produtos from "../../data/produtos";

function FeaturedProducts() {
  return (
    <section className="featured-products">
      <div className="featured-products-container">

        <div className="featured-products-header">
          <span>⭐ PRODUTOS EM DESTAQUE</span>

          <h2>Os mais procurados</h2>

          <p>
            Produtos selecionados com máxima qualidade e envio rápido.
          </p>
        </div>

        <div className="featured-products-grid">
          {produtos.map((produto) => (
            <ProductCard
            key={produto.id}
            slug={produto.slug}
            nome={produto.nome}
            descricao={produto.descricao}
            imagem={produto.imagem}
            categoria={produto.categoria}
            />
            ))}
           </div>

           </div>
           </section>
  );
}

export default FeaturedProducts;