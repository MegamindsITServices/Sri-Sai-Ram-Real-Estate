import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../utils/API";
import { setLogin, setLogOut } from "./UserSlice";

const useAuthInit = () => {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/current-user");
        dispatch(setLogin({ user: res.data.user }));
      } catch (err) {
        localStorage.removeItem("token");
        dispatch(setLogOut());
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, [dispatch]);

  return authLoading;
};

export default useAuthInit;
