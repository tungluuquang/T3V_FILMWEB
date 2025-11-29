import "./topbar.css"
import { Language, NotificationsNone, Settings } from '@mui/icons-material';

export default function Topbar() {
    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">
                        Netflix Admin
                    </span>
                </div>
                <div className="topRight">
                    <div className="topbarIconContainer">
                        <NotificationsNone />
                        <span className="topIconBadge">
                            2
                        </span>
                    </div>
                    <div className="topbarIconContainer">
                        <Language />
                        <span className="topIconBadge">
                            2
                        </span>
                    </div>
                    <div className="topbarIconContainer">
                        <Settings />
                        <span className="topIconBadge">
                            2
                        </span>
                    </div>
                    <img src="https://i.pinimg.com/736x/1a/d6/f5/1ad6f55ddd058398686b1955a17b0e5b.jpg" alt="" className="topAvatar" />
                </div>
            </div>
        </div>
    )
}
