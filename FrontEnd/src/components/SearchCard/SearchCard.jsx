import "./searchcard.scss";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoIcon from "@mui/icons-material/Info";
import { Link, useNavigate } from "react-router-dom";

function Popup({ movie, navigate }) {
  return (
    <div className="movie-popup">
      <div className="popup-poster-wrapper">
        <img className="popup-poster" src={movie.imgSm} alt={movie.title} />
      </div>

      <div className="popup-info">
        <h3>{movie.title}</h3>

        <div className="popup-buttons-row">
          <button
            className="watch-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie._id}`);
            }}
          >
            Xem ngay
          </button>
          <Button
            className="like"
            variant="outlined"
            size="small"
            color="neutral"
            startIcon={<FavoriteIcon fontSize="inherit" />}
          >
            Thích
          </Button>
          <button
            className="info"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie._id}`);
            }}
          >
            Chi tiết
          </button>
        </div>
        <div className="popup-meta-row">
          <span className="limit">+{movie.limit}</span>
          <span className="item">{movie.duration}</span>
          <span className="genre">{movie.genre}</span>
          <span className="item">{movie.year}</span>
          <span className="hd">HD</span>
        </div>
      </div>
    </div>
  );
}

export default function SearchCard({ movieId, index }) {
  const [movie, setMovie] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${movieId}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setMovie(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMovie();
  }, [movieId]);
  return (
    <div
      className="search-card-wrapper"
      onClick={() => navigate(`/movie/${movie._id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="search-card">
        <img className="movie-thumbnail" src={movie.imgSm} alt={movie.title} />
        <h3>{movie.title}</h3>
      </div>
      <Popup movie={movie} navigate={navigate} />
    </div>
  );
}
