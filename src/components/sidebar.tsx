/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Image,
  LogOut,
  MessageCircleMore,
  MoveUpLeft,
  User,
  UserPlus,
  Video,
} from "lucide-react";
import ActionSidebar from "./action-sidebar";
import { useEffect, useState } from "react";
import ModalEditDetail from "./modal-edit-user-details";
import { useQuery } from "react-query";
import { getDetails } from "../api/get-details";
import SearchUser from "./search-user";
import { useContextModalSearch } from "../context/modalSearchContex";
import { useUserOnline } from "../context/usersOnline";
import { Link } from "react-router-dom";
import { generateRandomColor } from "../constants/colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/pt-br";
import useUserContext from "../context/userIdContext";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.locale("pt-br");

const Sidebar = () => {
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const { socketConnection } = useUserOnline();
  const { modalSearch, handleEditUserOpen } = useContextModalSearch();
  const { user, setUserIdContext } = useUserContext();

  const { data } = useQuery({
    queryKey: ["details"],
    queryFn: getDetails,
  });

  useEffect(() => {
    setUserIdContext(data?.data?.user);
  }, []);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);
    }

    socketConnection.on(
      "sidebar-conversation",
      async (conversationUser: any) => {
        const conversationData = conversationUser.map((conversation: any) => {
          if (conversation.sender._id === conversation.receiver._id) {
            return {
              ...conversation,
              userDetails: conversation.sender,
            };
          } else if (conversation.receiver._id !== user._id) {
            return {
              ...conversation,
              userDetails: conversation.receiver,
            };
          } else {
            return {
              ...conversation,
              userDetails: conversation.sender,
            };
          }
        });
        setAllUsers(conversationData);
        console.log(conversationData);
      },
    );
  }, [socketConnection, user._id]);

  if (!data) return <p>carregando</p>;

  console.log(allUsers);

  return (
    <div className="grid h-full w-full grid-cols-[48px,1fr] border-r">
      <div className="flex h-full w-12 flex-col rounded-r-lg border-r bg-slate-100 py-4">
        <div className="flex-1">
          <ActionSidebar link="/" title="chat">
            <MessageCircleMore size={20} />
          </ActionSidebar>

          <button
            onClick={() => handleEditUserOpen()}
            className="flex h-12 w-12 items-center justify-center rounded hover:bg-slate-200 hover:transition-all"
          >
            <UserPlus size={20} />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-center">
            <div
              className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-200"
              title={data?.data?.user?.name}
            >
              <button onClick={() => setEditUserOpen(true)}>
                {data?.data?.user?.profile_pic ? (
                  <img
                    src={data?.data?.user?.profile_pic}
                    alt=""
                    className="object-cover"
                  />
                ) : (
                  <span className="font-bold">
                    <User size={16} />
                  </span>
                )}
              </button>
            </div>
          </div>
          <div
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded hover:bg-slate-200 hover:transition-all"
            title="logout"
          >
            <button>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className="border-b shadow-sm shadow-cyan-400/10">
          <h2 className="px-3 py-6 text-lg font-bold text-slate-800">
            Mensagens
          </h2>
        </div>

        <div className="flex-1">
          {allUsers.length === 0 && (
            <div className="mt-16 flex flex-col items-center justify-center">
              <div>
                <MoveUpLeft className="size-12 text-slate-400" />
              </div>
              <p className="text-center text-lg text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          <div className="my-1 flex flex-col gap-2 px-2">
            {allUsers.map((conv) => (
              <Link to={conv.userDetails._id} className="border-b py-2">
                <div className="relative flex items-center gap-2">
                  <div
                    className={`flex size-12 items-center justify-center overflow-hidden rounded-full ${generateRandomColor()}`}
                  >
                    {conv.userDetails.profile_pic ? (
                      <img
                        src={conv.userDetails.profile_pic}
                        alt=""
                        className="size-16"
                      />
                    ) : (
                      <p className="font-bold uppercase">
                        {conv.userDetails.name.slice(0, 2)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="truncate font-semibold">
                      {conv.userDetails.name}
                    </p>
                    <p className="text-xs text-gray-600">{conv.lastMsg.text}</p>
                    {conv.lastMsg.videoUrl && (
                      <p className="flex gap-1 text-xs text-gray-600">
                        <Video size={16} />
                        vídeo
                      </p>
                    )}
                    {conv.lastMsg.imageUrl && (
                      <p className="flex gap-1 text-xs text-gray-600">
                        <Image size={16} />
                        imagem
                      </p>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 ml-auto">
                    <span className="text-xs">
                      {" "}
                      {dayjs(conv.lastMsg.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {editUserOpen && (
        <ModalEditDetail closeModal={() => setEditUserOpen(false)} />
      )}

      {modalSearch && <SearchUser closeModal={() => handleEditUserOpen()} />}
    </div>
  );
};

export default Sidebar;
