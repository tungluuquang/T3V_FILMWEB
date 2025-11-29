import { useEffect, useState } from "react";
import axios from "axios";

import Featured from "../../components/featured/Featured.jsx";
import List from "../../components/list/List.jsx";
import TrendingList from "../../components/Trending/TrendingList.jsx";
import FilmSpecialList from "../../components/filmSpeacialList/filmSpeacialList.jsx";

import "./home.scss";
import GenreList from "../../components/genreFilm/genreList.jsx";

export default function Home({ type }) {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);
  const [allMovie, setAllMovie] = useState([]);
  const [topMovie, setTopMovie] = useState([]);
  const [filmRomance, setFilmRomance] = useState([]);
  const [recommendedMovie, setRecommendedMovie] = useState([]);

  const getRecommended = async () => {
    try {
      const url = `/recommender/${
        JSON.parse(localStorage.getItem("user"))._id
      }`;
      const res = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const movieArr = await Promise.all(
        Object.keys(res.data.data).map(async (key) => {
          const subRes = await axios.get(`/api/movies/${key}`, {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          });
          return subRes.data;
        })
      );
      return movieArr;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchRecommed = async () => {
      const recommended = await getRecommended();
      setRecommendedMovie(recommended);
    };

    fetchRecommed();
  }, []);

  useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `/api/lists${type ? "?type=" + type : ""}${
            genre ? "&genre=" + genre : ""
          }`,
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        setLists(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getAllMovie = async () => {
      try {
        if (genre) {
          const res = await axios.get(`/api/movies?genre=${genre}`, {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          });
          setAllMovie(res.data);
        } else {
          const res = await axios.get("/api/movies?limit=20", {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          });
          setAllMovie(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getTopMovies = async () => {
      try {
        const res = await axios.get("/api/movies/top", {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setTopMovie(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getTopRomance = async () => {
      try {
        const res = await axios.get("/api/movies?genre=romance", {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setFilmRomance(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getRandomLists();
    getAllMovie();
    getTopMovies();
    getTopRomance();
  }, [type, genre]);

  return (
    <div className="home">
      <Featured type={type} setGenre={setGenre} />
      <GenreList title={"Genre"} />
      <FilmSpecialList movies={topMovie} title={"Top Films"} />
      <TrendingList
        films={recommendedMovie ?? []}
        title={"Recommended For You"}
      />
      <List
        list={{
          title: "Latest On T3V",
          content: allMovie.map((movie) => movie._id),
        }}
      />
      {lists.map((list) => (
        <List key={list._id} list={list} />
      ))}
      <TrendingList films={filmRomance} title={"Top Romance"} />
    </div>
  );
}
