import { supabase } from "../lib/supabase";

export async function entrarComEmailESenha(
  email,
  senha,
) {
  const emailNormalizado = String(
    email || "",
  )
    .trim()
    .toLowerCase();

  if (!emailNormalizado) {
    throw new Error(
      "Informe o e-mail do administrador.",
    );
  }

  if (!senha) {
    throw new Error(
      "Informe a senha do administrador.",
    );
  }

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: emailNormalizado,
      password: senha,
    });

  if (error) {
    throw new Error(
      "E-mail ou senha inválidos.",
    );
  }

  return {
    usuario: data.user,
    sessao: data.session,
  };
}

export async function sairDaConta() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw new Error(
      "Não foi possível encerrar a sessão.",
    );
  }
}

export async function obterSessaoAtual() {
  const { data, error } =
    await supabase.auth.getSession();

  if (error) {
    throw new Error(
      "Não foi possível verificar a sessão.",
    );
  }

  return data.session || null;
}

export function observarAlteracoesDaSessao(
  callback,
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_evento, sessao) => {
      callback(sessao || null);
    },
  );

  return () => {
    subscription.unsubscribe();
  };
}