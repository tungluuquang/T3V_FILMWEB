import {InfoOutlined, PlayArrow} from "@mui/icons-material";
import "./featured.scss";
import {useState, useEffect} from "react";
import axios from "axios";
import FilmInfo from "../filmInfo/FilmInfo";
import {Link} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";

export default function Featured({type, setGenre}) {
    const [content, setContent] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const getRandomContent = async () => {
            try {
                const url = type ? `/api/movies/random?type=${type}` : `/api/movies/top`;
                console.log(url);
                const res = await axios.get(url, {
                    headers: {
                        token:
                            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
                    },
                });
                setMovies(res.data.slice(0, 6));
                setContent(res.data[0]);
                setCurrentIndex(0);
            } catch (err) {
                console.log(err);
            }
        };

        getRandomContent();
    }, [type]);

    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % movies.length;
                setContent(movies[nextIndex]);
                return nextIndex;
            });
        }, 10000); // 10s

        return () => clearInterval(interval);
    }, [content, movies]);

    return (
        <>
            <div className="featured">
                {type && (
                    <div className="category">
                        <span>{type === "movie" ? "Movies" : "Series"}</span>
                        <select
                            name="genre"
                            id="genre"
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option>Genre</option>
                            <option value="action">Action</option>
                            <option value="adventure">Adventure</option>
                            <option value="comedy">Comedy</option>
                            <option value="crime">Crime</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="historical">Historical</option>
                            <option value="horror">Horror</option>
                            <option value="romance">Romance</option>
                            <option value="sci-fi">Sci-fi</option>
                            <option value="thriller">Thriller</option>
                            <option value="western">Western</option>
                            <option value="animation">Animation</option>
                            <option value="drama">Drama</option>
                            <option value="documentary">Documentary</option>
                        </select>
                    </div>
                )}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={content._id}
                        src={content.img}
                        initial={{x: 50, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        transition={{duration: 0.4, ease: "easeOut"}}
                    />
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={content._id} // Trigger re-animation
                    >
                        <div className="info">
                            <img src={content.imgTitle}/>
                            <span className="desc">{content.desc}</span>
                            <div className="buttons">
                                <Link className="link" to={{pathname: "/watch"}} state={{movie: content}}>
                                    <button className="play">
                                        <PlayArrow/>
                                        <span>Play</span>
                                    </button>
                                </Link>
                                <button onClick={() => setShowDetail(true)} className="more">
                                    <InfoOutlined/>
                                    <span>Info</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {!type && (
                    <div className="thumbnail-carousel">
                        {movies.map((item, index) => (
                            <img
                                key={index}
                                src={item.imgSm || item.img}
                                onClick={() => {
                                    setContent(item);
                                    setCurrentIndex(index);
                                }}
                                style={{
                                    border: content?._id === item._id ? "2px solid white" : "2px solid transparent",
                                    cursor: "pointer",
                                    marginRight: "5px",
                                }}
                            />
                        ))}
                    </div>)}
            </div>
            {showDetail && (
                <FilmInfo
                    film={content}
                    onClose={() => setShowDetail(false)}
                    className="film-info-container"
                />
            )}
        </>
    );
}
