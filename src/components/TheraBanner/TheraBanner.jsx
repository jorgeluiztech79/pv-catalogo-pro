import "./TheraBanner.css";
import banner from "../../assets/produtos/peptideos.png";

function TheraBanner() {
  return (
    <section className="thera-banner">
      <div className="thera-banner__content">

        <div className="thera-banner__text">

          <span className="thera-badge">
            LINHA PREMIUM THERA
          </span>

          <h2>
            Conheça toda nossa linha
            <span> de Peptídeos.</span>
          </h2>

          <p>
            Produtos cuidadosamente selecionados com qualidade,
            tecnologia e inovação para oferecer o melhor aos nossos clientes.
          </p>

          <button>
            Ver Catálogo Completo
          </button>

        </div>

        <div className="thera-banner__image">
          <img src={banner} alt="Linha THERA" />
        </div>

      </div>
    </section>
  );
}

export default TheraBanner;