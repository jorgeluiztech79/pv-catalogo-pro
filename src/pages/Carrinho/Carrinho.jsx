import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import useSiteConfig from "../../hooks/useSiteConfig";

import "./Carrinho.css";

const ESTADO_INICIAL_CLIENTE = {
  nome: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  observacoes: "",
};

function somenteNumeros(valor = "") {
  return String(valor).replace(/\D/g, "");
}

function formatarTelefone(valor = "") {
  const numeros = somenteNumeros(valor).slice(
    0,
    11,
  );

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 6) {
    return `(${numeros.slice(
      0,
      2,
    )}) ${numeros.slice(2)}`;
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(
      0,
      2,
    )}) ${numeros.slice(
      2,
      6,
    )}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(
    0,
    2,
  )}) ${numeros.slice(
    2,
    7,
  )}-${numeros.slice(7)}`;
}

function formatarCep(valor = "") {
  const numeros = somenteNumeros(valor).slice(
    0,
    8,
  );

  if (numeros.length <= 5) {
    return numeros;
  }

  return `${numeros.slice(
    0,
    5,
  )}-${numeros.slice(5)}`;
}

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

  const { siteConfig } = useSiteConfig();

  const [dadosCliente, setDadosCliente] =
    useState(ESTADO_INICIAL_CLIENTE);

  const [erros, setErros] = useState({});

  const [buscandoCep, setBuscandoCep] =
    useState(false);

  const [erroCep, setErroCep] =
    useState("");

  const empresa =
    siteConfig?.empresa || {};

  const nomeEmpresa =
    empresa.nome ||
    siteConfig?.nomeEmpresa ||
    "Loja";

  const numeroWhatsApp = somenteNumeros(
    empresa.whatsapp ||
      siteConfig?.whatsapp ||
      "",
  );

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  useEffect(() => {
    const cep = somenteNumeros(
      dadosCliente.cep,
    );

    if (cep.length !== 8) {
      setErroCep("");
      return undefined;
    }

    const temporizador =
      window.setTimeout(
        async () => {
          try {
            setBuscandoCep(true);
            setErroCep("");

            const resposta = await fetch(
              `https://viacep.com.br/ws/${cep}/json/`,
            );

            if (!resposta.ok) {
              throw new Error(
                "Falha ao consultar o CEP.",
              );
            }

            const endereco =
              await resposta.json();

            if (endereco.erro) {
              setErroCep(
                "CEP não encontrado.",
              );

              return;
            }

            setDadosCliente(
              (dadosAtuais) => ({
                ...dadosAtuais,

                endereco:
                  endereco.logradouro ||
                  dadosAtuais.endereco,

                bairro:
                  endereco.bairro ||
                  dadosAtuais.bairro,

                cidade:
                  endereco.localidade ||
                  dadosAtuais.cidade,

                estado:
                  endereco.uf ||
                  dadosAtuais.estado,
              }),
            );

            setErros(
              (errosAtuais) => ({
                ...errosAtuais,
                cep: "",
                endereco: "",
                bairro: "",
                cidade: "",
                estado: "",
              }),
            );
          } catch (erro) {
            console.error(
              "Erro ao consultar CEP:",
              erro,
            );

            setErroCep(
              "Não foi possível consultar o CEP agora. Preencha o endereço manualmente.",
            );
          } finally {
            setBuscandoCep(false);
          }
        },
        400,
      );

    return () => {
      window.clearTimeout(
        temporizador,
      );
    };
  }, [dadosCliente.cep]);

  function atualizarDadosCliente(event) {
    const { name } = event.target;

    let { value } = event.target;

    if (name === "telefone") {
      value =
        formatarTelefone(value);
    }

    if (name === "cep") {
      value = formatarCep(value);
    }

    if (name === "estado") {
      value = value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
    }

    setDadosCliente(
      (dadosAtuais) => ({
        ...dadosAtuais,
        [name]: value,
      }),
    );

    setErros(
      (errosAtuais) => ({
        ...errosAtuais,
        [name]: "",
      }),
    );
  }

  function validarCheckout() {
    const novosErros = {};

    if (!dadosCliente.nome.trim()) {
      novosErros.nome =
        "Informe o nome completo.";
    }

    if (
      somenteNumeros(
        dadosCliente.telefone,
      ).length < 10
    ) {
      novosErros.telefone =
        "Informe um telefone válido com DDD.";
    }

    if (
      somenteNumeros(
        dadosCliente.cep,
      ).length !== 8
    ) {
      novosErros.cep =
        "Informe um CEP válido.";
    }

    if (!dadosCliente.endereco.trim()) {
      novosErros.endereco =
        "Informe o endereço.";
    }

    if (!dadosCliente.numero.trim()) {
      novosErros.numero =
        "Informe o número.";
    }

    if (!dadosCliente.bairro.trim()) {
      novosErros.bairro =
        "Informe o bairro.";
    }

    if (!dadosCliente.cidade.trim()) {
      novosErros.cidade =
        "Informe a cidade.";
    }

    if (
      dadosCliente.estado.trim().length !==
      2
    ) {
      novosErros.estado =
        "Informe a UF.";
    }

    setErros(novosErros);

    return (
      Object.keys(novosErros).length === 0
    );
  }

  const finalizarPedido = () => {
    if (cart.length === 0) {
      return;
    }

    if (!validarCheckout()) {
      document
        .getElementById(
          "dados-entrega",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      return;
    }

    if (!numeroWhatsApp) {
      window.alert(
        "O WhatsApp da loja ainda não foi configurado.",
      );

      return;
    }

    const listaProdutos = cart
      .map((item) => {
        const subtotal =
          Number(item.preco) *
          item.quantidade;

        return [
          `• ${item.quantidade}x ${item.nome}`,
          `  Valor unitário: ${formatarPreco(
            item.preco,
          )}`,
          `  Subtotal: ${formatarPreco(
            subtotal,
          )}`,
        ].join("\n");
      })
      .join("\n\n");

    const enderecoCompleto = [
      `${dadosCliente.endereco.trim()}, ${dadosCliente.numero.trim()}`,

      dadosCliente.complemento.trim()
        ? `Complemento: ${dadosCliente.complemento.trim()}`
        : "",

      `Bairro: ${dadosCliente.bairro.trim()}`,

      `${dadosCliente.cidade.trim()} - ${dadosCliente.estado.trim()}`,

      `CEP: ${dadosCliente.cep.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const mensagem = [
      `🛒 *NOVO PEDIDO — ${nomeEmpresa.toUpperCase()}*`,
      "",
      "*DADOS DO CLIENTE*",
      `Nome: ${dadosCliente.nome.trim()}`,
      `Telefone: ${dadosCliente.telefone.trim()}`,
      "",
      "*ENDEREÇO PARA ENTREGA*",
      enderecoCompleto,
      "",
      "*PRODUTOS*",
      listaProdutos,
      "",
      `Total de unidades: ${totalItens}`,
      `*Valor total estimado: ${formatarPreco(
        totalValor,
      )}*`,

      dadosCliente.observacoes.trim()
        ? `\n*OBSERVAÇÕES*\n${dadosCliente.observacoes.trim()}`
        : "",

      "",
      "Gostaria de confirmar a disponibilidade, pagamento e condições da entrega.",
    ]
      .filter(Boolean)
      .join("\n");

    const urlWhatsApp =
      `https://wa.me/${numeroWhatsApp}` +
      `?text=${encodeURIComponent(
        mensagem,
      )}`;

    window.open(
      urlWhatsApp,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <nav className="cart-breadcrumb">
            <Link to="/">Início</Link>

            <span>/</span>

            <strong>
              Carrinho
            </strong>
          </nav>

          <section className="cart-empty">
            <div className="cart-empty-icon">
              🛒
            </div>

            <span className="cart-empty-label">
              Seu carrinho está vazio
            </span>

            <h1>
              Escolha os produtos do seu
              pedido
            </h1>

            <p>
              Navegue pelo catálogo,
              consulte as informações e
              adicione os produtos desejados
              ao carrinho.
            </p>

            <Link
              to="/catalogo"
              className="cart-primary-link"
            >
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
        <nav className="cart-breadcrumb">
          <Link to="/">Início</Link>

          <span>/</span>

          <Link to="/catalogo">
            Catálogo
          </Link>

          <span>/</span>

          <strong>Carrinho</strong>
        </nav>

        <header className="cart-header">
          <div>
            <span className="cart-eyebrow">
              Resumo do pedido
            </span>

            <h1>Meu carrinho</h1>

            <p>
              Revise os produtos e informe os
              dados para entrega antes de
              enviar o pedido pelo WhatsApp.
            </p>
          </div>

          <div className="cart-header-count">
            <span>
              Total de unidades
            </span>

            <strong>
              {totalItens}
            </strong>
          </div>
        </header>

        <div className="cart-layout">
          <div className="cart-main-content">
            <section className="cart-products-section">
              <div className="cart-products-heading">
                <div>
                  <span>
                    Produtos selecionados
                  </span>

                  <strong>
                    {cart.length}
                  </strong>
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
                  const subtotal =
                    Number(item.preco) *
                    item.quantidade;

                  return (
                    <article
                      className="cart-product-card"
                      key={item.id}
                    >
                      <Link
                        to={`/produto/${item.slug}`}
                        className="cart-product-image-link"
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

                        <p>
                          {item.descricao}
                        </p>

                        <span className="cart-product-unit-price">
                          Unidade:{" "}
                          {formatarPreco(
                            item.preco,
                          )}
                        </span>
                      </div>

                      <div className="cart-product-controls">
                        <span className="cart-control-label">
                          Quantidade
                        </span>

                        <div className="cart-quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              decrease(item.id)
                            }
                          >
                            −
                          </button>

                          <strong>
                            {item.quantidade}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              increase(item.id)
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() =>
                            removeFromCart(
                              item.id,
                            )
                          }
                        >
                          Excluir
                        </button>
                      </div>

                      <div className="cart-product-subtotal">
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          {formatarPreco(
                            subtotal,
                          )}
                        </strong>
                      </div>
                    </article>
                  );
                })}
              </div>

              <Link
                to="/catalogo"
                className="cart-continue-link"
              >
                ← Continuar escolhendo produtos
              </Link>
            </section>

            <section
              id="dados-entrega"
              className="cart-checkout-section"
            >
              <div className="cart-checkout-heading">
                <span className="cart-eyebrow">
                  Dados para entrega
                </span>

                <h2>
                  Para onde devemos enviar?
                </h2>

                <p>
                  Informe o CEP e nós
                  preencheremos automaticamente
                  os dados disponíveis do
                  endereço.
                </p>
              </div>

              <div className="cart-checkout-grid">
                <div className="cart-field cart-field-full">
                  <label htmlFor="nome">
                    Nome completo *
                  </label>

                  <input
                    id="nome"
                    name="nome"
                    value={
                      dadosCliente.nome
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                    placeholder="Nome e sobrenome"
                  />

                  {erros.nome && (
                    <small className="cart-field-error">
                      {erros.nome}
                    </small>
                  )}
                </div>

                <div className="cart-field">
                  <label htmlFor="telefone">
                    Telefone *
                  </label>

                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={
                      dadosCliente.telefone
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                    placeholder="(21) 99999-9999"
                    inputMode="numeric"
                  />

                  {erros.telefone && (
                    <small className="cart-field-error">
                      {erros.telefone}
                    </small>
                  )}
                </div>

                <div className="cart-field">
                  <label htmlFor="cep">
                    CEP *
                  </label>

                  <input
                    id="cep"
                    name="cep"
                    value={dadosCliente.cep}
                    onChange={
                      atualizarDadosCliente
                    }
                    placeholder="00000-000"
                    inputMode="numeric"
                  />

                  {buscandoCep && (
                    <small>
                      Buscando endereço...
                    </small>
                  )}

                  {erroCep && (
                    <small className="cart-field-error">
                      {erroCep}
                    </small>
                  )}

                  {erros.cep && (
                    <small className="cart-field-error">
                      {erros.cep}
                    </small>
                  )}
                </div>

                <div className="cart-field cart-field-address">
                  <label htmlFor="endereco">
                    Endereço *
                  </label>

                  <input
                    id="endereco"
                    name="endereco"
                    value={
                      dadosCliente.endereco
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                    placeholder="Rua, avenida..."
                  />

                  {erros.endereco && (
                    <small className="cart-field-error">
                      {erros.endereco}
                    </small>
                  )}
                </div>

                <div className="cart-field">
                  <label htmlFor="numero">
                    Número *
                  </label>

                  <input
                    id="numero"
                    name="numero"
                    value={
                      dadosCliente.numero
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                    placeholder="123"
                  />

                  {erros.numero && (
                    <small className="cart-field-error">
                      {erros.numero}
                    </small>
                  )}
                </div>

                <div className="cart-field">
                  <label htmlFor="complemento">
                    Complemento
                  </label>

                  <input
                    id="complemento"
                    name="complemento"
                    value={
                      dadosCliente.complemento
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                    placeholder="Apto, bloco..."
                  />
                </div>

                <div className="cart-field">
                  <label htmlFor="bairro">
                    Bairro *
                  </label>

                  <input
                    id="bairro"
                    name="bairro"
                    value={
                      dadosCliente.bairro
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                  />

                  {erros.bairro && (
                    <small className="cart-field-error">
                      {erros.bairro}
                    </small>
                  )}
                </div>

                <div className="cart-field">
                  <label htmlFor="cidade">
                    Cidade *
                  </label>

                  <input
                    id="cidade"
                    name="cidade"
                    value={
                      dadosCliente.cidade
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                  />

                  {erros.cidade && (
                    <small className="cart-field-error">
                      {erros.cidade}
                    </small>
                  )}
                </div>

                <div className="cart-field">
                  <label htmlFor="estado">
                    Estado *
                  </label>

                  <input
                    id="estado"
                    name="estado"
                    value={
                      dadosCliente.estado
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                    placeholder="RJ"
                    maxLength={2}
                  />

                  {erros.estado && (
                    <small className="cart-field-error">
                      {erros.estado}
                    </small>
                  )}
                </div>

                <div className="cart-field cart-field-full">
                  <label htmlFor="observacoes">
                    Observações
                  </label>

                  <textarea
                    id="observacoes"
                    name="observacoes"
                    value={
                      dadosCliente.observacoes
                    }
                    onChange={
                      atualizarDadosCliente
                    }
                    rows="4"
                    placeholder="Ex.: Entregar após as 18h."
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="cart-summary">
  <span className="cart-summary-label">
    Resumo do pedido
  </span>

  <h2>Seu pedido</h2>

  <div className="cart-summary-products">
    {cart.map((item) => {
      const subtotal =
        Number(item.preco) *
        item.quantidade;

      return (
        <article
          className="cart-summary-product"
          key={item.id}
        >
          <div className="cart-summary-product-image">
            <img
              src={item.imagem}
              alt={item.nome}
            />
          </div>

          <div className="cart-summary-product-info">
            <strong>
              {item.nome}
            </strong>

            <span>
              {item.quantidade}x{" "}
              {formatarPreco(
                item.preco,
              )}
            </span>
          </div>

          <div className="cart-summary-product-price">
            {formatarPreco(
              subtotal,
            )}
          </div>
        </article>
      );
    })}
  </div>

  <div className="cart-summary-lines">
    <div>
      <span>
        Produtos diferentes
      </span>

      <strong>
        {cart.length}
      </strong>
    </div>

    <div>
      <span>
        Total de unidades
      </span>

      <strong>
        {totalItens}
      </strong>
    </div>

    <div>
      <span>
        Frete
      </span>

      <strong>
        A combinar
      </strong>
    </div>
  </div>

  <div className="cart-summary-total">
    <span>
      Total estimado
    </span>

    <strong>
      {formatarPreco(
        totalValor,
      )}
    </strong>
  </div>

  <div className="cart-summary-notice">
    <span>✓</span>

    <p>
      O pedido e os dados para
      entrega serão enviados pelo
      WhatsApp para confirmação.
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
    O envio do pedido não representa
    confirmação automática da compra.
  </small>
</aside>
        </div>
      </div>
    </main>
  );
}

export default Carrinho;