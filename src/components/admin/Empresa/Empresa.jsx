import { useEffect, useState } from "react";

import useSiteConfig from "../../../hooks/useSiteConfig";

import Button from "../../ui/Button";
import ImageUpload from "../../ui/ImageUpload";
import Input from "../../ui/Input";

import "./Empresa.css";

function criarEstadoInicial(siteConfig) {
  const empresa = siteConfig?.empresa || {};

  return {
    nome:
      empresa.nome ||
      siteConfig?.nomeEmpresa ||
      "",

    logo:
      empresa.logo ||
      siteConfig?.logo ||
      "",

    whatsapp:
      empresa.whatsapp ||
      siteConfig?.whatsapp ||
      "",

    email:
      empresa.email || "",

    instagram:
      empresa.instagram || "",

    facebook:
      empresa.facebook || "",

    telefone:
      empresa.telefone || "",

    cnpj:
      empresa.cnpj || "",

    endereco:
      empresa.endereco || "",

    cidade:
      empresa.cidade || "",

    estado:
      empresa.estado || "",

    cep:
      empresa.cep || "",

    descricao:
      empresa.descricao ||
      siteConfig?.descricaoEmpresa ||
      "",
  };
}

function apenasNumeros(valor = "") {
  return String(valor).replace(/\D/g, "");
}

