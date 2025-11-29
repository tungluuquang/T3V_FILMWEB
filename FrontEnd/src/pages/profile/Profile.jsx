// vi.mock("@mui/icons-material", () => ({
//     Male: () => "MaleIcon",
//     Female: () => "FemaleIcon",
// }));

import { useContext, useState } from "react"
import { AuthContext } from "../../authContext/AuthContext"
import { Male, Female } from "@mui/icons-material";
import "./profile.scss"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
    const { user } = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState(user)

    const handleChange = (e) => {
        setUserInfo(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.put(`/api/users/${userInfo._id}`, userInfo, {
                headers: {
                    token:
                        "Bearer " +
                        JSON.parse(localStorage.getItem("user")).accessToken,
                },
            })
            userInfo.accessToken = JSON.parse(localStorage.getItem("user")).accessToken
            localStorage.setItem("user", JSON.stringify(userInfo))
            toast.success("Updated Successfully!", { autoClose: 1000 });
            setTimeout(() => window.location.reload(), 2000)
        }
        catch (error) {
            console.log(error)
            toast.error("Something Went Wrong", { autoClose: 1000 });
            setTimeout(() => window.location.reload(), 2000)
        }
    }

    return (
        <div className="profileContainer">
            <div className="leftContainer">
                <h2>Account Management</h2>
                <img src={userInfo.profilePic} alt="profile picture" />
                <div className="inputField">
                    <label htmlFor="">Old Password</label>
                    <input id="oldPassword" name="oldPassword" type="text" placeholder="Old password" />
                </div>
                <div className="inputField">
                    <label htmlFor="">New Password</label>
                    <input id="password" name="password" type="text" placeholder="New password" />
                </div>
                <button>Change Password</button>
            </div>
            <form onSubmit={handleSubmit} className="rightContainer">
                <div className="header">
                    <h2>Profile Information</h2>
                    <p>Fill in more information for us to suggest the best movie for you!</p>
                </div>
                <div className="inputField">
                    <label htmlFor="username">Username (Required)</label>
                    <input name="username" id="username" type="text" placeholder="Username" onChange={handleChange} value={userInfo.username} required />
                </div>
                <div className="inputField">
                    <label htmlFor="email">Email (Required)</label>
                    <input name="email" id="email" type="email" placeholder="Email" onChange={handleChange} value={userInfo.email} required />
                </div>
                <div className="inputField">
                    <label htmlFor="profilePic">Profile Picture URL</label>
                    <input name="profilePic" id="profilePic" type="text" placeholder="Profile Picture" onChange={handleChange} value={userInfo.profilePic} />
                </div>
                <div className="inputField">
                    <label htmlFor="age">Age</label>
                    <input type="number" name="age" id="age" placeholder="Age" onChange={handleChange} value={userInfo?.age} />
                </div>
                <div className="inputField">
                    <label htmlFor="favoriteGenres">Favorite Genre</label>
                    <select name="favoriteGenre" id="favoriteGenre" onChange={handleChange} value={userInfo?.favoriteGenre}>
                        <option>Genre</option>
                        <option value="action">Action</option>
                        <option value="adventure">Adventure</option>
                        <option value="comedy">Comedy</option>
                        <option value="crime">Crime</option>
                        <option value="fantasy">Fantasy</option>
                        <option value="historical">Historical</option>
                        <option value="horror">Horror</option>
                        <option value="romance">Romance</option>
                        <option value="sci-fi">Sci-fi</option>
                        <option value="thriller">Thriller</option>
                        <option value="western">Western</option>
                        <option value="animation">Animation</option>
                        <option value="drama">Drama</option>
                        <option value="documentary">Documentary</option>
                    </select>
                </div>
                <div style={{ width: "100%" }} className="inputField">
                    <label>Gender</label>
                    <div className="radioGroup">
                        <label className="radioItem">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={userInfo?.gender === 'male'}
                                onChange={handleChange}
                            />
                            <Male />
                            Male
                        </label>

                        <label className="radioItem">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={userInfo?.gender === 'female'}
                                onChange={handleChange}
                            />
                            <Female />
                            Female
                        </label>
                    </div>
                </div>
                <button>Submit</button>
            </form>
            <ToastContainer />
        </div>
    )
}
