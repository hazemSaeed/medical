const moment = require('moment')
module.exports = {
    select : function(selected,options){
        return options.fn(this).replace(new RegExp('value=\"'+selected+'\"'),'$&selected="selected"')  
    },
    state: function(value) {
        if(value === 'approved') return `<span class="label label-success">Approved</span>`
        else if(value === 'pending') return `<span class="label label-warning">Pending</span>`
        else if(value === 'denied') return `<span class="label label-danger">Denied</span>`
        else return ''
    },
    rated: function(rating,id){
        if(rating.some(ele => ele.prescription == id)){
            return 'clicked'
        }
        return
    },
    check : function (value, test) {
        if (value == undefined) return ''
        return value == test ? 'checked' : ''
    },
    active: function(active,options){
        return options.fn(this).replace(new RegExp('value=\"'+active+'\"'),'$&class="active"')
    },
    // Function to do basic mathematical operation in handlebar
    math: function(lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue)
        rvalue = parseFloat(rvalue)
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator]
    },
    generateDate: function(date,format){
        return moment(date).format(format);
    },
    paginate: function(options){
        let output = ''

        if(options.hash.current === 1){
            output += `<li class="page-item disable"><a class="page-link">First</a></li>`; 
        }else {
            output += `<li class="page-item"><a class="page-link" href="/prescriptions?page=1">First</a></li>`;
        }

        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1)

        if(i !== 1){
            output += `<li class="page-item disable"><a class="page-link">...</a></li>` 
        }

        for (; i <= (Number(options.hash.current)+4) && i <= options.hash.pages ;i++) {
            
            if(i === options.hash.current){
                output += `<li class="page-item active"><a class="page-link">${i}</a></li>`
            }else{
                output += `<li class="page-item"><a href="/prescriptions?page=${i}" class="page-link">${i}</a></li>`;
            }

            if(i === Number(options.hash.current) + 4  && i < options.hash.pages){
                output += `<li class="page-item disable"><a class="page-link">...</a></li>`
            }
        }

        if(options.hash.current === options.hash.pages){
            output += `<li class="page-item disable"><a class="page-link">Last</a></li>`;
        }else{
            output += `<li class="page-item"><a class="page-link" href="/prescriptions?page=${options.hash.pages}">Last</a></li>`; 
        }
        return output
        
    } 
}