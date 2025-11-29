import NonAuthed from "../layouts/NonAuthed"
import Login from "../pages/login/Login"
import Register from "../pages/register/Register"

const nonAuthed = {
    element: <NonAuthed />,
    children: [
        {
            element: <Register />,
            path: ""
        },
        {
            element: <Login />,
            path: 'login'
        }
    ]
}

export default nonAuthed