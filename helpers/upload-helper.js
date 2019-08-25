const path = require('path')
module.exports = {
    uploadDir: path.join(__dirname,'../public/'),
    isEmpty: function(obj){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                return false
            }
        }
        return true
    }
}