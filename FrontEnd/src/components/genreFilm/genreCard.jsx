import React from "react";
import { useNavigate } from "react-router-dom";
import "./genreFilm.scss";

export default function GenreCard({ title, background }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/genre/${title.toLowerCase()}`);
  };

  return (
    <div className="genre-card" style={{ background }} onClick={handleClick}>
      <h3>{title}</h3>
      <p>Xem chủ đề &rarr;</p>
    </div>
  );
}
