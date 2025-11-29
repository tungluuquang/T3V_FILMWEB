import React, { useEffect, useRef, useState } from "react";
import TrendingCard from "../TrendingCard/TrendingCard";
import "./TrendingList.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { AlternateEmail } from "@mui/icons-material";
const TrendingList = ({ films, title }) => {
  const scrollRef = useRef();
  const [showButtons, setShowButtons] = useState(false);
  useEffect(() => {
    setShowButtons(films.length > 4);
  }, [films]);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;
    const scrollAmout = 250;
    direction === "left"
      ? (current.scrollLeft -= scrollAmout)
      : (current.scrollLeft += scrollAmout);
  };
  return (
    <div className="trending-list">
      <h2 className="trending-title">{title}</h2>
      {films.length ? (
        <div className="scroll-wrapper-main">
          {showButtons && (
            <button className="scroll-btn left" onClick={() => scroll("left")}>
              <ArrowBackIosNewIcon />
            </button>
          )}
          <div className="scroll-wrapper">
            <div className="trending-scroll" ref={scrollRef}>
              {films.map((film, index) => (
                <TrendingCard key={film.id} filmId={film._id} index={index} />
              ))}
            </div>
          </div>
          {showButtons && (
            <button
              className="scroll-btn right"
              onClick={() => scroll("right")}
            >
              <ArrowForwardIosIcon />
            </button>
          )}
        </div>
      ) : (
        <h3>Failed to fetch API</h3>
      )}
    </div>
  );
};

export default TrendingList;
