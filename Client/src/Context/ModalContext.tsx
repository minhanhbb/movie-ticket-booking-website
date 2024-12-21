// ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal } from 'antd';

// Định nghĩa interface cho ModalContext
interface ModalContextType {
  showModal: (title: string, content: string) => void;
}

// Định nghĩa kiểu cho props của ModalProvider (bao gồm children)
interface ModalProviderProps {
  children: ReactNode; // children có thể là bất kỳ React element nào
}

// Tạo Context cho modal
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Component ModalProvider để cung cấp giá trị showModal cho các component khác
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const showModal = (title: string, content: string) => {
    Modal.info({
      title: title,
      content: <div>{content}</div>, // Nội dung modal
      onOk() {
        console.log("Modal closed.");
      },
    });
  };

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// Hook custom để dễ dàng sử dụng showModal
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
