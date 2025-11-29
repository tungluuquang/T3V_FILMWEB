import "./movie.scss";
import { useParams } from "react-router-dom";
import { useRef, useEffect, useContext } from "react";
import {
  FavoriteBorder,
  Favorite,
  PlayArrow,
  Add,
  Share,
  Stars,
  Comment,
  Notes,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import ReviewPanel from "../../components/ReviewPanel/ReviewPanel";
import { useState } from "react";
import axios from "axios";
import { AuthContext } from "../../authContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Movie() {
  const { user } = useContext(AuthContext);
  const [reviewOpen, setReviewOpen] = useState(false);
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const commentStart = useRef();

  const calculateRating = (reviews) => {
    let avg = 0;
    for (let review of reviews) {
      avg += review.rating;
    }
    return avg / (reviews.length !== 0 ? reviews.length : 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const getMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${id}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setMovie((prev) => res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getMovie();
  }, [id]);

  const submitReview = async (review) => {
    try {
      const res = await axios.put(`/api/movies/reviews/${movie._id}`, review, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      const movieRes = await axios.get(`/api/movies/${movie._id}`, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      toast.success("Updated Successfully!", { autoClose: 1000 });
      setMovie((prev) => movieRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFavorite = async () => {
    try {
      const res = await axios.put(
        `/api/users/favorites/${user._id}`,
        { movieId: movie._id },
        {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        }
      );
      const newUser = res.data;
      newUser.accessToken = JSON.parse(
        localStorage.getItem("user")
      ).accessToken;
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success("Updated Successfully!", { autoClose: 1000 });
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!movie ? (
        <div>Loading...</div>
      ) : (
        <>
          {reviewOpen && (
            <ReviewPanel
              onSubmit={submitReview}
              onClose={() => setReviewOpen(false)}
              movie={{ ...movie, rating: calculateRating(movie.reviews) }}
            />
          )}
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--main-color)), url("${movie.img}")`,
            }}
            className="movie"
          ></div>
          <div className="movieContainer">
            <div className="movieContainerLeft">
              <img src={movie.imgSm} alt="" />
              <h1>{movie.title}</h1>
              <div className="tags">
                <span style={{ backgroundColor: "white", color: "black" }}>
                  {movie.limit}+
                </span>
                <span>{movie.year}</span>
                <span>{movie.genre}</span>
              </div>
              <div className="movieInfo">
                <h3>Description:</h3>
                <p>{movie.desc}</p>
              </div>
              <div className="movieInfo">
                <p>
                  <b style={{ fontSize: "20px", marginRight: "10px" }}>
                    Duration:{" "}
                  </b>
                  {movie.duration}
                </p>
              </div>
            </div>
            <div className="movieContainerRight">
              <div className="containerTop">
                <div className="buttonGroup">
                  <Link
                    className="link"
                    to={{ pathname: "/watch" }}
                    state={{ movie: movie }}
                  >
                    <div className="movieButton">
                      <PlayArrow />
                      Watch Now
                    </div>
                  </Link>
                  <div className="movieButton" onClick={handleFavorite}>
                    {user?.favorites.includes(movie._id) ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )}
                    {user?.favorites.includes(movie._id)
                      ? "Unfavorite"
                      : "Favorite"}
                  </div>
                  <div className="movieButton">
                    <Add />
                    Add
                  </div>
                  <div className="movieButton">
                    <Share />
                    Share
                  </div>
                  <div
                    className="movieButton"
                    onClick={() => {
                      commentStart.current.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  >
                    <Comment />
                    Comment
                  </div>
                </div>
                <div
                  onClick={() => setReviewOpen(true)}
                  className="movieRating"
                >
                  <Stars />
                  <h3>{calculateRating(movie.reviews).toFixed(2)}</h3>
                  <p>Rate Now</p>
                </div>
              </div>
              <div className="containerMid">
                <div className="containerDesc">
                  <Notes />
                  <h3>Episodes</h3>
                </div>
                <ul>
                  {/* <Link className="link" to={{ pathname: "/watch" }} state={{ movie: movie }}>
                <li>Ep 1</li>
              </Link> */}
                  {movie.episodes &&
                    movie.episodes.map((episode, ind) => {
                      return (
                        <Link
                          className="link"
                          to={{ pathname: "/watch" }}
                          state={{ movie: movie, video: episode }}
                        >
                          <li>{`Ep ${ind + 1}`}</li>
                        </Link>
                      );
                    })}
                </ul>
              </div>

              <div className="containerMid">
                <div className="containerDesc">
                  <Comment />
                  <h3 ref={commentStart}>Comments ({movie.reviews.length})</h3>
                </div>
                {movie.reviews.map((review) => (
                  <div className="review">
                    <img
                      src={
                        review.user?.profilePic ||
                        "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
                      }
                      alt=""
                    />
                    <div className="reviewText">
                      <div className="reviewUser">
                        <h3>{review.user?.username || "Unknown User"}</h3>
                        <span>{review.createdAt.substring(0, 10)}</span>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
}
