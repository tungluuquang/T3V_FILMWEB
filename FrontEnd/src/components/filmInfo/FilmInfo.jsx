import React, { useEffect, useRef, useState } from "react";
import "./FilmInfo.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

export default function FilmInfo({ film, onClose }) {
  const modalRef = useRef();
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="film-info-container">
      <div className="modal-content" ref={modalRef}>
        <img src={film.img} alt="" />
        <div className="title">
          <h1>{film.title}</h1>
        </div>
        <div className="wrapper-item">
          <div className="item">{film.genre}</div>
          <div className="item">{film.limit}</div>
          <div className="item">{film.year}</div>
          <div className="add-item" onClick={() => alert("Added to list!")}>
            <AddCircleIcon />
          </div>
          <div className="play-container-info">
            <PlayCircleIcon className="playBtn" />
            <p>Play</p>
          </div>
        </div>

        <div className={`desc ${showMore ? "expanded" : ""}`}>
          <p>{film.desc}</p>
          <span className="toggle-show" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Show Less" : "Show More"}
          </span>
        </div>
      </div>
    </div>
  );
}
