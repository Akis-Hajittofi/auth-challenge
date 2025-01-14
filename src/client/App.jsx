import { useEffect, useState } from "react";
import "./App.css";
import MovieForm from "./components/MovieForm";
import UserForm from "./components/UserForm";

const apiUrl = "http://localhost:4000";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then((res) => res.json())
      .then((res) => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    const options = {
      method: "POST",
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${apiUrl}/user/register`, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("User registered: ", data);
      });
  };

  const handleLogin = async ({ username, password }) => {
    const options = {
      method: "POST",
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${apiUrl}/user/login`, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        window.localStorage.setItem("accessToken", data.data);
      });
  };

  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
        runtimeMins: runtimeMins,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
      },
    };

    fetch(`${apiUrl}/movie`, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Push the data to the array first and then call setMovies using the spread syntax
        // This tells React that the data has changed
        movies.push(data.data);
        setMovies([...movies]);
      });
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
