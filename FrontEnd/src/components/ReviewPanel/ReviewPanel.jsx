import { useState } from "react";
import "./reviewPanel.scss"
import { Stars, SentimentDissatisfied, SentimentVeryDissatisfied, SentimentNeutral, SentimentSatisfied, SentimentVerySatisfied } from "@mui/icons-material";

export default function ReviewPanel({ onSubmit, onClose, movie }) {
    const userPastReview = movie.reviews.filter(review => {
        return review.user._id === JSON.parse(localStorage.getItem("user"))._id
    })[0]

    const [reviewInfo, setReviewInfo] = useState({
        rating: userPastReview ? userPastReview.rating : 0,
        comment: userPastReview ? userPastReview.comment : "",
        user: JSON.parse(localStorage.getItem("user"))._id
    })

    const [invalid, setInvalid] = useState(false)

    const handleClick = (rating) => {
        setInvalid(false)
        setReviewInfo(prev => ({ ...prev, rating }))
    }

    const handleTextChange = (e) => {
        setReviewInfo(prev => ({ ...prev, comment: e.target.value }))
    }

    const handleSubmit = () => {
        if (reviewInfo.rating != 0) {
            onSubmit(reviewInfo)
            onClose()
        }
        else {
            setInvalid(true)
        }
    }


    return (
        <div className="reviewPanel">
            <div className="container">
                <div className="containerTop">
                    <h3>{movie.title}</h3>
                    <div className="ratingInfo">
                        <Stars />
                        <span> {movie.rating.toFixed(2)} / 5</span>
                        <span style={{ color: "gray" }}>({movie.reviews.length} reviews)</span>
                    </div>
                </div>
                <div className="containerMid">
                    <div className={`ratingWrapper ${reviewInfo.rating === 1 ? "clicked" : ""}`} onClick={() => handleClick(1)}>
                        <SentimentVeryDissatisfied className="icon" sx={{ fontSize: 50 }} />
                        <p>Very Bad</p>
                    </div>
                    <div className={`ratingWrapper ${reviewInfo.rating === 2 ? "clicked" : ""}`} onClick={() => handleClick(2)}>
                        <SentimentDissatisfied className="icon" sx={{ fontSize: 50 }} />
                        <p>Bad</p>
                    </div>
                    <div className={`ratingWrapper ${reviewInfo.rating === 3 ? "clicked" : ""}`} onClick={() => handleClick(3)}>
                        <SentimentNeutral className="icon" sx={{ fontSize: 50 }} />
                        <p>Average</p>
                    </div>
                    <div className={`ratingWrapper ${reviewInfo.rating === 4 ? "clicked" : ""}`} onClick={() => handleClick(4)}>
                        <SentimentSatisfied className="icon" sx={{ fontSize: 50 }} />
                        <p>Great</p>
                    </div>
                    <div className={`ratingWrapper ${reviewInfo.rating === 5 ? "clicked" : ""}`} onClick={() => handleClick(5)}>
                        <SentimentVerySatisfied className="icon" sx={{ fontSize: 50 }} />
                        <p>Very Great</p>
                    </div>
                </div>
                <textarea value={reviewInfo.comment} onChange={handleTextChange} type="text" placeholder="Leave a comment (optional)" />
                <div className="buttonGroup">
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={onClose}>Close</button>
                </div>
                {invalid && <p style={{ color: "red" }}>Please select a rating!</p>}
            </div>
        </div>
    )
}
