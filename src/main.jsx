import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./store/ProductStore";
import { SiteConfigProvider } from "./store/SiteConfigStore";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteConfigProvider>
        <ProductProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ProductProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);