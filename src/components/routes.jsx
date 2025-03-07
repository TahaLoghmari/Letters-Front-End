import App from "./App";
import Categories from "./Categories";
import Category from "./Category";
import EditCategory from "./EditCategory";
import CreateCategory from "./CreateCategory";
import DeleteCategory from "./DeleteCategory";

import Games from "./Games";
import Game from "./Game";
import EditGame from "./EditGame";
import CreateGame from "./CreateGame";
import DeleteGame from "./DeleteGame";

import Home from "./Home";
import ErrorPage from "./ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [],
  },
];

export default routes;
