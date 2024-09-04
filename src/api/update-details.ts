interface updateDetails {
  name: string;
  profile_pic: string;
}

export async function updateDetails({ name, profile_pic }: updateDetails) {
  try {
    const response = await fetch("http://localhost:3001/update-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        profile_pic,
      }),
      credentials: "include",
    }).then((res) => res.json());

    return response;
  } catch (error) {
    console.log(error);
  }
}
