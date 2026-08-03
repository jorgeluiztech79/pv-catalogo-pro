import heroImage from "../assets/hero.png";
import logoPeptideosVip from "../assets/logo-peptideos-vip.png";

const siteConfig = {
  empresa: {
    nome: "Peptídeos VIP",

    logo: logoPeptideosVip,

    whatsapp: "5521998898166",

    email: "",

    instagram: "",

    descricao:
      "Catálogo de produtos com atendimento personalizado pelo WhatsApp.",
  },

  hero: {
    logo: logoPeptideosVip,

    imagem: heroImage,

    imagemAlt:
      "Apresentação visual da linha de produtos Peptídeos VIP",

    tag: "Peptídeos Premium",

    titulo:
      "Tecnologia, qualidade e atendimento especializado.",

    descricao:
      "Conheça uma linha cuidadosamente selecionada, apresentada em um catálogo moderno, seguro e preparado para oferecer uma experiência de compra simples e profissional.",

    botaoPrincipal: {
      texto: "Ver produtos",
      link: "/catalogo",
    },

    botaoSecundario: {
      texto: "Falar no WhatsApp",

      mensagem:
        "Olá! Gostaria de mais informações sobre os produtos disponíveis.",
    },

    destaques: [
      {
        id: 1,
        titulo: "Seleção premium",
        texto: "Produtos organizados com clareza",
      },
      {
        id: 2,
        titulo: "Atendimento direto",
        texto: "Contato rápido pelo WhatsApp",
      },
    ],

    cardFlutuante: {
      titulo: "Catálogo Premium",
      texto: "Experiência moderna e personalizada",
    },
  },

  catalogo: {
    cabecalho: {
      tag: "Catálogo completo",

      titulo: "Encontre o produto ideal",

      descricao:
        "Consulte informações, preços e disponibilidade. Adicione os itens ao carrinho e envie o pedido completo pelo WhatsApp.",
    },

    busca: {
      label: "Buscar produto",

      placeholder:
        "Digite o nome, a descrição ou a categoria...",
    },

    categorias: {
      label: "Categoria",

      opcaoTodos: "TODOS",

      opcoes: [
        "EMAGRECEDORES",
        "BELEZA",
        "PERFORMANCE",
        "HORMÔNIOS",
      ],
    },

    resultados: {
      titulo: "Produtos encontrados",

      botaoCarrinho: "Ver carrinho →",
    },

    produto: {
      valorLabel: "Valor",

      disponivel: "Disponível",

      indisponivel: "Indisponível no momento",

      seloDestaque: "Destaque",

      seloNovo: "Novo",

      seloEsgotado: "Esgotado",

      botaoDetalhes: "Ver informações",

      botaoAdicionar: "Adicionar ao carrinho",

      botaoAdicionado: "Adicionado ✓",

      botaoEsgotado: "Produto esgotado",
    },

    vazio: {
      tag: "Nenhum produto encontrado",

      titulo:
        "Não localizamos itens com esses filtros.",

      descricao:
        "Pesquise outro nome ou selecione uma categoria diferente.",

      botao: "Limpar filtros",
    },
  },

  carrinho: {
    titulo: "Meu carrinho",

    descricao:
      "Revise os produtos, altere as quantidades e envie o pedido pelo WhatsApp.",

    mensagemInicial:
      "Olá! Gostaria de solicitar os seguintes produtos:",
  },

  tema: {
    corPrincipal: "#101827",

    corSecundaria: "#fdb544",

    corWhatsApp: "#25d366",

    corFundo: "#f5f7fb",
  },

  sistema: {
    moeda: "BRL",

    locale: "pt-BR",
  },

  /*
   * Compatibilidade temporária com componentes que ainda
   * utilizam a estrutura antiga.
   */
  nomeEmpresa: "Peptídeos VIP",

  whatsapp: "5521998898166",

  logo: logoPeptideosVip,

  descricaoEmpresa:
    "Catálogo de produtos com atendimento personalizado pelo WhatsApp.",

  moeda: "BRL",

  locale: "pt-BR",
};

export default siteConfig;