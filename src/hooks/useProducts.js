import { useContext } from "react";

import { ProductContext } from "../store/ProductStore";

function useProducts() {
  const contexto = useContext(ProductContext);

  if (!contexto) {
    throw new Error(
      "useProducts precisa ser utilizado dentro de um ProductProvider.",
    );
  }

  return contexto;
}

export default useProducts;