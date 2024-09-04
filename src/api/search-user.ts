interface SearchUserResponse {
  search: string;
}

export async function searchUserRespose({ search }: SearchUserResponse) {
  const response = await fetch("http://localhost:3001/search-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ search }),
    credentials: "include",
  }).then((res) => res.json());
  console.log(response, "response");
  return response;
}
