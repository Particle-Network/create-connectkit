import React, { createContext, useContext, useState } from 'react';

interface GlobalState {
  activeIndex: number;
  setActiveIndex: (value: number) => void;
}

const GlobalContext = createContext<GlobalState>({} as any);

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <GlobalContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useActiveIndex = () => {
  const { activeIndex, setActiveIndex } = useContext(GlobalContext);

  return { activeIndex, setActiveIndex };
};

export { ContextProvider, useActiveIndex };
