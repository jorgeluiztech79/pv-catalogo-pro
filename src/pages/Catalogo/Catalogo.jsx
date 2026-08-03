import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import useProducts from "../../hooks/useProducts";
import siteConfig from "../../config/siteConfig";

import "./Catalogo.css";

function Catalogo() {
  const { addToCart } = useCart();

  const {
    produtos,
    categorias: categoriasDaLoja,
  } = useProducts();

  const textos = siteConfig.catalogo;

  const locale =
    siteConfig.sistema?.locale ||
    siteConfig.locale ||
    "pt-BR";

  const moeda =
    siteConfig.sistema?.moeda ||
    siteConfig.moeda ||
    "BRL";

  const categoriaTodos =
    textos.categorias.opcaoTodos;

  const categoriasConfiguradas =
    textos.categorias.opcoes || [];

  const [busca, setBusca] = useState("");

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState(categoriaTodos);

  const [produtoAdicionado, setProdutoAdicionado] =
    useState(null);

  const produtosAtivos = useMemo(() => {
    return produtos.filter(
      (produto) => produto.ativo !== false,
    );
  }, [produtos]);

  const categorias = useMemo(() => {
    const categoriasUnicas = [
      ...categoriasConfiguradas,
      ...categoriasDaLoja,
    ].filter(Boolean);

    return [
      categoriaTodos,
      ...new Set(categoriasUnicas),
    ];
  }, [
    categoriaTodos,
    categoriasConfiguradas,
    categoriasDaLoja,
  ]);

  const produtosFiltrados = useMemo(() => {
    const textoBusca = busca
      .trim()
      .toLocaleLowerCase(locale);

    return produtosAtivos.filter((produto) => {
      const camposPesquisaveis = [
        produto.nome,
        produto.descricao,
        produto.categoria,
        produto.subcategoria,
        produto.slug,
        produto.marca,
        produto.laboratorio,
        produto.principioAtivo,
      ];

      const correspondeBusca =
        textoBusca === "" ||
        camposPesquisaveis.some((campo) =>
          String(campo || "")
            .toLocaleLowerCase(locale)
            .includes(textoBusca),
        );

      const correspondeCategoria =
        categoriaSelecionada === categoriaTodos ||
        produto.categoria === categoriaSelecionada;

      return (
        correspondeBusca &&
        correspondeCategoria
      );
    });
  }, [
    produtosAtivos,
    busca,
    categoriaSelecionada,
    categoriaTodos,
    locale,
  ]);

  function formatarPreco(valor) {
    const precoNumerico = Number(valor);

    if (!Number.isFinite(precoNumerico)) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: moeda,
      }).format(0);
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: moeda,
    }).format(precoNumerico);
  }

  function adicionarProduto(produto) {
    const semEstoque =
      produto.estoque !== null &&
      produto.estoque !== undefined &&
      Number(produto.estoque) <= 0;

    if (
      !produto.disponivel ||
      semEstoque
    ) {
      return;
    }

    addToCart(produto);
    setProdutoAdicionado(produto.id);

    window.setTimeout(() => {
      setProdutoAdicionado(null);
    }, 1800);
  }

  function limparFiltros() {
    setBusca("");
    setCategoriaSelecionada(categoriaTodos);
  }

  function verificarDisponibilidade(produto) {
    const semEstoque =
      produto.estoque !== null &&
      produto.estoque !== undefined &&
      Number(produto.estoque) <= 0;

    return produto.disponivel && !semEstoque;
  }

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div className="catalog-container">
          <span className="catalog-eyebrow">
            {textos.cabecalho.tag}
          </span>

          <h1>{textos.cabecalho.titulo}</h1>

          <p>{textos.cabecalho.descricao}</p>
        </div>
      </section>

      <section className="catalog-content">
        <div className="catalog-container">
          <div className="catalog-toolbar">
            <div className="catalog-search-area">
              <label htmlFor="catalog-search">
                {textos.busca.label}
              </label>

              <input
                id="catalog-search"
                type="search"
                placeholder={textos.busca.placeholder}
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
              />
            </div>

            <div className="catalog-category-area">
              <label htmlFor="catalog-category">
                {textos.categorias.label}
              </label>

              <select
                id="catalog-category"
                value={categoriaSelecionada}
                onChange={(event) =>
                  setCategoriaSelecionada(
                    event.target.value,
                  )
                }
              >
                {categorias.map((categoria) => (
                  <option
                    key={categoria}
                    value={categoria}
                  >
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="catalog-results-header">
            <div>
              <span>
                {textos.resultados.titulo}
              </span>

              <strong>
                {produtosFiltrados.length}
              </strong>
            </div>

            <Link
              to="/carrinho"
              className="catalog-cart-shortcut"
            >
              {textos.resultados.botaoCarrinho}
            </Link>
          </div>

          {produtosFiltrados.length > 0 ? (
            <div className="catalog-grid">
              {produtosFiltrados.map((produto) => {
                const foiAdicionado =
                  produtoAdicionado === produto.id;

                const disponivel =
                  verificarDisponibilidade(produto);

                const estoqueControlado =
                  produto.estoque !== null &&
                  produto.estoque !== undefined;

                return (
                  <article
                    key={produto.id}
                    className={`catalog-card ${
                      !disponivel
                        ? "catalog-card-sold-out"
                        : ""
                    }`}
                  >
                    <div className="catalog-card-image-area">
                      <span className="catalog-card-category">
                        {produto.categoria}
                      </span>

                      {!disponivel && (
                        <span className="catalog-card-stock-badge">
                          {textos.produto.seloEsgotado}
                        </span>
                      )}

                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="catalog-card-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="catalog-card-image catalog-card-image-placeholder">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    <div className="catalog-card-content">
                      <h2>{produto.nome}</h2>

                      {produto.subcategoria && (
                        <span className="catalog-card-subcategory">
                          {produto.subcategoria}
                        </span>
                      )}

                      <p>
                        {produto.descricao ||
                          "Produto disponível no catálogo."}
                      </p>

                      <div className="catalog-card-price-area">
                        <span>
                          {textos.produto.valorLabel}
                        </span>

                        <strong>
                          {formatarPreco(produto.preco)}
                        </strong>

                        <small
                          className={
                            disponivel
                              ? "catalog-available"
                              : "catalog-unavailable"
                          }
                        >
                          {disponivel
                            ? textos.produto.disponivel
                            : textos.produto.indisponivel}
                        </small>

                        {estoqueControlado && (
                          <small className="catalog-card-stock-quantity">
                            {Number(produto.estoque)} unidade(s)
                            em estoque
                          </small>
                        )}
                      </div>

                      <div className="catalog-card-actions">
                        <Link
                          to={`/produto/${produto.slug}`}
                          className="catalog-details-button"
                        >
                          {textos.produto.botaoDetalhes}
                        </Link>

                        <button
                          type="button"
                          className="catalog-add-button"
                          disabled={!disponivel}
                          onClick={() =>
                            adicionarProduto(produto)
                          }
                        >
                          {!disponivel
                            ? textos.produto.botaoEsgotado
                            : foiAdicionado
                              ? textos.produto
                                  .botaoAdicionado
                              : textos.produto
                                  .botaoAdicionar}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="catalog-empty">
              <span>{textos.vazio.tag}</span>

              <h2>{textos.vazio.titulo}</h2>

              <p>{textos.vazio.descricao}</p>

              <button
                type="button"
                onClick={limparFiltros}
              >
                {textos.vazio.botao}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Catalogo;