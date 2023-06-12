document.addEventListener('DOMContentLoaded', () => {
  const reviewButton = document.querySelector('.reviewButton');

  // reviewButton이 존재하는지 확인
  if (reviewButton) {
    reviewButton.addEventListener('click', () => {
      const reviewMovieTitle = document.querySelector('.reviewMovieTitle');
      const reviewMoviePoster = document.querySelector('.reviewMoviePoster');

      // 영화 제목과 포스터 이미지 가져오기
      const movieTitle = movieTicketTitle.textContent;
      const moviePosterSrc = movieTicketPoster.src;

      // 리뷰창에 영화 제목과 포스터 이미지 적용
      reviewMovieTitle.textContent = movieTitle;
      reviewMoviePoster.src = moviePosterSrc;
    });
  }
});