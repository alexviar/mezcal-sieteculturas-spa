import { useContext } from "react";

import ModalContext from "./modalContext";

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("No existe el contexto");
  return context;
};
