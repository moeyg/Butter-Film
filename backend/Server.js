const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('./connection'); // 이전 단계에서 생성한 연결 파일
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 1.회원 가입 API
app.post('/signUp', (req, res) => {
    const { memberName, memberID, memberPassword } = req.body;
  
    // 비밀번호 해시 생성
    const saltRounds = 10;
  
    bcrypt.hash(memberPassword, saltRounds, (err, hashedPassword) => {
      if (err) {
        res.status(500).json({ error: '비밀번호 해시 생성 중 오류가 발생했습니다.' });
        return;
      }
  
      // 데이터베이스에 사용자 정보 저장
      const user = { memberName, memberID, memberPassword:hashedPassword };
      connection.query('INSERT INTO memberTBL SET ?', user, (error, results) => {
        if (error) {
          res.status(500).json({ error });
          return;
        }
  
        res.json({ message: '회원가입이 성공적으로 완료되었습니다.' });
      });
    });
  });


// 2.로그인 라우트
app.post('/logIn', (req, res) => {  
  const { memberID, memberPassword } = req.body;

  // 사용자 정보 확인
  const query = 'SELECT * FROM memberTBL WHERE memberID = ?';
  connection.query(query, [memberID], (error, results) => {
    if (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Failed to log in' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username' });
      return;
    }

    // 비밀번호 검증
    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(memberPassword, user.memberPassword);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // JWT 토큰 발급
    const token = jwt.sign({ memberID: user.memberID }, 'memberid', { algorithm: 'HS256', expiresIn: '1h' });

    res.json({ success: true, token });
  });
});

// 보호된 라우트 예시
app.get('/protected', verifyToken, (req, res) => {
    // 토큰 검증을 위한 미들웨어 함수
    res.json({ message: 'Protected route accessed' });
  });
  
  // 토큰 검증 미들웨어
  function verifyToken(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
  
    if (!token) {
      res.status(403).json({ error: 'Token not provided' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, 'memberid', { algorithms: ['HS256'] });
      req.user = decoded.memberID;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
      return;
    }
  }


// 3.로그아웃 요청 처리
app.post('/logout', verifyToken, (req, res) => {
    // 여기에서 토큰 무효화 등 로그아웃에 필요한 작업 수행
  
    res.json({ message: 'Logged out successfully' });
  });


//4.비밀번호 변경
app.post('/change-password', verifyToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user;
  
    // 1. 현재 비밀번호 확인
    const query = 'SELECT * FROM memberTBL WHERE memberID = ?';
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error checking current password:', error);
        res.status(500).json({ error: 'Failed to change password' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(currentPassword, user.memberPassword);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid current password' });
        return;
      }
  
      // 2. 새로운 비밀번호 입력
      const saltRounds = 10;
      bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing new password:', err);
          res.status(500).json({ error: 'Failed to change password' });
          return;
        }
  
        // 3. 비밀번호 업데이트
        const updateQuery = 'UPDATE memberTBL SET memberPassword = ? WHERE memberID = ?';
        connection.query(updateQuery, [hashedPassword, userId], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating password:', updateError);
            res.status(500).json({ error: 'Failed to change password' });
            return;
          }
  
          res.json({ success: true, message: 'Password changed successfully' });
        });
      });
    });
  });


//5. 비밀번호 찾기
app.post('/forgot-password', (req, res) => {
    const { memberID } = req.body;
  
    // 1. 클라이언트로부터 아이디 입력 받기
  
    // 2. 아이디를 사용하여 사용자 확인
    const query = 'SELECT * FROM memberTBL WHERE memberID = ?';
    connection.query(query, [memberID], (error, results) => {
      if (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Failed to reset password' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      const user = results[0];
  
      // 3. 임시 비밀번호 생성
      const temporaryPassword = generateTemporaryPassword();
  
      // 4. 임시 비밀번호 전달
      sendTemporaryPasswordEmail(user.memberID, temporaryPassword);
  
      // 5. 비밀번호 업데이트
      const saltRounds = 10;
      bcrypt.hash(temporaryPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing temporary password:', err);
          res.status(500).json({ error: 'Failed to reset password' });
          return;
        }
  
        const updateQuery = 'UPDATE memberTBL SET memberPassword = ? WHERE memberID = ?';
        connection.query(updateQuery, [hashedPassword, memberID], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating password:', updateError);
            res.status(500).json({ error: 'Failed to reset password' });
            return;
          }
  
          res.json({ message: 'Temporary password has been sent to your email' });
        });
      });
    });
  });
  
  function generateTemporaryPassword() {
    // 이 예시에서는 8자리의 랜덤한 숫자와 문자 조합을 생성합니다.
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let temporaryPassword = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      temporaryPassword += characters[randomIndex];
    }
  
    return temporaryPassword;
  }

  // transporter 초기화
  const transporter = nodemailer.createTransport({
    host: 'smtp.kakao.com',
    port: 465,
    secure: true,
    auth: {
      user: 'rhaehfddldj@kakao.com',
      pass: 'wjdrlfdnd0423',
    }
  });

  // 이메일 전송 함수
