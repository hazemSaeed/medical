function deleteCategory(id) {
    var idElement = '#delete_'+id,
        selector = $(idElement)

        $.ajax({
            type: "POST",
            url: '/admin/categories/delete',
            data: {id: id},
            success: function(message) {
                console.log(message);
                $(idElement).remove();
            }
        })
}