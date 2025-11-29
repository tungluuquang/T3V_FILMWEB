import { Link, useLocation } from "react-router-dom";
import "./watch.scss"
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";

export default function Watch() {
    const location = useLocation();
    const movie = location.state.movie;
    const vid = location.state.video;
    return (
        <div className="watch">
            <Link to={`/movie/${movie._id}`}>
                <div className="back">
                    <ArrowBackOutlined />
                    Home
                </div>
            </Link>
            <iframe className="video" src={vid ?? movie.video} allowFullScreen title="video"></iframe>
        </div>
    )
}