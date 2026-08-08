import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import siteConfigInicial from "../config/siteConfig";

import {
  carregarConfiguracaoLoja,
  salvarConfiguracaoLoja,
} from "./siteConfigService";

export const SiteConfigContext = createContext(null);

const STORAGE_KEY = "pv-catalog-pro-site-config";
const CACHE_VERSION_KEY =
  "pv-catalog-pro-site-config-version";
const CACHE_VERSION = "2";

function copiarConfiguracao(configuracao) {
  return {
    ...configuracao,

    empresa: {
      ...configuracao.empresa,
    },

    hero: {
      ...configuracao.hero,

      botaoPrincipal: {
        ...configuracao.hero?.botaoPrincipal,
      },

      botaoSecundario: {
        ...configuracao.hero?.botaoSecundario,
      },

      destaques:
        configuracao.hero?.destaques?.map(
          (destaque) => ({
            ...destaque,
          }),
        ) || [],

      cardFlutuante: {
        ...configuracao.hero?.cardFlutuante,
      },
    },

    catalogo: {
      ...configuracao.catalogo,

      cabecalho: {
        ...configuracao.catalogo?.cabecalho,
      },

      busca: {
        ...configuracao.catalogo?.busca,
      },

      categorias: {
        ...configuracao.catalogo?.categorias,

        opcoes: [
          ...(configuracao.catalogo?.categorias
            ?.opcoes || []),
        ],
      },

      resultados: {
        ...configuracao.catalogo?.resultados,
      },

      produto: {
        ...configuracao.catalogo?.produto,
      },

      vazio: {
        ...configuracao.catalogo?.vazio,
      },
    },

    carrinho: {
      ...configuracao.carrinho,
    },

    tema: {
      ...configuracao.tema,
    },

    sistema: {
      ...configuracao.sistema,
    },
  };
}

function mesclarConfiguracaoSalva(
  configuracaoInicial,
  configuracaoSalva,
) {
  return {
    ...copiarConfiguracao(configuracaoInicial),
    ...configuracaoSalva,

    empresa: {
      ...configuracaoInicial.empresa,
      ...configuracaoSalva?.empresa,
    },

    hero: {
      ...configuracaoInicial.hero,
      ...configuracaoSalva?.hero,

      botaoPrincipal: {
        ...configuracaoInicial.hero?.botaoPrincipal,
        ...configuracaoSalva?.hero?.botaoPrincipal,
      },

      botaoSecundario: {
        ...configuracaoInicial.hero?.botaoSecundario,
        ...configuracaoSalva?.hero?.botaoSecundario,
      },

      destaques:
        configuracaoSalva?.hero?.destaques ||
        configuracaoInicial.hero?.destaques ||
        [],

      cardFlutuante: {
        ...configuracaoInicial.hero?.cardFlutuante,
        ...configuracaoSalva?.hero?.cardFlutuante,
      },
    },

    catalogo: {
      ...configuracaoInicial.catalogo,
      ...configuracaoSalva?.catalogo,

      cabecalho: {
        ...configuracaoInicial.catalogo?.cabecalho,
        ...configuracaoSalva?.catalogo?.cabecalho,
      },

      busca: {
        ...configuracaoInicial.catalogo?.busca,
        ...configuracaoSalva?.catalogo?.busca,
      },

      categorias: {
        ...configuracaoInicial.catalogo?.categorias,
        ...configuracaoSalva?.catalogo?.categorias,

        opcoes:
          configuracaoSalva?.catalogo?.categorias
            ?.opcoes ||
          configuracaoInicial.catalogo?.categorias
            ?.opcoes ||
          [],
      },

      resultados: {
        ...configuracaoInicial.catalogo?.resultados,
        ...configuracaoSalva?.catalogo?.resultados,
      },

      produto: {
        ...configuracaoInicial.catalogo?.produto,
        ...configuracaoSalva?.catalogo?.produto,
      },

      vazio: {
        ...configuracaoInicial.catalogo?.vazio,
        ...configuracaoSalva?.catalogo?.vazio,
      },
    },

    carrinho: {
      ...configuracaoInicial.carrinho,
      ...configuracaoSalva?.carrinho,
    },

    tema: {
      ...configuracaoInicial.tema,
      ...configuracaoSalva?.tema,
    },

    sistema: {
      ...configuracaoInicial.sistema,
      ...configuracaoSalva?.sistema,
    },
  };
}

