import { Link } from "react-router-dom";

import useSiteConfig from "../../hooks/useSiteConfig";

import "./Hero.css";

function Hero() {
  const { siteConfig } = useSiteConfig();

  const { empresa, hero } = siteConfig;

  const numeroWhatsApp = String(
    empresa?.whatsapp || "",
  ).replace(/\D/g, "");

  const mensagemWhatsApp = encodeURIComponent(
    hero?.botaoSecundario?.mensagem ||
      "Olá! Gostaria de mais informações.",
  );

  const linkWhatsApp = numeroWhatsApp
    ? `https://wa.me/${numeroWhatsApp}?text=${mensagemWhatsApp}`
    : "#";

  return (
    <section className="hero">
      <div className="hero__glow hero__glow--left" />

      <div className="hero__glow hero__glow--right" />

      <div className="hero__content">
        {hero?.logo && (
          <img
            src={hero.logo}
            alt={`Logo da ${
              empresa?.nome || "empresa"
            }`}
            className="hero__logo"
          />
        )}

        {hero?.tag && (
          <span className="hero__tag">
            {hero.tag}
          </span>
        )}

        <h1 className="hero__title">
          {hero?.titulo ||
            "Tecnologia, qualidade e atendimento especializado."}
        </h1>

        <p className="hero__description">
          {hero?.descricao ||
            "Conheça nossos produtos e fale diretamente com nossa equipe."}
        </p>

        <div className="hero__buttons">
          <Link
            to={
              hero?.botaoPrincipal?.link ||
              "/catalogo"
            }
            className="hero__button hero__button--primary"
          >
            {hero?.botaoPrincipal?.texto ||
              "Ver produtos"}
          </Link>

          <a
            href={linkWhatsApp}
            className="hero__button hero__button--secondary"
            target={
              numeroWhatsApp ? "_blank" : undefined
            }
            rel={
              numeroWhatsApp
                ? "noopener noreferrer"
                : undefined
            }
            aria-disabled={!numeroWhatsApp}
            onClick={(event) => {
              if (!numeroWhatsApp) {
                event.preventDefault();
              }
            }}
          >
            {hero?.botaoSecundario?.texto ||
              "Falar no WhatsApp"}
          </a>
        </div>

        {hero?.destaques?.length > 0 && (
          <div className="hero__highlights">
            {hero.destaques.map((destaque) => (
              <div
                className="hero__highlight"
                key={destaque.id}
              >
                <strong>
                  {destaque.titulo}
                </strong>

                <span>
                  {destaque.texto}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hero__visual">
        <div className="hero__image-wrapper">
          <div className="hero__image-ring" />

          {hero?.imagem && (
            <img
              src={hero.imagem}
              alt={
                hero.imagemAlt ||
                "Imagem principal da loja"
              }
              className="hero__image"
            />
          )}

          {(hero?.cardFlutuante?.titulo ||
            hero?.cardFlutuante?.texto) && (
            <div className="hero__floating-card">
              <span className="hero__floating-dot" />

              <div>
                {hero?.cardFlutuante?.titulo && (
                  <strong>
                    {
                      hero.cardFlutuante
                        .titulo
                    }
                  </strong>
                )}

                {hero?.cardFlutuante?.texto && (
                  <p>
                    {
                      hero.cardFlutuante
                        .texto
                    }
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;