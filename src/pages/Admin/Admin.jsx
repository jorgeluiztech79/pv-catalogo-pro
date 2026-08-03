import { useState } from "react";

import Empresa from "../../components/admin/Empresa";
import Personalizacao from "../../components/admin/Personalizacao";
import ProductManager from "../../components/admin/ProductManager";
import Button from "../../components/ui/Button";

import useProducts from "../../hooks/useProducts";

import "./Admin.css";

const menuAdmin = [
  {
    id: "dashboard",
    titulo: "Dashboard",
    icone: "▦",
    descricao: "Visão geral da operação",
  },
  {
    id: "produtos",
    titulo: "Produtos",
    icone: "□",
    descricao: "Cadastro e gerenciamento",
  },
  {
    id: "categorias",
    titulo: "Categorias",
    icone: "◇",
    descricao: "Categorias e subcategorias",
  },
  {
    id: "empresa",
    titulo: "Empresa",
    icone: "⌂",
    descricao: "Logo e dados da loja",
  },
  {
    id: "personalizacao",
    titulo: "Personalização",
    icone: "▤",
    descricao: "Conteúdo da página inicial",
  },
  {
    id: "pedidos",
    titulo: "Pedidos",
    icone: "◎",
    descricao: "Solicitações dos clientes",
  },
  {
    id: "configuracoes",
    titulo: "Configurações",
    icone: "⚙",
    descricao: "Aparência e funcionamento",
  },
];

const atividades = [
  {
    titulo: "Catálogo conectado",
    descricao:
      "Os produtos cadastrados no painel são apresentados automaticamente na loja.",
    horario: "Concluído",
  },
  {
    titulo: "Personalização conectada",
    descricao:
      "Textos e imagens da página inicial podem ser alterados pelo painel.",
    horario: "Concluído",
  },
  {
    titulo: "Empresa conectada",
    descricao:
      "Nome, logo, WhatsApp e informações comerciais podem ser gerenciados pelo administrador.",
    horario: "Atualizado",
  },
];