function carregarCacheLocal() {
  try {
    const versaoSalva =
      localStorage.getItem(CACHE_VERSION_KEY);

    /*
     * Remove automaticamente o cache antigo
     * que ainda poderia conter Peptídeos VIP.
     */
    if (versaoSalva !== CACHE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);

      localStorage.setItem(
        CACHE_VERSION_KEY,
        CACHE_VERSION,
      );

      return copiarConfiguracao(siteConfigInicial);
    }

    const configuracaoSalva =
      localStorage.getItem(STORAGE_KEY);

    if (!configuracaoSalva) {
      return copiarConfiguracao(siteConfigInicial);
    }

    const configuracaoConvertida =
      JSON.parse(configuracaoSalva);

    return mesclarConfiguracaoSalva(
      siteConfigInicial,
      configuracaoConvertida,
    );
  } catch (erro) {
    console.error(
      "Não foi possível carregar o cache local:",
      erro,
    );

    return copiarConfiguracao(siteConfigInicial);
  }
}

function salvarCacheLocal(configuracao) {
  try {
    localStorage.setItem(
      CACHE_VERSION_KEY,
      CACHE_VERSION,
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(configuracao),
    );
  } catch (erro) {
    console.error(
      "Não foi possível salvar o cache local:",
      erro,
    );
  }
}

