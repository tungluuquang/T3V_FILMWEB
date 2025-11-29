import { useState } from "react";
import { MdTune } from "react-icons/md";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import "./filter.scss";

const filterOptions = {
    genre: ["Tất cả", "Action", "Fantasy", "Comedy", "Romance"],
    year: ["Tất cả", "2024", "2023", "2022"],
};

export default function Filter({ onFilterApply }) {
    const [filters, setFilters] = useState({
        genre: "Tất cả",
        year: "Tất cả",
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: value,
        }));
    };

    const handleApply = () => {
        if (onFilterApply) {
            onFilterApply(filters);
        }
    };

    const handleReset = () => {
        setFilters({
            genre: "Tất cả",
            year: "Tất cả",
        });
    };

    return (
        <div className="filter">
            <div className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                <MdTune size={20} />
                <span>Bộ lọc</span>
            </div>

            <div className={`filter-elements ${showFilters ? "show" : ""}`}>
              <div className={"filter-wrapper"}>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2,
                    }}
                >
                    {Object.entries(filterOptions).map(([type, options]) => (
                        <FormControl key={type} size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </InputLabel>
                            <Select
                                value={filters[type]}
                                label={type.charAt(0).toUpperCase() + type.slice(1)}
                                onChange={(e) => handleFilterChange(type, e.target.value)}
                            >
                                {options.map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ))}
                </Box>

                <Box sx={{ textAlign: "right" }}>
                    <Button
                        className="filter-btn"
                        variant="contained"
                        onClick={handleApply}
                        sx={{ mr: 1 }}
                    >
                        Lọc
                    </Button>
                    <Button
                        className="reset-btn"
                        variant="outlined"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </Box>
              </div>
            </div>
        </div>
    );
}
