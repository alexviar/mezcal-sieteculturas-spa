import React from "react";
import { ContextProps } from "@/constants";

const NotificationContext = React.createContext<ContextProps | null>(null);

export const NotificationProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const getToast = (message: string) => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
    setMessage(message);
  };

  const value = { getToast, message, open };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
