// const endpoint =
//   process.env.NODE_ENV === "production" ? `` : "http://localhost:8000";

const endpoint = process.env.REACT_APP_ENDPOINT;

// console.log(endpoint)

// let token = localStorage.getItem("jwt");

export let fetchApi = async (resource, pathRouter) => {
  //   console.log(resource);
  let token = localStorage.getItem("jwt");

  try {
    let res = await fetch(`${endpoint}${resource}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (res.status === 404) {
        let msg = await res.json();
        const error = new Error(msg.detail);
        throw error;
      }
      if (res.status === 401) {
        let msg = await res.json();
        const error = new Error(msg.detail);
        throw error;
      }

      // const error = new Error("An error occurred while fetching the data");
      // Attach extra info to the error object.
      // error.info = await res.json();
      // error.status = res.status;
      // throw error;
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    console.log(error.info);

    // redirect to login
    if (error.info.detail === "Token Expired" && error.status === 401) {
      console.log("redirect to login");
    }
    throw error;

    // return { code: "-1", message: error.message };
  }

  // console.log(res.status);
  // console.log(res.statusText);

  // if (res.ok) {
  //   //   let data = await res.json();
  //   //   console.log(data);
  //   resolve(await res.json());
  // } else {
  //   reject({ code: res.status, message: await res.json() });
  // }

  // .catch((err) => {
  //   return { code: "-1", message: err.message };
  // });
};

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
      // Attach extra info to the error object.

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

    // return { code: "-1", message: error.message };
  }
};
