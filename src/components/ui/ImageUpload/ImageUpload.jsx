import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import Button from "../Button";

import {
  uploadImagem,
} from "../../../services/storageService";

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

  const [arrastando, setArrastando] =
    useState(false);

  const [erroInterno, setErroInterno] =
    useState("");

  const [nomeArquivo, setNomeArquivo] =
    useState("");

  const [tamanhoArquivo, setTamanhoArquivo] =
    useState("");

  const [enviandoImagem, setEnviandoImagem] =
    useState(false);

  const [previewLocal, setPreviewLocal] =
    useState("");

  const bloqueado =
    disabled || enviandoImagem;

  const mensagemErro =
    error || erroInterno;

  const imagemExibida =
    previewLocal || value;

  useEffect(() => {
    return () => {
      if (previewLocal) {
        URL.revokeObjectURL(previewLocal);
      }
    };
  }, [previewLocal]);

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

  async function processarArquivo(arquivo) {
    if (bloqueado) {
      return;
    }

    const erroValidacao =
      validarArquivo(arquivo);

    if (erroValidacao) {
      setErroInterno(erroValidacao);
      return;
    }

    const novaPreview =
      URL.createObjectURL(arquivo);

    if (previewLocal) {
      URL.revokeObjectURL(previewLocal);
    }

    setPreviewLocal(novaPreview);
    setErroInterno("");
    setNomeArquivo(arquivo.name);
    setTamanhoArquivo(
      formatarTamanho(arquivo.size),
    );
    setEnviandoImagem(true);

    try {
      const urlPublica =
        await uploadImagem(arquivo);

      if (!urlPublica) {
        throw new Error(
          "O endereço da imagem não foi gerado.",
        );
      }

      emitirAlteracao(urlPublica);

      URL.revokeObjectURL(novaPreview);
      setPreviewLocal("");
    } catch (erroUpload) {
      console.error(
        "Erro ao enviar imagem:",
        erroUpload,
      );

      setErroInterno(
        erroUpload?.message ||
          "Não foi possível enviar a imagem.",
      );

      URL.revokeObjectURL(novaPreview);
      setPreviewLocal("");
      setNomeArquivo("");
      setTamanhoArquivo("");
    } finally {
      setEnviandoImagem(false);
    }
  }

  function selecionarArquivo(event) {
    const arquivo =
      event.target.files?.[0];

    processarArquivo(arquivo);

    event.target.value = "";
  }

  function abrirSeletor() {
    if (bloqueado) {
      return;
    }

    inputRef.current?.click();
  }

  function aoArrastarSobre(event) {
    event.preventDefault();

    if (!bloqueado) {
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

    if (bloqueado) {
      return;
    }

    const arquivo =
      event.dataTransfer.files?.[0];

    processarArquivo(arquivo);
  }

  function removerImagem() {
    if (bloqueado) {
      return;
    }

    if (previewLocal) {
      URL.revokeObjectURL(previewLocal);
    }

    setErroInterno("");
    setNomeArquivo("");
    setTamanhoArquivo("");
    setPreviewLocal("");

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
        bloqueado
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
        disabled={bloqueado}
        onChange={selecionarArquivo}
      />

      {imagemExibida ? (
        <div className="pv-image-upload__preview">
          <div className="pv-image-upload__preview-image">
            <img
              src={imagemExibida}
              alt="Pré-visualização da imagem selecionada"
            />
          </div>

          <div className="pv-image-upload__preview-content">
            <span className="pv-image-upload__success">
              {enviandoImagem
                ? "Enviando imagem..."
                : "Imagem carregada"}
            </span>

            <strong>
              {nomeArquivo ||
                "Imagem do produto"}
            </strong>

            {tamanhoArquivo && (
              <small>{tamanhoArquivo}</small>
            )}

            <div className="pv-image-upload__actions">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={bloqueado}
                onClick={abrirSeletor}
              >
                Trocar imagem
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={bloqueado}
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
          tabIndex={bloqueado ? -1 : 0}
          aria-disabled={bloqueado}
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
            {enviandoImagem
              ? "Enviando imagem..."
              : "Arraste uma imagem aqui"}
          </strong>

          {!enviandoImagem && (
            <>
              <span>ou</span>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={bloqueado}
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
            </>
          )}
        </div>
      )}

      {mensagemErro ? (
        <span className="pv-image-upload__error">
          {mensagemErro}
        </span>
      ) : (
        helperText && (
          <span className="pv-image-upload__helper">
            {enviandoImagem
              ? "Aguarde o envio terminar antes de salvar o produto."
              : helperText}
          </span>
        )
      )}
    </div>
  );
}

export default ImageUpload;