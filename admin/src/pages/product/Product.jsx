import { Link, useLocation, useNavigate } from "react-router-dom"
import "./product.css"
import { useState } from "react";
import { useContext } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { updateMovie } from "../../context/movieContext/apiCalls";

export default function Product() {
    const location = useLocation();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(location.state.movie);
    const { dispatch } = useContext(MovieContext);

    const handleChange = (e) => {
        const value = e.target.value;
        setMovie({ ...movie, [e.target.name]: value });
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        updateMovie(movie, dispatch);
        navigate("/movies");
    }

    return (
        <div className="product">
            <div className="productTop">
                <div className="productTopRight">
                    <div className="productInfoTop">
                        <img src={movie.img} alt="" className="productInfoImg" />
                        <span className="productName">{movie.title}</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">id:</span>
                            <span className="productInfoValue">{movie._id}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">genre:</span>
                            <span className="productInfoValue">{movie.genre}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">year:</span>
                            <span className="productInfoValue">{movie.year}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">limit:</span>
                            <span className="productInfoValue">{movie.limit}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="productBottom">
                <form className="productForm">
                    <div className="productFormLeft">
                        <label>Movie Title</label>
                        <input type="text" name="title" placeholder={movie.title} onChange={handleChange} />
                        <label>Year</label>
                        <input type="text" name="year" placeholder={movie.year} onChange={handleChange} />
                        <label>Genre</label>
                        {/* <input type="text" name="genre" placeholder={movie.genre} onChange={handleChange} /> */}
                        <select name="genre" id="genre" value={movie.genre} onChange={handleChange}>
                            <option >Genre</option>
                            <option value="action">Action</option>
                            <option value="adventure">Adventure</option>
                            <option value="comedy">Comedy</option>
                            <option value="crime">Crime</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="historical">Historical</option>
                            <option value="horro">Horror</option>
                            <option value="romance">Romance</option>
                            <option value="sci-fi">Sci-fi</option>
                            <option value="thriller">Thriller</option>
                            <option value="western">Western</option>
                            <option value="animation">Animation</option>
                            <option value="drama">Drama</option>
                            <option value="documentary">Documentary</option>
                        </select>
                        <label>Limit</label>
                        <input type="text" name="limit" placeholder={movie.limit} onChange={handleChange} />
                        <label>Duration</label>
                        <input type="text" name="duration" placeholder={movie.duration} onChange={handleChange} />
                        <label>Trailer</label>
                        <input type="text" name="trailer" placeholder={movie.trailer} onChange={handleChange} />
                        <label>Video</label>
                        <input type="text" name="video" placeholder={movie.video} onChange={handleChange} />
                        <label>Image</label>
                        <input type="text" id="img" placeholder={movie.img} name="img" onChange={handleChange} />
                        <label>Image Title</label>
                        <input type="text" id="imgTitle" placeholder={movie.imgTitle} name="imgTitle" onChange={handleChange} />
                        <label>Image Thumbnail</label>
                        <input type="text" id="imgSm" placeholder={movie.imgSm} name="imgSm" onChange={handleChange} />
                    </div>
                    <div className="productFormRight">
                        <div className="productUpload">
                            <img src={movie.img} alt="" className="productUploadImg" />
                        </div>
                        <button className="productButton" onClick={handleUpdate}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
