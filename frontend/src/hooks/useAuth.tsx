import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import axios from 'axios'
import { useToast } from "@/hooks/use-toast";
import { log } from "node:console";


axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true

interface User {
  _id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
  email: string,
  password: string,
  name: string,
  agencyName: string,
  contactNumber: string
) => Promise<void>;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const API_BASE =
//   import.meta.env.VITE_API_BASE

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 🔹 Restore session on refresh
  useEffect(() => {
  const fetchMe = async () => {
    try {
      const res = await axios.get("/user/data");

      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchMe();
}, []);



  // // create new chat
  // const createNewChat = async () => {
  //   try {
  //     if()
  //   } catch (error) {
      
  //   }
  // }

  // 🔹 Register
  const signUp = async (email: string, password: string, name: string,contactNumber: string) => {
    // const res = await fetch(`${API_BASE}/user/register`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     email,
    //     password,
    //     name,
    //   }),
    // });

    // if (!res.ok) {
    //   const err = await res.json();
    //   throw new Error(err.message || "Registration failed");
    // }

    // const data = await res.json();
    // console.log("response from signUp:", data);
    
    // localStorage.setItem("token", data.token);
    // setUser(data.user);
    try {
      const res = await axios.post(`/user/register`, {
        email: email,
        password: password,
        name: name,
        contactNumber: contactNumber
      })

      if(res.data.success){
        console.log(`response from signUp: `, res.data);
        // localStorage.setItem("token",res.data.token)
        // setToken(res.data.token); 
        setUser(res.data.user)
      }else{
        throw new Error(
          res.data.message
        )
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "User already exists Please Login!"
      );
    }
  };

  // 🔹 Login
  const signIn = async (email: string, password: string) => {
    try {
      const res = await axios.post(`/user/login`, {
        email: email,
        password: password
      });
      if(res.data.success){
        console.log(`response from: backend`, res.data);
        // localStorage.setItem("token",res.data.token)
        // setToken(res.data.token); 
        setUser(res.data.user)
      }else{
        throw new Error(
          res.data.message || "Check Password & Email!"
        )
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Login failed || Check Password & Email!"
      );
    }
  };
  // // 🔹 Login
  // const signIn = async (email: string, password: string) => {
  //   const res = await fetch(`${API_BASE}/user/login`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   });

  //   if (!res.ok) {
  //     const err = await res.json();
  //     throw new Error(err.message || "Login failed");
  //   }

  //   const data = await res.json();
  //   localStorage.setItem("token", data.token);
  //   setUser(data.user);
  // };

  // 🔹 Logout
  const signOut = async() => {
    await axios.post("/user/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
