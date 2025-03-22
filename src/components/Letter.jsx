import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/lib/api";
import { createContext, use, useEffect, useState, useContext } from "react";
import { States } from "./App";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Letter({ letter }) {
  const { authentication } = useContext(States);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  useEffect(() => {
    fetch(`${API_BASE_URL}/users/${letter.userid}`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Error getting message's user");
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUser(data);
      });
  }, []);
  return (
    <div
      key={letter.messageid}
      className="w-[30%] bg-accent rounded-sm  h-75 overflow-hidden"
    >
      <div className="flex items-center justify-center w-full bg-primary p-4">
        <div className="border-4 border-orange-300 rounded-full">
          <Avatar className="w-15 h-15">
            <AvatarImage src={user.icon} />
            <AvatarFallback>
              <img
                src="https://miro.medium.com/v2/resize:fit:1400/1*rKl56ixsC55cMAsO2aQhGQ@2x.jpeg"
                alt="userIcon"
                className="w-full h-full object-cover"
              />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="w-full mb-2 text-orange-300 font-bold flex items-center justify-between">
          <div className="bg-primary h-px w-10"></div>
          <p>{letter.title}</p>
          <div className="bg-primary h-px w-10"></div>
        </div>
        <p>{letter.text}</p>
        <p className="text-sm text-secondary-foreground">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(letter.timestamp))}
        </p>
        <p className="text-md text-secondary-foreground font-semibold">
          From :{" "}
          {authentication.status === "admin" ||
          (authentication.status === "member" && user.status == "member") ||
          authentication.userid == user.userid
            ? user.username
            : "anonymous"}
        </p>
        <div className="flex justify-end gap-3">
          {authentication.status === "admin" ||
          authentication.userid === user.userid ? (
            <Button
              onClick={() =>
                navigate(`/myLetters/deleteLetter/${letter.messageid}`)
              }
              className="cursor-pointer"
            >
              Delete
            </Button>
          ) : (
            ""
          )}
          {authentication.userid === user.userid ? (
            <Button
              onClick={() =>
                navigate(`/myLetters/editLetter/${letter.messageid}`)
              }
              className="cursor-pointer"
            >
              Edit
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
