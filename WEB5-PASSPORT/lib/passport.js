module.exports = function(app) { 
    var flash = require("connect-flash");
    
    var authData = {
        email: 'egoing777@gmail.com',
        password: '111111',
        nickname: 'egoing'
    };

    var passport = require("passport");
    var LocalStrategy = require("passport-local");

    // passport 설치, express에 쓰겠다. 세션 쓰겠다.
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    // 로그인 성공시 세션스토어에 저장하는 방법 정의
    passport.serializeUser(function (user, done) {
    done(null, user.email);
    //done(null, user.id);
    });

    // 페이지에 방문할때마다 세션스토어의 식별자를 가져와서
    // 실제 사용할 데이터를 가져오는 방법을 정의
    passport.deserializeUser(function (id, done) {
    done(null, authData);
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
        function (username, password, done) {
            if (username === authData.email) {
                if (password === authData.password) {
                return done(null, authData, {
                    message: "welcome.",
                });
                } else {
                return done(null, false, {
                    message: "Incorrect password.",
                });
                }
            } else {
                return done(null, false, {
                message: "Incorrect username.",
                });
            }
        }
    ));
    return passport;
}