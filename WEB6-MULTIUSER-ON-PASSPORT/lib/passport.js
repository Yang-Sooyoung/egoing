const db = require("../lib/db.js");
const bcrypt = require("bcrypt");

module.exports = function (app) {
  var flash = require("connect-flash");
  var passport = require("passport");
  var LocalStrategy = require("passport-local");

  // passport 설치, express에 쓰겠다. 세션 쓰겠다.
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // 로그인 성공시 세션스토어에 저장하는 방법 정의
  passport.serializeUser(function (user, done) {
    console.log("serializeUser", user);
    done(null, user.id);
    //done(null, user.id);
  });

  // 페이지에 방문할때마다 세션스토어의 식별자를 가져와서
  // 실제 사용할 데이터를 가져오는 방법을 정의
  passport.deserializeUser(function (id, done) {
    var user = db.get("users").find({id:id}).value();
    console.log("deserializeUser", id, user);
    done(null, user);
    //User.findById(id, function(err, user) {
    //  done(err, user);
    //});
  });

  //로그인 성공, 실패 판별 코드
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "pwd",
      },
      function (email, password, done) {
        console.log("LocalStrategy", email, password);
        var user = db.get('users').find({email:email}).value();
        if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
              if(result) {
                return done(null, user, {
                  message: 'Welcome.'
                });
              } else {
                return done(null, false, {
                    message: 'Password is not correct.'
                });
              }
            });
        } else {
            return done(null, false, {
              message: "There is no email.",
            });
        }
      }
    )
  );
  return passport;
};
