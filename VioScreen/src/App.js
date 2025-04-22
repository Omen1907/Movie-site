import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import searchIcon from "./search.svg";
import MovieCard from "./MovieCard";

const apiUrl = process.env.REACT_APP_API_URL;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = useCallback(async (title) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}&s=${title}`);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No results found.");
      }
    } catch (err) {
      setError("Something went wrong.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchMovies("Avengers");
  }, [searchMovies]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchMovies(searchTerm);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className='app'>
      <h1>MovieVerse</h1>

      <div className='search'>
        <input
          placeholder='Search for movies'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img
          src={searchIcon}
          alt='search'
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        />
      </div>

      {loading ? (
        <div className='empty'>
          <h2>Loading...</h2>
        </div>
      ) : error ? (
        <div className='empty'>
          <h2>{error}</h2>
        </div>
      ) : movies.length > 0 ? (
        <div className='container'>
          {movies.map((movie, index) => (
            <div
              key={movie.imdbID}
              style={{ animationDelay: `${index * 0.1}s` }}
              className='animated-movie'
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className='empty'>
          <h2>No movies found</h2>
        </div>
      )}
    </div>
  );
};

export default App;
