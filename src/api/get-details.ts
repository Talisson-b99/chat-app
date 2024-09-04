export async function getDetails() {
  const response = await fetch("http://localhost:3001/user-details", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) => response.json());

  localStorage.setItem("user", JSON.stringify(response.data.user));
  localStorage.setItem("token", response.data.token);

  return response;
}
