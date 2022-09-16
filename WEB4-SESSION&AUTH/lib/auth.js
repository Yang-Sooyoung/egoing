module.exports = {
    IsOwner: function(request, response) {
        if (request.session.is_logined) {
            return true;
        } else {
            return false;
        }
    },
    StatueUI: function(request, response) {
        var authStatueUI = '<a href="/auth/login">login</a>';
        if (this.IsOwner(request, response)) {
            authStatueUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatueUI;
    }   
}
