import React, { useEffect, useState, useRef } from "react";
import "./TrendingCard.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Add,
  PlayArrow,
  ThumbDownOutlined,
  ThumbUpOutlined,
} from "@mui/icons-material";

const TrendingCard = ({ filmId, index }) => {
  const [isHover, setIsHover] = useState(false);
  const [film, setFilm] = useState({});
  const cardRef = useRef(null);
  const [alignRight, setAlignRight] = useState(false);

  // Kiểm tra vị trí của card trong viewport
  const checkPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Nếu card ở nửa bên phải viewport, hiển thị hover content về bên trái
      if (rect.right > viewportWidth - 200) {
        setAlignRight(true);
      } else {
        setAlignRight(false);
      }
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${filmId}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setFilm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();

    // Đăng ký event listener cho resize
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, [filmId]);

  const handleMouseEnter = () => {
    setIsHover(true);
    checkPosition();
  };

  return (
    <Link to={`/movie/${film._id}`}>
      <div
        className="trending-card-wrapper"
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className={`trending-card ${isHover ? "hovered" : ""} ${
            alignRight ? "align-right" : ""
          }`}
        >
          <img src={film.imgSm} alt={film.title} />
          <div className="card-rank">{index + 1}</div>

          {isHover && (
            <div className="hover-trending">
              <iframe
                src={film.trailer}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="trailer"
              ></iframe>

              <div className="itemInfo">
                <div className="icons">
                  <PlayArrow className="icon" />
                  <Add className="icon" />
                  <ThumbUpOutlined className="icon" />
                  <ThumbDownOutlined className="icon" />
                </div>

                <div className="itemInfoTop">
                  <span className="item">{film.duration}</span>
                  <span className="limit">+{film.limit}</span>
                  <span className="item">{film.year}</span>
                  <div className="genre">{film.genre}</div>
                </div>

                <div className="desc">{film.desc}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TrendingCard;
