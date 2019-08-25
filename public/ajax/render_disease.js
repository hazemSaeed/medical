function renderDisease(id){
    var info_page_content = $('#info_page_content');
    var healthIssueInfo = '<div>';
    $.ajax({
        type: "GET",
        url: "/checkers/disease/"+id+"",
        success: function (response) {  

            healthIssueInfo += `<h1 class="margin-none" itemprop="name">${response.Name}</h1>` ;
            if(response.ProfName || response.Synonyms) {
                if(response.ProfName) healthIssueInfo += `<h3 class="border-bottom">
                    <small>Professional Name  (<b itemprop="alternateName">${response.ProfName}</b>)</small><br>`;

                if(response.Synonyms) healthIssueInfo += `<small>Synonyms  (<b itemprop="alternateName">${response.Synonyms}</b>)</small>
                    </h3>`;
            }
            healthIssueInfo += `<h3>Short description</h3>
            <p class="healthIssueInfo">${response.DescriptionShort}</p>`

            healthIssueInfo += ` <h3>Description</h3>
            <p class="healthIssueInfo">${response.Description}</p>`

            healthIssueInfo += `<h3>Occurrence + Symptom</h3>
            <p class="healthIssueInfo">${response.MedicalCondition}</p>`

            healthIssueInfo += `<h3>Consequences + Treatment</h3>
            <p class="healthIssueInfo">${response.TreatmentDescription}</p>`

            healthIssueInfo += `<h3>Possible symptoms of the disease:</h3>
            <p class="healthIssueInfo">${response.PossibleSymptoms}</p>`

            healthIssueInfo += `</div>`
            info_page_content.html(healthIssueInfo);
        },
        fail: function(error){
        }

     });

}

$(function () {
    setTimeout(function () {
        $("#modal-disease").iziModal({overlayClose: false, overlayColor: 'rgba(0, 0, 0, 0.9)'});
    }, 30)
    
})