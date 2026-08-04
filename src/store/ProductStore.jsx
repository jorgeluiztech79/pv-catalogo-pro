import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import produtosIniciais from "../data/produtos";

import {
  listarProdutos,
  criarProduto,
  atualizarProdutoBanco,
  excluirProdutoBanco,
} from "../services/produtoService";

export const ProductContext = createContext(null);

function criarSlug(texto = "") {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizarProduto(
  produto,
  produtosAtuais = [],
) {
  const nome =
    produto.nome?.trim() ||
    "Produto sem nome";

  const slugBase =
    criarSlug(produto.slug || nome) ||
    `produto-${Date.now()}`;

  const produtoComMesmoSlug =
    produtosAtuais.find(
      (item) =>
        item.slug === slugBase &&
        String(item.id) !==
          String(produto.id),
    );

  const slug = produtoComMesmoSlug
    ? `${slugBase}-${Date.now()}`
    : slugBase;

  const precoNumerico =
    Number(produto.preco);

  return {
    id: produto.id,
    slug,
    nome,

    categoria:
      produto.categoria?.trim() ||
      "SEM CATEGORIA",

    subcategoria:
      produto.subcategoria?.trim() ||
      "",

    descricao:
      produto.descricao?.trim() ||
      "",

    paraQueServe:
      produto.paraQueServe?.trim() ||
      "",

    comoUsar:
      produto.comoUsar?.trim() ||
      "",

    informacoesAdicionais:
      produto.informacoesAdicionais?.trim() ||
      "",

    imagem:
      produto.imagem || "",

    preco:
      Number.isFinite(precoNumerico)
        ? precoNumerico
        : 0,

    disponivel:
      Boolean(produto.disponivel),

    destaque:
      Boolean(produto.destaque),

    novo:
      Boolean(produto.novo),

    estoque:
      produto.estoque === "" ||
      produto.estoque === null ||
      produto.estoque === undefined
        ? null
        : Math.max(
            0,
            Number(produto.estoque) || 0,
          ),

    marca:
      produto.marca?.trim() ||
      "",

    laboratorio:
      produto.laboratorio?.trim() ||
      "",

    sku:
      produto.sku?.trim() ||
      "",

    ativo:
      produto.ativo !== false,

    criadoEm:
      produto.criadoEm ||
      new Date().toISOString(),

    atualizadoEm:
      produto.atualizadoEm ||
      new Date().toISOString(),
  };
}

export function ProductProvider({
  children,
}) {
  const [produtos, setProdutos] =
    useState([]);

  const [
    carregandoProdutos,
    setCarregandoProdutos,
  ] = useState(true);

  const [erroProdutos, setErroProdutos] =
    useState("");

  const carregarProdutos =
    useCallback(async () => {
      try {
        setCarregandoProdutos(true);
        setErroProdutos("");

        const produtosDoBanco =
          await listarProdutos();

        setProdutos(produtosDoBanco);
      } catch (erro) {
        console.error(
          "Não foi possível carregar os produtos do Supabase:",
          erro,
        );

        setErroProdutos(
          erro.message ||
            "Não foi possível carregar os produtos.",
        );
      } finally {
        setCarregandoProdutos(false);
      }
    }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const adicionarProduto = useCallback(
    async (dadosProduto) => {
      const produtoPreparado =
        normalizarProduto(
          {
            ...dadosProduto,
            criadoEm:
              new Date().toISOString(),
            atualizadoEm:
              new Date().toISOString(),
          },
          produtos,
        );

      const produtoCriado =
        await criarProduto(
          produtoPreparado,
        );

      setProdutos((produtosAtuais) => [
        ...produtosAtuais,
        produtoCriado,
      ]);

      return produtoCriado;
    },
    [produtos],
  );

  const atualizarProduto = useCallback(
    async (id, novosDados) => {
      const produtoAtual =
        produtos.find(
          (produto) =>
            String(produto.id) ===
            String(id),
        );

      if (!produtoAtual) {
        throw new Error(
          "Produto não encontrado.",
        );
      }

      const produtoPreparado =
        normalizarProduto(
          {
            ...produtoAtual,
            ...novosDados,
            id: produtoAtual.id,
            criadoEm:
              produtoAtual.criadoEm,
            atualizadoEm:
              new Date().toISOString(),
          },
          produtos,
        );

      const produtoAtualizado =
        await atualizarProdutoBanco(
          id,
          produtoPreparado,
        );

      setProdutos((produtosAtuais) =>
        produtosAtuais.map((produto) =>
          String(produto.id) ===
          String(id)
            ? produtoAtualizado
            : produto,
        ),
      );

      return produtoAtualizado;
    },
    [produtos],
  );

  const excluirProduto = useCallback(
    async (id) => {
      await excluirProdutoBanco(id);

      setProdutos((produtosAtuais) =>
        produtosAtuais.filter(
          (produto) =>
            String(produto.id) !==
            String(id),
        ),
      );

      return true;
    },
    [],
  );

  const duplicarProduto = useCallback(
    async (id) => {
      const produtoOriginal =
        produtos.find(
          (produto) =>
            String(produto.id) ===
            String(id),
        );

      if (!produtoOriginal) {
        throw new Error(
          "Produto original não encontrado.",
        );
      }

      const produtoDuplicado =
        normalizarProduto(
          {
            ...produtoOriginal,

            id: undefined,

            nome:
              `${produtoOriginal.nome} - Cópia`,

            slug:
              `${produtoOriginal.slug}-copia-${Date.now()}`,

            destaque: false,
            novo: false,

            criadoEm:
              new Date().toISOString(),

            atualizadoEm:
              new Date().toISOString(),
          },
          produtos,
        );

      const produtoCriado =
        await criarProduto(
          produtoDuplicado,
        );

      setProdutos((produtosAtuais) => [
        ...produtosAtuais,
        produtoCriado,
      ]);

      return produtoCriado;
    },
    [produtos],
  );

  const alternarDisponibilidade =
    useCallback(
      async (id) => {
        const produtoAtual =
          produtos.find(
            (produto) =>
              String(produto.id) ===
              String(id),
          );

        if (!produtoAtual) {
          throw new Error(
            "Produto não encontrado.",
          );
        }

        return atualizarProduto(
          id,
          {
            disponivel:
              !produtoAtual.disponivel,
          },
        );
      },
      [produtos, atualizarProduto],
    );

  const alternarDestaque =
    useCallback(
      async (id) => {
        const produtoAtual =
          produtos.find(
            (produto) =>
              String(produto.id) ===
              String(id),
          );

        if (!produtoAtual) {
          throw new Error(
            "Produto não encontrado.",
          );
        }

        return atualizarProduto(
          id,
          {
            destaque:
              !produtoAtual.destaque,
          },
        );
      },
      [produtos, atualizarProduto],
    );

  const alternarNovo =
    useCallback(
      async (id) => {
        const produtoAtual =
          produtos.find(
            (produto) =>
              String(produto.id) ===
              String(id),
          );

        if (!produtoAtual) {
          throw new Error(
            "Produto não encontrado.",
          );
        }

        return atualizarProduto(
          id,
          {
            novo:
              !produtoAtual.novo,
          },
        );
      },
      [produtos, atualizarProduto],
    );

  const buscarProdutoPorId =
    useCallback(
      (id) =>
        produtos.find(
          (produto) =>
            String(produto.id) ===
            String(id),
        ) || null,
      [produtos],
    );

  const buscarProdutoPorSlug =
    useCallback(
      (slug) =>
        produtos.find(
          (produto) =>
            produto.slug === slug,
        ) || null,
      [produtos],
    );

  const restaurarProdutosIniciais =
    useCallback(async () => {
      const confirmar =
        window.confirm(
          "Deseja substituir os produtos atuais pelos produtos iniciais?",
        );

      if (!confirmar) {
        return false;
      }

      for (const produto of produtos) {
        await excluirProdutoBanco(
          produto.id,
        );
      }

      const produtosRestaurados = [];

      for (
        const produtoInicial
        of produtosIniciais
      ) {
        const produtoPreparado =
          normalizarProduto(
            {
              ...produtoInicial,

              id: undefined,

              criadoEm:
                new Date().toISOString(),

              atualizadoEm:
                new Date().toISOString(),
            },
            produtosRestaurados,
          );

        const produtoCriado =
          await criarProduto(
            produtoPreparado,
          );

        produtosRestaurados.push(
          produtoCriado,
        );
      }

      setProdutos(
        produtosRestaurados,
      );

      return true;
    }, [produtos]);

  const categorias = useMemo(() => {
    return [
      ...new Set(
        produtos
          .map(
            (produto) =>
              produto.categoria,
          )
          .filter(Boolean),
      ),
    ].sort(
      (
        categoriaA,
        categoriaB,
      ) =>
        categoriaA.localeCompare(
          categoriaB,
          "pt-BR",
        ),
    );
  }, [produtos]);

  const indicadores = useMemo(() => {
    const produtosAtivos =
      produtos.filter(
        (produto) =>
          produto.ativo !== false,
      );

    return {
      total:
        produtosAtivos.length,

      disponiveis:
        produtosAtivos.filter(
          (produto) =>
            produto.disponivel,
        ).length,

      esgotados:
        produtosAtivos.filter(
          (produto) =>
            !produto.disponivel,
        ).length,

      destaques:
        produtosAtivos.filter(
          (produto) =>
            produto.destaque,
        ).length,

      novos:
        produtosAtivos.filter(
          (produto) =>
            produto.novo,
        ).length,

      categorias:
        categorias.length,
    };
  }, [produtos, categorias]);

  const valor = useMemo(
    () => ({
      produtos,
      categorias,
      indicadores,

      carregandoProdutos,
      erroProdutos,

      carregarProdutos,

      adicionarProduto,
      atualizarProduto,
      excluirProduto,
      duplicarProduto,

      alternarDisponibilidade,
      alternarDestaque,
      alternarNovo,

      buscarProdutoPorId,
      buscarProdutoPorSlug,

      restaurarProdutosIniciais,
    }),
    [
      produtos,
      categorias,
      indicadores,

      carregandoProdutos,
      erroProdutos,

      carregarProdutos,

      adicionarProduto,
      atualizarProduto,
      excluirProduto,
      duplicarProduto,

      alternarDisponibilidade,
      alternarDestaque,
      alternarNovo,

      buscarProdutoPorId,
      buscarProdutoPorSlug,

      restaurarProdutosIniciais,
    ],
  );

  return (
    <ProductContext.Provider
      value={valor}
    >
      {children}
    </ProductContext.Provider>
  );
}