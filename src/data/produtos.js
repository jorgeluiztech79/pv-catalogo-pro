import tirzepatida from "../assets/produtos/tirzepatida.png";
import retatrutida from "../assets/produtos/reta.png";
import retratutide from "../assets/produtos/retratutide.png";
import ss31 from "../assets/produtos/ss31.png";
import tb500 from "../assets/produtos/tb500.png";
import motsc from "../assets/produtos/mots-c.png";
import klow from "../assets/produtos/klow.png";
import zphc from "../assets/produtos/zphc.png";

const produtos = [
  {
    id: 1,
    slug: "tirzepatida",
    nome: "Tirzepatida",

    categoria: "EMAGRECEDORES",
    subcategoria: "Suporte metabólico",

    descricao:
      "Produto da linha de suporte metabólico.",

    paraQueServe:
      "Campo destinado às informações comerciais e institucionais fornecidas pela loja sobre o produto.",

    comoUsar:
      "A utilização deve seguir as orientações fornecidas pelo profissional responsável e as informações oficiais do produto.",

    informacoesAdicionais:
      "Consulte a loja para informações sobre apresentação, conservação, disponibilidade e condições comerciais.",

    imagem: tirzepatida,

    preco: 630,

    disponivel: true,
    destaque: true,
    novo: false,
  },

  {
    id: 2,
    slug: "retatrutida",
    nome: "Retatrutida",

    categoria: "EMAGRECEDORES",
    subcategoria: "Suporte metabólico",

    descricao:
      "Produto da linha de suporte metabólico.",

    paraQueServe:
      "Campo destinado às informações comerciais e institucionais fornecidas pela loja sobre o produto.",

    comoUsar:
      "A utilização deve seguir as orientações fornecidas pelo profissional responsável e as informações oficiais do produto.",

    informacoesAdicionais:
      "Consulte a loja para informações sobre apresentação, conservação, disponibilidade e condições comerciais.",

    imagem: retatrutida,

    preco: 800,

    disponivel: true,
    destaque: true,
    novo: false,
  },

  {
    id: 3,
    slug: "retatrutida-thera",
    nome: "Retatrutida THERA",

    categoria: "EMAGRECEDORES",
    subcategoria: "Linha THERA",

    descricao:
      "Produto da linha premium THERA.",

    paraQueServe:
      "Campo destinado às informações comerciais e institucionais fornecidas pela loja sobre o produto.",

    comoUsar:
      "A utilização deve seguir as orientações fornecidas pelo profissional responsável e as informações oficiais do produto.",

    informacoesAdicionais:
      "Consulte a loja para informações sobre apresentação, conservação, disponibilidade e condições comerciais.",

    imagem: retratutide,

    preco: 800,

    disponivel: false,
    destaque: true,
    novo: false,
  },

  {
    id: 4,
    slug: "ss-31",
    nome: "SS-31",

    categoria: "PERFORMANCE",
    subcategoria: "Suporte celular",

    descricao:
      "Produto da linha de suporte celular.",

    paraQueServe:
      "Campo destinado às informações comerciais e institucionais fornecidas pela loja sobre o produto.",

    comoUsar:
      "A utilização deve seguir as orientações fornecidas pelo profissional responsável e as informações oficiais do produto.",

    informacoesAdicionais:
      "Consulte a loja para informações sobre apresentação, conservação, disponibilidade e condições comerciais.",

    imagem: ss31,

    preco: 450,

    disponivel: false,
    destaque: true,
    novo: false,
  },

  {
    id: 5,
    slug: "tb-500",
    nome: "TB-500",

    categoria: "PERFORMANCE",
    subcategoria: "Recuperação",

    descricao:
      "Produto da linha de suporte à recuperação.",

    paraQueServe:
      "Campo destinado às informações comerciais e institucionais fornecidas pela loja sobre o produto.",

    comoUsar:
      "A utilização deve seguir as orientações fornecidas pelo profissional responsável e as informações oficiais do produto.",

    informacoesAdicionais:
      "Consulte a loja para informações sobre apresentação, conservação, disponibilidade e condições comerciais.",

    imagem: tb500,

    preco: 470,

    disponivel: true,
    destaque: true,
    novo: false,
  },

  {
    id: 6,
    slug: "mots-c",
    nome: "MOTS-C",

    categoria: "PERFORMANCE",
    subcategoria: "Metabólico",

    descricao:
      "Produto da linha de suporte metabólico.",

    paraQueServe:
      "Campo destinado às informações comerciais e institucionais fornecidas pela loja sobre o produto.",

    comoUsar:
      "A utilização deve seguir as orientações fornecidas pelo profissional responsável e as informações oficiais do produto.",

    informacoesAdicionais:
      "Consulte a loja para informações sobre apresentação, conservação, disponibilidade e condições comerciais.",

    imagem: motsc,

    preco: 470,

    disponivel: true,
    destaque: true,
    novo: false,
  },

  {
    id: 7,
    slug: "klow",
    nome: "KLOW",

    categoria: "BELEZA",
    subcategoria: "Linha premium",

    descricao:
      "Produto exclusivo da linha premium.",

    paraQueServe:
      "Campo destinado às informações comerciais e institucionais fornecidas pela loja sobre o produto.",

    comoUsar:
      "A utilização deve seguir as orientações fornecidas pelo profissional responsável e as informações oficiais do produto.",

    informacoesAdicionais:
      "Consulte a loja para informações sobre apresentação, conservação, disponibilidade e condições comerciais.",

    imagem: klow,

    preco: 470,

    disponivel: true,
    destaque: true,
    novo: true,
  },

  {
    id: 8,
    slug: "zphc",
    nome: "ZPHC",

    categoria: "HORMÔNIOS",
    subcategoria: "Linha ZPHC",

    descricao:
      "Produto da linha premium ZPHC.",

    paraQueServe:
      "Campo destinado às informações comerciais e institucionais fornecidas pela loja sobre o produto.",

    comoUsar:
      "A utilização deve seguir as orientações fornecidas pelo profissional responsável e as informações oficiais do produto.",

    informacoesAdicionais:
      "Consulte a loja para informações sobre apresentação, conservação, disponibilidade e condições comerciais.",

    imagem: zphc,

    preco: 800,

    disponivel: false,
    destaque: true,
    novo: false,
  },
];

export default produtos;