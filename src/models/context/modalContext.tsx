import React, { useState, createContext, ReactNode } from "react";
import { Product } from "../entities";

interface ModalContextProps {
  open: boolean;
  reload: boolean;
  setOpen: (open: boolean) => void;
  setReload: (reload: boolean) => void;
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
  handleSelectItem?: (item: Product) => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [selection, setSelection] = useState<Product | null>(null);

  const handleSelectItem = (item: Product) => {
    setOpen(true);
    setSelection(item);
  };
  const value = {
    open,
    setOpen,
    content,
    setContent,
    selection,
    handleSelectItem,
    reload,
    setReload,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export default ModalContext;
