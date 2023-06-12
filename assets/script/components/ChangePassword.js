export default class ChangePAssword {
    static async changePassword() {
      try {
        const currentPasswordInput = document.querySelector('.currentPassword');
        const newPasswordInput = document.querySelector('.newPassword');
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
  
        const token = localStorage.getItem('token');
  
        const response = await axios.post(
          'http://localhost:3000/change-password',
          {
            currentPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          console.log('비밀번호가 성공적으로 변경되었습니다.');
          window.location.href = 'http://localhost:5500/index.html';
        } else {
          console.log('비밀번호 변경에 실패했습니다.');
          // 비밀번호 변경 실패 처리
        }
      } catch (error) {
        console.error('오류:', error.message);
        // 요청 실패 처리
      }
    }
  }