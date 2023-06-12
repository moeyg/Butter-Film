export default class Booking {
  static importMovieTitle() {
    const movieInformation = sessionStorage.getItem('movieInformation');
    const movie = JSON.parse(movieInformation);
    const movieTitle = document.querySelector('.movieTitleToBooking');

    movieTitle.textContent = movie.title;
  }

  static selectedState() {
    const seats = document.querySelectorAll('.seat');
    const selectedSeats = [];
    let totalCount = 0;
    let totalPrice = 0;

    seats.forEach((seat) => {
      seat.addEventListener('click', () => {
        seat.classList.toggle('selected');
        updateNotice(seat.innerText);
      });
    });

    const countOfSeats = document.querySelector('.countOfSeats');
    const priceOfSeats = document.querySelector('.priceOfSeats');

    function updateNotice(seatText) {
      if (seatText === '') return; // 빈 좌석 무시

      const index = selectedSeats.indexOf(seatText);
      if (index !== -1) {
        // 이미 선택된 좌석인 경우 배열에서 제거
        selectedSeats.splice(index, 1);
        totalCount--;
        totalPrice -= 12000;
      } else {
        // 새로 선택된 좌석인 경우 배열에 추가
        selectedSeats.push(seatText);
        totalCount++;
        totalPrice += 12000;
      }

      countOfSeats.innerText = totalCount;
      priceOfSeats.innerText = totalPrice;

      sessionStorage.setItem('totalPrice', totalPrice);
      sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    }
  }

  static register() {
    const currentDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const seats = document.querySelector('.seats');
    const notice = document.querySelector('.notice');
    const registerButton = document.querySelector('.registerButton');
    const cancelButton = document.querySelector('.cancelButton');

    // Update UI
    seats.classList.add('disabled');
    notice.innerText = 'Check out My Tickets page!';
    registerButton.classList.add('ir');
    cancelButton.classList.remove('ir');

    sessionStorage.setItem('registerDate', currentDate);
  }

  static cancel() {
    sessionStorage.removeItem('selectedSeats');
    sessionStorage.removeItem('registerDate');
    sessionStorage.removeItem('totalPrice');
    location.reload();
  }

  static sendDatas() {
    const movieTitle = document.querySelector('.movieTitleToBooking').textContent;
    const selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats'));
    const totalPrice = sessionStorage.getItem('totalPrice');
  
    const reservationData = {
      movieTitle,
      seatNum: selectedSeats.join(', '), // 좌석 배열을 문자열로 변환하여 쉼표로 구분
      price: totalPrice,
    };
  
    this.reserveMovie(reservationData);
  }

  static async reserveMovie(reservationData) {
    const url = 'http://localhost:3000/reserve';
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('토큰이 제공되지 않았습니다.');
      return;
    }
  
    const headers = { authorization: `Bearer ${token}` };
  
    try {
      const response = await axios.post(url, reservationData, { headers });
      if (response.status === 200) {
        console.log('예매가 성공적으로 완료되었습니다.');
        // 예매 성공 시 필요한 동작 수행
        this.register();
      } else {
        console.log('예매에 실패했습니다.');
        alert('예매에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('예매 과정에서 오류가 발생했습니다.');
    }
  }
}