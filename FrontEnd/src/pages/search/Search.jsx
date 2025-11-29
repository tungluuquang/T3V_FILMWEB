import Filter from "../../components/Filter/Filter.jsx";
import SearchCard from "../../components/SearchCard/SearchCard.jsx";
import { MdManageSearch } from "react-icons/md";
import { TablePagination, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./search.scss";

function Header({ query }) {
  return (
    <div className="row-header">
      <div className="icon">
        <MdManageSearch size={40} color="white" />
      </div>
      <h3 className="category-name">Kết quả tìm kiếm "{query || "Tất cả"}"</h3>
    </div>
  );
}

export default function Search() {
  const [allMovie, setAllMovie] = useState([]);
  const [searchMovies, setSearchMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    const getSearchMovies = async () => {
      try {
        const response = await axios.get(`/api/movies?title=${searchQuery}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setSearchMovies(response.data);
        setFilteredMovies(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (searchQuery.trim() !== "") {
      getSearchMovies();
    } else {
      setSearchMovies(allMovie); // fallback: hiển thị toàn bộ khi không có từ khóa
    }
  }, [searchQuery]);

  useEffect(() => {
    const getAllMovie = async () => {
      try {
        const res = await axios.get("/api/movies", {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        console.log(res.data);
        setAllMovie(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getAllMovie();
  }, []);

  // Scroll to top when page or rowsPerPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, rowsPerPage]);

  const handleFilterAplly = (filters) => {
    let result = [...searchMovies];
    if (filters.genre !== "Tất cả") {
      result = result.filter(
        (movie) => movie.genre === filters.genre.toLowerCase()
      );
    }
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
    <div className="search">
      <div className="search-content">
        <Header query={searchQuery} />
        <div className="tab-content">
          <Filter onFilterApply={handleFilterAplly} />
          {filteredMovies.length === 0 && (
            <p style={{ color: "#fff", marginTop: "1rem" }}>
              Không tìm thấy phim {searchQuery} nào.
            </p>
          )}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
                xl: "repeat(5, 1fr)",
              },
              rowGap: 0,
            }}
          >
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
          </Box>
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
