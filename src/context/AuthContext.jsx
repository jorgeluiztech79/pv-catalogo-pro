import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  entrarComEmailESenha,
  sairDaConta,
  obterSessaoAtual,
  observarAlteracoesDaSessao,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      const sessao = await obterSessaoAtual();

      setUsuario(sessao?.user ?? null);
      setLoading(false);
    }

    carregarSessao();

    const unsubscribe =
      observarAlteracoesDaSessao((sessao) => {
        setUsuario(sessao?.user ?? null);
      });

    return unsubscribe;
  }, []);

  async function login(email, senha) {
    const resposta =
      await entrarComEmailESenha(email, senha);

    setUsuario(resposta.usuario);

    return resposta;
  }

  async function logout() {
    await sairDaConta();

    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        autenticado: !!usuario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}