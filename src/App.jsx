import { Route, Routes, useLocation } from "react-router-dom";

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts";

import Catalogo from "./pages/Catalogo/Catalogo";
import Carrinho from "./pages/Carrinho/Carrinho";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin/Admin";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
}

function PaginaNaoEncontrada() {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "grid",
        placeItems: "center",
        padding: "40px 24px",
        background: "#f5f7fb",
        textAlign: "center",
      }}
    >
      <div>
        <span
          style={{
            color: "#b76300",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Erro 404
        </span>

        <h1
          style={{
            margin: "14px 0 10px",
            color: "#101828",
          }}
        >
          Página não encontrada
        </h1>

        <p
          style={{
            margin: 0,
            color: "#667085",
          }}
        >
          Verifique o endereço ou volte para a página inicial.
        </p>
      </div>
    </main>
  );
}

function App() {
  const location = useLocation();

  const estaNoAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!estaNoAdmin && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/catalogo" element={<Catalogo />} />

        <Route path="/produto/:slug" element={<ProductDetails />} />

        <Route path="/carrinho" element={<Carrinho />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Routes>
    </>
  );
}

export default App;