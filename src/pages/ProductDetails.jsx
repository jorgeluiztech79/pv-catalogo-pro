import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import produtos from "../data/produtos";
import "./ProductDetails.css";

function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [produtoAdicionado, setProdutoAdicionado] = useState(false);

  const produto = produtos.find((item) => item.slug === slug);

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const voltarPagina = () => {
    navigate("/catalogo");
  };

  const adicionarProdutoAoCarrinho = () => {
    if (!produto || !produto.disponivel) {
      return;
    }

    addToCart(produto);
    setProdutoAdicionado(true);

    window.setTimeout(() => {
      setProdutoAdicionado(false);
    }, 2500);
  };

  if (!produto) {
    return (
      <main className="product-not-found">
        <div className="product-not-found-content">
          <span>Produto não encontrado</span>

          <h1>Não conseguimos localizar este produto.</h1>

          <p>
            O endereço pode estar incorreto ou o produto pode ter sido
            removido do catálogo.
          </p>

          <Link to="/catalogo" className="product-primary-button">
            Voltar ao catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link to="/">Início</Link>

          <span>/</span>

          <Link to="/catalogo">Catálogo</Link>

          <span>/</span>

          <strong>{produto.nome}</strong>
        </nav>

        <section className="product-details-card">
          <div className="product-details-image-area">
            <div className="product-decoration-circle" />

            <div className="product-details-image-box">
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="product-details-image"
              />
            </div>
          </div>

          <div className="product-details-content">
            <span className="product-details-category">
              {produto.categoria}
            </span>

            <h1>{produto.nome}</h1>

            <p className="product-details-description">
              {produto.descricao}
            </p>

            <div className="product-details-price-area">
              {produto.disponivel ? (
                <>
                  <span className="product-price-label">Valor</span>

                  <strong className="product-details-price">
                    {formatarPreco(produto.preco)}
                  </strong>

                  <span className="product-stock product-stock-available">
                    Disponível
                  </span>
                </>
              ) : (
                <>
                  <span className="product-price-label">Disponibilidade</span>

                  <strong className="product-details-sold-out">
                    Produto esgotado
                  </strong>

                  <span className="product-stock product-stock-unavailable">
                    Indisponível no momento
                  </span>
                </>
              )}
            </div>

            <div className="product-details-divider" />

            <div className="product-info-grid">
              <article className="product-info-card">
                <span>Categoria</span>
                <strong>{produto.categoria}</strong>
              </article>

              <article className="product-info-card">
                <span>Atendimento</span>
                <strong>Personalizado</strong>
              </article>

              <article className="product-info-card">
                <span>Disponibilidade</span>
                <strong>
                  {produto.disponivel ? "Em estoque" : "Esgotado"}
                </strong>
              </article>
            </div>

            <div
              className={`product-status-notice ${
                produto.disponivel
                  ? "product-status-notice-available"
                  : "product-status-notice-unavailable"
              }`}
            >
              <span className="product-status-icon">
                {produto.disponivel ? "✓" : "!"}
              </span>

              <div>
                <strong>
                  {produto.disponivel
                    ? "Produto disponível"
                    : "Produto temporariamente esgotado"}
                </strong>

                <p>
                  {produto.disponivel
                    ? "Adicione este item ao carrinho e continue escolhendo outros produtos."
                    : "Este item não poderá ser adicionado ao carrinho enquanto estiver indisponível."}
                </p>
              </div>
            </div>

            {produtoAdicionado && (
              <div className="product-cart-success" role="status">
                <span>✓</span>

                <div>
                  <strong>Produto adicionado ao carrinho!</strong>

                  <p>
                    Você pode continuar comprando ou abrir o carrinho para
                    revisar o pedido.
                  </p>
                </div>
              </div>
            )}

            <div className="product-details-actions">
              <button
                type="button"
                className="product-add-cart-button"
                disabled={!produto.disponivel}
                onClick={adicionarProdutoAoCarrinho}
              >
                {produto.disponivel
                  ? produtoAdicionado
                    ? "Adicionado ao carrinho ✓"
                    : "Adicionar ao carrinho"
                  : "Produto esgotado"}
              </button>

              <button
                type="button"
                className="product-back-button"
                onClick={voltarPagina}
              >
                ← Voltar
              </button>
            </div>

            <div className="product-navigation-links">
              <Link to="/catalogo" className="product-catalog-link">
                Continuar vendo o catálogo
              </Link>

              <Link to="/carrinho" className="product-cart-link">
                Ver meu carrinho →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;