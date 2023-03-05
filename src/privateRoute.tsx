import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  let token = localStorage.getItem("token");
console.log(token);

  return token ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;