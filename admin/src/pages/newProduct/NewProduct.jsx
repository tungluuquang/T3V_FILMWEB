import { useState } from "react"
import "./newProduct.css"
import { createMovie, updateMovie } from "../../context/movieContext/apiCalls";
import { useContext } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { useNavigate } from "react-router-dom"
import { URL as FilmUrl } from "../../constants/OphimApi";
import axios from 'axios'

export default function NewProduct() {
    const [movie, setMovie] = useState({});
    const [apiTitle, setApiTitle] = useState("");
    const [apiError, setApiError] = useState(false)

    const { dispatch } = useContext(MovieContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;
        setMovie({ ...movie, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createMovie(movie, dispatch);
        navigate("/movies");
    }

    const handleApiSearchChange = (e) => {
        setApiTitle(prev => e.target.value)
    }

    const handleApiSubmit = async () => {
        setApiError(false)
        try {
            const title = apiTitle.trim().replaceAll(" ", "-")
            const res = await axios.get(`${FilmUrl.GET_FILM_BASE_URL}${title}`)
            const metadata = res.data.movie
            const episodes = res.data.episodes[0].server_data.map(video => {
                return video.link_embed
            })
            setMovie(prev => ({ ...prev, img: metadata.poster_url }))
            setMovie(prev => ({ ...prev, imgSm: metadata.thumb_url }))
            setMovie(prev => ({ ...prev, title: metadata.name }))
            setMovie(prev => ({ ...prev, desc: metadata.content }))
            setMovie(prev => ({ ...prev, year: metadata.year }))
            setMovie(prev => ({ ...prev, duration: metadata.time }))
            setMovie(prev => ({ ...prev, video: res.data.episodes[0].server_data[0].link_embed }))
            setMovie(prev => ({ ...prev, episodes }))
        }
        catch (err) {
            console.log(err)
            setApiError(true)
        }
    }

    return (
        <div className="newProduct">
            <h1 className="addProductTitle">New Film</h1>
            <div className="apiFind">
                <h2>Add Using Third party's API</h2>
                <input type="text" placeholder="film title" onChange={handleApiSearchChange} />
                <button onClick={handleApiSubmit} className="addProductButton">Find</button>
            </div>
            {apiError && <p style={{ color: "red" }}>Cannot find film!</p>}
            <div className="addMovieContainer">
                <form className="addProductForm">
                    <div className="addProductItem">
                        <label>Image</label>
                        <input type="text" id="img" placeholder="image link" name="img" value={movie.img} onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Title image</label>
                        <input type="text" id="imgTitle" placeholder="image link" value={movie.imgTitle} name="imgTitle" onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Thumbnail image</label>
                        <input type="text" id="imgSm" placeholder="image link" value={movie.imgSm} name="imgSm" onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Title</label>
                        <input type="text" placeholder="title" name="title" value={movie.title} onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Description</label>
                        <input type="text" placeholder="description" name="desc" value={movie.desc} onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Year</label>
                        <input type="text" placeholder="year" name="year" value={movie.year} onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Genre</label>
                        <select name="genre" id="genre" onChange={handleChange}>
                            <option >Genre</option>
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
                    <div className="addProductItem">
                        <label>Duration</label>
                        <input type="text" placeholder="duration" name="duration" value={movie.duration} onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Limit</label>
                        <input type="text" placeholder="limit" name="limit" value={movie.limit} onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Is Series?</label>
                        <select name="isSeries" id="isSeries" onChange={handleChange}>
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                        </select>
                    </div>
                    <div className="addProductItem" >
                        <label>Trailer</label>
                        <input type="text" name="trailer" placeholder="embedding link" value={movie.trailer} onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Video</label>
                        <input type="text" name="video" placeholder="embedding link" value={movie.video} onChange={handleChange} />
                    </div>
                    <button className="addProductButton" onClick={handleSubmit}>Create</button>
                </form>

                {movie.img && <div className="moviePreview">
                    <h2>{movie.title}</h2>
                    <div className="moviePreviewIte">
                        <h3>Title image</h3>
                        <img src={movie.imgTitle} alt="" />
                    </div>
                    <div className="moviePreviewItem">
                        <h3>Poster image</h3>
                        <img src={movie.img} alt="" />
                    </div>
                    <div className="moviePreviewItem">
                        <h3>Thumbnail image</h3>
                        <img src={movie.imgSm} alt="" />
                    </div>
                </div>}
            </div>
        </div>
    )
}
