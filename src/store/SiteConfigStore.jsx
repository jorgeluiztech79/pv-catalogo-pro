import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import siteConfigInicial from "../config/siteConfig";

export const SiteConfigContext = createContext(null);

const STORAGE_KEY = "pv-catalog-pro-site-config";

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

function carregarConfiguracaoInicial() {
  try {
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
      "Não foi possível carregar as configurações da loja:",
      erro,
    );

    return copiarConfiguracao(siteConfigInicial);
  }
}

export function SiteConfigProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(
    carregarConfiguracaoInicial,
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(siteConfig),
      );
    } catch (erro) {
      console.error(
        "Não foi possível salvar as configurações da loja:",
        erro,
      );
    }
  }, [siteConfig]);

  const atualizarEmpresa = useCallback(
    (novosDados) => {
      setSiteConfig((configuracaoAtual) => ({
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
      }));
    },
    [],
  );

  const atualizarHero = useCallback(
    (novosDados) => {
      setSiteConfig((configuracaoAtual) => ({
        ...configuracaoAtual,

        hero: {
          ...configuracaoAtual.hero,
          ...novosDados,

          botaoPrincipal: {
            ...configuracaoAtual.hero.botaoPrincipal,
            ...novosDados.botaoPrincipal,
          },

          botaoSecundario: {
            ...configuracaoAtual.hero.botaoSecundario,
            ...novosDados.botaoSecundario,
          },

          cardFlutuante: {
            ...configuracaoAtual.hero.cardFlutuante,
            ...novosDados.cardFlutuante,
          },

          destaques:
            novosDados.destaques ??
            configuracaoAtual.hero.destaques,
        },
      }));
    },
    [],
  );

  const atualizarCatalogo = useCallback(
    (novosDados) => {
      setSiteConfig((configuracaoAtual) => ({
        ...configuracaoAtual,

        catalogo: {
          ...configuracaoAtual.catalogo,
          ...novosDados,
        },
      }));
    },
    [],
  );

  const atualizarTema = useCallback(
    (novosDados) => {
      setSiteConfig((configuracaoAtual) => ({
        ...configuracaoAtual,

        tema: {
          ...configuracaoAtual.tema,
          ...novosDados,
        },
      }));
    },
    [],
  );

  const restaurarConfiguracoes = useCallback(() => {
    setSiteConfig(
      copiarConfiguracao(siteConfigInicial),
    );
  }, []);

  const valor = useMemo(
    () => ({
      siteConfig,

      atualizarEmpresa,
      atualizarHero,
      atualizarCatalogo,
      atualizarTema,

      restaurarConfiguracoes,
    }),
    [
      siteConfig,
      atualizarEmpresa,
      atualizarHero,
      atualizarCatalogo,
      atualizarTema,
      restaurarConfiguracoes,
    ],
  );

  return (
    <SiteConfigContext.Provider value={valor}>
      {children}
    </SiteConfigContext.Provider>
  );
}