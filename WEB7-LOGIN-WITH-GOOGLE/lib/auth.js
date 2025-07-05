module.exports = {
    IsOwner: function(request, response) {
        if (request.user) {
            return true;
        } else {
            return false;
        }
    },
    StatueUI: function(request, response) {
        var authStatueUI = `<a href="/auth/login">Login</a> 
                            | <a href="auth/register">Register</a>
                            | <a href="auth/google">Login with Google</a>`;
        if (this.IsOwner(request, response)) {
            authStatueUI = `${request.user.displayName} | <a href="/auth/logout">logout</a>`;
        }
        return authStatueUI;
    }   
}
