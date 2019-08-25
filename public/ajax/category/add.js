function addCategory() {
    var category = $('#category').val(),
        bodyCategory = $('#bodyCategory')
        result = '' 
        
    $.ajax({
        type: "POST",
        url: '/admin/categories/add',
        data: {category: category},
        success: function(category) {
            console.log(category.category);
            
            result += `<tr id="delete_${category._id}">`
            result += `<td>${category._id}</td>`
            result += `<td id="edit_${category._id}" style="position: relative;"> ${category.category} </td><td>`
            result += category.created
            result += `</td><td>
            <i id="editCategory" data-target="${category._id}" data-key="${category.category}" class="fa fa-edit text-info" aria-hidden="true"></i>
            <i id="deleteCategory" onclick="deleteCategory('${category._id}')" class="fa fa-trash text-danger" aria-hidden="true"></i>
            </td>`
            result += '</tr>'
            console.log(bodyCategory.has("#categoryNotFound").length == 1);
            $('#category').val('')
            if(bodyCategory.has("#categoryNotFound").length == 1){
                bodyCategory.html("")
            }
            bodyCategory.append(result)
            
        }
    })
}

$('#category').on('keypress',function(event){
    if(event.keyCode == 13){
        addCategory();
    }
});
$('#buttonAdd').on('click',addCategory);