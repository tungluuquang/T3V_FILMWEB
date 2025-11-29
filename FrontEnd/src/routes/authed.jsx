import Watch from "../pages/watch/Watch";
import Authed from "../layouts/Authed";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/home/Home";
import Movie from "../pages/movie/Movie";
import Search from "../pages/search/Search";
import Profile from "../pages/profile/Profile";
import GenrePage from "../components/genreFilm/GenrePage";

const authed = {
  element: <Authed />,
  children: [
    {
      element: <DefaultLayout />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/series",
          element: <Home type={"series"} />,
        },
        {
          path: "/movies",
          element: <Home type={"movie"} />,
        },
      ],
    },
    {
      element: <DefaultLayout />,
      path: "/movie",
      children: [
        {
          path: ":id",
          element: <Movie />,
        },
      ],
    },
    {
      element: <Watch />,
      path: "/watch",
    },
    {
      element: <DefaultLayout />,
      path: "/search",
      children: [
        {
          path: "",
          element: <Search />,
        },
      ],
    },
    {
      element: <DefaultLayout />,
      path: "/genre",
      children: [
        {
          path: ":genre",
          element: <GenrePage />,
        },
      ],
    },
    {
      element: <DefaultLayout />,
      path: "/profile",
      children: [
        {
          path: "",
          element: <Profile />,
        },
      ],
    },
  ],
};

export default authed;
