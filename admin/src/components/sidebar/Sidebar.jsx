import { Link } from "react-router-dom";
import "./sidebar.css"
import { List, LineStyle, PlayCircleOutline, SupervisedUserCircleOutlined, Timeline, TrendingUp } from '@mui/icons-material';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">
                        Dashboard
                    </h3>
                    <ul className="sidebarList">
                        <Link className="link" to="/">
                            <li className="sidebarListItem active">
                                <LineStyle className="sidebarIcon" />
                                Home
                            </li>
                        </Link>
                        <li className="sidebarListItem">
                            <Timeline className="sidebarIcon" />
                            Anylytics
                        </li>
                        <li className="sidebarListItem">
                            <Timeline className="sidebarIcon" />
                            Sales
                        </li>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">
                        Quick menu
                    </h3>
                    <ul className="sidebarList">
                        <Link className="link" to="/users">
                            <li className="sidebarListItem">
                                <SupervisedUserCircleOutlined className="sidebarIcon" />
                                Users
                            </li>
                        </Link>
                        <Link className="link" to="/movies">
                            <li className="sidebarListItem">
                                <PlayCircleOutline className="sidebarIcon" />
                                Movies
                            </li>
                        </Link>
                        <Link className="link" to="/lists">
                            <li className="sidebarListItem">
                                <List className="sidebarIcon" />
                                List
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}
