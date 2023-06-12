document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.querySelector('.username');
    const userEmailInput = document.querySelector('.userEmail');
  
    const token = localStorage.getItem('token');
    const url = 'http://localhost:3000/myinfo';
  
    if (!token) {
      console.log('토큰이 제공되지 않았습니다.');
    } else {
      const headers = { Authorization: `Bearer ${token}` };
  
      axios.get(url, { headers })
        .then(response => {
          const data = response.data;
          usernameInput.value = data.memberName;
          userEmailInput.value = data.memberID;
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
          // 에러 처리 로직 추가
        });
    }
  });