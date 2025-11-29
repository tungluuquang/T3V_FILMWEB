import "./userList.css"
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import { userRows } from "../../../dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function UserList() {
    const [data, setData] = useState(userRows);

    const handleDelete = (id) => {
        setData(data.filter(p => p.id !== id));
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'username', headerName: 'Username', width: 150, renderCell: (params) => {
                return (
                    <div className="userListUser">
                        <img className="userListImg" src={params.row.avatar} />
                        {params.row.username}
                    </div>
                )
            }
        },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'status', headerName: 'Status', width: 90 },
        { field: 'transaction', headerName: 'Transaction Volume', width: 150 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={"/user/" + params.row.id}>
                            <button className="userListEdit">Edit</button>
                        </Link>
                        <DeleteOutline onClick={() => handleDelete(params.row.id)} className="userListDelete" />
                    </>
                )
            }
        }
    ];
    return (
        <div className="userList">
            <DataGrid
                rows={data}
                disableRowSelectionOnClick
                columns={columns}
                pageSize={5}
                checkboxSelection
            />
        </div>
    )
}
