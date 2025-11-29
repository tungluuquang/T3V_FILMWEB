import axios from "axios"
import { createListFailure, createListStart, createListSuccess, getListsStart, getListsFailure, getListsSuccess, deleteListFailure, deleteListStart, deleteListSuccess } from "./ListAction";

export const getLists = async (dispatch) => {
    dispatch(getListsStart())
    try {
        const res = await axios.get("/api/lists", {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        });
        dispatch(getListsSuccess(res.data));
    }
    catch (err) {
        dispatch(getListsFailure());
    }
}

export const createList = async (list, dispatch) => {
    dispatch(createListStart());
    try {
        const res = await axios.post(`/api/lists/`, list, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        });
        dispatch(createListSuccess(res.data));
    }
    catch (err) {
        dispatch(createListFailure());
    }
}

// export const updateMovie = async (movie, dispatch) => {
//     dispatch(updateMovieStart());
//     try {
//         const res = await axios.put(`/api/movies/${movie._id}`, movie, {
//             headers: {
//                 token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
//             }
//         });
//         dispatch(updateMovieSuccess(res.data));
//     }
//     catch (err) {
//         dispatch(updateMovieFailure());
//     }
// }


export const deleteList = async (id, dispatch) => {
    dispatch(deleteListStart())
    try {
        await axios.delete(`/api/lists/${id}`, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        });
        dispatch(deleteListSuccess(id));
    }
    catch (err) {
        dispatch(deleteListFailure());
    }
}