const express = require("express");
const router = express.Router();
const template = require("../lib/template.js");
const auth = require("../lib/auth");

router.get("/", (request, response) => {
  var fmsg = request.flash();
  var feedback = "";
    console.log(fmsg);
  if (fmsg.message) {
    feedback = fmsg.message;
  }
  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
    <div style="color:blue;">${feedback}</div>
    <h2>${title}</h2>${description}
    <img src="/images/hello.jpg" width=300px; style="display:block; margin:10px;"></img>`,
    `<a href="/topic/create">create</a>`,
    auth.StatueUI(request, response)
  );
  response.send(html);
});

module.exports = router;