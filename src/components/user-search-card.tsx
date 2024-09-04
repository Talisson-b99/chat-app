import { Link } from "react-router-dom";
import { useContextModalSearch } from "../context/modalSearchContex";
import { useUserOnline } from "../context/usersOnline";

interface UserSearchCardProps {
  user: {
    _id: string;
    email: string;
    name: string;
    profile_pic: string;
  };
}

const UserSearchCard = ({ user }: UserSearchCardProps) => {
  const { handleEditUserOpen } = useContextModalSearch();
  const { usersOnline } = useUserOnline();

  const isUserOnline = usersOnline.includes(user?._id);

  console.log(isUserOnline);

  return (
    <Link
      to={user._id}
      className="flex cursor-pointer gap-2 rounded-lg border border-transparent p-1 hover:border hover:border-cyan-400"
      onClick={() => handleEditUserOpen()}
    >
      <div className="relative">
        <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-cyan-300">
          {user.profile_pic && <img src={user?.profile_pic} alt="profile" />}
          {!user.profile_pic && (
            <span className="font-bold">{user.name.slice(0, 2)}</span>
          )}

          {isUserOnline && (
            <div className="absolute bottom-0 right-0 z-10 size-3 rounded-full bg-green-500"></div>
          )}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold">{user.name}</p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
