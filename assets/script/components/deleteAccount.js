export default class DeleteAccount {
    static async deleteAccount() {
      try {
        // 사용자 계정을 삭제하기 위해 DELETE 요청을 전송합니다.
        const token = localStorage.getItem('token');
        const response = await axios.delete('http://localhost:3000/deleteUser', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.status === 200) {
          console.log('User delete success!');
          window.location.href = 'http://localhost:5500/index.html';
        } else {
          console.log('Failed to delete user.');
          // 사용자 삭제 실패 시 에러 처리를 합니다.
        }
      } catch (error) {
        console.error('Error:', error.message);
        // 요청 실패에 대한 에러 처리를 합니다.
      }
    }
  }