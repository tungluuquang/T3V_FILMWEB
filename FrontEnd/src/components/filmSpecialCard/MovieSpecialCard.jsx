import React, { useEffect, useState } from "react";
import "./MovieSpecialCard.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const MovieSpecialCard = ({ film_id, index }) => {
    const [film, setFilm] = useState({});

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axios.get(`/api/movies/${film_id}`, {
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
    }, [film_id]);
    return (
        <Link to={`/movie/${film_id}`} className='link'>
            <div className={`movie-card ${index % 2 === 0 ? "cut-left" : "cut-right"}`}>
                <div className="poster-container">
                    <img src={film.imgSm} alt={film.title} className="poster" />
                </div>

                <div className="info">
                    <h3 className="rank">{index}</h3>
                    <div className="titles">
                        <h4 className="title">{film.title}</h4>
                        <p className="meta">
                            {film.year} • Category: <span>{film.genre}</span>
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieSpecialCard;
