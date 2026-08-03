import { useEffect, useMemo, useState } from "react";

import useSiteConfig from "../../../hooks/useSiteConfig";

import Button from "../../ui/Button";
import ImageUpload from "../../ui/ImageUpload";
import Input from "../../ui/Input";

import "./Personalizacao.css";

function criarEstadoInicial(siteConfig) {
  const hero = siteConfig?.hero || {};

  return {
    tag: hero.tag || "",
    titulo: hero.titulo || "",
    descricao: hero.descricao || "",

    logo: hero.logo || "",
    imagem: hero.imagem || "",
    imagemAlt: hero.imagemAlt || "",

    botaoPrincipalTexto:
      hero.botaoPrincipal?.texto || "",

    botaoPrincipalLink:
      hero.botaoPrincipal?.link || "/catalogo",

    botaoSecundarioTexto:
      hero.botaoSecundario?.texto || "",

    botaoSecundarioMensagem:
      hero.botaoSecundario?.mensagem || "",

    destaque1Titulo:
      hero.destaques?.[0]?.titulo || "",

    destaque1Texto:
      hero.destaques?.[0]?.texto || "",

    destaque2Titulo:
      hero.destaques?.[1]?.titulo || "",

    destaque2Texto:
      hero.destaques?.[1]?.texto || "",

    cardFlutuanteTitulo:
      hero.cardFlutuante?.titulo || "",

    cardFlutuanteTexto:
      hero.cardFlutuante?.texto || "",
  };
}

