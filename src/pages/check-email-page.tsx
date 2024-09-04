import { useForm } from "react-hook-form";
import Input from "../components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { checkEmail } from "../api/check-email";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import useUserContext from "../context/userIdContext";

const schemaInput = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type FormData = z.infer<typeof schemaInput>;

const EmailPage = () => {
  const navigate = useNavigate();
  const { setUserIdContext } = useUserContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schemaInput),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      toast.loading("Verificando email...", {
        id: "check-email",
      });

      const response = await checkEmail(data.email);

      if (response.success) {
        toast.success("Email verificado com sucesso", {
          id: "check-email",
        });
        setUserIdContext(response.data);
        console.log(response.data);
        navigate("/password");
      }

      if (response.error) {
        toast.error("Email não encontrado", {
          id: "check-email",
        });
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao verificar email", {
        id: "check-email",
      });
    }
  };

  return (
    <div className="mt-5">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white p-4 shadow-md">
        <h3 className="text-center text-xl font-bold">
          Bem vindo ao Chat App{" "}
        </h3>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              placeholder="Digite seu email"
              type="text"
              name="email"
              register={register}
            />
            <p className="text-xs text-red-500">{errors.email?.message}</p>
          </div>

          <button className="w-full rounded bg-cyan-400 py-2 font-bold text-white outline-none transition-colors hover:bg-cyan-500">
            Verificar email
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-gray-500">
          Ainda não tem uma conta?{" "}
          <Link
            to={"/register"}
            className="underline hover:text-cyan-500 hover:transition-colors"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmailPage;
