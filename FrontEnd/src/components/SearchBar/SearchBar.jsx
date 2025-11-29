// SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { Search } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './searchbar.scss';

function MovieSuggestionItem({ movie, onClick }) {
  return (
    <div className="suggestion-item" onClick={() => onClick(movie)}>
      <div className="movie-poster">
        <img 
          src={movie.imgSm || movie.img} 
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/50x75?text=No+Image';
          }}
        />
      </div>
      <div className="movie-info">
        <div className="movie-title">{movie.title}</div>
        <div className="movie-desc">
          {movie.desc?.length > 100 
            ? `${movie.desc.substring(0, 100)}...` 
            : movie.desc}
        </div>
        <div className="movie-meta">
          <span className="year">{movie.year}</span>
          {movie.duration && (
            <span className="duration">{movie.duration}</span>
          )}
          {movie.genre && (
            <span className="genre">{movie.genre}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchBar({ isScrolled }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === '') {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/movies?title=${searchTerm}`, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setIsDropdownVisible(false);
      setSearchTerm("");
    }
  };

  const handleSelectMovie = (movie) => {
    setSearchTerm(movie.title);
    setIsDropdownVisible(false);
    console.log(movie);
    navigate(`/movie/${movie._id}`);
    setSearchTerm("");
  };

  return (
    <div className={`search-container ${isScrolled ? 'scrolled' : ''}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="navbar-search-form">
        <input
          type="text"
          placeholder="Tìm phim..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownVisible(true);
          }}
          onFocus={() => setIsDropdownVisible(true)}
        />
        <button type="submit" className="search-btn">
          <Search className="icon"/>
        </button>

        {isDropdownVisible && searchTerm.trim() !=='' && (
          <div className="search-dropdown">
            {isLoading ? (
              <div className="loading">Đang tìm kiếm...</div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="suggestions-list">
                  {suggestions.slice(0, 5).map((movie) => (
                    <MovieSuggestionItem 
                      key={movie._id}
                      movie={movie}
                      onClick={handleSelectMovie}
                    />
                  ))}
                </div>
                {suggestions.length > 5 && (
                  <div 
                    className="show-more"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
                      setIsDropdownVisible(false);
                    }}
                  >
                    Xem thêm {suggestions.length - 5} kết quả khác...
                  </div>
                )}
              </>
            ) : searchTerm.trim() !== '' && (
              <div className="no-results">Không tìm thấy kết quả</div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}