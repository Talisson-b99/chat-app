import { ReactNode } from "react";
import logo from "../assets/logo.png";

const AutoLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className="flex h-20 items-center justify-center bg-white shadow-md">
        <img src={logo} alt="" className="size-20" />
      </header>

      {children}
    </>
  );
};

export default AutoLayout;
