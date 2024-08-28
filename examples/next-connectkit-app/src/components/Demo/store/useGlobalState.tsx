import React, { useContext, createContext, useState } from 'react';
import { ToastType } from '../modules/Toast';
  
interface GlobalState {
  activeIndex: number;
  setActiveIndex: (value: number) => void
  toast: any
}

const GlobalContext = createContext<GlobalState>({} as any);

const ContextProvider = ({ children, toast }: { children: React.ReactNode, toast: any }) => {
  const [activeIndex, setActiveIndex] = useState(0);


  return (
    <GlobalContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        toast
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

const useActiveIndex = () => {
  const { activeIndex, setActiveIndex } = useContext(GlobalContext);

  return { activeIndex, setActiveIndex };
};

const useToast = () => {
  const { toast } = useContext(GlobalContext);

  return toast;
};


export {
  ContextProvider,
  useActiveIndex,
  useToast
}