function sendTemporaryPasswordEmail(email, temporaryPassword) {
    const mailOptions = {
      from: 'bf',
      to: email, 
      subject: 'Temporary Password',
      text: `Your temporary password is: ${temporaryPassword}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return;
      }
      console.log('Email sent:', info.response);
    });
  }
  


//6.예매
app.use(express.json());
// 영화 예매 엔드포인트
app.post('/reserve', verifyToken,(req, res) => {
    const { movieTitle, seatNum, price } = req.body;
    const memberID = req.user;
  
    // 현재 날짜 가져오기
    const reservationDate = new Date().toISOString().split('T')[0];
  
    // 예매 정보 저장
    const reservation = {
      memberID,
      movieTitle,
      seatNum,
      reservationDate,
      price
    };

    const ticket = {
        memberID,
        movieTitle,
        reservationDate,
      };
  
    // 데이터베이스에 예매 정보 저장
    connection.beginTransaction((err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          res.status(500).json({ error: '예매 과정에서 오류가 발생했습니다.' });
          return;
        }
    
        connection.query('INSERT INTO reservationTBL SET ?', [reservation], (error, results) => {
          if (error) {
            console.error('Error reserving:', error);
            connection.rollback(() => {
              res.status(500).json({ error: '예매 과정에서 오류가 발생했습니다.' });
            });
            return;
          }

          connection.query('INSERT INTO ticketTBL SET ?', [ticket], (error, results) => {
            if (error) {
              console.error('Error reserving:', error);
              connection.rollback(() => {
                res.status(500).json({ error: '예매 과정에서 오류가 발생했습니다.' });
              });
              return;
            }
                connection.commit((err) => {
                  if (err) {
                    console.error('Error committing transaction:', err);
                    connection.rollback(() => {
                      res.status(500).json({ error: '예매 과정에서 오류가 발생했습니다.' });
                    });
                    return;
                  }
      
                  res.json({ success: true, message: '예매가 성공적으로 완료되었습니다.' });
            });
          });
        });
      });
    });


//7.코멘트
// 리뷰 코멘트 작성 엔드포인트
app.post('/reviews', verifyToken, (req, res) => {
  const { movieTitle, rating, ratingComment } = req.body;
  const memberID = req.user;

  // 리뷰 정보 저장
  const review = {
    memberID,
    movieTitle,
    rating,
    ratingComment
  };

  // 데이터베이스에 리뷰 정보 저장
  connection.query('INSERT INTO ratingTBL SET ?', review, (error, results) => {
    if (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: '리뷰 작성 중 오류가 발생했습니다.' });
      return;
    }

    res.json({ success: true, message: '리뷰가 성공적으로 작성되었습니다.' });
  });
});

//8.내티켓
app.get('/ticket', verifyToken, (req, res) => {
  const userInfo = req.user;

  // 사용자 정보 조회
  const query = 'SELECT movieTitle, reservationDate FROM ticketTBL WHERE memberID = ?';
  connection.query(query, [userInfo], (error, results) => {
    if (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Failed to fetch user info' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User ticket not found' });
      return;
    }

    // 사용자 정보 반환
    const tickets = results.map((ticket) => ({
      movieTitle: ticket.movieTitle,
      reservationDate: ticket.reservationDate,
    }));

    res.json(tickets);
  });
});

//9.내정보 확인 라우트
app.get('/myinfo', verifyToken, (req, res) => {
    const userInfo = req.user;
  
    // 사용자 정보 조회
    const query = 'SELECT memberName, memberID FROM memberTBL WHERE memberID = ?';
    connection.query(query, [userInfo], (error, results) => {
      if (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ error: 'Failed to fetch user info' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error });
        return;
      }
  
      // 사용자 정보 반환
      const user = results[0];
      res.json({ memberName: user.memberName, memberID: user.memberID });
    });
});


//10.회원삭제
app.delete('/deleteUser', verifyToken, (req, res) => {
  const userInfo = req.user;

  // 사용자 정보 삭제
  const deleteMemberQuery = 'DELETE FROM memberTBL WHERE memberID = ?';
  const deleteTicketQuery = 'DELETE FROM ticketTBL WHERE memberID = ?';
  const deleteReservationQuery = 'DELETE FROM reservationTBL WHERE memberID = ?';
  const deleteRatingQuery = 'DELETE FROM ratingTBL WHERE memberID = ?';

  connection.beginTransaction((error) => {
    if (error) {
      console.error('Error starting transaction:', error);
      res.status(500).json({ error: 'Failed to start transaction' });
      return;
    }

    // 회원 정보 삭제
    connection.query(deleteMemberQuery, [userInfo], (error, memberResults) => {
      if (error) {
        console.error('Error deleting user:', error);
        connection.rollback(() => {
          res.status(500).json({ error: 'Failed to delete user' });
        });
        return;
      }

      // 티켓 정보 삭제
      connection.query(deleteTicketQuery, [userInfo], (error, ticketResults) => {
        if (error) {
          console.error('Error deleting tickets:', error);
          connection.rollback(() => {
            res.status(500).json({ error: 'Failed to delete tickets' });
          });
          return;
        }

        // 예약 정보 삭제
        connection.query(deleteReservationQuery, [userInfo], (error, reservationResults) => {
          if (error) {
            console.error('Error deleting reservations:', error);
            connection.rollback(() => {
              res.status(500).json({ error: 'Failed to delete reservations' });
            });
            return;
          }

          // 평가 정보 삭제
          connection.query(deleteRatingQuery, [userInfo], (error, ratingResults) => {
            if (error) {
              console.error('Error deleting ratings:', error);
              connection.rollback(() => {
                res.status(500).json({ error: 'Failed to delete ratings' });
              });
              return;
            }

            // 모든 작업이 성공적으로 완료되면 트랜잭션 커밋
            connection.commit((error) => {
              if (error) {
                console.error('Error committing transaction:', error);
                connection.rollback(() => {
                  res.status(500).json({ error: 'Failed to commit transaction' });
                });
                return;
              }

              res.json({ message: 'User and related data deleted successfully' });
            });
          });
        });
      });
    });
  });
});


// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});