const express = require("express");
const router = express.Router();
const template = require("../lib/template.js");

module.exports = function (passport) {
  router.get("/login", (request, response) => {
    var fmsg = request.flash();
    var feedback = "";
    if (fmsg.message) {
      feedback = fmsg.message;
    }
    var title = "WEB - login";
    var list = template.list(request.list);
    var html = template.HTML(
      title,
      list,
      `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form >
    `,
      ""
    );
    response.send(html);
  });

  // 사용자가 전송한 정보를 받았을때 어떻게 처리할지 방법 정의
  router.post("/login_process", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (req.session.flash) {
        req.session.flash = {};
      }
      req.flash("message", info.message),
        req.session.save(() => {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.redirect("/auth/login");
          }
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            return req.session.save(() => {
              res.redirect("/");
            });
          });
        });
    })(req, res, next);
  });

  router.get("/logout", function (request, response) {
    request.logout(function () {
      // request.session.destroy(function (err) {
      //   response.redirect("/");
      // });
      request.session.save(function () {
        response.redirect("/");
      });
    });
  });

  return router;
};