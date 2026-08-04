import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts";

import Catalogo from "./pages/Catalogo/Catalogo";
import Carrinho from "./pages/Carrinho/Carrinho";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin/Admin";
import Login from "./pages/Login/Login";

import { useAuth } from "./context/AuthContext";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
}

function CarregandoAutenticacao() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 24px",
        background: "#f5f7fb",
        textAlign: "center",
      }}
    >
      <div>
        <div
          aria-hidden="true"
          style={{
            width: 42,
            height: 42,
            margin: "0 auto 18px",
            border: "4px solid #e4e7ec",
            borderTopColor: "#c87400",
            borderRadius: "50%",
            animation:
              "pv-auth-loading 0.8s linear infinite",
          }}
        />

        <h1
          style={{
            margin: "0 0 8px",
            color: "#101828",
            fontSize: 22,
          }}
        >
          Verificando acesso
        </h1>

        <p
          style={{
            margin: 0,
            color: "#667085",
            fontSize: 14,
          }}
        >
          Aguarde enquanto carregamos sua sessão.
        </p>

        <style>
          {`
            @keyframes pv-auth-loading {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    </main>
  );
}

function RotaProtegida({ children }) {
  const {
    autenticado,
    loading,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return <CarregandoAutenticacao />;
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

function RotaLogin() {
  const {
    autenticado,
    loading,
  } = useAuth();

  if (loading) {
    return <CarregandoAutenticacao />;
  }

  if (autenticado) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return <Login />;
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
          Verifique o endereço ou volte para a página
          inicial.
        </p>
      </div>
    </main>
  );
}

function App() {
  const location = useLocation();

  const estaEmAreaSemHeader =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login");

  return (
    <>
      {!estaEmAreaSemHeader && <Header />}

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/catalogo"
          element={<Catalogo />}
        />

        <Route
          path="/produto/:slug"
          element={<ProductDetails />}
        />

        <Route
          path="/carrinho"
          element={<Carrinho />}
        />

        <Route
          path="/login"
          element={<RotaLogin />}
        />

        <Route
          path="/admin"
          element={
            <RotaProtegida>
              <Admin />
            </RotaProtegida>
          }
        />

        <Route
          path="*"
          element={<PaginaNaoEncontrada />}
        />
      </Routes>
    </>
  );
}

export default App;