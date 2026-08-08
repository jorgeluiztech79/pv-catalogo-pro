import { supabase } from "../lib/supabase";

const CONFIG_ID = 1;

function montarConfiguracao(data) {
  if (!data) {
    return null;
  }

  const empresa = data.empresa || {};
  const sistema = data.sistema || {};

  return {
    empresa,

    hero: data.hero || {},

    catalogo: data.catalogo || {},

    carrinho: data.carrinho || {},

    tema: data.tema || {},

    sistema,

    /*
     * Compatibilidade com componentes antigos.
     */
    nomeEmpresa: empresa.nome || "",

    whatsapp: empresa.whatsapp || "",

    logo: empresa.logo || "",

    descricaoEmpresa:
      empresa.descricao || "",

    moeda: sistema.moeda || "BRL",

    locale: sistema.locale || "pt-BR",
  };
}

export async function carregarConfiguracaoLoja() {
  const { data, error } = await supabase
    .from("configuracoes_loja")
    .select(
      `
        id,
        empresa,
        hero,
        catalogo,
        carrinho,
        tema,
        sistema
      `,
    )
    .eq("id", CONFIG_ID)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Não foi possível carregar as configurações da loja: ${error.message}`,
    );
  }

  return montarConfiguracao(data);
}

export async function salvarConfiguracaoLoja(
  configuracao,
) {
  console.log(
    "SALVANDO CONFIGURAÇÃO",
    configuracao,
  );

  const dadosBanco = {
    id: CONFIG_ID,

    empresa:
      configuracao.empresa || {},

    hero:
      configuracao.hero || {},

    catalogo:
      configuracao.catalogo || {},

    carrinho:
      configuracao.carrinho || {},

    tema:
      configuracao.tema || {},

    sistema:
      configuracao.sistema || {},
  };

  const { data, error } = await supabase
    .from("configuracoes_loja")
    .upsert(dadosBanco, {
      onConflict: "id",
    })
    .select(
      `
        id,
        empresa,
        hero,
        catalogo,
        carrinho,
        tema,
        sistema
      `,
    )
    .single();

  if (error) {
    throw new Error(
      `Não foi possível salvar as configurações da loja: ${error.message}`,
    );
  }

  return montarConfiguracao(data);
}