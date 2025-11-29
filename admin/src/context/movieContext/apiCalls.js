import { deleteMovieFailure, deleteMovieStart, deleteMovieSuccess, getMoviesFailure, getMoviesStart, getMoviesSuccess, createMovieFailure, createMovieStart, createMovieSuccess, updateMovieStart, updateMovieSuccess, updateMovieFailure } from "./MovieActions.js"
import axios from "axios"

export const getMovies = async (dispatch) => {
    dispatch(getMoviesStart())
    try {
        const res = await axios.get("/api/movies", {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        });
        dispatch(getMoviesSuccess(res.data));
    }
    catch (err) {
        dispatch(getMoviesFailure());
    }
}

export const createMovie = async (movie, dispatch) => {
    dispatch(createMovieStart());
    try {
        const res = await axios.post(`/api/movies/`, movie, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        });
        dispatch(createMovieSuccess(res.data));
    }
    catch (err) {
        dispatch(createMovieFailure());
    }
}

export const updateMovie = async (movie, dispatch) => {
    dispatch(updateMovieStart());
    try {
        const res = await axios.put(`/api/movies/${movie._id}`, movie, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        });
        dispatch(updateMovieSuccess(res.data));
    }
    catch (err) {
        dispatch(updateMovieFailure());
    }
}


export const deleteMovie = async (id, dispatch) => {
    dispatch(deleteMovieStart())
    try {
        await axios.delete(`/api/movies/${id}`, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        });
        dispatch(deleteMovieSuccess(id));
    }
    catch (err) {
        dispatch(deleteMovieFailure());
    }
}