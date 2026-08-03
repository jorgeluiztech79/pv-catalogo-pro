import "./ProductCard.css";
import { Link } from "react-router-dom";

function ProductCard({
  slug,
  nome,
  descricao,
  imagem,
  categoria = "Peptídeos",
}) {
  return (
    <article className="product-card">
      <div className="product-card-image">
        <img src={imagem} alt={nome} />
      </div>

      <div className="product-card-content">
        <span className="product-category">
          {categoria}
        </span>

        <h3>{nome}</h3>

        <p>{descricao}</p>

        <Link
          to={`/produto/${slug}`}
          className="product-button"
        >
          Ver Produto
        </Link>

      </div>
    </article>
  );
}

export default ProductCard;