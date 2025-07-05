module.exports = {
    IsOwner: function(request, response) {
        if (request.user) {
            return true;
        } else {
            return false;
        }
    },
    StatueUI: function(request, response) {
        var authStatueUI = `<a href="/auth/login">login</a> 
                            | <a href="auth/register">register</a>
                            | <a href="auth/facebook">Login with Facebook</a>`;
        if (this.IsOwner(request, response)) {
            authStatueUI = `${request.user.displayName} | <a href="/auth/logout">logout</a>`;
        }
        return authStatueUI;
    }   
}
