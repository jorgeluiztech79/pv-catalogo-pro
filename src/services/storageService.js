import { supabase } from "../lib/supabase";

const BUCKET = "produtos";

function gerarNomeArquivo(nomeOriginal = "") {
  const extensao =
    nomeOriginal.split(".").pop()?.toLowerCase() || "jpg";

  const nome =
    Date.now() +
    "-" +
    Math.random().toString(36).substring(2, 10);

  const ano = new Date().getFullYear();
  const mes = String(new Date().getMonth() + 1).padStart(2, "0");

  return `${ano}/${mes}/${nome}.${extensao}`;
}

export async function uploadImagem(arquivo) {
  const caminho = gerarNomeArquivo(arquivo.name);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, arquivo);

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(caminho);

  return data.publicUrl;
}

export async function excluirImagem(url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  const marcador =
    "/storage/v1/object/public/produtos/";

  const indice = url.indexOf(marcador);

  if (indice === -1) {
    return false;
  }

  const caminhoCodificado =
    url.substring(indice + marcador.length);

  const caminho = decodeURIComponent(
    caminhoCodificado,
  );

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([caminho]);

  if (error) {
    throw new Error(
      `Não foi possível excluir a imagem: ${error.message}`,
    );
  }

  return true;
}