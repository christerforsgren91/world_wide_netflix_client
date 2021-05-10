import React, { useState, useEffect } from 'react';
import { Card, Container } from 'semantic-ui-react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const MainPageMovieContainer = (props) => {
  const [topTenMovies, setTopTenMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  useEffect(() => {
    const fetchMovieData = async (query) => {
      try {
        if (query) {
          let headers = JSON.parse(localStorage.getItem('userData'));
          const response = await axios.get(`/movies/?query=${query}`, {
            headers: headers,
          });
          setTopTenMovies(response.data.body);
          setErrorMessage('');
        } else {
          const pos = await getPosition();
          const { latitude, longitude } = pos.coords;
          if (latitude && longitude) {
            let headers = JSON.parse(localStorage.getItem('userData'));
            const response = await axios.get(
              `/movies/?lat=${latitude}&lon=${longitude}`,
              { headers: headers }
            );
            setTopTenMovies(response.data.body);
            setErrorMessage('');
          }
        }
      } catch (error) {
        if (error.message === 'User denied Geolocation') {
          const response = await axios.get(`/movies/`);
          setTopTenMovies(response.data.body);
          setErrorMessage(
            "Allow your location to show movies that's not from your country"
          );
        } else if (error.response.status === 500) {
          setErrorMessage(
            'Please try again later, our servers are currently not responding'
          );
        } else {
          setErrorMessage(error.message);
        }
      }
    };

    fetchMovieData(props.query);
  }, [props.update, props.query, props.message]);

  let movieList = topTenMovies.map((movie, i) => {
    return <MovieCard data-cy='movie-card' movie={movie} i={i} />;
  });

  return (
    <Container>
      {errorMessage && <h1 data-cy='error-message'>{errorMessage}</h1>}
      {props.message && <h1 data-cy='success-message'>{props.message}</h1>}
      <Card.Group data-cy='movie-container' itemsPerRow={5} centered>
        {movieList}
      </Card.Group>
    </Container>
  );
};

export default MainPageMovieContainer;
