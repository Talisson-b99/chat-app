/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";

interface ModalSearchContextData {
  modalSearch: boolean;
  handleEditUserOpen: () => void;
}

const ModalSearchContext = createContext({} as ModalSearchContextData);

export const ModalSearchProvider = ({ children }: { children: ReactNode }) => {
  const [modalSearch, setModalSearch] = useState(false);

  const handleEditUserOpen = () => {
    setModalSearch(!modalSearch);
  };

  return (
    <ModalSearchContext.Provider value={{ modalSearch, handleEditUserOpen }}>
      {children}
    </ModalSearchContext.Provider>
  );
};

export const useContextModalSearch = () => useContext(ModalSearchContext);
