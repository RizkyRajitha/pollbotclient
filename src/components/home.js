import React from "react";
import Login from "../auth/login";
import Dashboard from "../dashboard/dashboard";
const Home = ({ session }) => {
  return (
    <>
      {!session ? (
        <Login />
      ) : (
        <Dashboard key={session.user.id} session={session} />
      )}
    </>
  );
};
export default Home;
