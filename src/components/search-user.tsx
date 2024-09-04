/* eslint-disable react-hooks/exhaustive-deps */
import { Search } from "lucide-react";
import { STYLE_INPUT } from "../constants/style-input";
import { useEffect, useRef, useState } from "react";
import UserSearchCard from "./user-search-card";
import { useMutation } from "react-query";
import { searchUserRespose } from "../api/search-user";
import { useUserOnline } from "../context/usersOnline";

interface SearchUserProps {
  closeModal: () => void;
}

interface User {
  _id: string;
  email: string;
  name: string;
  profile_pic: string;
}

const SearchUser = ({ closeModal }: SearchUserProps) => {
  const [clicked, setClicked] = useState(false);
  const [searchUser, setSearchUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRefSearch = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const { usersOnline } = useUserOnline();

  const { mutate } = useMutation({
    mutationFn: searchUserRespose,

    onSuccess: (data) => {
      setSearchUser(data.data);
      setLoading(false);
    },
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      modalRefSearch.current &&
      !modalRefSearch.current.contains(event.target as Node)
    ) {
      setClicked(false);
      setTimeout(() => {
        closeModal();
      }, 300);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length > 3) {
      setLoading(true);
      mutate({ search: query });
    }
  }, [query, usersOnline, mutate]);

  return (
    <div className="fixed inset-0 z-10 bg-slate-700/70">
      <div
        className={`${clicked ? "w-[90%] lg:w-[448px]" : "w-[200px]"} mx-auto transition-all`}
        ref={modalRefSearch}
      >
        <div
          className={`${STYLE_INPUT} mx-auto mt-12 flex items-center justify-between overflow-hidden rounded-lg bg-white pr-4`}
          onClick={() => setClicked(true)}
        >
          <input
            type="text"
            placeholder="Pesquise pelo nome, email...."
            className={`w-full truncate bg-white outline-none`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div>
            <Search size={16} className="text-slate-400" />
          </div>
        </div>
        {clicked && (
          <div
            className={`mx-auto mt-2 ${clicked ? "w-[100%] lg:w-[448px]" : "w-[200px]"} rounded-lg bg-white p-1.5 transition-all`}
          >
            {searchUser.length === 0 && !loading && (
              <p className="text-center text-slate-500">
                usuário não encontrado
              </p>
            )}

            {loading && (
              <p className="mx-auto size-4 animate-spin rounded-full border-2 border-b-0 border-cyan-400 bg-transparent"></p>
            )}

            <div className="space-y-3">
              {searchUser.length > 0 &&
                !loading &&
                searchUser.map((user, i) => (
                  <UserSearchCard user={user} key={i} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
