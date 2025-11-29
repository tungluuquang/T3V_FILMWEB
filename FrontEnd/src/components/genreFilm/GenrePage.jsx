import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, TablePagination } from "@mui/material";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import Filter from "../Filter/Filter";
import SearchCard from "../SearchCard/SearchCard";
import TrendingCard from "../TrendingCard/TrendingCard";
import "./genreFilm.scss";

function Header({ genre }) {
  return (
    <div className="row-header">
      <h3 className="category-name">Phim thể loại "{genre}"</h3>
    </div>
  );
}

export default function GenrePage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { genre } = useParams();

  useEffect(() => {
    const getMoviesByGenre = async () => {
      try {
        // Log the raw genre from URL
        console.log("Raw genre from URL:", genre);

        // Get all movies first to check the genre format in database
        const allMoviesResponse = await axios.get("/api/movies", {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        console.log(
          "Sample movie genres from database:",
          allMoviesResponse.data.slice(0, 3).map((m) => m.genre)
        );

        // Make the genre-specific request
        const response = await axios.get(`/api/movies?genre=${genre}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        console.log("API Response for genre:", genre, ":", response.data);

        if (response.data.length === 0) {
          console.log("No movies found for genre:", genre);
          // Try with lowercase
          const lowercaseResponse = await axios.get(
            `/api/movies?genre=${genre.toLowerCase()}`,
            {
              headers: {
                token:
                  "Bearer " +
                  JSON.parse(localStorage.getItem("user")).accessToken,
              },
            }
          );
          console.log(
            "API Response for lowercase genre:",
            genre.toLowerCase(),
            ":",
            lowercaseResponse.data
          );
          setMovies(lowercaseResponse.data);
          setFilteredMovies(lowercaseResponse.data);
        } else {
          setMovies(response.data);
          setFilteredMovies(response.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        console.error("Error details:", error.response?.data);
      }
    };

    if (genre) {
      getMoviesByGenre();
    }
  }, [genre]);

  // Scroll to top when genre or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [genre, page]);

  const handleFilterApply = (filters) => {
    let result = [...movies];
    if (filters.year !== "Tất cả") {
      result = result.filter((movie) => movie.year === filters.year);
    }
    setFilteredMovies(result);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="genre-page">
      <div className="genre-content">
        <Header genre={genre} />
        <div className="tab-content">
          <div className="filter-container">
            <Filter onFilterApply={handleFilterApply} />
          </div>
          {filteredMovies.length === 0 && (
            <p style={{ color: "#fff", marginTop: "1rem" }}>
              Không tìm thấy phim thể loại {genre}.
            </p>
          )}
          <div className="movie-grid">
            {filteredMovies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((movie, index) => (
                <Box key={movie._id} sx={{ overflow: "visible" }}>
                  <SearchCard
                    key={movie.id}
                    movieId={movie._id}
                    index={index}
                  />
                </Box>
              ))}
          </div>
          <TablePagination
            className="pagination"
            component="div"
            count={filteredMovies.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[4, 8, 12, 16, 20]}
            sx={{
              color: "white",
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  color: "white",
                },
              ".MuiSvgIcon-root": {
                color: "white",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
