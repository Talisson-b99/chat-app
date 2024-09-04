/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";

interface UserIdContextData {
  user: {
    _id: string | null;
    name: string;
    email: string;
    profile_pic: string | null;
    token?: string | null;
  };

  setUserIdContext: ({ name, profile_pic, _id, token }: User) => void;
  handleUsersOnline: (users: []) => void;
  usersOnline: [];
}

interface User {
  _id: string | null;
  name: string;
  email: string;
  profile_pic: string | null;
  token?: string | null;
}

const UserIdContext = createContext({} as UserIdContextData);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    _id: null,
    name: "",
    email: "",
    profile_pic: null,
    token: null,
  });

  const [usersOnline, setUsersOnline] = useState<[]>([]);

  const handleUsersOnline = (users: []) => {
    setUsersOnline(users);
  };

  const setUserIdContext = ({ name, profile_pic, _id, token, email }: User) => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name, profile_pic, _id, token, email }),
    );
    setUser({ name, profile_pic, _id, token, email });
  };

  return (
    <UserIdContext.Provider
      value={{ user, setUserIdContext, handleUsersOnline, usersOnline }}
    >
      {children}
    </UserIdContext.Provider>
  );
};

const useUserContext = () => useContext(UserIdContext);

export default useUserContext;
