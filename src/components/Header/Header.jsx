import {
  Link,
  NavLink,
} from "react-router-dom";

import {
  FaShoppingCart,
  FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import useSiteConfig from "../../hooks/useSiteConfig";

import "./Header.css";

function Header() {
  const { totalItens } = useCart();

  const { siteConfig } = useSiteConfig();

  const empresa = siteConfig?.empresa || {};

  const nomeEmpresa =
    empresa.nome ||
    siteConfig?.nomeEmpresa ||
    "PV Catalog";

  const logoEmpresa =
    empresa.logo ||
    siteConfig?.logo ||
    "";

  const numeroWhatsApp = String(
    empresa.whatsapp ||
      siteConfig?.whatsapp ||
      "",
  ).replace(/\D/g, "");

  const mensagemWhatsApp =
    encodeURIComponent(
      `Olá! Gostaria de mais informações sobre os produtos da ${nomeEmpresa}.`,
    );

  const linkWhatsApp = numeroWhatsApp
    ? `https://wa.me/${numeroWhatsApp}?text=${mensagemWhatsApp}`
    : "#";

  function definirClasseMenu({
    isActive,
  }) {
    return isActive
      ? "header-menu-link header-menu-link-active"
      : "header-menu-link";
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link
          to="/"
          className="header-brand"
          aria-label="Ir para o início"
        >
          {logoEmpresa && (
            <img
              src={logoEmpresa}
              alt={`Logo da ${nomeEmpresa}`}
              className="header-logo-image"
            />
          )}

          <span className="header-company-name">
            {nomeEmpresa}
          </span>
        </Link>

        <nav
          className="header-menu"
          aria-label="Menu principal"
        >
          <NavLink
            to="/"
            end
            className={definirClasseMenu}
          >
            Início
          </NavLink>

          <NavLink
            to="/catalogo"
            className={definirClasseMenu}
          >
            Produtos
          </NavLink>
        </nav>

        <div className="header-actions">
          <Link
            to="/carrinho"
            className="header-cart-button"
            aria-label={`Abrir carrinho com ${totalItens} itens`}
          >
            <FaShoppingCart />

            <span className="header-cart-text">
              Carrinho
            </span>

            {totalItens > 0 && (
              <span className="header-cart-count">
                {totalItens > 99
                  ? "99+"
                  : totalItens}
              </span>
            )}
          </Link>

          <a
            href={linkWhatsApp}
            target={
              numeroWhatsApp
                ? "_blank"
                : undefined
            }
            rel={
              numeroWhatsApp
                ? "noopener noreferrer"
                : undefined
            }
            className="header-whatsapp-button"
            aria-disabled={!numeroWhatsApp}
            onClick={(event) => {
              if (!numeroWhatsApp) {
                event.preventDefault();
              }
            }}
          >
            <FaWhatsapp />

            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;