const express = require("express");
const router = express.Router();
const template = require("../lib/template.js");
const shortid = require("shortid");
const db = require("../lib/db.js");
const bcrypt = require("bcrypt");

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
      </form>
    `,
      ""
    );
    response.send(html);
  });

  // 사용자가 전송한 정보를 받았을때 어떻게 처리할지 방법 정의
  router.post("/login_process", //(req, res, next) => {
    // passport.authenticate("local", (err, user, info) => {
    //   if (req.session.flash) {
    //     req.session.flash = {};
    //   }
    //   req.flash("message", info.message),
    //   req.session.save(() => {
    //     req.logIn(user, (err) => {
    //       if (err) {
    //         return next(err);
    //       }
    //       return req.session.save(() => {
    //         res.redirect("/");
    //       });
    //     });
    //   });
    // })(req, res, next);
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true
    }));

  router.get("/register", (request, response) => {
    var fmsg = request.flash();
    console.log(fmsg);
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
        <form action="/auth/register_process" method="post">
          <p><input type="text" name="email" placeholder="email" value="egoing7777@gmail.com"></p>
          <p><input type="password" name="pwd" placeholder="password" value="111111"></p>
          <p><input type="password" name="pwd2" placeholder="password" value="111111"></p>
          <p><input type="text" name="displayName" placeholder="display name" value="egoing"></p>
          <p>
            <input type="submit" value="register">
          </p>
        </form>
      `,
      ""
    );
    response.send(html);
  });

  router.post("/register_process", (request, response) => {
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;

    if (pwd !== pwd2) {
      request.flash("error", "Password must same!");
      response.redirect("/auth/register");
    } else {
      const hash = bcrypt.hashSync(pwd, 10);
      var user = {
        id: shortid.generate(),
        email: email,
        password: hash,
        displayName: displayName,
      };
      db.get("users").push(user).write();
      request.login(user, function (err) {
        console.log("redirect");
        response.redirect("/");
      });
    }
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