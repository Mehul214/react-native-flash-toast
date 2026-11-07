import React, { createContext, useContext, useMemo } from 'react';
import { FlashMessage } from './FlashMessage';
import { flashManager } from './FlashMessageManager';
import type { FlashMessageContainerProps, FlashMessageOptions } from './types';

interface FlashMessageContextValue {
  show: (options: FlashMessageOptions) => void;
  hide: () => void;
}

const FlashMessageContext = createContext<FlashMessageContextValue | null>(null);

export interface FlashMessageProviderProps extends FlashMessageContainerProps {
  children: React.ReactNode;
}

export const FlashMessageProvider: React.FC<FlashMessageProviderProps> = ({
  children,
  ...containerProps
}) => {
  const contextValue = useMemo<FlashMessageContextValue>(
    () => ({
      show: (options: FlashMessageOptions) => flashManager.showMessage(options),
      hide: () => flashManager.hideMessage(),
    }),
    []
  );

  return (
    <FlashMessageContext.Provider value={contextValue}>
      {children}
      <FlashMessage {...containerProps} />
    </FlashMessageContext.Provider>
  );
};

export function useFlashMessage(): FlashMessageContextValue {
  const context = useContext(FlashMessageContext);
  if (!context) {
    // Graceful fallback to global manager even if Provider is omitted
    return {
      show: (options: FlashMessageOptions) => flashManager.showMessage(options),
      hide: () => flashManager.hideMessage(),
    };
  }
  return context;
}
