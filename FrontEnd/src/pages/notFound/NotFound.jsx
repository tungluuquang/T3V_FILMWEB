import { Link } from 'react-router-dom'
import './notFound.scss'

export default function NotFound() {
    return (
        <div className='notFound'>
            <div className='title'>
                <h2>Something went wrong</h2>
                <p>Sorry, we couldn't find the page you were looking for.</p>
                <br />
                <p>To return to T3V's Home Page, click the button below</p>
                <Link className='link' to="/home">
                    <button>Home</button>
                </Link>
            </div>
        </div>
    )
}
