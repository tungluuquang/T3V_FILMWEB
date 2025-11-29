import { useEffect, useState } from "react"
import "./newList.css"
import { useContext } from "react";
import { ListContext } from "../../context/listContext/ListContext";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { getMovies } from "../../context/movieContext/apiCalls";
import { createList } from "../../context/listContext/apiCalls";
import { useNavigate } from "react-router-dom";

export default function NewProduct() {
    const [list, setList] = useState({});
    const navigate = useNavigate();
    const { dispatch } = useContext(ListContext);
    const { movies, dispatch: dispatchMovie } = useContext(MovieContext);

    const handleChange = (e) => {
        const value = e.target.value;
        setList({ ...list, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createList(list, dispatch);
        navigate("/lists");
    }

    const handleSelect = (e) => {
        let value = Array.from(e.target.selectedOptions, (option) => option.value);
        setList({ ...list, [e.target.name]: value });
    }

    useEffect(() => {
        getMovies(dispatchMovie);
    }, [dispatchMovie])

    return (
        <div className="newProduct">
            <h1 className="addProductTitle">New List</h1>
            <form className="addProductForm">
                <div className="formLeft">
                    <div className="addProductItem">
                        <label>Title</label>
                        <input type="text" placeholder="title" name="title" onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Genre</label>
                        <input type="text" placeholder="genre" name="genre" onChange={handleChange} />
                    </div>
                    <div className="addProductItem">
                        <label>Type</label>
                        <select name="type" id="type" onChange={handleChange}>
                            <option value="">Type</option>
                            <option value="series">Series</option>
                            <option value="movie">Movie</option>
                        </select>
                    </div>
                </div>
                <div className="formRight">
                    <div className="addProductItem">
                        <label>Content</label>
                        <select style={{ height: "300px" }} multiple name="content" id="content" onChange={handleSelect}>
                            {movies.map(movie => (
                                <option key={movie._id} value={movie._id}>{movie.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="addProductButton" onClick={handleSubmit}>Create</button>
            </form>
        </div>
    )
}
