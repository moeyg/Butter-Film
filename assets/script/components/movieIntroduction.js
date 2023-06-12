export default class MoviesIntroduction {
  static movieInformation() {
    const movieInformation = document.querySelector('.movieInformation');
    const movieInfos = sessionStorage.getItem('movieInformation');
    const movie = JSON.parse(movieInfos);

    const movieInfo = `
        <h1 class="movieTitle title">${movie.title}<span class="release"> (${movie.release})</span></h1>
        <div class="movieContents">
            <img
            class="moviePoster"
            src="${movie.poster}"
            alt="${movie.title}"
            />
            <ul class="movieInfos">
                <li class="movieInfo runningTime">Running Time: <strong>${movie.runningTime}</strong></li>
                <li class="movieInfo averageRating">Average Rating: <strong>★ ${movie.averageRating} / 5</strong></li>
                <li class="summaries">
                    &nbsp;${movie.summaries}
                </li>
                <button class="chooseSeatButton button">CHOOSE SEAT</button>
            </ul>
        </div>
    `;
    movieInformation.insertAdjacentHTML('beforeend', movieInfo);

    const reviewList = document.querySelector('.reviewList');
    const review = `
        <li class="review">
            <div class="reviewer">
                <strong class="reviewerName"></strong>
                <span class="reviewerRating"><strong>${movie.myRating}</strong></span>
            </div>
            <p class="reviewContents">
            ${movie.comment}
            </p>
        </li>
    `;
    reviewList.insertAdjacentHTML('beforeend', review);

    const chooseSeatButton = document.querySelector('.chooseSeatButton');
    chooseSeatButton.addEventListener('click', () => {
      window.location.href = 'booking.html';
    });
  }
}
