import { UseFormRegister } from "react-hook-form";
import { FormData } from "../pages/register-page";

// Tipos de propriedades do input
interface InputProps {
  name: keyof FormData;
  register: UseFormRegister<FormData>;
  placeholder?: string;
  type?: string;
}

const Input = ({ name, register, placeholder, type }: InputProps) => {
  return (
    <input
      className="w-full rounded border border-zinc-300 bg-slate-100 px-3 py-2 text-slate-500 shadow-sm outline-none focus-within:border-cyan-200/90 focus-within:ring-2 focus-within:ring-cyan-100 focus-within:transition-all focus-within:duration-200 focus:outline-cyan-400/10"
      placeholder={placeholder}
      type={type}
      {...register(name)}
    />
  );
};

export default Input;
