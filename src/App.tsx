import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ModalSearchProvider } from "./context/modalSearchContex";
import { UserProvider } from "./context/userIdContext";
import { UserOnlineProvider } from "./context/usersOnline";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserOnlineProvider>
          <UserProvider>
            <ModalSearchProvider>
              <main>
                <Outlet />
              </main>
            </ModalSearchProvider>
          </UserProvider>
        </UserOnlineProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
