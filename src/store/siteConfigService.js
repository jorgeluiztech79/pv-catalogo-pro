import { supabase } from "../lib/supabase";

const CONFIG_ID = 1;

export async function carregarConfiguracaoLoja() {
  const { data, error } = await supabase
    .from("configuracoes_loja")
    .select("configuracao")
    .eq("id", CONFIG_ID)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Não foi possível carregar as configurações da loja: ${error.message}`,
    );
  }

  return data?.configuracao || null;
}

export async function salvarConfiguracaoLoja(configuracao) {
  const { data, error } = await supabase
    .from("configuracoes_loja")
    .upsert(
      {
        id: CONFIG_ID,
        configuracao,
        atualizado_em: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )
    .select("configuracao")
    .single();

  if (error) {
    throw new Error(
      `Não foi possível salvar as configurações da loja: ${error.message}`,
    );
  }

  return data.configuracao;
}