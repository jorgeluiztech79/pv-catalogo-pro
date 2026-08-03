import { useEffect, useState } from "react";

import Button from "../../ui/Button";
import ImageUpload from "../../ui/ImageUpload";
import Input from "../../ui/Input";

import "./ProductForm.css";

const categoriasDisponiveis = [
  "EMAGRECEDORES",
  "BELEZA",
  "PERFORMANCE",
  "HORMÔNIOS",
];

const produtoInicial = {
  nome: "",
  categoria: "",
  preco: "",
  estoque: "",
  descricao: "",
  imagem: "",
  disponivel: true,
};

function normalizarProduto(produto) {
  return {
    nome: produto?.nome || "",
    categoria: produto?.categoria || "",

    preco:
      produto?.preco !== undefined &&
      produto?.preco !== null
        ? String(produto.preco)
        : "",

    estoque:
      produto?.estoque !== undefined &&
      produto?.estoque !== null
        ? String(produto.estoque)
        : "",

    descricao: produto?.descricao || "",
    imagem: produto?.imagem || "",

    disponivel:
      produto?.disponivel !== undefined
        ? Boolean(produto.disponivel)
        : true,
  };
}

function ProductForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] =
    useState(produtoInicial);

  const [errors, setErrors] = useState({});
  const [previewError, setPreviewError] =
    useState(false);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    setFormData(
      initialData
        ? normalizarProduto(initialData)
        : produtoInicial,
    );

    setErrors({});
    setPreviewError(false);
  }, [initialData]);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    const newValue =
      type === "checkbox" ? checked : value;

    setFormData((currentData) => {
      const updatedData = {
        ...currentData,
        [name]: newValue,
      };

      if (name === "estoque" && value !== "") {
        const quantidade = Number(value);

        if (
          Number.isFinite(quantidade) &&
          quantidade <= 0
        ) {
          updatedData.disponivel = false;
        }
      }

      return updatedData;
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    if (name === "imagem") {
      setPreviewError(false);
    }
  }

  function handleImageUpload(novaImagem) {
    setFormData((currentData) => ({
      ...currentData,
      imagem: novaImagem,
    }));

    setPreviewError(false);

    setErrors((currentErrors) => ({
      ...currentErrors,
      imagem: "",
    }));
  }

  function validarFormulario() {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome =
        "Informe o nome do produto.";
    }

    if (!formData.categoria) {
      newErrors.categoria =
        "Selecione uma categoria.";
    }

    if (
      formData.preco === "" ||
      Number(formData.preco) <= 0
    ) {
      newErrors.preco =
        "Informe um preço maior que zero.";
    }

    if (
      formData.estoque !== "" &&
      Number(formData.estoque) < 0
    ) {
      newErrors.estoque =
        "A quantidade não pode ser negativa.";
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao =
        "Informe uma descrição para o produto.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const estoqueFormatado =
      formData.estoque === ""
        ? null
        : Math.max(0, Number(formData.estoque));

    const produtoFormatado = {
      ...initialData,

      nome: formData.nome.trim(),
      categoria: formData.categoria,
      preco: Number(formData.preco),

      estoque: estoqueFormatado,

      descricao: formData.descricao.trim(),
      imagem: formData.imagem.trim(),

      disponivel:
        estoqueFormatado === 0
          ? false
          : formData.disponivel,
    };

    if (typeof onSubmit === "function") {
      onSubmit(produtoFormatado);
    }
  }

  function handleCancel() {
    setErrors({});

    if (typeof onCancel === "function") {
      onCancel();
    }
  }

  const estoqueControlado =
    formData.estoque !== "";

  const quantidadeEstoque =
    estoqueControlado
      ? Number(formData.estoque)
      : null;

  const produtoDisponivel =
    quantidadeEstoque === 0
      ? false
      : formData.disponivel;

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="product-form__header">
        <div>
          <span className="admin-eyebrow">
            {isEditing
              ? "Edição de produto"
              : "Novo produto"}
          </span>

          <h2>
            {isEditing
              ? "Editar produto"
              : "Cadastrar produto"}
          </h2>

          <p>
            Preencha as informações que serão
            apresentadas no catálogo público.
          </p>
        </div>

        <span
          className={`product-form__status ${
            produtoDisponivel
              ? "product-form__status--available"
              : "product-form__status--unavailable"
          }`}
        >
          {produtoDisponivel
            ? "Disponível"
            : "Esgotado"}
        </span>
      </div>

      <div className="product-form__body">
        <div className="product-form__fields">
          <section className="product-form__section">
            <div className="product-form__section-header">
              <span className="product-form__section-number">
                01
              </span>

              <div>
                <h3>Informações principais</h3>

                <p>
                  Dados utilizados para identificar e
                  organizar o produto.
                </p>
              </div>
            </div>

            <div className="product-form__grid">
              <div className="product-form__field--full">
                <Input
                  name="nome"
                  label="Nome do produto"
                  placeholder="Ex.: Tirzepatida"
                  value={formData.nome}
                  error={errors.nome}
                  required
                  maxLength={100}
                  onChange={handleChange}
                />
              </div>

              <div className="product-form__field">
                <label
                  className="product-form__label"
                  htmlFor="product-category"
                >
                  Categoria
                  <span aria-hidden="true">*</span>
                </label>

                <div className="product-form__select-control">
                  <select
                    id="product-category"
                    name="categoria"
                    value={formData.categoria}
                    className={`product-form__select ${
                      errors.categoria
                        ? "product-form__select--error"
                        : ""
                    }`}
                    onChange={handleChange}
                    aria-invalid={Boolean(
                      errors.categoria,
                    )}
                    aria-describedby={
                      errors.categoria
                        ? "product-category-error"
                        : undefined
                    }
                  >
                    <option value="">
                      Selecione uma categoria
                    </option>

                    {categoriasDisponiveis.map(
                      (categoria) => (
                        <option
                          value={categoria}
                          key={categoria}
                        >
                          {categoria}
                        </option>
                      ),
                    )}
                  </select>

                  <span
                    className="product-form__select-arrow"
                    aria-hidden="true"
                  >
                    ⌄
                  </span>
                </div>

                {errors.categoria && (
                  <span
                    id="product-category-error"
                    className="product-form__error"
                  >
                    {errors.categoria}
                  </span>
                )}
              </div>

              <div className="product-form__field">
                <Input
                  name="preco"
                  label="Preço"
                  type="number"
                  placeholder="0,00"
                  value={formData.preco}
                  error={errors.preco}
                  required
                  min="0"
                  step="0.01"
                  iconLeft="R$"
                  onChange={handleChange}
                />
              </div>

              <div className="product-form__field--full">
                <Input
                  name="estoque"
                  label="Quantidade em estoque"
                  type="number"
                  placeholder="Ex.: 10"
                  value={formData.estoque}
                  error={errors.estoque}
                  helperText="Deixe vazio caso não queira controlar a quantidade."
                  min="0"
                  step="1"
                  iconLeft="□"
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="product-form__section">
            <div className="product-form__section-header">
              <span className="product-form__section-number">
                02
              </span>

              <div>
                <h3>Apresentação no catálogo</h3>

                <p>
                  Descrição comercial e imagem
                  exibidas para os clientes.
                </p>
              </div>
            </div>

            <div className="product-form__grid">
              <div className="product-form__field--full">
                <label
                  className="product-form__label"
                  htmlFor="product-description"
                >
                  Descrição
                  <span aria-hidden="true">*</span>
                </label>

                <textarea
                  id="product-description"
                  name="descricao"
                  value={formData.descricao}
                  placeholder="Informe os principais detalhes do produto..."
                  className={`product-form__textarea ${
                    errors.descricao
                      ? "product-form__textarea--error"
                      : ""
                  }`}
                  rows="5"
                  maxLength="500"
                  onChange={handleChange}
                  aria-invalid={Boolean(
                    errors.descricao,
                  )}
                  aria-describedby={
                    errors.descricao
                      ? "product-description-error"
                      : "product-description-counter"
                  }
                />

                <div className="product-form__field-footer">
                  {errors.descricao ? (
                    <span
                      id="product-description-error"
                      className="product-form__error"
                    >
                      {errors.descricao}
                    </span>
                  ) : (
                    <span />
                  )}

                  <span
                    id="product-description-counter"
                    className="product-form__counter"
                  >
                    {formData.descricao.length}/500
                  </span>
                </div>
              </div>

              <div className="product-form__field--full">
                <ImageUpload
                  value={formData.imagem}
                  onChange={handleImageUpload}
                  error={errors.imagem}
                  disabled={loading}
                />
              </div>

              <div className="product-form__field--full">
                <div className="product-form__image-divider">
                  <span>ou use uma URL</span>
                </div>
              </div>

              <div className="product-form__field--full">
                <Input
                  name="imagem"
                  label="URL da imagem"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={
                    formData.imagem.startsWith("data:")
                      ? ""
                      : formData.imagem
                  }
                  helperText="Opção alternativa: cole o endereço completo da imagem."
                  iconLeft="↗"
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="product-form__section">
            <div className="product-form__section-header">
              <span className="product-form__section-number">
                03
              </span>

              <div>
                <h3>Disponibilidade</h3>

                <p>
                  Defina se o produto poderá ser
                  solicitado pelos clientes.
                </p>
              </div>
            </div>

            <label className="product-form__availability">
              <input
                type="checkbox"
                name="disponivel"
                checked={produtoDisponivel}
                disabled={quantidadeEstoque === 0}
                onChange={handleChange}
              />

              <span
                className="product-form__switch"
                aria-hidden="true"
              >
                <span />
              </span>

              <span className="product-form__availability-content">
                <strong>
                  Produto disponível para venda
                </strong>

                <small>
                  {quantidadeEstoque === 0
                    ? "A quantidade está zerada. O produto será exibido como esgotado."
                    : "Quando desativado, o item será apresentado como esgotado no catálogo."}
                </small>
              </span>
            </label>
          </section>
        </div>

        <aside className="product-form__preview">
          <div className="product-form__preview-header">
            <span className="admin-eyebrow">
              Pré-visualização
            </span>

            <h3>Card do produto</h3>

            <p>
              Exemplo de como o item será
              apresentado no catálogo.
            </p>
          </div>

          <article className="product-form__preview-card">
            <div className="product-form__preview-image">
              {formData.imagem &&
              !previewError ? (
                <img
                  src={formData.imagem}
                  alt={
                    formData.nome ||
                    "Pré-visualização do produto"
                  }
                  onError={() =>
                    setPreviewError(true)
                  }
                />
              ) : (
                <div className="product-form__image-placeholder">
                  <span>◇</span>

                  <small>
                    {previewError
                      ? "Imagem indisponível"
                      : "Prévia da imagem"}
                  </small>
                </div>
              )}

              <span
                className={`product-form__preview-badge ${
                  produtoDisponivel
                    ? "product-form__preview-badge--available"
                    : "product-form__preview-badge--unavailable"
                }`}
              >
                {produtoDisponivel
                  ? "Disponível"
                  : "Esgotado"}
              </span>
            </div>

            <div className="product-form__preview-content">
              <span className="product-form__preview-category">
                {formData.categoria ||
                  "Categoria do produto"}
              </span>

              <h4>
                {formData.nome ||
                  "Nome do produto"}
              </h4>

              <p>
                {formData.descricao ||
                  "A descrição do produto será apresentada neste espaço."}
              </p>

              <strong>
                {formData.preco
                  ? Number(
                      formData.preco,
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "R$ 0,00"}
              </strong>

              <span className="product-form__preview-stock">
                {estoqueControlado
                  ? `${Math.max(
                      0,
                      Number(
                        formData.estoque || 0,
                      ),
                    )} unidade(s) em estoque`
                  : "Estoque não controlado"}
              </span>
            </div>
          </article>
        </aside>
      </div>

      <div className="product-form__footer">
        <Button
          type="button"
          variant="secondary"
          size="md"
          disabled={loading}
          onClick={handleCancel}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          loadingText="Salvando produto..."
          iconLeft={isEditing ? "✓" : "＋"}
        >
          {isEditing
            ? "Salvar alterações"
            : "Cadastrar produto"}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;