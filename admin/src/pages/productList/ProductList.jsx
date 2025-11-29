import "./productList.css"
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import { productRows } from "../../../dummyData";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext"
import { deleteMovie, getMovies } from "../../context/movieContext/apiCalls";

export default function ProductList() {
    const [data, setData] = useState(productRows);
    const { movies, dispatch } = useContext(MovieContext);

    useEffect(() => {
        getMovies(dispatch);
    }, [dispatch])

    const handleDelete = (id) => {
        deleteMovie(id, dispatch);
    }

    const columns = [
        { field: '_id', headerName: 'ID', width: 90 },
        {
            field: 'movie', headerName: 'Movie', width: 300, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params.row.img} />
                        {params.row.title}
                    </div>
                )
            }
        },
        { field: 'genre', headerName: 'Genre', width: 150 },
        { field: 'year', headerName: 'Year', width: 150 },
        { field: 'limit', headerName: 'Limit', width: 150 },
        { field: 'isSeries', headerName: 'isSeries', width: 150 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={"/product/" + params.row._id} state={{ movie: params.row }}>
                            <button className="productListEdit">Edit</button>
                        </Link>
                        <DeleteOutline onClick={() => handleDelete(params.row._id)} className="productListDelete" />
                    </>
                )
            }
        }
    ];
    return (
        <div className="productList">
            <div style={{ marginBottom: "30px", padding: "20px" }} className="productTitleContainer">
                <h1 className="productTitle">Films</h1>
                <Link to="/newProduct">
                    <button className="productAddButton">Create</button>
                </Link>
            </div>
            <DataGrid
                rows={movies}
                disableRowSelectionOnClick
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                    },
                }}
                checkboxSelection
                getRowId={r => r._id}
            />
        </div>
    )
}
