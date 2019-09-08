const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
module.exports = {
    userAuth: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/')
    },
    requiresAdmin: function() {
        return [
          ensureLoggedIn('/admin/login'),
          function(req, res, next) {
            if (req.user && req.user.isAdmin === true)
              next()
            else
              res.status(401).send('Unauthorized')
          }
        ]
      }
};