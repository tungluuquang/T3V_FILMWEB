import { ArrowDropDown, Notifications, Search } from "@mui/icons-material";
import "./navbar.scss";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../authContext/AuthContext";
import { logout } from "../../authContext/AuthActions";
import SearchBar from "../SearchBar/SearchBar.jsx";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { dispatch } = useContext(AuthContext);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <img
            src="https://freeimghost.net/images/2025/04/13/favicon.png"
            alt="favicon"
            border="0"
          />
          <Link to="/home" className="link">
            <span>Homepage</span>
          </Link>
          <Link to="/series" className="link">
            <span>Series</span>
          </Link>
          <Link to="/movies" className="link">
            <span>Movies</span>
          </Link>
          <span>New and Popular</span>
          <span>My list</span>
        </div>
        <div className="right">
          <SearchBar isScrolled={isScrolled} />
          <span>KID</span>
          <Notifications className="icon" />
          <img
            src={
              JSON.parse(localStorage.getItem("user"))?.profilePic ||
              "https://via.placeholder.com/40x40?text=User"
            }
            alt="avatar"
          />
          <div className="profile">
            <ArrowDropDown className="icon" />
            <div className="options">
              <Link
                style={{
                  padding: "10px 0px",
                }}
                className="link"
                to="/profile"
              >
                <span>Profile</span>
              </Link>
              <span>Settings</span>
              <span onClick={() => dispatch(logout())}>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
