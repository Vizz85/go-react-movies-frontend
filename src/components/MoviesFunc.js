import React, { useEffect, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'

function MoviesFunc(props) {

  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
      .then(response => {
        if (response.status !== 200) {
          setError('Invalid response code: ', response.status)
        } else {
          setError(null)
        }

        return response.json()
      })
      .then(json => {
        setMovies(json.movies)
        setIsLoaded(true)
      })
  }, []) // Must set default value

  if (error != null) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <Fragment>
        <h2>Choose a movie</h2>

        <div className="list-group">
          {movies.map(m => (
            <Link key={m.id} className="list-group-item list-group-item-action" to={`/movies/${m.id}`}>{m.title}</Link>
          ))}
        </div>
      </Fragment>
    )
  }
}

export default MoviesFunc;