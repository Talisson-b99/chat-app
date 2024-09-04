import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useUserContext from "../context/userIdContext";
import { checkPassword } from "../api/check-password";
import { toast } from "sonner";
import { UserCircle2 } from "lucide-react";
import { useEffect } from "react";
import { STYLE_INPUT } from "../constants/style-input";

const schemaInput = z.object({
  password: z.string().min(6, { message: "Senha inválido" }),
});

type FormData = z.infer<typeof schemaInput>;

const PasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schemaInput),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (user._id === null) {
      return navigate("/email");
    }
    console.log(user._id);
  }, [user._id, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      const respose = await checkPassword({
        password: data.password,
        userId: user._id!,
      });

      if (respose.success) {
        navigate("/");
        return;
      }

      if (respose.error) {
        console.log(respose);
        toast.error("Senha inválida");
        return;
      }
      console.log(respose);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-5">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white p-4 shadow-md">
        <div className="flex justify-center">
          {user.profile_pic ? (
            <img
              src={user.profile_pic}
              alt="profile"
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <UserCircle2 size={64} />
          )}
        </div>
        <h3 className="truncate text-center text-xl font-bold">
          Bem vindo {user.name}
        </h3>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className={`${STYLE_INPUT}`}
              placeholder="Digite sua senha"
              type="password"
              {...register("password")}
            />
            <p className="text-xs text-red-500">{errors.password?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-cyan-400 py-2 font-bold text-white outline-none transition-colors hover:bg-cyan-500"
          >
            Verificar senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPage;
