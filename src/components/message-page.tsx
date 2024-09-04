/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router-dom";
import { useUserOnline } from "../context/usersOnline";
import { useEffect, useRef, useState } from "react";

import backgroundImage from "../assets/background.jpg";

import {
  CheckCheck,
  ChevronLeft,
  EllipsisVertical,
  Image,
  Plus,
  SendHorizonal,
  Video,
  X,
} from "lucide-react";
import moment from "moment";

import { uploadFiles } from "../helpers/upload-files";

interface DataUser {
  name: string;
  email: string;
  profile_pic: string;
  _id: string;
  online: boolean;
}

const MessagePage = () => {
  const params = useParams();
  const { socketConnection } = useUserOnline();
  const [dataUser, setDateUser] = useState<DataUser>();
  const [animation, setAniamtion] = useState(false);

  const [message, setMessage] = useState("");

  const [allMessages, setAllMessages] = useState<any[]>([]);

  const [fileFromUpload, setFileFromUpload] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | undefined>(
    undefined,
  );

  const currentMessage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log(user._id);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoPreview(undefined);

    if (!e.target.files) return;

    const file = e.target.files[0];
    setFileFromUpload(file);
    const urlPreview = URL.createObjectURL(file);
    setImagePreview(urlPreview);
  };

  const handleUploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreview(null);

    if (!e.target.files) return;

    const file = e.target.files[0];

    const urlPreview = URL.createObjectURL(file);
    setVideoPreview(urlPreview);
    setFileFromUpload(file);
    setMessage("");
  };

  const clerImagePreview = () => {
    setImagePreview(null);
    setVideoPreview(undefined);
  };

  useEffect(() => {
    socketConnection.emit("messagepage", params.userId);

    socketConnection.on("message-user", (data: DataUser) => {
      setDateUser(data);
    });

    socketConnection.on("message", (data: any) => {
      setAllMessages(data);
    });
  }, [socketConnection, params.userId]);

  const handleSendeMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message || fileFromUpload) {
      let url = "";
      if (fileFromUpload) {
        url = await uploadFiles(fileFromUpload!);
        console.log(url, "url");
      }

      socketConnection.emit("send-message", {
        sender: user._id,
        receiver: params.userId,
        text: message,
        image: imagePreview ? url : "",
        video: videoPreview ? url : "",
        msgByUserId: user._id,
      });

      setMessage("");
      setFileFromUpload(null);
      setImagePreview(null);
      setVideoPreview(undefined);
    }
  };

  const isSendMessagem = !!message || !!imagePreview || !!videoPreview;

  if (!dataUser) return <div>carregando</div>;
  console.log(allMessages, "conversa");

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 flex h-16 items-center bg-white px-4">
        <div className="mr-3 lg:hidden">
          <Link to={"/"}>
            <ChevronLeft className="text-bold" />
          </Link>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="relative">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-cyan-400">
              {dataUser.profile_pic ? (
                <img src={dataUser.profile_pic} alt={dataUser.name} />
              ) : (
                <span className="bg-cyan-400 font-bold uppercase">
                  {dataUser.name.slice(0, 2)}
                </span>
              )}
              {dataUser.online && (
                <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500" />
              )}
            </div>
          </div>

          <div>
            <p className="font-bold capitalize tracking-normal">
              {dataUser.name}
            </p>
            {dataUser.online && <p className="text-sm text-gray-500">online</p>}
          </div>
        </div>

        <button>
          <EllipsisVertical />
        </button>
      </header>

      <section
        className="relative flex-1 overflow-y-auto"
        style={{ background: `url(${backgroundImage})` }}
      >
        <div className="py-2" ref={currentMessage}>
          {allMessages.length > 0 &&
            allMessages.map((message) => (
              <div
                key={message._id}
                className={`mt-1 flex flex-col px-2 ${user._id === message.msgByUserId ? "items-end" : "items-start"}`}
              >
                <div
                  className={`flex w-fit items-end gap-1 rounded bg-white px-2 ${user._id === message.msgByUserId ? "bg-teal-100" : "bg-white"}`}
                >
                  {message.text && <p className="text-left">{message.text}</p>}
                  {message.imageUrl && (
                    <div className="flex size-60 items-center justify-center overflow-hidden">
                      <img
                        src={message.imageUrl}
                        alt=""
                        className="object-cover"
                      />
                    </div>
                  )}

                  {message.videoUrl && (
                    <div className="flex h-full max-h-72 w-full max-w-72 items-center justify-center overflow-hidden">
                      <video
                        src={message.videoUrl}
                        className="h-full w-full"
                        controls
                        muted
                        autoPlay
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-px text-gray-500">
                    <p className="bottom-0 right-0 text-[10px]">
                      {moment(message.createdAt).locale("pt-br").format("H:mm")}
                    </p>
                    <p>
                      <CheckCheck className="size-[10px]" />
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {imagePreview && (
          <div className="sticky bottom-0 flex h-full items-center justify-center bg-gray-700/20">
            <div className="mx-4 flex size-96 items-center justify-center overflow-hidden rounded-md">
              <img
                src={imagePreview}
                alt="preview"
                className="object-scale-down"
              />
            </div>

            <button
              className="absolute right-1 top-1"
              onClick={clerImagePreview}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {videoPreview && (
          <div className="sticky bottom-0 left-0 right-0 top-0 flex h-full items-center justify-center bg-gray-700/20">
            <div className="mx-4 flex size-[500px] items-center justify-center overflow-hidden rounded-md">
              <video
                src={videoPreview}
                controls
                muted
                autoPlay
                className="aspect-squere"
              />
            </div>

            <button
              className="absolute right-1 top-1"
              onClick={clerImagePreview}
            >
              <X size={20} />
            </button>
          </div>
        )}
      </section>

      <section className="flex h-16 items-center gap-3 bg-white px-4">
        <div className="relative flex size-10 items-center justify-center rounded-full bg-cyan-400">
          <button
            onClick={() => setAniamtion(!animation)}
            className="select-none"
          >
            <Plus
              className={`size-5 transform select-none font-bold text-white transition-transform ${animation ? "-rotate-[225deg]" : "rotate-0"}`}
            />
          </button>

          <div
            className={`absolute flex flex-col items-center justify-center gap-2 p-3 ${animation ? "animate-fadeIn" : "top-[40px] hidden"}`}
          >
            <label
              htmlFor="upload-image"
              className="cursor-pointer rounded-full bg-cyan-200 p-2 text-cyan-500 shadow-md transition-transform hover:scale-110"
            >
              <Image />
            </label>
            <label
              htmlFor="upload-video"
              className="cursor-pointer rounded-full bg-cyan-200 p-2 text-cyan-500 shadow-md transition-transform hover:scale-110"
            >
              <Video />
            </label>
            <input
              type="file"
              className="sr-only"
              id="upload-image"
              onChange={handleUploadImage}
            />
            <input
              type="file"
              className="sr-only"
              id="upload-video"
              onChange={handleUploadVideo}
            />
          </div>
        </div>

        <form
          className="flex w-full flex-1 gap-3"
          onSubmit={handleSendeMessage}
        >
          <input
            type="text"
            placeholder="Digite uma mensagem"
            className="w-full rounded bg-slate-200/60 px-2 py-1.5 text-slate-500 outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className={`${isSendMessagem ? "bg-green-700" : "bg-slate-400"} flex items-center justify-center rounded-full p-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70`}
            type="submit"
            disabled={!isSendMessagem}
          >
            <SendHorizonal />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