function Empresa() {
  const {
    siteConfig,
    atualizarEmpresa,
    restaurarConfiguracoes,
  } = useSiteConfig();

  const [formData, setFormData] = useState(() =>
    criarEstadoInicial(siteConfig),
  );

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [errors, setErrors] = useState({});
  const [previewError, setPreviewError] =
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

    setErrors((errosAtuais) => ({
      ...errosAtuais,
      [name]: "",
    }));

    if (name === "logo") {
      setPreviewError(false);
    }
  }

  function atualizarLogo(valor) {
    setFormData((dadosAtuais) => ({
      ...dadosAtuais,
      logo: valor,
    }));

    setPreviewError(false);

    setErrors((errosAtuais) => ({
      ...errosAtuais,
      logo: "",
    }));
  }

  function validarFormulario() {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome =
        "Informe o nome da empresa.";
    }

    const numeroWhatsApp = apenasNumeros(
      formData.whatsapp,
    );

    if (!numeroWhatsApp) {
      novosErros.whatsapp =
        "Informe o número do WhatsApp.";
    } else if (numeroWhatsApp.length < 10) {
      novosErros.whatsapp =
        "Informe um número válido com DDD.";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email,
      )
    ) {
      novosErros.email =
        "Informe um e-mail válido.";
    }

    setErrors(novosErros);

    return (
      Object.keys(novosErros).length === 0
    );
  }

  function mostrarMensagem(texto) {
    setMensagem(texto);

    window.setTimeout(() => {
      setMensagem("");
    }, 3000);
  }

  function salvarEmpresa(event) {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setSalvando(true);

    atualizarEmpresa({
      nome: formData.nome.trim(),

      logo: formData.logo.trim(),

      whatsapp: apenasNumeros(
        formData.whatsapp,
      ),

      email: formData.email.trim(),

      instagram: formData.instagram.trim(),

      facebook: formData.facebook.trim(),

      telefone: formData.telefone.trim(),

      cnpj: formData.cnpj.trim(),

      endereco: formData.endereco.trim(),

      cidade: formData.cidade.trim(),

      estado: formData.estado.trim(),

      cep: formData.cep.trim(),

      descricao: formData.descricao.trim(),
    });

    window.setTimeout(() => {
      setSalvando(false);

      mostrarMensagem(
        "Dados da empresa salvos com sucesso.",
      );
    }, 500);
  }

  function restaurarPadrao() {
    const confirmar = window.confirm(
      "Deseja restaurar todas as configurações originais da loja?",
    );

    if (!confirmar) {
      return;
    }

    restaurarConfiguracoes();

    mostrarMensagem(
      "Configurações originais restauradas.",
    );
  }

  const nomePreview =
    formData.nome.trim() ||
    "Nome da empresa";

  const descricaoPreview =
    formData.descricao.trim() ||
    "Descrição comercial da empresa.";

  const whatsappPreview =
    apenasNumeros(formData.whatsapp);

  return (
    <section className="empresa-admin">
      {mensagem && (
        <div
          className="empresa-admin__message"
          role="status"
        >
          <span>✓</span>

          {mensagem}
        </div>
      )}

      <header className="empresa-admin__header">
        <div>
          <span className="admin-eyebrow">
            Identidade da loja
          </span>

          <h2>Dados da empresa</h2>

          <p>
            Altere o nome, logo, contatos e
            informações comerciais exibidas na loja.
          </p>
        </div>

        <div className="empresa-admin__header-actions">
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
            form="empresa-admin-form"
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
        id="empresa-admin-form"
        className="empresa-admin__content"
        onSubmit={salvarEmpresa}
        noValidate
      >
        <div className="empresa-admin__fields">
          <section className="empresa-admin__section">
            <div className="empresa-admin__section-header">
              <span className="empresa-admin__section-number">
                01
              </span>

              <div>
                <h3>Identidade da empresa</h3>

                <p>
                  Configure o nome, a descrição e o
                  logo apresentados aos clientes.
                </p>
              </div>
            </div>

            <div className="empresa-admin__grid">
              <div className="empresa-admin__field-full">
                <Input
                  name="nome"
                  label="Nome da empresa"
                  value={formData.nome}
                  placeholder="Ex.: Comunidade Maromba"
                  error={errors.nome}
                  required
                  maxLength={80}
                  onChange={handleChange}
                />
              </div>

              <div className="empresa-admin__field-full">
                <label
                  className="empresa-admin__label"
                  htmlFor="empresa-descricao"
                >
                  Descrição da empresa
                </label>

                <textarea
                  id="empresa-descricao"
                  name="descricao"
                  value={formData.descricao}
                  rows="5"
                  maxLength="500"
                  placeholder="Apresente a empresa e seus principais diferenciais..."
                  className="empresa-admin__textarea"
                  onChange={handleChange}
                />

                <span className="empresa-admin__counter">
                  {formData.descricao.length}/500
                </span>
              </div>

              <div className="empresa-admin__field-full">
                <ImageUpload
                  label="Logo da empresa"
                  value={formData.logo}
                  onChange={atualizarLogo}
                  helperText="PNG, JPG, JPEG ou WEBP. Recomenda-se fundo transparente."
                  disabled={salvando}
                />
              </div>

              <div className="empresa-admin__field-full">
                <div className="empresa-admin__divider">
                  <span>ou informe uma URL</span>
                </div>
              </div>

              <div className="empresa-admin__field-full">
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
                  helperText="Use esta opção apenas para imagens hospedadas na internet."
                  iconLeft="↗"
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="empresa-admin__section">
            <div className="empresa-admin__section-header">
              <span className="empresa-admin__section-number">
                02
              </span>

              <div>
                <h3>Contato</h3>

                <p>
                  Informe os canais utilizados para
                  atendimento aos clientes.
                </p>
              </div>
            </div>

            <div className="empresa-admin__grid">
              <div className="empresa-admin__field">
                <Input
                  name="whatsapp"
                  label="WhatsApp"
                  value={formData.whatsapp}
                  placeholder="5521999999999"
                  error={errors.whatsapp}
                  helperText="Informe o código do país, DDD e número."
                  required
                  maxLength={20}
                  onChange={handleChange}
                />
              </div>

              <div className="empresa-admin__field">
                <Input
                  name="telefone"
                  label="Telefone"
                  value={formData.telefone}
                  placeholder="(21) 99999-9999"
                  maxLength={25}
                  onChange={handleChange}
                />
              </div>

              <div className="empresa-admin__field-full">
                <Input
                  name="email"
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  placeholder="contato@empresa.com.br"
                  error={errors.email}
                  maxLength={120}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="empresa-admin__section">
            <div className="empresa-admin__section-header">
              <span className="empresa-admin__section-number">
                03
              </span>

              <div>
                <h3>Redes sociais</h3>

                <p>
                  Cadastre os endereços das redes
                  sociais da empresa.
                </p>
              </div>
            </div>

            <div className="empresa-admin__grid">
              <div className="empresa-admin__field">
                <Input
                  name="instagram"
                  label="Instagram"
                  value={formData.instagram}
                  placeholder="@suaempresa"
                  maxLength={120}
                  onChange={handleChange}
                />
              </div>

              <div className="empresa-admin__field">
                <Input
                  name="facebook"
                  label="Facebook"
                  value={formData.facebook}
                  placeholder="facebook.com/suaempresa"
                  maxLength={160}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="empresa-admin__section">
            <div className="empresa-admin__section-header">
              <span className="empresa-admin__section-number">
                04
              </span>

              <div>
                <h3>Dados comerciais</h3>

                <p>
                  Informações opcionais para identificação
                  e localização da empresa.
                </p>
              </div>
            </div>

            <div className="empresa-admin__grid">
              <div className="empresa-admin__field">
                <Input
                  name="cnpj"
                  label="CNPJ"
                  value={formData.cnpj}
                  placeholder="00.000.000/0001-00"
                  maxLength={25}
                  onChange={handleChange}
                />
              </div>

              <div className="empresa-admin__field">
                <Input
                  name="cep"
                  label="CEP"
                  value={formData.cep}
                  placeholder="00000-000"
                  maxLength={12}
                  onChange={handleChange}
                />
              </div>

              <div className="empresa-admin__field-full">
                <Input
                  name="endereco"
                  label="Endereço"
                  value={formData.endereco}
                  placeholder="Rua, número, complemento e bairro"
                  maxLength={180}
                  onChange={handleChange}
                />
              </div>

              <div className="empresa-admin__field">
                <Input
                  name="cidade"
                  label="Cidade"
                  value={formData.cidade}
                  placeholder="Rio de Janeiro"
                  maxLength={80}
                  onChange={handleChange}
                />
              </div>

              <div className="empresa-admin__field">
                <Input
                  name="estado"
                  label="Estado"
                  value={formData.estado}
                  placeholder="RJ"
                  maxLength={30}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <div className="empresa-admin__footer">
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

        <aside className="empresa-admin__preview">
          <div className="empresa-admin__preview-header">
            <span className="admin-eyebrow">
              Pré-visualização
            </span>

            <h3>Cabeçalho da loja</h3>

            <p>
              Confira como o nome e o logo serão
              apresentados aos clientes.
            </p>
          </div>

          <div className="empresa-admin__preview-card">
            <div className="empresa-admin__preview-brand">
              {formData.logo &&
              !previewError ? (
                <img
                  src={formData.logo}
                  alt={`Logo da ${nomePreview}`}
                  onError={() =>
                    setPreviewError(true)
                  }
                />
              ) : (
                <span>
                  {nomePreview
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}

              <strong>{nomePreview}</strong>
            </div>

            <p>{descricaoPreview}</p>

            <div className="empresa-admin__preview-info">
              <div>
                <span>WhatsApp</span>

                <strong>
                  {whatsappPreview ||
                    "Não informado"}
                </strong>
              </div>

              <div>
                <span>E-mail</span>

                <strong>
                  {formData.email ||
                    "Não informado"}
                </strong>
              </div>
            </div>

            <div className="empresa-admin__preview-actions">
              <span>Início</span>
              <span>Produtos</span>
              <strong>WhatsApp</strong>
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}

export default Empresa;