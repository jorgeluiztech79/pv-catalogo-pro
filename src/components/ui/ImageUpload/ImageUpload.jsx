import { useId, useRef, useState } from "react";

import Button from "../Button";

import "./ImageUpload.css";

const TIPOS_PERMITIDOS = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const TAMANHO_MAXIMO_BYTES = 3 * 1024 * 1024;

function formatarTamanho(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "";
  }

  const megabytes = bytes / (1024 * 1024);

  return `${megabytes.toFixed(2)} MB`;
}

function ImageUpload({
  value = "",
  onChange,
  label = "Imagem do produto",
  helperText = "PNG, JPG, JPEG ou WEBP. Tamanho máximo: 3 MB.",
  error = "",
  disabled = false,
}) {
  const inputId = useId();
  const inputRef = useRef(null);

  const [arrastando, setArrastando] = useState(false);
  const [erroInterno, setErroInterno] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [tamanhoArquivo, setTamanhoArquivo] = useState("");

  const mensagemErro = error || erroInterno;

  function emitirAlteracao(novoValor) {
    if (typeof onChange === "function") {
      onChange(novoValor);
    }
  }

  function validarArquivo(arquivo) {
    if (!arquivo) {
      return "Nenhum arquivo foi selecionado.";
    }

    if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
      return "Formato inválido. Utilize PNG, JPG, JPEG ou WEBP.";
    }

    if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
      return "A imagem deve possuir no máximo 3 MB.";
    }

    return "";
  }

  function processarArquivo(arquivo) {
    if (disabled) {
      return;
    }

    const erroValidacao = validarArquivo(arquivo);

    if (erroValidacao) {
      setErroInterno(erroValidacao);
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      const resultado = String(leitor.result || "");

      setErroInterno("");
      setNomeArquivo(arquivo.name);
      setTamanhoArquivo(formatarTamanho(arquivo.size));

      emitirAlteracao(resultado);
    };

    leitor.onerror = () => {
      setErroInterno(
        "Não foi possível carregar a imagem selecionada.",
      );
    };

    leitor.readAsDataURL(arquivo);
  }

  function selecionarArquivo(event) {
    const arquivo = event.target.files?.[0];

    processarArquivo(arquivo);

    event.target.value = "";
  }

  function abrirSeletor() {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  }

  function aoArrastarSobre(event) {
    event.preventDefault();

    if (!disabled) {
      setArrastando(true);
    }
  }

  function aoSairDaArea(event) {
    event.preventDefault();

    setArrastando(false);
  }

  function aoSoltar(event) {
    event.preventDefault();

    setArrastando(false);

    if (disabled) {
      return;
    }

    const arquivo = event.dataTransfer.files?.[0];

    processarArquivo(arquivo);
  }

  function removerImagem() {
    if (disabled) {
      return;
    }

    setErroInterno("");
    setNomeArquivo("");
    setTamanhoArquivo("");

    emitirAlteracao("");
  }

  function aoPressionarTecla(event) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      abrirSeletor();
    }
  }

  return (
    <div
      className={`pv-image-upload ${
        disabled
          ? "pv-image-upload--disabled"
          : ""
      }`}
    >
      {label && (
        <label
          className="pv-image-upload__label"
          htmlFor={inputId}
        >
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        className="pv-image-upload__input"
        disabled={disabled}
        onChange={selecionarArquivo}
      />

      {value ? (
        <div className="pv-image-upload__preview">
          <div className="pv-image-upload__preview-image">
            <img
              src={value}
              alt="Pré-visualização da imagem selecionada"
            />
          </div>

          <div className="pv-image-upload__preview-content">
            <span className="pv-image-upload__success">
              Imagem carregada
            </span>

            <strong>
              {nomeArquivo || "Imagem do produto"}
            </strong>

            {tamanhoArquivo && (
              <small>{tamanhoArquivo}</small>
            )}

            <div className="pv-image-upload__actions">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={disabled}
                onClick={abrirSeletor}
              >
                Trocar imagem
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                className="pv-image-upload__remove"
                onClick={removerImagem}
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`pv-image-upload__dropzone ${
            arrastando
              ? "pv-image-upload__dropzone--active"
              : ""
          } ${
            mensagemErro
              ? "pv-image-upload__dropzone--error"
              : ""
          }`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={abrirSeletor}
          onKeyDown={aoPressionarTecla}
          onDragEnter={aoArrastarSobre}
          onDragOver={aoArrastarSobre}
          onDragLeave={aoSairDaArea}
          onDrop={aoSoltar}
        >
          <span
            className="pv-image-upload__icon"
            aria-hidden="true"
          >
            ↑
          </span>

          <strong>
            Arraste uma imagem aqui
          </strong>

          <span>ou</span>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              abrirSeletor();
            }}
          >
            Selecionar arquivo
          </Button>

          <small>
            PNG, JPG, JPEG ou WEBP
          </small>
        </div>
      )}

      {mensagemErro ? (
        <span className="pv-image-upload__error">
          {mensagemErro}
        </span>
      ) : (
        helperText && (
          <span className="pv-image-upload__helper">
            {helperText}
          </span>
        )
      )}
    </div>
  );
}

export default ImageUpload;