$(document)
  .ready(function () {

    // Scroll js

    $(".scrollmenu").niceScroll({cursorwidth: '4px', autohidemode: true, zindex: 5});

    // Slider Header js
    var slider = $("#content-slider").lightSlider({
      loop: true,
      auto: true,
      play: true,
      slideMargin: 25,
      pager: false,
      enableDrag: false,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            item: 2,
            controls: false,
            auto: true
          }
        }, {
          breakpoint: 768,
          settings: {
            item: 1,
            controls: false,
            auto: true
          }
        }
      ]
    });
    $(".prevSlider").click(function () {
      slider.goToPrevSlide();
    });
    $(".nextSlider").click(function () {
      slider.goToNextSlide();
    });

    var sliderControll = $("#controll-slider").lightSlider({
      slideMargin: 25,
      useCSS: true,
      pager: false,
      item: 5,
      enableDrag: false,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            item: 2,
            controls: false
          }
        }, {
          breakpoint: 768,
          settings: {
            item: 1,
            controls: false
          }
        }
      ]
    });
    $(".prevcont").click(function () {
      sliderControll.goToPrevSlide();
    });
    $(".nextcont").click(function () {
      sliderControll.goToNextSlide();
    });

    var skincareslider = $("#skincare-slider").lightSlider({
      slideMargin: 25,
      pager: false,
      item: 5,
      useCSS: true,
      enableDrag: false,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            item: 2
          }
        }, {
          breakpoint: 768,
          settings: {
            item: 1
          }
        }
      ]

    });
    $(".prevskincare").click(function () {
      skincareslider.goToPrevSlide();
    });
    $(".nextskincare").click(function () {
      skincareslider.goToNextSlide();
    });

    var skinproblemslider = $("#skinproblem-slider").lightSlider({
      slideMargin: 25,
      pager: false,
      item: 5,
      useCSS: true,
      enableDrag: false,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            item: 2
          }
        }, {
          breakpoint: 768,
          settings: {
            item: 1
          }
        }
      ]

    });
    $(".prevskinproblem").click(function () {
      skinproblemslider.goToPrevSlide();
    });
    $(".nextskinproblem").click(function () {
      skinproblemslider.goToNextSlide();
    });

    var hearcareslider = $("#hearcare-slider").lightSlider({
      slideMargin: 25,
      pager: false,
      item: 5,
      useCSS: true,
      enableDrag: false,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            item: 2
          }
        }, {
          breakpoint: 768,
          settings: {
            item: 1
          }
        }
      ]

    });
    $(".prevhearcare").click(function () {
      hearcareslider.goToPrevSlide();
    });
    $(".nexthearcare").click(function () {
      hearcareslider.goToNextSlide();
    });

    var diseases = $("#diseases-slider").lightSlider({
      slideMargin: 25,
      pager: false,
      item: 5,
      useCSS: true,
      enableDrag: false,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            item: 2
          }
        }, {
          breakpoint: 768,
          settings: {
            item: 1
          }
        }
      ]

    });
    $(".prevdiseases").click(function () {
      diseases.goToPrevSlide();
    });
    $(".nextdiseases").click(function () {
      diseases.goToNextSlide();
    });

    $("#btn-login").click(function (e) {
      $('#modal-login').iziModal('open', this);
      e.preventDefault();
    });

  });
$(function () {

  /* Instantiating iziModal */
  $("#modal-login").iziModal({overlayClose: false, overlayColor: 'rgba(0, 0, 0, 0.9)'});
  $("#modal-register").iziModal({overlayClose: false, overlayColor: 'rgba(0, 0, 0, 0.9)'});

  /* JS inside the modal */

  $("#modal-login").on('click', '.submit', function (event) {
    var fx = "wobble", //wobble shake
      $modal = $(this).closest('.iziModal');
    if (!$modal.hasClass(fx)) {
      $modal.addClass(fx);
      setTimeout(function () {
        $modal.removeClass(fx);
      }, 1500);
    }
  });

 })

$(function () {
  $("#modal-redFlag").iziModal({overlayClose: false, overlayColor: 'rgba(0, 0, 0, 0.9)'});
})
$(function () {
  $("#modal-closeAccount").iziModal({overlayClose: false, overlayColor: 'rgba(0, 0, 0, 0.9)'});
})
$(function () {
  $("#modal-register")
    .on('click', 'header div a', function (event) {
      event.preventDefault();
      var i = $(this).index()
      $(this)
        .addClass('active')
        .siblings('a')
        .removeClass('active');
      $(this)
        .parents("div")
        .find("section")
        .eq(i)
        .removeClass('hide')
        .siblings('section')
        .addClass('hide');
    });

  $("#modal-register").on('click', '.submit', function (event) {
    var fx = "wobble", //wobble shake
      $modal = $(this).closest('.iziModal');

    if (!$modal.hasClass(fx)) {
      $modal.addClass(fx);
      setTimeout(function () {
        $modal.removeClass(fx);
      }, 1500);
    }
  });
})

