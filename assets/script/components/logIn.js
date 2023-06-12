export default class LogIn {
  static async validation() {
    const url = 'http://localhost:3000/logIn';
    const memberID = document.querySelector('#logInMemberID').value;
    const memberPassword = document.querySelector('#logInmemberPassword').value;
    const memberData = { memberID, memberPassword };

    try {
      const response = await axios.post(url, memberData);
      const status = response.data.status;

      // 로그인 성공 시
      if (status !== 422) {
        // 토큰 전송
        const token = response.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
        // 백엔드로 전송된 토큰으로 보호된 경로에 접근
        axios.get('http://localhost:3000/protected')
          .then(response => {
            console.log(response.data);
            // 홈으로 이동
            location.href = 'http://localhost:5500/assets/pages/home.html';
          })
          .catch(error => {
            console.log(error);
            alert('Failed to access protected route');
          });
      }
      // 로그인 실패 시 알림
      if (status === 422) {
        alert('Please double check your email and password.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login.');
    }
  }
}