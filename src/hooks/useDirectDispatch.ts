import { createContext, useContext } from "react";

export interface DirectDispatchContextType {
  openDirectMessage: (customMessage?: string, service?: string) => void;
  closeDirectMessage: () => void;
}

export const DirectDispatchContext = createContext<DirectDispatchContextType | undefined>(undefined);

export const useDirectDispatch = () => {
  const context = useContext(DirectDispatchContext);
  if (!context) {
    throw new Error("useDirectDispatch must be used within a DirectDispatchProvider");
  }
  return context;
};
