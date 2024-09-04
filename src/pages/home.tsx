import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { getDetails } from "../api/get-details";
import Sidebar from "../components/sidebar";
import { useQuery } from "react-query";
import logo from "../assets/logo.png";

import { useEffect } from "react";
import { useUserOnline } from "../context/usersOnline";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usersOnline } = useUserOnline();

  useEffect(() => {}, [usersOnline]);

  const { data } = useQuery({
    queryKey: "details",
    queryFn: getDetails,
    onSuccess: (data) => {
      localStorage.setItem("token", JSON.stringify(data.data.token));
    },
  });

  useEffect(() => {
    if (data?.data?.logout || data?.error) {
      navigate("/email");
    }
  }, [data, navigate]);

  if (!data) return <div>carregando</div>;

  const basePath = location.pathname === "/";

  return (
    <div className="h-screen max-h-screen grid-cols-[320px,1fr] lg:grid">
      <aside className={`bg-white ${!basePath && "hidden"} h-full lg:block`}>
        <Sidebar />
      </aside>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`flex flex-col items-center justify-center gap-2 ${!basePath && "hidden"}`}
      >
        <div>
          <img src={logo} alt="" width={250} />
        </div>
        <p className="mt-2 text-lg text-slate-400">
          Selecione usuário para conversar
        </p>
      </div>
    </div>
  );
};

export default HomePage;
