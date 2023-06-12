export default class MovieTicket {
  static async getMyMovieTickets() {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:3000/ticket', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const tickets = response.data;

        // 예매된 영화 티켓 생성
        const ticketContainer = document.querySelector('.myMovieTickets');

        tickets.forEach((ticket) => {
          const { movieTitle, reservationDate } = ticket;

          const movieTicket = document.createElement('section');
          movieTicket.classList.add('myMovieTicket');

          const movieTicketPoster = document.createElement('img');
          movieTicketPoster.classList.add('movieTicketPoster');

          // 영화 제목에 해당하는 이미지 경로를 가져옴
          const movieImage = getMovieImage(movieTitle);
          movieTicketPoster.src = movieImage || '/assets/images/movies/default.png'; // 영화 이미지가 없을 경우 기본 이미지 경로 설정
          movieTicketPoster.alt = movieTitle;

          const movieTicketInfo = document.createElement('div');
          movieTicketInfo.classList.add('movieTicketInfo');

          const movieTicketTitle = document.createElement('h2');
          movieTicketTitle.classList.add('movieTicketTitle');
          movieTicketTitle.textContent = movieTitle;

          const movieTicketBookingDate = document.createElement('p');
          movieTicketBookingDate.classList.add('movieTicketBookingDate');
          const utcDate = new Date(reservationDate);
          const dateString = utcDate.toISOString().substring(0, 10);
          movieTicketBookingDate.textContent = dateString;

          const reviewButton = document.createElement('a');
          reviewButton.classList.add('reviewButton', 'button');
          reviewButton.href = '/assets/pages/review.html';
          reviewButton.textContent = 'Review';

          movieTicketInfo.appendChild(movieTicketTitle);
          movieTicketInfo.appendChild(movieTicketBookingDate);
          movieTicketInfo.appendChild(reviewButton);

          movieTicket.appendChild(movieTicketPoster);
          movieTicket.appendChild(movieTicketInfo);

          ticketContainer.appendChild(movieTicket);
        });
      } else {
        console.log('영화 티켓을 가져오는데 실패했습니다.');
        // 실패 처리
      }
    } catch (error) {
      console.error('오류:', error.message);
      // 요청 실패 처리
    }
  }
}

function getMovieImage(movieTitle) {
  const movieImages = {
    'Chasing Ice': '/assets/images/movies/Chasing_Ice.png',
    'A Plastic Ocean': '/assets/images/movies/A_Plastic_Ocean.png',
    'Before The Flood': '/assets/images/movies/BEFORE_THE_FLOOD.png',
    'Forks Over Knives': '/assets/images/movies/Forks_over_knives.png',
    'SEASPIRACY': '/assets/images/movies/SEASPIRACY.png',
    'THE GAME CHANGERS': '/assets/images/movies/THE_GAME_CHANGERS.png',
    // 다른 영화 제목과 해당하는 이미지 경로를 추가해주세요
  };

  return movieImages[movieTitle];
}