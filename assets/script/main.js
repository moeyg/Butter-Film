// Import HTML Pages
import ImportHTML from './components/importHTML.js';
import Movies from './components/movies.js';
import MoviesIntroduction from './components/movieIntroduction.js';
import Booking from './components/booking.js';
//import Review from './components/review.js';
import SignUp from './components/signUp.js';
import LogIn from './components/logIn.js';
import DeleteAccount from './components/deleteAccount.js';
import ChangePAssword from './components/ChangePassword.js';

// Import mainLogo.html
if (document.querySelector('.mainLogo')) {
  (async () => {
    await ImportHTML.importHTML('mainLogo');
    const mainLogo = document.querySelector('.mainLogo');
    mainLogo.addEventListener('click', () => {
      window.location.href = '../../index.html';
    });
  })();
}

// Import headerBar.html
if (document.querySelector('.headerBar')) {
  (async () => {
    await ImportHTML.importHTML('headerBar');
    const menu = document.querySelector('.menu');
    const logOut = document.querySelector('.logOut');
    const logOutButton = document.querySelector('.logOutButton');

    if (menu && logOut) {
      menu.addEventListener('click', () => {
        logOut.classList.toggle('ir');
      });

      logOutButton.addEventListener('click', async () => {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '../../index.html';
      });
    }

    const logo = document.querySelector('.logo');
    logo.addEventListener('click', () => {
      sessionStorage.removeItem('movieInformation');
    });
  })();
}

// Import underBar.html
if (document.querySelector('.underBar')) {
  (async () => {
    await ImportHTML.importHTML('underBar');
    const home = document.querySelector('.home');

    if (home) {
      home.addEventListener('click', async () => {
        sessionStorage.removeItem('movieInformation');
      });
    }
  })();
}

// Import Today's Movies JSON
if (document.querySelector('.todaysMovies')) {
  Movies.importJSON();
}
if (document.querySelector('.movieIntroduction')) {
  MoviesIntroduction.movieInformation();
}

// Booking program
if (document.querySelector('.booking')) {
  Booking.importMovieTitle();
  Booking.selectedState();

  const registerButton = document.querySelector('.registerButton');
  registerButton.addEventListener('click', () => {
    Booking.register();
    Booking.sendDatas();
  });

  const cancelButton = document.querySelector('.cancelButton');
  cancelButton.addEventListener('click', () => {
    Booking.cancel();
  });
}

//Review
//if (document.querySelector('.reviewPage')) {
//  const movieTitle = document.querySelector('.reviewMovieTitle').textContent;
//  Review.getMovieReview(movieTitle);
//}

// Sign Up
if (document.querySelector('#signUpPage')) {
  const createButton = document.querySelector('.createButton');
  createButton.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 동작 취소
    SignUp.validation();
  });
}

// Log In
if (document.querySelector('#logInPage')) {
  const logInButton = document.querySelector('.logInButton');
  logInButton.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 동작 취소
    LogIn.validation();
  });
}

// Delete Account
if (document.querySelector('.deleteAccount')) {
  const deleteButton = document.querySelector('.deleteButton');
  deleteButton.addEventListener('click', () => {
    DeleteAccount.deleteAccount();
  });
}

// change Account
if (document.querySelector('.changePassword')) {
  const saveButton = document.querySelector('.saveButton');
  saveButton.addEventListener('click', () => {
    ChangePAssword.changePassword();
  });
}