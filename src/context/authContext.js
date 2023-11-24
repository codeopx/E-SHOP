import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import '../styles/context/authContext.css'
import PuffLoader from "react-spinners/PuffLoader";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);
    if (loading) {
      return (
        <div className="spinner">
          <PuffLoader color={"#2f234f"} loading={loading} size={60} />
        </div>
      );
    }
  return <UserContext.Provider value={{user}}>{children}</UserContext.Provider>;
};

export const UserAuth = () => {
  return useContext(UserContext);
};
