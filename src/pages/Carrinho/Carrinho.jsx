import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import siteConfig from "../../config/siteConfig";

import "./Carrinho.css";

function Carrinho() {
  const {
    cart,
    removeFromCart,
    increase,
    decrease,
    clearCart,
    totalItens,
    totalValor,
  } = useCart();

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const finalizarPedido = () => {
    if (cart.length === 0) {
      return;
    }

    const listaProdutos = cart
      .map((item) => {
        const subtotal = Number(item.preco) * item.quantidade;

        return [
          `• ${item.quantidade}x ${item.nome}`,
          `  Valor unitário: ${formatarPreco(item.preco)}`,
          `  Subtotal: ${formatarPreco(subtotal)}`,
        ].join("\n");
      })
      .join("\n\n");

    const mensagem = [
      `Olá! Gostaria de solicitar os seguintes produtos da ${siteConfig.nomeEmpresa}:`,
      "",
      listaProdutos,
      "",
      `Total de unidades: ${totalItens}`,
      `Valor total estimado: ${formatarPreco(totalValor)}`,
      "",
      "Gostaria de confirmar a disponibilidade e as condições do pedido.",
    ].join("\n");

    const numeroWhatsApp = String(siteConfig.whatsapp).replace(/\D/g, "");

    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
  };

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <nav className="cart-breadcrumb" aria-label="Navegação estrutural">
            <Link to="/">Início</Link>

            <span>/</span>

            <strong>Carrinho</strong>
          </nav>

          <section className="cart-empty">
            <div className="cart-empty-icon">🛒</div>

            <span className="cart-empty-label">Seu carrinho está vazio</span>

            <h1>Escolha os produtos do seu pedido</h1>

            <p>
              Navegue pelo catálogo, consulte as informações e adicione os
              produtos desejados ao carrinho.
            </p>

            <Link to="/catalogo" className="cart-primary-link">
              Ver catálogo
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <nav className="cart-breadcrumb" aria-label="Navegação estrutural">
          <Link to="/">Início</Link>

          <span>/</span>

          <Link to="/catalogo">Catálogo</Link>

          <span>/</span>

          <strong>Carrinho</strong>
        </nav>

        <header className="cart-header">
          <div>
            <span className="cart-eyebrow">Resumo do pedido</span>

            <h1>Meu carrinho</h1>

            <p>
              Revise os produtos, altere as quantidades e envie o pedido pelo
              WhatsApp.
            </p>
          </div>

          <div className="cart-header-count">
            <span>Total de unidades</span>
            <strong>{totalItens}</strong>
          </div>
        </header>

        <div className="cart-layout">
          <section className="cart-products-section">
            <div className="cart-products-heading">
              <div>
                <span>Produtos selecionados</span>
                <strong>{cart.length}</strong>
              </div>

              <button
                type="button"
                className="cart-clear-button"
                onClick={clearCart}
              >
                Limpar carrinho
              </button>
            </div>

            <div className="cart-products-list">
              {cart.map((item) => {
                const subtotal = Number(item.preco) * item.quantidade;

                return (
                  <article className="cart-product-card" key={item.id}>
                    <Link
                      to={`/produto/${item.slug}`}
                      className="cart-product-image-link"
                      aria-label={`Ver informações de ${item.nome}`}
                    >
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="cart-product-image"
                      />
                    </Link>

                    <div className="cart-product-info">
                      <span className="cart-product-category">
                        {item.categoria}
                      </span>

                      <Link
                        to={`/produto/${item.slug}`}
                        className="cart-product-name"
                      >
                        {item.nome}
                      </Link>

                      <p>{item.descricao}</p>

                      <span className="cart-product-unit-price">
                        Unidade: {formatarPreco(item.preco)}
                      </span>
                    </div>

                    <div className="cart-product-controls">
                      <span className="cart-control-label">Quantidade</span>

                      <div className="cart-quantity-control">
                        <button
                          type="button"
                          onClick={() => decrease(item.id)}
                          aria-label={`Diminuir quantidade de ${item.nome}`}
                        >
                          −
                        </button>

                        <strong>{item.quantidade}</strong>

                        <button
                          type="button"
                          onClick={() => increase(item.id)}
                          aria-label={`Aumentar quantidade de ${item.nome}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Excluir
                      </button>
                    </div>

                    <div className="cart-product-subtotal">
                      <span>Subtotal</span>
                      <strong>{formatarPreco(subtotal)}</strong>
                    </div>
                  </article>
                );
              })}
            </div>

            <Link to="/catalogo" className="cart-continue-link">
              ← Continuar escolhendo produtos
            </Link>
          </section>

          <aside className="cart-summary">
            <span className="cart-summary-label">Resumo do pedido</span>

            <h2>Valores</h2>

            <div className="cart-summary-lines">
              <div>
                <span>Produtos diferentes</span>
                <strong>{cart.length}</strong>
              </div>

              <div>
                <span>Total de unidades</span>
                <strong>{totalItens}</strong>
              </div>
            </div>

            <div className="cart-summary-total">
              <span>Total estimado</span>
              <strong>{formatarPreco(totalValor)}</strong>
            </div>

            <div className="cart-summary-notice">
              <span>✓</span>

              <p>
                O pedido será enviado pelo WhatsApp para confirmação de
                disponibilidade, pagamento e entrega.
              </p>
            </div>

            <button
              type="button"
              className="cart-whatsapp-button"
              onClick={finalizarPedido}
            >
              Finalizar pelo WhatsApp
            </button>

            <small className="cart-summary-disclaimer">
              O envio do pedido não representa confirmação automática da
              compra.
            </small>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Carrinho;