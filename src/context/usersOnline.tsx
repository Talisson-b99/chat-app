/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";

interface UserOnlineContextData {
  usersOnline: string[];
  socketConnection: any;
}

export const UserOnlineContext = createContext({} as UserOnlineContextData);

export const UserOnlineProvider = ({ children }: { children: ReactNode }) => {
  const [usersOnline, setUsersOnline] = useState<string[]>([]);
  const [socketConnection, setSocketConnection] = useState<any>();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token")!);

    const socket = io("http://localhost:3001", {
      auth: {
        token,
      },
    });

    setSocketConnection(socket);

    socket.on("onlineUsers", (data) => {
      setUsersOnline(data);
    });

    return () => {
      // Remove o listener específico
      socket.off("onlineUsers");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.on("onlineUsers", (data: any) => {
        setUsersOnline(data);
      });
    }
    console.log("usuarios online", usersOnline);
  }, [usersOnline, socketConnection]);

  return (
    <UserOnlineContext.Provider value={{ usersOnline, socketConnection }}>
      {children}
    </UserOnlineContext.Provider>
  );
};

export const useUserOnline = () => useContext(UserOnlineContext);