$('.scrollmenu a').click(function (e) {
  var targetHref = $(this).data('target');

  $('html, body').animate({
    scrollTop: $(targetHref)
      .offset()
      .top - 30
  }, 1000);
  e.preventDefault();
});

// Find a doctor search autocomplete
var demo1 = new autoComplete({
  selector: '#findDoctor',
  minChars: 1,
  source: function (term, suggest) {
    term = term.toLowerCase();
    var choices = ajax('/doctors/get').then(value => {
      return  value;
    });
    choices.then((function(data) {
      let name = data.doctors.map(a => a.username); 
      let speciality = data.doctors.map(a => a.speciality)
      let country = data.doctors.map(a => a.country )
      var myArrayNew = country.filter(function (el) {

        return el != null && el != "";
    
      });
      var result1 = merge_array(name, speciality, myArrayNew) 
      var suggestions = [];
      for (i = 0; i < result1.length; i++) 
        if (~ result1[i].toLowerCase().indexOf(term)) 
          suggestions.push(result1[i]);
          suggest(suggestions);
    }))
  }
});
// Country Autocomplete
var demo2 = new autoComplete({
  selector: '#country',
  minChars: 0,
  source: function (term, suggest) {
    term = term.toLowerCase();
    var choices = [
      [
        'Australia', 'au'
      ],
      [
        'Austria', 'at'
      ],
      [
        'Brasil', 'br'
      ],
      [
        'Bulgaria', 'bg'
      ],
      [
        'Canada', 'ca'
      ],
      [
        'China', 'cn'
      ],
      [
        'Czech Republic', 'cz'
      ],
      [
        'Denmark', 'dk'
      ],
      [
        'Finland', 'fi'
      ],
      [
        'France', 'fr'
      ],
      [
        'Germany', 'de'
      ],
      [
        'Hungary', 'hu'
      ],
      [
        'India', 'in'
      ],
      [
        'Italy', 'it'
      ],
      [
        'Japan', 'ja'
      ],
      [
        'Netherlands', 'nl'
      ],
      [
        'Norway', 'no'
      ],
      [
        'Portugal', 'pt'
      ],
      [
        'Romania', 'ro'
      ],
      [
        'Russia', 'ru'
      ],
      [
        'Spain', 'es'
      ],
      [
        'Swiss', 'ch'
      ],
      [
        'Turkey', 'tr'
      ],
      ['USA', 'us']
    ];
    var suggestions = [];
    for (i = 0; i < choices.length; i++) 
      if (~ (choices[i][0] + ' ' + choices[i][1]).toLowerCase().indexOf(term)) 
        suggestions.push(choices[i]);
  suggest(suggestions);
  },
  renderItem: function (item, search) {
    search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&amp;');
    var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
    return '<div class="autocomplete-suggestion" data-langname="' + item[0] + '" data-lang="' + item[1] + '" data-val="' + search + '"><img src="/uploads/country/' + item[1] + '.png"> ' + item[0].replace(re, "<b>$1</b>") + '</div>';
  },
  onSelect: function (e, term, item) {
    console.log('Item "' + item.getAttribute('data-langname') + ' (' + item.getAttribute('data-lang') + ')" selected by ' + (e.type == 'keydown'
      ? 'pressing enter'
      : 'mouse click') + '.');
    document
      .getElementById('country')
      .value = item.getAttribute('data-langname') + ' (' + item.getAttribute('data-lang') + ')';
  }
});

var findPrescription = new autoComplete({
  selector: '#findPrescription',
  minChars: 1,
  source: function (term, suggest) {
    term = term.toLowerCase();
  var choices = ajax('/prescriptions/get').then(value => {
      return  value;
  });
  choices.then((function(data) {
    let title = data.prescriptions.map(a => a.title); 
    let categories = data.prescriptions.map(a => a.category.category)
    var result = merge_array(title, categories) 
    var suggestions = [];
    for (i = 0; i < result.length; i++) 
      if (~ result[i].toLowerCase().indexOf(term)) 
        suggestions.push(result[i]);
        suggest(suggestions);
  }))
  }
});
function merge_array(array1, array2, array3 = []) {
  const result_array = [];
  const arr0 = array1.concat(array2);
  const arr = arr0.concat(array3)
  let len = arr.length;
  const assoc = {};

  while(len--) {
      const item = arr[len];

      if(!assoc[item]) 
      { 
          result_array.unshift(item);
          assoc[item] = true;
      }
  }

  return result_array;
}

