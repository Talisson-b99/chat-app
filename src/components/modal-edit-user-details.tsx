/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { STYLE_INPUT } from "../constants/style-input";
import { uploadFiles } from "../helpers/upload-files";
import { updateDetails } from "../api/update-details";
import { User } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { getDetails } from "../api/get-details";
import { toast } from "sonner";

interface ModalEditDetailProps {
  closeModal: () => void;
}

const SchemaInputs = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  profile_pic: z.string().url({ message: "URL inválida" }),
});

type Inputs = z.infer<typeof SchemaInputs>;

const ModalEditDetail = ({ closeModal }: ModalEditDetailProps) => {
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["details"],
    queryFn: getDetails,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SchemaInputs),
    defaultValues: {
      name: data.data.user.name,
      profile_pic: data.data.user.profile_pic as string,
    },
  });

  const handleChangePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const photoUrl = URL.createObjectURL(event.target.files[0]);
    setFileUpload(event.target.files[0]);
    setPhotoUrl(photoUrl);
  };

  const { mutateAsync } = useMutation({
    mutationKey: "updateDetails",
    mutationFn: updateDetails,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Usuário atualizado com sucesso", {
        id: "update-user",
      });
      queryClient.invalidateQueries("details");
      closeModal();
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário", {
        id: "update-user",
      });
    },
  });

  const onSubmitForm = async ({ name, profile_pic }: Inputs) => {
    toast.loading("Atualizando usuário", {
      id: "update-user",
    });
    if (fileUpload) {
      const urlImage = await uploadFiles(fileUpload);
      await mutateAsync({ name, profile_pic: urlImage });

      return;
    }
    await mutateAsync({ name, profile_pic });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute h-screen w-full bg-gray-200/85 blur-sm">
      {createPortal(
        <div
          ref={modalRef}
          className="absolute left-1/2 top-1/2 z-50 w-[400px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white pb-10 shadow-md shadow-cyan-400/20"
        >
          <div>
            <div className="h-20 w-full bg-cyan-500/60"></div>
            <div className="-mt-10 px-5">
              <div>
                <img
                  src={data.data.user.profile_pic as string}
                  alt="profile"
                  className="size-16 rounded-full"
                />
                <p className="font-bold">{data.data.user.name}</p>
                <p className="text-xs text-gray-500">{data.data.user.email}</p>
              </div>

              <form
                className="mt-5 space-y-3"
                onSubmit={handleSubmit(onSubmitForm)}
              >
                <div className="grid grid-cols-3 border-t pt-3">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium text-gray-400"
                  >
                    Nome
                  </label>
                  <div className="col-span-2 w-full">
                    <input
                      type="text"
                      id="name"
                      className={`${STYLE_INPUT} `}
                      {...register("name")}
                    />
                    <p className="text-xs text-red-500">
                      {errors.name?.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 border-y py-3">
                  <label
                    htmlFor="photo"
                    className="text-xs font-medium text-gray-400"
                  >
                    Foto de perfil
                  </label>
                  <div className="col-span-2 flex gap-4">
                    <label
                      htmlFor="photo"
                      className="size-12 cursor-pointer rounded-full"
                    >
                      {photoUrl && <img src={photoUrl} alt="" />}
                      {data.data.user.profile_pic && !photoUrl && (
                        <img
                          src={data.data.user.profile_pic}
                          alt=""
                          className="size-12 rounded-full"
                        />
                      )}
                      {!data.data.user.profile_pic && !photoUrl && (
                        <User size={16} />
                      )}
                    </label>
                    <label
                      htmlFor="photo"
                      className="flex h-fit cursor-pointer items-center justify-center rounded-lg border border-cyan-400 bg-transparent px-4 py-1.5 text-center text-sm font-semibold text-cyan-400"
                    >
                      Escolher foto
                      <input
                        id="photo"
                        className="sr-only"
                        type="file"
                        onChange={handleChangePhoto}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="w-20 rounded-lg bg-cyan-400 px-3 py-1.5 text-white"
                    >
                      Salvar
                    </button>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-20 rounded-lg bg-red-400 px-3 py-1.5 text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};

export default ModalEditDetail;
