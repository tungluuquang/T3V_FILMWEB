import React, { useState } from "react";
import GenreCard from "./genreCard";
import "./genreFilm.scss";

const gradientColors = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f7971e, #ffd200)",
  "linear-gradient(135deg, #00c6ff, #0072ff)",
  "linear-gradient(135deg, #f77062, #fe5196)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
  "linear-gradient(135deg, #30cfd0, #330867)",
  "linear-gradient(135deg, #ff6a00, #ee0979)",
  "linear-gradient(135deg, #f953c6, #b91d73)",
  "linear-gradient(135deg, #667db6, #0082c8, #667db6)",
  "linear-gradient(135deg, #e1eec3, #f05053)",
  "linear-gradient(135deg, #00dbde, #fc00ff)",
];

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Fantasy",
  "Historical",
  "Horror",
  "Romance",
  "Sci-fi",
  "Thriller",
  "Western",
  "Animation",
  "Drama",
  "Documentary",
];

export default function GenreList({ title }) {
  const [showAll, setShowAll] = useState(false);

  const visibleGenres = showAll ? genres : genres.slice(0, 5);
  const hiddenCount = genres.length - 5;

  return (
    <div className="genre-container">
      <div className="genre-title">{title}</div>
      <div className="genre-list">
        {visibleGenres.map((genre, index) => (
          <GenreCard
            key={index}
            title={genre}
            background={gradientColors[index % gradientColors.length]}
          />
        ))}

        {hiddenCount > 0 && (
          <div
            className="genre-card show-more-card"
            onClick={() => setShowAll(!showAll)}
            style={{ background: "linear-gradient(135deg, #232526, #414345)" }}
          >
            <span>{showAll ? "Show Less" : `+${hiddenCount} Genre`}</span>
          </div>
        )}
      </div>
    </div>
  );
}
