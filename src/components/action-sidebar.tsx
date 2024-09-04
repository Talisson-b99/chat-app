import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface ActionSidebarProps {
  children: ReactNode;
  title: string;
  link: string;
}

const ActionSidebar = ({ children, title, link }: ActionSidebarProps) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `flex h-12 w-12 cursor-pointer items-center justify-center rounded hover:bg-slate-200 hover:transition-all ${isActive ? "bg-slate-200 shadow-md shadow-cyan-400/10" : ""}`
      }
      title={title}
    >
      {children}
    </NavLink>
  );
};

export default ActionSidebar;
