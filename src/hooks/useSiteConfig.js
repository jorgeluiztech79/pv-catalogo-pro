import { useContext } from "react";

import { SiteConfigContext } from "../store/SiteConfigStore";

function useSiteConfig() {
  const context = useContext(SiteConfigContext);

  if (!context) {
    throw new Error(
      "useSiteConfig deve ser utilizado dentro de um SiteConfigProvider.",
    );
  }

  return context;
}

export default useSiteConfig;