export async function checkEmail(email: string) {
  const response = await fetch("http://localhost:3001/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).then((response) => response.json());

  localStorage.setItem("user", JSON.stringify(response.data));

  console.log("check email", response);

  return response;
}
