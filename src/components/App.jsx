import { ThemeProvider } from "./theme-provider";
import { Navigate, Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Hexagon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const States = createContext(null);
function App() {
  const [authentication, setAuthentication] = useState(null);
  const [letters, setLetters] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE_URL}/letters`, { credentials: "include" })
      .then((response) => {
        if (response.status == 401) console.log("User is Unauthorized");
        if (!response.ok)
          throw new Error("Error Occured when retrieving letters");
        return response.json();
      })
      .then((data) => {
        setLetters(data);
      })
      .catch((error) => console.log(error));
    fetch(`${API_BASE_URL}/users/available`, { credentials: "include" })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setLoading(false);
        setAuthentication(data.user);
      })
      .catch(() => {
        setAuthentication(null);
        setLoading(false);
      });
  }, []);
  const handleLogout = () => {
    fetch(`${API_BASE_URL}/log-out`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Logout failed");
        return response.json();
      })
      .then((result) => {
        setAuthentication(null);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (loading) return <div>Loading ...</div>;
  if (authentication) {
    return (
      <ThemeProvider defaultTheme="dark">
        <States.Provider
          value={{ letters, setLetters, authentication, setAuthentication }}
        >
          <div className="flex flex-row  bg-accent items-center w-full p-3 ">
            <Link to="/" className="justify-self-start">
              <Hexagon className="w-12 h-auto text-accent-foreground flex items-center hover:bg-primary hover:text-primary-foreground transition-all duration-200 p-2 rounded-sm cursor-pointer" />
            </Link>
            <div className="flex flex-row gap-5 items-center justify-center mx-auto ml-160">
              <Link
                to="/addLetter"
                className="text-sm font-semibold text-accent-foreground hover:bg-primary p-2 rounded-sm hover:text-primary-foreground transition-all duration-200"
              >
                Write a Letter
              </Link>
              <Link
                to="/myLetters"
                className="text-sm font-semibold text-accent-foreground hover:bg-primary p-2 rounded-sm hover:text-primary-foreground transition-all duration-200"
              >
                My Letters
              </Link>
              <Avatar className="w-14 h-auto">
                <AvatarImage
                  src={authentication.icon}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              {authentication.status === "user" ? (
                <Link
                  to="/membership"
                  className="text-sm font-semibold text-accent-foreground hover:bg-primary p-2 rounded-sm hover:text-primary-foreground transition-all duration-200"
                >
                  Become a Member
                </Link>
              ) : authentication.status === "member" ? (
                <Link
                  to="/admin"
                  className="text-sm font-semibold text-accent-foreground hover:bg-primary p-2 rounded-sm hover:text-primary-foreground transition-all duration-200"
                >
                  Become an Admin
                </Link>
              ) : (
                <p className="text-sm font-semibold text-accent-foreground hover:bg-primary p-2 rounded-sm hover:text-primary-foreground transition-all duration-200">
                  You are an Admin !
                </p>
              )}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <Link
                        className="block px-4 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
                        to="/userInfo"
                      >
                        Personal
                      </Link>
                      <div
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
                      >
                        Log out
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <ModeToggle />
          </div>
          <Outlet />
          <footer className="bg-accent w-full p-4 flex items-center justify-center text-sm">
            <p className="flex gap-2">
              Made With <Heart />{" "}
              <span className="font-semibold">by Taha Loghmari</span>
            </p>
          </footer>
        </States.Provider>
      </ThemeProvider>
    );
  }
  return <Navigate to="/login" replace />;
}

export default App;
