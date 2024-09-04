import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/input";
import { Eye, EyeOff, Upload } from "lucide-react";
import { ChangeEvent, useState } from "react";
import ImagePreview from "../components/imagePreview";
import { Link } from "react-router-dom";
import { uploadFiles } from "../helpers/upload-files";
import { registerUser } from "../api/register";
import { toast } from "sonner";

const schemaInput = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nome muito curto" })
      .max(50, { message: "Nome muito longo" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "Senha muito curta" })
      .max(50, { message: "Senha muito longa" }),
    confirm_password: z.string().min(6, { message: "Senha muito curta" }),
    profile_pic: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Senhas não coincidem",
    path: ["confirm_password"],
  });

export type FormData = z.infer<typeof schemaInput>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfimation, setShowPasswordConfirmation] =
    useState(false);
  const [image, setImage] = useState<File[] | null>(null);
  const [photoUpload, SetPhotoUpload] = useState<File>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schemaInput),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      profile_pic: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      toast.loading("Cadastrando...", { id: "register" });
      let uploadPhoto = "";
      if (photoUpload) {
        uploadPhoto = await uploadFiles(photoUpload);
        console.log("linkupload", uploadPhoto);
      }

      const user = {
        ...data,
        profile_pic: uploadPhoto,
      };

      const response = await registerUser(user);

      if (response) {
        toast.error("Erro ao cadastrar, email já existe", {
          id: "register",
        });
        reset();
        SetPhotoUpload(undefined);
        setImage(null);
        return;
      }

      reset();
      SetPhotoUpload(undefined);
      setImage(null);

      toast.success("Cadastrado com sucesso", {
        id: "register",
      });
    } catch (error) {
      toast.error("Erro ao cadastrar", {
        id: "register",
      });
      console.log(error);
    }
  };

  async function handleFilesSelected(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    setImage(files);

    SetPhotoUpload(e.target.files[0]);
  }

  return (
    <div className="mt-5">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white p-4 shadow-md">
        <h3 className="text-center text-xl font-bold">Bem vindo ao Chat App</h3>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              placeholder="Digite seu nome"
              type="text"
              name="name"
              register={register}
            />

            <p className="text-xs text-red-500">{errors.name?.message}</p>
          </div>

          <div>
            <Input
              placeholder="Digite seu email"
              type="text"
              name="email"
              register={register}
            />
            <p className="text-xs text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <div className="relative">
              <Input
                placeholder="Digite sua senha"
                type={showPassword ? "text" : "password"}
                name="password"
                register={register}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? (
                  <Eye className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
                ) : (
                  <EyeOff className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
                )}
              </button>
            </div>
            <p className="text-xs text-red-500">{errors.password?.message}</p>
          </div>

          <div>
            <div className="relative">
              <Input
                placeholder="Confirme sua senha"
                type={showPasswordConfimation ? "text" : "password"}
                name="confirm_password"
                register={register}
              />
              <button
                onClick={() =>
                  setShowPasswordConfirmation(!showPasswordConfimation)
                }
                type="button"
              >
                {showPasswordConfimation ? (
                  <Eye className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
                ) : (
                  <EyeOff className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
                )}
              </button>
            </div>
            <p className="text-xs text-red-500">
              {errors.confirm_password?.message}
            </p>
          </div>

          <div className="grid grid-cols-3">
            <ImagePreview files={image} />
            <label
              htmlFor="profile"
              className="col-span-2 w-full cursor-pointer"
            >
              <div className="col-span-2 flex h-20 w-full items-center justify-center rounded border border-cyan-400/20">
                <Upload className="text-cyan-400" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              className="sr-only"
              onChange={handleFilesSelected}
            />
          </div>

          <button className="w-full rounded bg-cyan-400 py-2 font-bold text-white outline-none transition-colors hover:bg-cyan-500">
            Cadastrar
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-gray-500">
          Já possui uma conta?{" "}
          <Link
            to={"/email"}
            className="underline hover:text-cyan-400 hover:transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
