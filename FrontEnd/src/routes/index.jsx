import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import authed from "./authed.jsx"
import nonAuthed from "./nonAuthed.jsx"
import notFound from "./notFound.jsx"

const route = createBrowserRouter([authed, nonAuthed, notFound])

export default function Router() {
    return <RouterProvider router={route} />
}