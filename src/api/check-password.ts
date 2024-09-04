type Props = {
  password: string;
  userId: string;
};

export async function checkPassword(data: Props) {
  const response = await fetch("http://localhost:3001/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  }).then((response) => response.json());

  console.log("response", response);
  localStorage.setItem("token", response.token);

  return response;
}
