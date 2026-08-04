import { useMemo, useState } from "react";

import useProducts from "../../../hooks/useProducts";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import ProductForm from "../ProductForm";

import "./ProductManager.css";

function ProductManager() {
  const {
    produtos,
    categorias,
    adicionarProduto,
    atualizarProduto,
    excluirProduto,
    duplicarProduto,
    alternarDisponibilidade,
  } = useProducts();

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("TODAS");
  const [statusSelecionado, setStatusSelecionado] =
    useState("TODOS");

  const [formularioAberto, setFormularioAberto] =
    useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] =
    useState(null);
  const [mensagem, setMensagem] = useState("");

  const produtosFiltrados = useMemo(() => {
    const textoBusca = busca.trim().toLowerCase();

    return produtos.filter((produto) => {
      const correspondeBusca =
        textoBusca === "" ||
        produto.nome
          ?.toLowerCase()
          .includes(textoBusca) ||
        produto.descricao
          ?.toLowerCase()
          .includes(textoBusca) ||
        produto.categoria
          ?.toLowerCase()
          .includes(textoBusca);

      const correspondeCategoria =
        categoriaSelecionada === "TODAS" ||
        produto.categoria === categoriaSelecionada;

      const correspondeStatus =
        statusSelecionado === "TODOS" ||
        (statusSelecionado === "DISPONIVEIS" &&
          produto.disponivel) ||
        (statusSelecionado === "ESGOTADOS" &&
          !produto.disponivel);

      return (
        correspondeBusca &&
        correspondeCategoria &&
        correspondeStatus
      );
    });
  }, [
    produtos,
    busca,
    categoriaSelecionada,
    statusSelecionado,
  ]);

  function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function mostrarMensagem(texto) {
    setMensagem(texto);

    window.setTimeout(() => {
      setMensagem("");
    }, 2500);
  }

  function abrirNovoProduto() {
    setProdutoEmEdicao(null);
    setFormularioAberto(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function abrirEdicao(produto) {
    setProdutoEmEdicao(produto);
    setFormularioAberto(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function fecharFormulario() {
    setProdutoEmEdicao(null);
    setFormularioAberto(false);
  }

  async function salvarProduto(
    dadosProduto,
  ) {
    try {
      if (produtoEmEdicao) {
        const produtoAtualizado =
          await atualizarProduto(
            produtoEmEdicao.id,
            dadosProduto,
          );

        if (!produtoAtualizado) {
          throw new Error(
            "O produto não foi atualizado.",
          );
        }

        mostrarMensagem(
          "Produto atualizado com sucesso.",
        );
      } else {
        const produtoCriado =
          await adicionarProduto({
            ...dadosProduto,
            destaque: false,
            novo: true,
            ativo: true,
          });

        if (!produtoCriado) {
          throw new Error(
            "O produto não foi cadastrado.",
          );
        }

        mostrarMensagem(
          "Produto cadastrado com sucesso.",
        );
      }

      fecharFormulario();
    } catch (erro) {
      console.error(
        "Erro ao salvar produto:",
        erro,
      );

      mostrarMensagem(
        erro.message ||
          "Não foi possível salvar o produto.",
      );
    }
  }

  async function removerProduto(
    produto,
  ) {
    const confirmarExclusao =
      window.confirm(
        `Deseja realmente excluir o produto "${produto.nome}"?`,
      );

    if (!confirmarExclusao) {
      return;
    }

    try {
      await excluirProduto(
        produto.id,
      );

      mostrarMensagem(
        "Produto excluído com sucesso.",
      );
    } catch (erro) {
      console.error(
        "Erro ao excluir produto:",
        erro,
      );

      mostrarMensagem(
        erro.message ||
          "Não foi possível excluir o produto.",
      );
    }
  }

  async function copiarProduto(
    produto,
  ) {
    try {
      await duplicarProduto(
        produto.id,
      );

      mostrarMensagem(
        "Produto duplicado com sucesso.",
      );
    } catch (erro) {
      console.error(
        "Erro ao duplicar produto:",
        erro,
      );

      mostrarMensagem(
        erro.message ||
          "Não foi possível duplicar o produto.",
      );
    }
  }

  async function alterarDisponibilidade(
    produto,
  ) {
    try {
      await alternarDisponibilidade(
        produto.id,
      );

      mostrarMensagem(
        produto.disponivel
          ? "Produto marcado como esgotado."
          : "Produto marcado como disponível.",
      );
    } catch (erro) {
      console.error(
        "Erro ao alterar disponibilidade:",
        erro,
      );

      mostrarMensagem(
        erro.message ||
          "Não foi possível alterar a disponibilidade.",
      );
    }
  }

  function limparFiltros() {
    setBusca("");
    setCategoriaSelecionada("TODAS");
    setStatusSelecionado("TODOS");
  }

  if (formularioAberto) {
    return (
      <ProductForm
        initialData={produtoEmEdicao}
        onSubmit={salvarProduto}
        onCancel={fecharFormulario}
      />
    );
  }

  return (
    <section className="product-manager">
      {mensagem && (
        <div
          className="product-manager__message"
          role="status"
        >
          <span>✓</span>
          {mensagem}
        </div>
      )}

      <header className="product-manager__header">
        <div>
          <span className="admin-eyebrow">
            Gerenciamento
          </span>

          <h2>Produtos</h2>

          <p>
            Cadastre, altere preços e controle a
            disponibilidade dos produtos da loja.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          iconLeft="＋"
          onClick={abrirNovoProduto}
        >
          Novo produto
        </Button>
      </header>

      <div className="product-manager__summary">
        <article>
          <span>Total</span>
          <strong>{produtos.length}</strong>
        </article>

        <article>
          <span>Disponíveis</span>

          <strong>
            {
              produtos.filter(
                (produto) => produto.disponivel,
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Esgotados</span>

          <strong>
            {
              produtos.filter(
                (produto) => !produto.disponivel,
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Categorias</span>
          <strong>{categorias.length}</strong>
        </article>
      </div>

      <div className="product-manager__toolbar">
        <div className="product-manager__search">
          <Input
            type="search"
            value={busca}
            placeholder="Pesquisar produto..."
            iconLeft="⌕"
            ariaLabel="Pesquisar produto"
            onChange={(event) =>
              setBusca(event.target.value)
            }
          />
        </div>

        <div className="product-manager__filter">
          <label htmlFor="product-manager-category">
            Categoria
          </label>

          <select
            id="product-manager-category"
            value={categoriaSelecionada}
            onChange={(event) =>
              setCategoriaSelecionada(
                event.target.value,
              )
            }
          >
            <option value="TODAS">
              Todas as categorias
            </option>

            {categorias.map((categoria) => (
              <option
                value={categoria}
                key={categoria}
              >
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div className="product-manager__filter">
          <label htmlFor="product-manager-status">
            Disponibilidade
          </label>

          <select
            id="product-manager-status"
            value={statusSelecionado}
            onChange={(event) =>
              setStatusSelecionado(
                event.target.value,
              )
            }
          >
            <option value="TODOS">
              Todos os produtos
            </option>

            <option value="DISPONIVEIS">
              Disponíveis
            </option>

            <option value="ESGOTADOS">
              Esgotados
            </option>
          </select>
        </div>
      </div>

      <div className="product-manager__results">
        <div>
          <span>Produtos encontrados</span>
          <strong>{produtosFiltrados.length}</strong>
        </div>

        {(busca ||
          categoriaSelecionada !== "TODAS" ||
          statusSelecionado !== "TODOS") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limparFiltros}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {produtosFiltrados.length > 0 ? (
        <div className="product-manager__table-wrapper">
          <table className="product-manager__table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Disponibilidade</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td>
                    <div className="product-manager__product">
                      <div className="product-manager__image">
                        {produto.imagem ? (
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                          />
                        ) : (
                          <span>◇</span>
                        )}
                      </div>

                      <div>
                        <strong>{produto.nome}</strong>

                        <small>
                          {produto.descricao ||
                            "Sem descrição"}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="product-manager__category">
                      {produto.categoria}
                    </span>
                  </td>

                  <td>
                    <strong className="product-manager__price">
                      {formatarPreco(produto.preco)}
                    </strong>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={`product-manager__status ${
                        produto.disponivel
                          ? "product-manager__status--available"
                          : "product-manager__status--unavailable"
                      }`}
                      onClick={() =>
                        alterarDisponibilidade(produto)
                      }
                    >
                      <span />

                      {produto.disponivel
                        ? "Disponível"
                        : "Esgotado"}
                    </button>
                  </td>

                  <td>
                    <div className="product-manager__actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          abrirEdicao(produto)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copiarProduto(produto)
                        }
                      >
                        Duplicar
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="product-manager__delete"
                        onClick={() =>
                          removerProduto(produto)
                        }
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="product-manager__empty">
          <span>◇</span>

          <h3>Nenhum produto encontrado</h3>

          <p>
            Altere os filtros ou cadastre um novo
            produto.
          </p>

          <Button
            variant="primary"
            size="md"
            iconLeft="＋"
            onClick={abrirNovoProduto}
          >
            Novo produto
          </Button>
        </div>
      )}
    </section>
  );
}

export default ProductManager;