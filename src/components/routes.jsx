import App from "./App";
import Letters from "./Letters";
import MyLetters from "./MyLetters.jsx";
import DeleteLetter from "./DeleteLetter";
import AddLetter from "./AddLetter";
import Membership from "./Membership";
import Admin from "./Admin";
import UserInfo from "./UserInfo";
import Login from "./Login";
import SignUp from "./SignUp";
import EditLetter from "./EditLetter";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Letters /> },
      { path: ":page", element: <Letters /> },
      { path: "/myLetters", element: <MyLetters /> },
      { path: "/myLetters/:page", element: <MyLetters /> },
      { path: "/myLetters/deleteLetter/:id", element: <DeleteLetter /> },
      { path: "/myLetters/editLetter/:id", element: <EditLetter /> },
      { path: "/addLetter", element: <AddLetter /> },
      { path: "/membership", element: <Membership /> },
      { path: "/admin", element: <Admin /> },
      { path: "/userInfo", element: <UserInfo /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
];

export default routes;
