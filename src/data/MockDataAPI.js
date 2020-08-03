
import { genres } from './dataArrays';


export function NumberOfBooksGenres(genreId) {
  let count = 0;
  genres.map(data => {
    if (data.id == genreId) {
      count++;
    }
  });
  return count;
}

export function getGenres(genreId) {
  const GenresArray = [];
  Genres.map(data => {
    if (data.genreId == genreId) {
      GenresArray.push(data);
    }
  });
  return GenresArray;
}

