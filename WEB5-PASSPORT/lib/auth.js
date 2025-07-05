module.exports = {
    IsOwner: function(request, response) {
        if (request.user) {
            return true;
        } else {
            return false;
        }
    },
    StatueUI: function(request, response) {
        var authStatueUI = '<a href="/auth/login">login</a>';
        if (this.IsOwner(request, response)) {
            authStatueUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatueUI;
    }   
}
