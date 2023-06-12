export default class SignUp {
  static async validation() {
    const url = 'http://localhost:3000/signUp';
    const memberName = document.querySelector('#signUpMemberName').value;
    const memberID = document.querySelector('#signUpMemberID').value;
    const memberPassword = document.querySelector(
      '#signUpMemberPassword'
    ).value;
    const memberData = {
      memberName,
      memberID,
      memberPassword,
    };
    try {
      const response = await axios.post(url, memberData);
      if (response.status === 200) {
        console.log('Sign Up Success!');
        window.location.href = 'http://localhost:5500/index.html';
      } else {
        console.log('failed');
        alert('The memberID is already taken. Please choose a different one.');
      }
    } catch (error) {
      console.log('Error: ', error.message);
    }
  }
}
