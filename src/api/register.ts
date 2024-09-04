import { FormData } from "../pages/register-page";

export async function registerUser(user: FormData) {
  try {
    const response = await fetch("http://localhost:3001/register", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) => res.json());

    return response.error;
  } catch (error) {
    console.log(error);
  }
}
