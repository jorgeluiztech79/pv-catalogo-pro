import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const cartSalvo = localStorage.getItem("pv-cart");

      return cartSalvo ? JSON.parse(cartSalvo) : [];
    } catch (error) {
      console.error("Não foi possível carregar o carrinho:", error);

      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("pv-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Não foi possível salvar o carrinho:", error);
    }
  }, [cart]);

  const addToCart = (produto) => {
    if (!produto || !produto.disponivel) {
      return;
    }

    setCart((carrinhoAtual) => {
      const produtoExistente = carrinhoAtual.find(
        (item) => item.id === produto.id
      );

      if (produtoExistente) {
        return carrinhoAtual.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + 1,
              }
            : item
        );
      }

      return [
        ...carrinhoAtual,
        {
          ...produto,
          quantidade: 1,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((carrinhoAtual) =>
      carrinhoAtual.filter((item) => item.id !== id)
    );
  };

  const increase = (id) => {
    setCart((carrinhoAtual) =>
      carrinhoAtual.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: item.quantidade + 1,
            }
          : item
      )
    );
  };

  const decrease = (id) => {
    setCart((carrinhoAtual) =>
      carrinhoAtual
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantidade: item.quantidade - 1,
              }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItens = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.quantidade,
      0
    );
  }, [cart]);

  const totalValor = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.preco || 0) * item.quantidade,
      0
    );
  }, [cart]);

  const contexto = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      increase,
      decrease,
      clearCart,
      totalItens,
      totalValor,
    }),
    [cart, totalItens, totalValor]
  );

  return (
    <CartContext.Provider value={contexto}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const contexto = useContext(CartContext);

  if (contexto === undefined) {
    throw new Error(
      "useCart precisa ser utilizado dentro do CartProvider."
    );
  }

  return contexto;
}