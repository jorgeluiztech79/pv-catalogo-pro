import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import produtosIniciais from "../data/produtos";

export const ProductContext = createContext(null);

const STORAGE_KEY = "pv-catalog-pro-produtos";

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

function gerarId(produtosAtuais) {
  const maiorId = produtosAtuais.reduce((maior, produto) => {
    const idNumerico = Number(produto.id);

    if (!Number.isFinite(idNumerico)) {
      return maior;
    }

    return Math.max(maior, idNumerico);
  }, 0);

  return maiorId + 1;
}

function normalizarProduto(produto, produtosAtuais = []) {
  const nome = produto.nome?.trim() || "Produto sem nome";

  const slugBase = criarSlug(produto.slug || nome) || `produto-${Date.now()}`;

  const produtoComMesmoSlug = produtosAtuais.find(
    (item) =>
      item.slug === slugBase && String(item.id) !== String(produto.id),
  );

  const slug = produtoComMesmoSlug
    ? `${slugBase}-${produto.id || Date.now()}`
    : slugBase;

  const precoNumerico = Number(produto.preco);

  return {
    id: produto.id,
    slug,
    nome,

    categoria: produto.categoria?.trim() || "SEM CATEGORIA",
    subcategoria: produto.subcategoria?.trim() || "",

    descricao: produto.descricao?.trim() || "",

    paraQueServe: produto.paraQueServe?.trim() || "",

    comoUsar: produto.comoUsar?.trim() || "",

    informacoesAdicionais:
      produto.informacoesAdicionais?.trim() || "",

    imagem: produto.imagem || "",

    preco: Number.isFinite(precoNumerico) ? precoNumerico : 0,

    disponivel: Boolean(produto.disponivel),
    destaque: Boolean(produto.destaque),
    novo: Boolean(produto.novo),

    estoque:
      produto.estoque === "" ||
      produto.estoque === null ||
      produto.estoque === undefined
        ? null
        : Math.max(0, Number(produto.estoque) || 0),

    marca: produto.marca?.trim() || "",
    laboratorio: produto.laboratorio?.trim() || "",
    sku: produto.sku?.trim() || "",

    ativo: produto.ativo !== false,

    criadoEm: produto.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
}

function carregarProdutosIniciais() {
  try {
    const produtosSalvos = localStorage.getItem(STORAGE_KEY);

    if (!produtosSalvos) {
      return produtosIniciais.map((produto) =>
        normalizarProduto(produto, produtosIniciais),
      );
    }

    const produtosConvertidos = JSON.parse(produtosSalvos);

    if (!Array.isArray(produtosConvertidos)) {
      throw new Error("Os produtos salvos não possuem um formato válido.");
    }

    return produtosConvertidos.map((produto) =>
      normalizarProduto(produto, produtosConvertidos),
    );
  } catch (erro) {
    console.error(
      "Não foi possível carregar os produtos salvos:",
      erro,
    );

    return produtosIniciais.map((produto) =>
      normalizarProduto(produto, produtosIniciais),
    );
  }
}

export function ProductProvider({ children }) {
  const [produtos, setProdutos] = useState(carregarProdutosIniciais);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
    } catch (erro) {
      console.error(
        "Não foi possível salvar os produtos no navegador:",
        erro,
      );
    }
  }, [produtos]);

  const adicionarProduto = useCallback((dadosProduto) => {
    let produtoCriado = null;

    setProdutos((produtosAtuais) => {
      const novoId = gerarId(produtosAtuais);

      produtoCriado = normalizarProduto(
        {
          ...dadosProduto,
          id: novoId,
          criadoEm: new Date().toISOString(),
        },
        produtosAtuais,
      );

      return [...produtosAtuais, produtoCriado];
    });

    return produtoCriado;
  }, []);

  const atualizarProduto = useCallback((id, novosDados) => {
    let produtoAtualizado = null;

    setProdutos((produtosAtuais) =>
      produtosAtuais.map((produto) => {
        if (String(produto.id) !== String(id)) {
          return produto;
        }

        produtoAtualizado = normalizarProduto(
          {
            ...produto,
            ...novosDados,
            id: produto.id,
            criadoEm: produto.criadoEm,
          },
          produtosAtuais,
        );

        return produtoAtualizado;
      }),
    );

    return produtoAtualizado;
  }, []);

  const excluirProduto = useCallback((id) => {
    setProdutos((produtosAtuais) =>
      produtosAtuais.filter(
        (produto) => String(produto.id) !== String(id),
      ),
    );
  }, []);

  const duplicarProduto = useCallback((id) => {
    let produtoDuplicado = null;

    setProdutos((produtosAtuais) => {
      const produtoOriginal = produtosAtuais.find(
        (produto) => String(produto.id) === String(id),
      );

      if (!produtoOriginal) {
        return produtosAtuais;
      }

      const novoId = gerarId(produtosAtuais);

      produtoDuplicado = normalizarProduto(
        {
          ...produtoOriginal,
          id: novoId,
          nome: `${produtoOriginal.nome} - Cópia`,
          slug: `${produtoOriginal.slug}-copia-${novoId}`,
          destaque: false,
          novo: false,
          criadoEm: new Date().toISOString(),
        },
        produtosAtuais,
      );

      return [...produtosAtuais, produtoDuplicado];
    });

    return produtoDuplicado;
  }, []);

  const alternarDisponibilidade = useCallback((id) => {
    setProdutos((produtosAtuais) =>
      produtosAtuais.map((produto) =>
        String(produto.id) === String(id)
          ? {
              ...produto,
              disponivel: !produto.disponivel,
              atualizadoEm: new Date().toISOString(),
            }
          : produto,
      ),
    );
  }, []);

  const alternarDestaque = useCallback((id) => {
    setProdutos((produtosAtuais) =>
      produtosAtuais.map((produto) =>
        String(produto.id) === String(id)
          ? {
              ...produto,
              destaque: !produto.destaque,
              atualizadoEm: new Date().toISOString(),
            }
          : produto,
      ),
    );
  }, []);

  const alternarNovo = useCallback((id) => {
    setProdutos((produtosAtuais) =>
      produtosAtuais.map((produto) =>
        String(produto.id) === String(id)
          ? {
              ...produto,
              novo: !produto.novo,
              atualizadoEm: new Date().toISOString(),
            }
          : produto,
      ),
    );
  }, []);

  const buscarProdutoPorId = useCallback(
    (id) =>
      produtos.find(
        (produto) => String(produto.id) === String(id),
      ) || null,
    [produtos],
  );

  const buscarProdutoPorSlug = useCallback(
    (slug) =>
      produtos.find((produto) => produto.slug === slug) || null,
    [produtos],
  );

  const restaurarProdutosIniciais = useCallback(() => {
    const produtosRestaurados = produtosIniciais.map((produto) =>
      normalizarProduto(produto, produtosIniciais),
    );

    setProdutos(produtosRestaurados);
  }, []);

  const categorias = useMemo(() => {
    return [...new Set(
      produtos
        .map((produto) => produto.categoria)
        .filter(Boolean),
    )].sort((categoriaA, categoriaB) =>
      categoriaA.localeCompare(categoriaB, "pt-BR"),
    );
  }, [produtos]);

  const indicadores = useMemo(() => {
    const produtosAtivos = produtos.filter(
      (produto) => produto.ativo !== false,
    );

    return {
      total: produtosAtivos.length,

      disponiveis: produtosAtivos.filter(
        (produto) => produto.disponivel,
      ).length,

      esgotados: produtosAtivos.filter(
        (produto) => !produto.disponivel,
      ).length,

      destaques: produtosAtivos.filter(
        (produto) => produto.destaque,
      ).length,

      novos: produtosAtivos.filter(
        (produto) => produto.novo,
      ).length,

      categorias: categorias.length,
    };
  }, [produtos, categorias]);

  const valor = useMemo(
    () => ({
      produtos,
      categorias,
      indicadores,

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
    <ProductContext.Provider value={valor}>
      {children}
    </ProductContext.Provider>
  );
}