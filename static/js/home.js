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
function resizeBase64Img(base64, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    var deferred = $.Deferred();
    $("<img/>").attr("src", "data:image/gif;base64," + base64).load(function() {
        context.scale(width/this.width,  height/this.height);
        context.drawImage(this, 0, 0);
        deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
    });
    return deferred.promise();
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





        // load file into preview pane

        var reader = new FileReader();
        reader.onload = function (e) {
	    html = '<div class="card card-inverse pb-5" style="width: 20rem; height: auto; overflow: hidden;"><img class="card-img" src="' + e.target.result + '" alt="Card image" style="max-height:400px;  filter: brightness(50%);"><div class="card-img-overlay"> <h4 class="card-title" id="content'+idnum+'">Uploading... </h4> </div> </div>'

            $('#inventory').append(html);
            file = resizeBase64Img(file,100,100);
            formdata = new FormData();
            formdata.append('image', file);


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
