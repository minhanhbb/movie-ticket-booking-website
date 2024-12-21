import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: any;
  }
}

export default async function initializeEcho() {
  try {
    window.Pusher = Pusher;

    // Nạp cấu hình từ import.meta.env
    const echo = new Echo({
      broadcaster: "pusher",
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: import.meta.env.VITE_PUSHER_SCHEME === "https",
    //   wsHost: window.location.hostname,
      wsPort: import.meta.env.VITE_PUSHER_PORT
        ? parseInt(import.meta.env.VITE_PUSHER_PORT)
        : undefined,
      wssPort: import.meta.env.VITE_PUSHER_PORT
        ? parseInt(import.meta.env.VITE_PUSHER_PORT)
        : undefined,
      enabledTransports: ["ws", "wss"],
      authEndpoint: "http://127.0.0.1:8000/broadcasting/auth", // Endpoint xác thực
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần
        },
      },
      debug: true,
    });
    console.log("Echo initialized:", echo);

    return echo;
  } catch (error) {
    console.error("Error initializing Echo:", error);
    return null;
  }
}
