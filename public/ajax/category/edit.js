function editCategory(id, category){
    var idElement = '#edit_'+id,
        selector = $(idElement),
        input = `<input type="text" data-target="${id}" name="updateCategory" id="updateCategory" value="${category}">`,
        exit = `<i onclick="notChange('${id}','${category}')" class="fa fa-times-circle-o" style="cursor: pointer;position: absolute;top: 14px;right: 15px;" aria-hidden="true"></i>`
        $(idElement).html("").append(input).append(exit)         
}

$('body').on('click','#editCategory', function(){
        var id = $(this).data('target');
        var category = $(`#edit_${id}`).html();
        editCategory(id,category) 
})

function notChange(id,category) {
    var idElement = '#edit_'+id,
    selector = $(idElement)
    $(idElement).html(category)
}

$('body').on('keypress','#updateCategory',function(event){
    if(event.keyCode == 13){
        var id = $(this).data('target'),
            category = $(this).val()  

        $.ajax({
            type: "POST",
            url: '/admin/categories/edit',
            data: {id: id, category: category},
            success: function(newCategory) {
                console.log(newCategory);
                notChange(id,newCategory)
                console.log($('#editCategory').attr("data-key",newCategory))
            }
        })
    }
})