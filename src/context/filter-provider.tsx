"use client";

import {
  createContext,
  useContext,
  useTransition,
  ReactNode,
  TransitionStartFunction,
} from "react";

interface FilterTransitionContextType {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

const FilterTransitionContext = createContext<
  FilterTransitionContextType | undefined
>(undefined);

export const useFilterTransition = () => {
  const context = useContext(FilterTransitionContext);
  if (!context) {
    return { isPending: false, startTransition: (fn: () => void) => fn() };
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <FilterTransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </FilterTransitionContext.Provider>
  );
};
