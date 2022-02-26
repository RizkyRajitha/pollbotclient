const endpoint = process.env.REACT_APP_ENDPOINT;

export let postApi = async (resource, data, token) => {
  if (!data) {
    throw new Error("Provide data");
  }

  if (!token) {
    throw new Error("Provide token");
  }

  try {
    let res = await fetch(`${endpoint}${resource}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = new Error("An error occurred while posting the data");

      if (res.status === 400) {
        let msg = await res.json();
        const error = new Error(msg.message);
        throw error;
      }

      if (res.status === 500) {
        let msg = await res.json();
        const error = new Error(msg.message);
        throw error;
      }

      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
