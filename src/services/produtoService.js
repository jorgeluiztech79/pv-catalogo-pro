import { supabase } from "../lib/supabase";

function mapearProdutoDoBanco(produto) {
  return {
    id: produto.id,
    slug: produto.slug,
    nome: produto.nome,

    categoria: produto.categoria,
    subcategoria: produto.subcategoria,

    descricao: produto.descricao,

    paraQueServe: produto.para_que_serve,
    comoUsar: produto.como_usar,
    informacoesAdicionais:
      produto.informacoes_adicionais,

    imagem: produto.imagem,

    preco: Number(produto.preco),
    estoque: produto.estoque,

    disponivel: produto.disponivel,
    destaque: produto.destaque,
    novo: produto.novo,
    ativo: produto.ativo,

    marca: produto.marca,
    laboratorio: produto.laboratorio,
    sku: produto.sku,

    criadoEm: produto.criado_em,
    atualizadoEm: produto.atualizado_em,
  };
}

function mapearProdutoParaBanco(produto) {
  return {
    slug: produto.slug,
    nome: produto.nome,

    categoria:
      produto.categoria || "SEM CATEGORIA",

    subcategoria:
      produto.subcategoria || "",

    descricao:
      produto.descricao || "",

    para_que_serve:
      produto.paraQueServe || "",

    como_usar:
      produto.comoUsar || "",

    informacoes_adicionais:
      produto.informacoesAdicionais || "",

    imagem:
      produto.imagem || "",

    preco:
      Number(produto.preco) || 0,

    estoque:
      produto.estoque === "" ||
      produto.estoque === null ||
      produto.estoque === undefined
        ? null
        : Math.max(
            0,
            Number(produto.estoque) || 0,
          ),

    disponivel:
      Boolean(produto.disponivel),

    destaque:
      Boolean(produto.destaque),

    novo:
      Boolean(produto.novo),

    ativo:
      produto.ativo !== false,

    marca:
      produto.marca || "",

    laboratorio:
      produto.laboratorio || "",

    sku:
      produto.sku || "",
  };
}

export async function listarProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("criado_em", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Não foi possível carregar os produtos: ${error.message}`,
    );
  }

  return (data || []).map(
    mapearProdutoDoBanco,
  );
}

export async function criarProduto(produto) {
  const dadosBanco =
    mapearProdutoParaBanco(produto);

  const { data, error } = await supabase
    .from("produtos")
    .insert(dadosBanco)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `Não foi possível cadastrar o produto: ${error.message}`,
    );
  }

  return mapearProdutoDoBanco(data);
}

export async function atualizarProdutoBanco(
  id,
  produto,
) {
  const dadosBanco =
    mapearProdutoParaBanco(produto);

  const { data, error } = await supabase
    .from("produtos")
    .update(dadosBanco)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `Não foi possível atualizar o produto: ${error.message}`,
    );
  }

  return mapearProdutoDoBanco(data);
}

export async function excluirProdutoBanco(id) {
  const { error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Não foi possível excluir o produto: ${error.message}`,
    );
  }
}