export function SiteConfigProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(
    carregarCacheLocal,
  );

  const [
    carregandoConfiguracoes,
    setCarregandoConfiguracoes,
  ] = useState(true);

  const [erroConfiguracoes, setErroConfiguracoes] =
    useState("");

  const deveSalvarRef = useRef(false);

  const ultimaConfiguracaoSalvaRef =
    useRef("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarConfiguracoes() {
      try {
        setErroConfiguracoes("");

        const configuracaoBanco =
          await carregarConfiguracaoLoja();

        if (!componenteAtivo) {
          return;
        }

        if (configuracaoBanco) {
          const configuracaoMesclada =
            mesclarConfiguracaoSalva(
              siteConfigInicial,
              configuracaoBanco,
            );

          ultimaConfiguracaoSalvaRef.current =
            JSON.stringify(
              configuracaoMesclada,
            );

          setSiteConfig(
            configuracaoMesclada,
          );

          salvarCacheLocal(
            configuracaoMesclada,
          );

          return;
        }

        /*
         * A tabela ainda está vazia.
         * Mantém Comunidade Maromba como padrão.
         * A primeira alteração feita no Admin
         * será gravada no Supabase.
         */
        const configuracaoInicial =
          copiarConfiguracao(
            siteConfigInicial,
          );

        ultimaConfiguracaoSalvaRef.current =
          JSON.stringify(
            configuracaoInicial,
          );

        setSiteConfig(
          configuracaoInicial,
        );

        salvarCacheLocal(
          configuracaoInicial,
        );
      } catch (erro) {
        console.error(
          "Não foi possível carregar as configurações do Supabase:",
          erro,
        );

        if (componenteAtivo) {
          setErroConfiguracoes(
            erro.message ||
              "Não foi possível carregar as configurações da loja.",
          );
        }
      } finally {
        if (componenteAtivo) {
          setCarregandoConfiguracoes(false);
        }
      }
    }

    carregarConfiguracoes();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  useEffect(() => {
    salvarCacheLocal(siteConfig);

    if (
      carregandoConfiguracoes ||
      !deveSalvarRef.current
    ) {
      return undefined;
    }

    const configuracaoSerializada =
      JSON.stringify(siteConfig);

    if (
      configuracaoSerializada ===
      ultimaConfiguracaoSalvaRef.current
    ) {
      deveSalvarRef.current = false;

      return undefined;
    }

    const temporizador =
      window.setTimeout(
        async () => {
          try {
            setErroConfiguracoes("");

            await salvarConfiguracaoLoja(
              siteConfig,
            );

            ultimaConfiguracaoSalvaRef.current =
              configuracaoSerializada;

            deveSalvarRef.current = false;

            console.log(
              "Configurações da loja salvas no Supabase.",
            );
          } catch (erro) {
            console.error(
              "Não foi possível salvar as configurações no Supabase:",
              erro,
            );

            setErroConfiguracoes(
              erro.message ||
                "Não foi possível salvar as configurações da loja.",
            );
          }
        },
        500,
      );

    return () => {
      window.clearTimeout(
        temporizador,
      );
    };
  }, [
    siteConfig,
    carregandoConfiguracoes,
  ]);

  const atualizarEmpresa = useCallback(
    (novosDados) => {
      deveSalvarRef.current = true;

      setSiteConfig(
        (configuracaoAtual) => ({
          ...configuracaoAtual,

          empresa: {
            ...configuracaoAtual.empresa,
            ...novosDados,
          },

          nomeEmpresa:
            novosDados.nome ??
            configuracaoAtual.nomeEmpresa,

          whatsapp:
            novosDados.whatsapp ??
            configuracaoAtual.whatsapp,

          logo:
            novosDados.logo ??
            configuracaoAtual.logo,
        }),
      );
    },
    [],
  );

  const atualizarHero = useCallback(
    (novosDados) => {
      deveSalvarRef.current = true;

      setSiteConfig(
        (configuracaoAtual) => ({
          ...configuracaoAtual,

          hero: {
            ...configuracaoAtual.hero,
            ...novosDados,

            botaoPrincipal: {
              ...configuracaoAtual.hero
                ?.botaoPrincipal,
              ...novosDados.botaoPrincipal,
            },

            botaoSecundario: {
              ...configuracaoAtual.hero
                ?.botaoSecundario,
              ...novosDados.botaoSecundario,
            },

            cardFlutuante: {
              ...configuracaoAtual.hero
                ?.cardFlutuante,
              ...novosDados.cardFlutuante,
            },

            destaques:
              novosDados.destaques ??
              configuracaoAtual.hero
                ?.destaques ??
              [],
          },
        }),
      );
    },
    [],
  );

  const atualizarCatalogo = useCallback(
    (novosDados) => {
      deveSalvarRef.current = true;

      setSiteConfig(
        (configuracaoAtual) => ({
          ...configuracaoAtual,

          catalogo: {
            ...configuracaoAtual.catalogo,
            ...novosDados,
          },
        }),
      );
    },
    [],
  );

  const atualizarTema = useCallback(
    (novosDados) => {
      deveSalvarRef.current = true;

      setSiteConfig(
        (configuracaoAtual) => ({
          ...configuracaoAtual,

          tema: {
            ...configuracaoAtual.tema,
            ...novosDados,
          },
        }),
      );
    },
    [],
  );

  const restaurarConfiguracoes =
    useCallback(() => {
      deveSalvarRef.current = true;

      setSiteConfig(
        copiarConfiguracao(
          siteConfigInicial,
        ),
      );
    }, []);

  const valor = useMemo(
    () => ({
      siteConfig,

      carregandoConfiguracoes,
      erroConfiguracoes,

      atualizarEmpresa,
      atualizarHero,
      atualizarCatalogo,
      atualizarTema,

      restaurarConfiguracoes,
    }),
    [
      siteConfig,
      carregandoConfiguracoes,
      erroConfiguracoes,
      atualizarEmpresa,
      atualizarHero,
      atualizarCatalogo,
      atualizarTema,
      restaurarConfiguracoes,
    ],
  );

  return (
    <SiteConfigContext.Provider
      value={valor}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}