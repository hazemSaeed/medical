function renderSublocation(id,age,gender){
    var subloaction = $('#subloaction');
    var element = $('#element');
    var parent = `
    <div class="col-md-6">
        <div class="card">
            <div class="card-body">
                <h2>Choose a sub location body</h2>
                <p>Your Age: <mark><b>${age}</b></mark> | Your Gender: <mark><b>${gender}</b></mark></p>  
                <h4 class="card-title">Sub Locations Body</h4>
                <p class="card-text">select a symptom</p>
                <ul class="list-unstyled"> 
    `;
    var el = '';
    subloaction.css({"opacity": '0'})
    $.ajax({
        url: "/checkers/sublocations/"+id+"",
        success: function (response) {  
        response.sublocations.forEach(data => {
            el += `<li>
                <a 
                    class="nextBtn" 
                    id="Location_${data.ID}" 
                    href="/checkers/symptoms/${data.ID}/${age}/${gender}">
                    ${data.Name}
                </a>
            </li>`
        });
            parent += el;
            parent+= `</ul></div></div></div>`;
            subloaction.css({"opacity": '1'})

            element.html(parent)
            
        },
        fail: function(error){
            parent+= '<p>Fialed to load data</p>'
            parent+= `</ul></div></div></div>`;
            subloaction.css({"opacity": '1'})
        }
     });
}