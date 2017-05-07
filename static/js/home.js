/**
 * Created by Hallshit on 2/14/17.
 */
// var selectedFile = $('#fileinput').get(0).files[0];
// console.log()
//  Cookie Bullshit


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

//Cookie Bullshit ends

//Image Resizer
function resizeInCanvas(img){
  /////////  3-3 manipulate image
    var perferedWidth = 2700;
  var ratio = perferedWidth / img.width;
  var canvas = $("<canvas>")[0];
  canvas.width = img.width * ratio;
  canvas.height = img.height * ratio;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0,0,canvas.width, canvas.height);
  //////////4. export as dataUrl
  return canvas.toDataURL();
}


//Adds a new element and posts to db


var idnum = 1;
$(document).ready(function () {
    $('#fileinput').on('change', function () {
	$('#botgobutton').html('<div class="loader mx-auto"></div>');
    $('#howtojtron').remove();
        var s = '<li>text</li>'; // HTML string

        var div = document.createElement('div');
        div.innerHTML = s;
        var elements = div.childNodes;


        // get file and pull attributes
        var input = $(this)[0];
        var file = input.files[0];
        file = resizeInCanvas(file);
        formdata = new FormData();
        formdata.append('image', file);

        // load file into preview pane

        var reader = new FileReader();
        reader.onload = function (e) {
	    html = '<div class="card card-inverse pb-5" style="width: 20rem; height: auto; overflow: hidden;"><img class="card-img" src="' + e.target.result + '" alt="Card image" style="max-height:400px;  filter: brightness(50%);"><div class="card-img-overlay"> <h4 class="card-title" id="content'+idnum+'">Uploading... </h4> </div> </div>'

            $('#inventory').append(html);
            $.ajax({
                type: 'POST',
                url: 'ajax/post/',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (json) {
		    $('#botgobutton').html('Go!');     

                    console.log(json);
                    $('#content'+idnum).html(json.description);
                    idnum +=1
                }
            });
            // $('#testcard').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);

    });
});
