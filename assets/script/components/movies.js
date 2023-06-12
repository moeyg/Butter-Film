export default class Movies {
  static async importJSON() {
    try {
      const response = await fetch('/assets/json/datas.json');
      const movies = await response.json();
      this.displayMovies(movies);
    } catch (error) {
      throw new Error(`Failed to import page: ${error}`);
    }
  }

  static displayMovies(movies) {
    const todaysMovies = document.querySelector('.todaysMovies');

    movies.forEach((data) => {
      const movie = `
        <li class="movie">
          <h2 class="movieTitle">${data.title}</h2>
          <img class="moviePoster" src="${data.poster}" alt="${data.title}" />
          <button class="bookingButton button" data-movie='${JSON.stringify(
            data
          )}'>Booking</button>
        </li>`;
      todaysMovies.insertAdjacentHTML('beforeend', movie);
    });

    const bookingButtons = document.querySelectorAll('.bookingButton');
    bookingButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const movieData = JSON.parse(button.dataset.movie);
        this.saveDataToSessionStorage(movieData);
        this.redirectionMovieIntroduction();
      });
    });
  }

  static saveDataToSessionStorage(movieData) {
    sessionStorage.setItem('movieInformation', JSON.stringify(movieData));
  }

  static redirectionMovieIntroduction() {
    window.location.href = 'movieIntroduction.html';
  }
}
