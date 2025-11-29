import { Link, useLocation } from "react-router-dom"
import "./list.css"
import { useState } from "react";
import { useContext } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { updateMovie } from "../../context/movieContext/apiCalls";

export default function List() {
    const location = useLocation();
    const [list, setMovie] = useState(location.state.list);
    const { dispatch } = useContext(MovieContext);

    const handleChange = (e) => {
        const value = e.target.value;
        setMovie({ ...movie, [e.target.name]: value });
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        updateMovie(movie, dispatch);
    }

    return (
        <div className="product">
            <div className="productTitleContainer">
                <h1 className="productTitle">Movie</h1>
                <Link to="/newList">
                    <button className="productAddButton">Create</button>
                </Link>
            </div>
            <div className="productTop">
                <div className="productTopRight">
                    <div className="productInfoTop">
                        <span className="productName">{list.title}</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">id:</span>
                            <span className="productInfoValue">{list._id}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">genre:</span>
                            <span className="productInfoValue">{list.genre}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">type:</span>
                            <span className="productInfoValue">{list.type}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="productBottom">
                <form className="productForm">
                    <div className="productFormLeft">
                        <label>List Title</label>
                        <input type="text" name="title" placeholder={list.title} onChange={handleChange} />
                        <label>Genre</label>
                        <input type="text" name="genre" placeholder={list.genre} onChange={handleChange} />
                        <label>Type</label>
                        <input type="text" name="genre" placeholder={list.type} onChange={handleChange} />
                    </div>
                    <div className="productFormRight">
                        <button className="productButton" onClick={handleUpdate}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
