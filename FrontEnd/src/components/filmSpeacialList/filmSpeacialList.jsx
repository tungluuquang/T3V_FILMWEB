import React, { useRef, useState, useEffect } from "react";
import MovieSpecialCard from "../filmSpecialCard/MovieSpecialCard";
import "./filmSpeacialList.scss";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const FilmSpecialList = ({ movies, title }) => {
  const scrollRef = useRef();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setShowButtons(movies.length > 4);
  }, [movies]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 460;
    scrollRef.current.scrollLeft +=
      direction === "left" ? -scrollAmount : scrollAmount;
  };

  return (
    <div className="movie-list">
      <h2>{title}</h2>
      <div className="scroll-wrapper">
        {showButtons && (
          <button className="scroll-btn left" onClick={() => scroll("left")}>
            <ArrowBackIosNewIcon />
          </button>
        )}
        <div className="movie-scroll" ref={scrollRef}>
          {movies.map((movie, index) => (
            <MovieSpecialCard film_id={movie._id} index={index + 1} />
          ))}
        </div>
        {showButtons && (
          <button className="scroll-btn right" onClick={() => scroll("right")}>
            <ArrowForwardIosIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilmSpecialList;
