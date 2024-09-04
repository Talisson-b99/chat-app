import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/register-page";
import EmailPage from "../pages/check-email-page";
import PasswordPage from "../pages/check-password-page";
import HomePage from "../pages/home";
import MessagePage from "../components/message-page";
import AutoLayout from "../layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: (
          <AutoLayout>
            <RegisterPage />
          </AutoLayout>
        ),
      },
      {
        path: "email",
        element: (
          <AutoLayout>
            <EmailPage />
          </AutoLayout>
        ),
      },

      {
        path: "password",
        element: (
          <AutoLayout>
            <PasswordPage />
          </AutoLayout>
        ),
      },
      {
        path: "",
        element: <HomePage />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