function Dashboard({
  indicadores,
  onSelecionarModulo,
}) {
  const cardsIndicadores = [
    {
      titulo: "Produtos cadastrados",
      valor: indicadores.total,
      detalhe: "Total de produtos ativos",
      icone: "□",
    },
    {
      titulo: "Produtos disponíveis",
      valor: indicadores.disponiveis,
      detalhe: "Prontos para venda",
      icone: "✓",
    },
    {
      titulo: "Produtos esgotados",
      valor: indicadores.esgotados,
      detalhe: "Necessitam atualização",
      icone: "!",
    },
    {
      titulo: "Categorias",
      valor: indicadores.categorias,
      detalhe: "Categorias principais",
      icone: "◇",
    },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-welcome">
        <div>
          <span className="admin-eyebrow">
            Visão geral
          </span>

          <h2>Bem-vindo ao PV Catalog Pro</h2>

          <p>
            Gerencie sua loja, seus produtos e suas
            configurações em um único lugar.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          iconLeft="＋"
          className="admin-primary-button"
          onClick={() =>
            onSelecionarModulo("produtos")
          }
        >
          Novo produto
        </Button>
      </section>

      <section className="admin-indicators">
        {cardsIndicadores.map((indicador) => (
          <article
            className="admin-indicator-card"
            key={indicador.titulo}
          >
            <div className="admin-indicator-header">
              <span className="admin-indicator-icon">
                {indicador.icone}
              </span>

              <span className="admin-indicator-status">
                Atualizado
              </span>
            </div>

            <strong>{indicador.valor}</strong>

            <h3>{indicador.titulo}</h3>

            <p>{indicador.detalhe}</p>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span className="admin-eyebrow">
                Atividade
              </span>

              <h3>Últimas atualizações</h3>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="admin-text-button"
            >
              Ver todas
            </Button>
          </div>

          <div className="admin-activity-list">
            {atividades.map((atividade) => (
              <div
                className="admin-activity-item"
                key={atividade.titulo}
              >
                <span className="admin-activity-marker" />

                <div className="admin-activity-content">
                  <strong>
                    {atividade.titulo}
                  </strong>

                  <p>{atividade.descricao}</p>
                </div>

                <span className="admin-activity-time">
                  {atividade.horario}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel admin-quick-panel">
          <div className="admin-panel-header">
            <div>
              <span className="admin-eyebrow">
                Atalhos
              </span>

              <h3>Ações rápidas</h3>
            </div>
          </div>

          <div className="admin-quick-actions">
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              iconLeft="＋"
              onClick={() =>
                onSelecionarModulo("produtos")
              }
            >
              <div>
                <strong>Cadastrar produto</strong>

                <small>
                  Adicionar um item ao catálogo
                </small>
              </div>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              fullWidth
              iconLeft="⌂"
              onClick={() =>
                onSelecionarModulo("empresa")
              }
            >
              <div>
                <strong>Editar empresa</strong>

                <small>
                  Alterar nome, logo e contatos
                </small>
              </div>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              fullWidth
              iconLeft="▤"
              onClick={() =>
                onSelecionarModulo(
                  "personalizacao",
                )
              }
            >
              <div>
                <strong>
                  Personalizar página inicial
                </strong>

                <small>
                  Atualizar o banner da loja
                </small>
              </div>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              fullWidth
              iconLeft="↗"
              onClick={() =>
                window.open("/", "_blank")
              }
            >
              <div>
                <strong>Visualizar catálogo</strong>

                <small>
                  Abrir a loja para conferência
                </small>
              </div>
            </Button>
          </div>
        </article>
      </section>

      <section className="admin-progress-panel">
        <div className="admin-progress-header">
          <div>
            <span className="admin-eyebrow">
              Implantação
            </span>

            <h3>Configuração do sistema</h3>
          </div>

          <strong>80%</strong>
        </div>

        <div className="admin-progress-track">
          <div
            className="admin-progress-value"
            style={{ width: "80%" }}
          />
        </div>

        <div className="admin-progress-items">
          <span className="completed">
            ✓ Estrutura inicial
          </span>

          <span className="completed">
            ✓ Catálogo público
          </span>

          <span className="completed">
            ✓ Cadastro de produtos
          </span>

          <span className="completed">
            ✓ Personalização da Home
          </span>

          <span className="completed">
            ✓ Dados da empresa
          </span>

          <span>
            ○ Finalização do pedido
          </span>
        </div>
      </section>
    </div>
  );
}

function ModuloEmConstrucao({
  titulo,
  descricao,
}) {
  return (
    <section className="admin-empty-module">
      <div className="admin-empty-icon">
        ◇
      </div>

      <span className="admin-eyebrow">
        Próximo módulo
      </span>

      <h2>{titulo}</h2>

      <p>{descricao}</p>

      <div className="admin-empty-notice">
        Este módulo será conectado ao sistema nas
        próximas etapas.
      </div>
    </section>
  );
}

function Admin() {
  const { indicadores } = useProducts();

  const [menuAberto, setMenuAberto] =
    useState(false);

  const [moduloAtivo, setModuloAtivo] =
    useState("dashboard");

  const itemAtivo =
    menuAdmin.find(
      (item) => item.id === moduloAtivo,
    ) || menuAdmin[0];

  function selecionarModulo(id) {
    setModuloAtivo(id);
    setMenuAberto(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function renderizarConteudo() {
    if (moduloAtivo === "dashboard") {
      return (
        <Dashboard
          indicadores={indicadores}
          onSelecionarModulo={
            selecionarModulo
          }
        />
      );
    }

    if (moduloAtivo === "produtos") {
      return <ProductManager />;
    }

    if (moduloAtivo === "empresa") {
      return <Empresa />;
    }

    if (moduloAtivo === "personalizacao") {
      return <Personalizacao />;
    }

    const descricoes = {
      categorias:
        "Crie categorias e subcategorias para organizar os produtos da loja.",

      pedidos:
        "Acompanhe as solicitações enviadas pelos clientes e o status de cada atendimento.",

      configuracoes:
        "Gerencie aparência, mensagens, moeda e preferências gerais do sistema.",
    };

    return (
      <ModuloEmConstrucao
        titulo={itemAtivo.titulo}
        descricao={
          descricoes[moduloAtivo] ||
          "Este módulo será desenvolvido em uma próxima atualização."
        }
      />
    );
  }

  return (
    <div className="admin-layout">
      {menuAberto && (
        <button
          className="admin-overlay"
          type="button"
          aria-label="Fechar menu"
          onClick={() =>
            setMenuAberto(false)
          }
        />
      )}

      <aside
        className={`admin-sidebar ${
          menuAberto
            ? "admin-sidebar-open"
            : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-brand-symbol">
            PV
          </div>

          <div>
            <strong>PV Catalog</strong>

            <span>Administração</span>
          </div>
        </div>

        <div className="admin-store-status">
          <span className="admin-status-dot" />

          <div>
            <strong>Loja online</strong>

            <small>Sistema operacional</small>
          </div>
        </div>

        <nav
          className="admin-navigation"
          aria-label="Menu administrativo"
        >
          <span className="admin-menu-title">
            Menu principal
          </span>

          {menuAdmin.map((item) => (
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              className={`admin-menu-button ${
                moduloAtivo === item.id
                  ? "active"
                  : ""
              }`}
              key={item.id}
              onClick={() =>
                selecionarModulo(item.id)
              }
            >
              <span className="admin-menu-icon">
                {item.icone}
              </span>

              <span className="admin-menu-content">
                <strong>{item.titulo}</strong>

                <small>{item.descricao}</small>
              </span>
            </Button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            className="admin-view-store"
            target="_blank"
            rel="noreferrer"
          >
            <span>↗</span>

            <div>
              <strong>Visualizar loja</strong>

              <small>
                Abrir catálogo público
              </small>
            </div>
          </a>

          <div className="admin-version">
            <span>PV Catalog Pro</span>

            <small>
              Versão comercial 1.0
            </small>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <Button
              variant="ghost"
              size="sm"
              className="admin-mobile-menu"
              ariaLabel="Abrir menu"
              onClick={() =>
                setMenuAberto(true)
              }
            >
              ☰
            </Button>

            <div>
              <span className="admin-breadcrumb">
                Painel administrativo
              </span>

              <h1>{itemAtivo.titulo}</h1>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <a
              href="/"
              className="admin-preview-button"
              target="_blank"
              rel="noreferrer"
            >
              Visualizar loja
            </a>

            <Button
              variant="ghost"
              size="sm"
              className="admin-notification-button"
              ariaLabel="Notificações"
            >
              ♢
              <span />
            </Button>

            <Button
              variant="ghost"
              size="md"
              className="admin-user-button"
            >
              <span className="admin-user-avatar">
                JS
              </span>

              <span className="admin-user-data">
                <strong>Administrador</strong>

                <small>Conta principal</small>
              </span>

              <span className="admin-user-arrow">
                ⌄
              </span>
            </Button>
          </div>
        </header>

        <div className="admin-page-content">
          {renderizarConteudo()}
        </div>
      </main>
    </div>
  );
}

export default Admin;