function Personalizacao() {
  const {
    siteConfig,
    atualizarHero,
    restaurarConfiguracoes,
  } = useSiteConfig();

  const [formData, setFormData] = useState(() =>
    criarEstadoInicial(siteConfig),
  );

  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [previewLogoError, setPreviewLogoError] =
    useState(false);
  const [previewImagemError, setPreviewImagemError] =
    useState(false);

  useEffect(() => {
    setFormData(criarEstadoInicial(siteConfig));
  }, [siteConfig]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));

    if (name === "logo") {
      setPreviewLogoError(false);
    }

    if (name === "imagem") {
      setPreviewImagemError(false);
    }
  }

  function atualizarCampo(nome, valor) {
    setFormData((dadosAtuais) => ({
      ...dadosAtuais,
      [nome]: valor,
    }));

    if (nome === "logo") {
      setPreviewLogoError(false);
    }

    if (nome === "imagem") {
      setPreviewImagemError(false);
    }
  }

  function mostrarMensagem(texto) {
    setMensagem(texto);

    window.setTimeout(() => {
      setMensagem("");
    }, 3000);
  }

  function salvarPersonalizacao(event) {
    event.preventDefault();

    setSalvando(true);

    atualizarHero({
      tag: formData.tag.trim(),

      titulo: formData.titulo.trim(),

      descricao: formData.descricao.trim(),

      logo: formData.logo.trim(),

      imagem: formData.imagem.trim(),

      imagemAlt:
        formData.imagemAlt.trim() ||
        "Imagem principal da loja",

      botaoPrincipal: {
        texto:
          formData.botaoPrincipalTexto.trim() ||
          "Ver produtos",

        link:
          formData.botaoPrincipalLink.trim() ||
          "/catalogo",
      },

      botaoSecundario: {
        texto:
          formData.botaoSecundarioTexto.trim() ||
          "Falar no WhatsApp",

        mensagem:
          formData.botaoSecundarioMensagem.trim() ||
          "Olá! Gostaria de mais informações.",
      },

      destaques: [
        {
          id: 1,

          titulo:
            formData.destaque1Titulo.trim(),

          texto:
            formData.destaque1Texto.trim(),
        },

        {
          id: 2,

          titulo:
            formData.destaque2Titulo.trim(),

          texto:
            formData.destaque2Texto.trim(),
        },
      ].filter(
        (destaque) =>
          destaque.titulo || destaque.texto,
      ),

      cardFlutuante: {
        titulo:
          formData.cardFlutuanteTitulo.trim(),

        texto:
          formData.cardFlutuanteTexto.trim(),
      },
    });

    window.setTimeout(() => {
      setSalvando(false);

      mostrarMensagem(
        "Personalização salva com sucesso.",
      );
    }, 500);
  }

  function restaurarPadrao() {
    const confirmarRestauracao = window.confirm(
      "Deseja restaurar todas as configurações originais da loja?",
    );

    if (!confirmarRestauracao) {
      return;
    }

    restaurarConfiguracoes();

    mostrarMensagem(
      "Configurações originais restauradas.",
    );
  }

  const linkWhatsAppPreview = useMemo(() => {
    const numeroWhatsApp = String(
      siteConfig?.empresa?.whatsapp || "",
    ).replace(/\D/g, "");

    const mensagem = encodeURIComponent(
      formData.botaoSecundarioMensagem ||
        "Olá! Gostaria de mais informações.",
    );

    return numeroWhatsApp
      ? `https://wa.me/${numeroWhatsApp}?text=${mensagem}`
      : "#";
  }, [
    formData.botaoSecundarioMensagem,
    siteConfig?.empresa?.whatsapp,
  ]);

  return (
    <section className="personalizacao">
      {mensagem && (
        <div
          className="personalizacao__message"
          role="status"
        >
          <span>✓</span>

          {mensagem}
        </div>
      )}

      <header className="personalizacao__header">
        <div>
          <span className="admin-eyebrow">
            Página inicial
          </span>

          <h2>Personalização da loja</h2>

          <p>
            Altere textos, imagens e botões apresentados
            no banner principal da loja.
          </p>
        </div>

        <div className="personalizacao__header-actions">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() =>
              window.open("/", "_blank")
            }
          >
            Visualizar loja
          </Button>

          <Button
            type="submit"
            form="personalizacao-form"
            variant="primary"
            size="md"
            loading={salvando}
            loadingText="Salvando..."
            iconLeft="✓"
          >
            Salvar alterações
          </Button>
        </div>
      </header>

      <form
        id="personalizacao-form"
        className="personalizacao__content"
        onSubmit={salvarPersonalizacao}
      >
        <div className="personalizacao__fields">
          <section className="personalizacao__section">
            <div className="personalizacao__section-header">
              <span className="personalizacao__section-number">
                01
              </span>

              <div>
                <h3>Identidade visual</h3>

                <p>
                  Configure o logo e a imagem principal
                  exibidos no banner.
                </p>
              </div>
            </div>

            <div className="personalizacao__grid">
              <div className="personalizacao__field-full">
                <ImageUpload
                  label="Logo apresentado no banner"
                  value={formData.logo}
                  onChange={(valor) =>
                    atualizarCampo("logo", valor)
                  }
                  helperText="PNG, JPG, JPEG ou WEBP. Recomenda-se imagem com fundo transparente."
                  disabled={salvando}
                />
              </div>

              <div className="personalizacao__field-full">
                <div className="personalizacao__divider">
                  <span>ou informe uma URL</span>
                </div>
              </div>

              <div className="personalizacao__field-full">
                <Input
                  name="logo"
                  label="URL do logo"
                  type="url"
                  value={
                    formData.logo.startsWith("data:")
                      ? ""
                      : formData.logo
                  }
                  placeholder="https://exemplo.com/logo.png"
                  helperText="Use apenas caso o logo esteja hospedado na internet."
                  iconLeft="↗"
                  onChange={handleChange}
                />
              </div>

              <div className="personalizacao__field-full">
                <ImageUpload
                  label="Imagem principal do banner"
                  value={formData.imagem}
                  onChange={(valor) =>
                    atualizarCampo("imagem", valor)
                  }
                  helperText="PNG, JPG, JPEG ou WEBP. Tamanho máximo recomendado: 3 MB."
                  disabled={salvando}
                />
              </div>

              <div className="personalizacao__field-full">
                <div className="personalizacao__divider">
                  <span>ou informe uma URL</span>
                </div>
              </div>

              <div className="personalizacao__field-full">
                <Input
                  name="imagem"
                  label="URL da imagem principal"
                  type="url"
                  value={
                    formData.imagem.startsWith("data:")
                      ? ""
                      : formData.imagem
                  }
                  placeholder="https://exemplo.com/banner.png"
                  helperText="Use apenas caso a imagem esteja hospedada na internet."
                  iconLeft="↗"
                  onChange={handleChange}
                />
              </div>

              <div className="personalizacao__field-full">
                <Input
                  name="imagemAlt"
                  label="Descrição da imagem"
                  value={formData.imagemAlt}
                  placeholder="Ex.: Apresentação dos produtos da loja"
                  helperText="Esse texto melhora a acessibilidade e o entendimento da imagem."
                  maxLength={140}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="personalizacao__section">
            <div className="personalizacao__section-header">
              <span className="personalizacao__section-number">
                02
              </span>

              <div>
                <h3>Conteúdo principal</h3>

                <p>
                  Edite a etiqueta, o título e a descrição
                  que apresentam a loja.
                </p>
              </div>
            </div>

            <div className="personalizacao__grid">
              <div className="personalizacao__field-full">
                <Input
                  name="tag"
                  label="Etiqueta"
                  value={formData.tag}
                  placeholder="Ex.: PRODUTOS PREMIUM"
                  helperText="Pequeno destaque apresentado acima do título."
                  maxLength={60}
                  onChange={handleChange}
                />
              </div>

              <div className="personalizacao__field-full">
                <Input
                  name="titulo"
                  label="Título principal"
                  value={formData.titulo}
                  placeholder="Ex.: Tecnologia, qualidade e atendimento especializado."
                  required
                  maxLength={120}
                  onChange={handleChange}
                />
              </div>

              <div className="personalizacao__field-full">
                <label
                  className="personalizacao__label"
                  htmlFor="personalizacao-descricao"
                >
                  Descrição
                </label>

                <textarea
                  id="personalizacao-descricao"
                  name="descricao"
                  value={formData.descricao}
                  rows="5"
                  maxLength="500"
                  placeholder="Apresente a empresa e os principais diferenciais..."
                  className="personalizacao__textarea"
                  onChange={handleChange}
                />

                <span className="personalizacao__counter">
                  {formData.descricao.length}/500
                </span>
              </div>
            </div>
          </section>

          <section className="personalizacao__section">
            <div className="personalizacao__section-header">
              <span className="personalizacao__section-number">
                03
              </span>

              <div>
                <h3>Botões do banner</h3>

                <p>
                  Defina os textos, links e a mensagem
                  enviada pelo WhatsApp.
                </p>
              </div>
            </div>

            <div className="personalizacao__grid">
              <div className="personalizacao__field">
                <Input
                  name="botaoPrincipalTexto"
                  label="Texto do botão principal"
                  value={formData.botaoPrincipalTexto}
                  placeholder="Ver produtos"
                  maxLength={40}
                  onChange={handleChange}
                />
              </div>

              <div className="personalizacao__field">
                <Input
                  name="botaoPrincipalLink"
                  label="Link do botão principal"
                  value={formData.botaoPrincipalLink}
                  placeholder="/catalogo"
                  helperText="Para o catálogo, utilize /catalogo."
                  maxLength={120}
                  onChange={handleChange}
                />
              </div>

              <div className="personalizacao__field">
                <Input
                  name="botaoSecundarioTexto"
                  label="Texto do botão WhatsApp"
                  value={formData.botaoSecundarioTexto}
                  placeholder="Falar no WhatsApp"
                  maxLength={40}
                  onChange={handleChange}
                />
              </div>

              <div className="personalizacao__field">
                <Input
                  name="botaoSecundarioMensagem"
                  label="Mensagem inicial do WhatsApp"
                  value={
                    formData.botaoSecundarioMensagem
                  }
                  placeholder="Olá! Gostaria de mais informações."
                  maxLength={250}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="personalizacao__section">
            <div className="personalizacao__section-header">
              <span className="personalizacao__section-number">
                04
              </span>

              <div>
                <h3>Destaques da loja</h3>

                <p>
                  Configure os dois pequenos diferenciais
                  apresentados abaixo dos botões.
                </p>
              </div>
            </div>

            <div className="personalizacao__highlights-grid">
              <article className="personalizacao__highlight-card">
                <span>Destaque 1</span>

                <Input
                  name="destaque1Titulo"
                  label="Título"
                  value={formData.destaque1Titulo}
                  placeholder="Seleção premium"
                  maxLength={50}
                  onChange={handleChange}
                />

                <Input
                  name="destaque1Texto"
                  label="Descrição"
                  value={formData.destaque1Texto}
                  placeholder="Produtos organizados com clareza"
                  maxLength={100}
                  onChange={handleChange}
                />
              </article>

              <article className="personalizacao__highlight-card">
                <span>Destaque 2</span>

                <Input
                  name="destaque2Titulo"
                  label="Título"
                  value={formData.destaque2Titulo}
                  placeholder="Atendimento direto"
                  maxLength={50}
                  onChange={handleChange}
                />

                <Input
                  name="destaque2Texto"
                  label="Descrição"
                  value={formData.destaque2Texto}
                  placeholder="Contato rápido pelo WhatsApp"
                  maxLength={100}
                  onChange={handleChange}
                />
              </article>
            </div>
          </section>

          <section className="personalizacao__section">
            <div className="personalizacao__section-header">
              <span className="personalizacao__section-number">
                05
              </span>

              <div>
                <h3>Card flutuante</h3>

                <p>
                  Configure o pequeno card apresentado
                  sobre a imagem principal.
                </p>
              </div>
            </div>

            <div className="personalizacao__grid">
              <div className="personalizacao__field">
                <Input
                  name="cardFlutuanteTitulo"
                  label="Título do card"
                  value={
                    formData.cardFlutuanteTitulo
                  }
                  placeholder="Catálogo Premium"
                  maxLength={60}
                  onChange={handleChange}
                />
              </div>

              <div className="personalizacao__field">
                <Input
                  name="cardFlutuanteTexto"
                  label="Texto do card"
                  value={
                    formData.cardFlutuanteTexto
                  }
                  placeholder="Experiência moderna e personalizada"
                  maxLength={100}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <div className="personalizacao__footer">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={salvando}
              onClick={restaurarPadrao}
            >
              Restaurar padrão
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={salvando}
              loadingText="Salvando..."
              iconLeft="✓"
            >
              Salvar alterações
            </Button>
          </div>
        </div>

        <aside className="personalizacao__preview">
          <div className="personalizacao__preview-header">
            <span className="admin-eyebrow">
              Pré-visualização
            </span>

            <h3>Banner da loja</h3>

            <p>
              Confira uma representação do conteúdo
              antes de salvar.
            </p>
          </div>

          <div className="personalizacao__preview-banner">
            <div className="personalizacao__preview-content">
              {formData.logo &&
                !previewLogoError && (
                  <img
                    src={formData.logo}
                    alt="Prévia do logo"
                    className="personalizacao__preview-logo"
                    onError={() =>
                      setPreviewLogoError(true)
                    }
                  />
                )}

              {formData.tag && (
                <span className="personalizacao__preview-tag">
                  {formData.tag}
                </span>
              )}

              <h4>
                {formData.titulo ||
                  "Título principal da loja"}
              </h4>

              <p>
                {formData.descricao ||
                  "A descrição principal será exibida neste espaço."}
              </p>

              <div className="personalizacao__preview-buttons">
                <span>
                  {formData.botaoPrincipalTexto ||
                    "Ver produtos"}
                </span>

                <a
                  href={linkWhatsAppPreview}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => {
                    if (
                      linkWhatsAppPreview === "#"
                    ) {
                      event.preventDefault();
                    }
                  }}
                >
                  {formData.botaoSecundarioTexto ||
                    "Falar no WhatsApp"}
                </a>
              </div>
            </div>

            <div className="personalizacao__preview-visual">
              {formData.imagem &&
              !previewImagemError ? (
                <img
                  src={formData.imagem}
                  alt={
                    formData.imagemAlt ||
                    "Prévia da imagem principal"
                  }
                  onError={() =>
                    setPreviewImagemError(true)
                  }
                />
              ) : (
                <div className="personalizacao__preview-placeholder">
                  <span>◇</span>

                  <small>
                    Imagem principal
                  </small>
                </div>
              )}

              {(formData.cardFlutuanteTitulo ||
                formData.cardFlutuanteTexto) && (
                <div className="personalizacao__preview-floating-card">
                  <span />

                  <div>
                    <strong>
                      {formData.cardFlutuanteTitulo ||
                        "Card flutuante"}
                    </strong>

                    <small>
                      {formData.cardFlutuanteTexto ||
                        "Texto do card"}
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}

export default Personalizacao;