function ajax(url) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
			var status = xhr.status;
			if (status == 200) {
				resolve(xhr.response);
			} else {
				reject(status);
			}
		};
		xhr.send();
	});
}

$('.redFlag').on('click',function() {
    var check = $(this).children(['input']).prop("checked");
    $(this).children(['input']).prop("checked", !check);
    if($(this).children(['input']).prop("checked")){
      $(this).attr("data-izimodal-open","#modal-redFlag"); 
    }else{
      $(this).removeAttr("data-izimodal-open")
    }     
})

$(document).ready(function () {
  var male = $('#male');
  male.mapster(
    {
        fillOpacity: 0.4,
        fillColor: "d42e16",
       isSelectable: true,
       singleSelect: true,
       mapKey: 'name',
       listKey: 'name',
       showToolTip: true,
       toolTipClose: ["tooltip-click", "area-click"],
       areas: [
             {
               key: "hands",
               fillColor: "555555",
       
             },
             {
               key: "head",
               fillColor: "555555"
             },
             {
               key: "foots",
               fillColor: "555555"
             },
             {  
               key: "chest",
               fillColor: "555555"
             },
             {
                key: "abdomen",
               fillColor: "555555"
             },
             {
                key: "genitals",
                fillColor: "555555"
             }
             ]
     });
   });


$('body').on('click','.disabledInputs', function(){
  const id = $(this).data('target')
  if(! $(this).attr('checked') ){
    $(`#${id}`).find('input[type=time]').each(function(){
    $(this).attr('disabled','disabled')
    })
    $(this).attr('checked','checked')
  }else if($(this).attr('checked')) {
    $(`#${id}`).find('input[type=time]').each(function(){
      $(this).removeAttr('disabled')
    })
      $(this).removeAttr('checked')
  }
})   

$('body').on('click', '.views', function() {
  const prescription = $(this).data('target')
  const user = $(this).data('user')
  const views = $(this)
  var rate = ''
  $.ajax({
    type: 'POST',
    url: '/rating',
    data: {prescription: prescription, user: user},
    success: function(data) {
      console.log(data.prescription);
      if(data.removeClick){
        rate += `${data.prescription.rating} <i class="fa fa-heart"></i>`
      }
      else {
        rate += `${data.prescription.rating} <i class="fa fa-heart clicked"></i>`
      }
      views.html(rate)
    }
  })
  
})

function getReservation(){
  var id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1) || null
  let arr = []
  return $.ajax({
    type: 'POST',
    url: '/reservationsDoctor',
    data: {id: id},
    success: function(data) {
     return  data.reservations    
    }
    
  }) 
}
document.addEventListener('DOMContentLoaded', function() {
  var reservations = getReservation().then(data => {
    return data
  })
  reservations.then((function(element) {
    var result = element.reservations.map(ele => {
      var hourFrom = ele.dateFrom.split(':')
      var hourTo = ele.dateFrom.split(':')
      
      startDate = new Date(ele.date)
      startDate.setHours(hourFrom[0],hourFrom[1])
      startDate = startDate.toISOString()
      
      endDate = new Date(ele.date)
      endDate.setHours(hourTo[0],hourTo[1])
      endDate = endDate.toISOString()
      const obj = {
        title: ele.subject,
        url: '/reservations/view/'+ele.doctor+'/'+ele._id,
        start: startDate,
        end: endDate,
      }

      return obj
    })

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'interaction', 'dayGrid', 'timeGrid' ],
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      timeZone: 'local',
      defaultDate: Date.now(),
      navLinks: true, // can click day/week names to navigate views
      selectable: true,
      selectMirror: true,
      select: function(arg) {
        var title = prompt('Enter Subject:');
        if (title) {
          $(location).attr('href',`/doctors/appointment?subject=${title}&start=${arg.start.toISOString()}&end=${arg.end.toISOString()}`)
          calendar.addEvent({
            title: title,
            start: arg.start,
            end: arg.end,
            allDay: arg.allDay
          })
        }
        calendar.unselect()
      },
      editable: false,
      eventLimit: true, // allow "more" link when too many events
      events: result
    });
    calendar.render();
}))
 
});

// Remove Reservation
$('#removeReservation').on('click', function() {
  const id = $(this).data('id')
  $.ajax({
    type: "POST",
    url: "/reservation/delete/",
    data: {id: id},
    success: function(data){
      $(location).attr('href', '/doctors/profile/'+data.reservation.doctor)
    }
  })
})