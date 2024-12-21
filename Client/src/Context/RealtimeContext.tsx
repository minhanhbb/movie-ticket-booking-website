import React, { createContext, useContext } from "react";
import { Modal } from "antd";
import initializeEcho from "../server/realtime";
import { useNavigate } from "react-router-dom";
import './RealtimeContext.css'

interface RealtimeContextProps {
  setupRealtime: () => void;
}

const RealtimeContext = createContext<RealtimeContextProps | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const setupRealtime = async () => {
    try {
      const echo = await initializeEcho();
      // console.log("Kết nối thành công với Echo:", echo);
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        console.error("User ID is not available in local storage.");
        return;
      }

      if (echo) {
        const channel = echo.private(`seats${userId}`);
        // console.log("Connected to channel:", channel);

        // Lắng nghe sự kiện SeatReset
        channel.listen("SeatReset", (eventData: any) => {
          console.log("Realtime data received:", eventData);

          const {message } = eventData;

          // Hiển thị modal
          showModal({
            title: "Thông báo",
            content: `${message}`,
          });
        });
      }
    } catch (error) {
      console.error("Failed to setup realtime connection:", error);
    }
  };

  const showModal = ({ title, content }: { title: string; content: string }) => {
    Modal.info({
      title,
      content: (
        <div>
          <p>{content}</p>
        </div>
      ),
      okText: "Quay về trang chủ", // Thay đổi nút OK thành Quay về trang chủ
      onOk() {
        // Điều hướng về trang chủ khi nhấn "Quay về trang chủ"
        navigate("/", { replace: true });
      },
      width: 600, // Tùy chỉnh chiều rộng modal
      bodyStyle: {
        fontSize: "16px",
        padding: "20px",
      },
      maskStyle: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
    });
  };

  return (
    <RealtimeContext.Provider value={{ setupRealtime }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = (): RealtimeContextProps => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
};
