var checked = true;
var credit_text = ", Tweeted using @SquallApp";
var TCO_LENGTH = 23;
var IMAGE_LINK_LENGTH = 40;
var font = "Lato";
var timer;
var app_user = 'SquallApp';

rangy.init();

function Highlighter() {
    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action';
    this.button.textContent = 'H';
    this.button.onclick = this.onClick.bind(this);
    this.classApplier = rangy.createCssClassApplier("highlight", {
        elementTagName: 'mark',
        normalize: true
    });
}
Highlighter.prototype.onClick = function() {
    this.classApplier.toggleSelection();
    //draw();
};
Highlighter.prototype.getButton = function() {
    return this.button;
};
Highlighter.prototype.checkState = function (node) {
    if(node.tagName == 'MARK') {
        this.button.classList.add('medium-editor-button-active');
    }
};


var editor = new MediumEditor('.editable', {
  buttons: ['highlight', 'bold', 'italic', 'underline', 'quote', 'header1',
            'superscript', 'subscript', 'unorderedlist'],
  cleanPastedHTML: true,
  buttonLabels: 'fontawesome',
  extensions: {
    'highlight': new Highlighter()
  }
});


function draw(callback) {
  console.log('draw(callback) ');
  $('#image-header-title').text($('#textArea').val());

  //TODO include moment.js for datetime
  //TODO make sure user time is correctish by using server time
  var temp_d = new Date();
  $('#image-header-timestamp').html( (strftime('%b %d, %Y at %I:%M %p', new Date())).replace(/ /g,'&nbsp;')  );
  html2canvas(document.getElementById('t'), {
    allowTaint: true,
    onrendered: function(canvas) {
      document.getElementById('image-body').src = canvas.toDataURL();
      // html2canvas does not render hidden HTML -> showing then hiding image_container
      var image_container = $('#image-container');
      image_container.css('display','block');
      html2canvas(image_container[0] , {
	    allowTaint: true,
	    background: '#fff',
	    onrendered: function(canvas) {
	      document.getElementById('image').src = canvas.toDataURL();
	      $('#image-container').css('display','none');
	      if(callback){
	    	  callback();
	    	  console.log('callback called');
	      }
	      else{
	    	  console.log('no callback ');
	      }
      }
	  });
    }
  });
}



$(document).ready(function() {

  autosize(document.querySelectorAll('textarea'));

  // Format date strings
  $('.post-time').map(function() {
    var dateString = Date.parse($(this).text());
    $(this).text(strftime('%b %d, %Y at %I:%M %p', new Date(dateString)));
  });

  $('.post-time-date').map(function() {
    var dateString = Date.parse($(this).text());
    $(this).text(strftime('%b %d, %Y', new Date(dateString)));
  });

  $('.login-btn').click(function() {
    ga('send', 'event', 'Homepage', 'click', 'Login');
  });

  $('.example-btn').click(function() {
    ga('send', 'event', 'Homepage', 'click', 'Example');
  });

  $('.why-btn').click(function() {
    ga('send', 'event', 'Homepage', 'click', 'Why Medium');
  });

//  $('.editable').on('input', function() {
//    draw();
//  });

  $('.tweet-button').click(function() {

	draw(function(){
		toggler(function() {
	      $('.tweet-button').text('Tweet Posted');
	      $('.tweetresult').css('display', 'none');
	      $('.tweet-button').addClass('disabled');
	      ga('send', 'event', 'Dashboard', 'Click', 'Tweet', $('.textBox').text().length);

	      var title = $('textArea').val();
	      if(title.length === 0) {
	        title = "My Post";
	        console.log("too short");
	        console.log(title);
	      }

	      var content = document.getElementById('t').textContent;
	      var htmlcontent = $('#m').html().toString();
	      var author = $('#profileUsername').text();

	      $.post('/tweetpost', { image: $('#image').attr('src'), title: String(title), htmlcontent: htmlcontent, content: String(content), author: String(author) }, function(data) {
	        $('.tweetresult').css('display', 'block');
	        $('.tweetresult').find('.embed').html(data);
	        $('.tweet-button').text('Tweet');
	        $('.tweet-button').removeClass('disabled');
	      });
	    });
	});


  });


  $('.upload-imgur').click(function() {

	draw( function(){
		$('.tweet-button').text('Uploading image...');
	    $('.tweetresult').css('display', 'none');
	    $('.tweet-button').addClass('disabled');
	    ga('send', 'event', 'Dashboard', 'Click', 'Imgur Upload');
	    $.post('/upload/imgur', { image: $('#image').attr('src') }, function(data) {
	      if (data === 'error') {
	        alert('Could not upload image');
	      } else {
	        $('.tweetresult').css('display', 'block');
	        $('.tweetresult').find('h4').text('Image Uploaded');
	        $('.tweetresult').find('.embed').html(
	            '<div class="form-control-wrapper"><input class="form-control ' +
	            'empty upload-link" readonly value="' + data + '" type="text"><span ' +
	            'class="material-input"></span></div>');
	      }
	      $('.tweet-button').text('Tweet');
	      $('.tweet-button').removeClass('disabled');
	    });
	});

  });


$('#credit').click(function() {
  var $this = $(this);
  checked = $this.is(':checked');
  if (checked) {
    $('.textBox').after('<div class="credit-preview">' + credit_text + '</div>');
  } else {
    $('.panel-body').find('.credit-preview').remove();
  }
});

$('#font').click(function() {
  var $this = $(this);
  checked = $this.is(':checked');
  if (checked) {
    font = 'Merriweather';
  } else {
    font = 'Lato';
  }
  $('.panel-body').css('font-family', font);
  //draw();
});

$('#textArea').keyup(function() {
  var text = $(this).val();
  var splits = text.split(' ');
  geturl = new RegExp("(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))", "g");
  var length = (text.match(/ /g) || []).length;

  for (var i = 0; i < splits.length; i++) {
    if (splits[i].match(geturl) && splits[i].length > TCO_LENGTH) {
      // it's a url and under max length
      length += TCO_LENGTH;
    } else {
      length += splits[i].length;
    }
  }

  $('.text-length').text( length + '/60 characters left');
  if(length > 60){
    $('#textArea').text($('#textArea').text().substring(0, 59));
  }
  $('#previewtitle').text($('#textArea').val());
  //draw()
});

  $('#t').keyup(function() {
    var post_length = $('#t').text().length;
    if (post_length > 2000) {
      $('#t').text($('#t').text().substring(0,1999));
    }
    $('.post-length').text(post_length +' / 2000 characters left');

    $('#previewcontent').html($('#t').html());
    //draw()
  });

  $(".upload-link").focus(function() {
    this.select();
  });

  $('.rand-bg-btn').click(function() {
    var color = randomColor({
       luminosity: 'light'
    });
    $('.panel-body').css('background-color', color);
  //draw()

  });

  //Catching this event on the body means that we don't have to re-attach click handlers when swapping ids.
  $("body").on("click", "#follow, #unfollow", function(event) {
    var btn = $(event.target);
    var username = btn.attr("data-username");
    btn.prop("disabled", true);
    $.post('/'+username+"/"+btn.attr("id"), {}, function(){
        btn.toggleClass("btn-info btn-danger").prop("disabled", false);
        if(btn.hasClass("btn-info")){
          btn.text("Follow");
        }else{
          btn.text("Unfollow");
        }
    });
  });

$('.followuser').click(function() {
  console.log('following')
  var username = $('#profileUsername').text()

  $.post("/"+username+"/follow", function() {
    console.log('friendship')
    $('.followuser').text("Followed");
  });

});

$('.unfollowuser').click(function() {
  console.log('unfollow')
  var username = $('#profileUsername').text()
  console.log("unfollowing");
  console.log(username);
  $.post("/"+username+"/unfollow", function() {
    $('.unfollowuser').text("Unfollowed")
  });
});

  $('#settings-form').submit(function(e) {
    $('#success-alert').addClass("hide");
    $('#error-alert').addClass("hide");
    var params = $('#settings-form').serializeJSON();

    $.post('/settings', params, function(data) {
      if (data.passed) {
        $('#success-alert').removeClass("hide");
      } else {
        $('#error-alert').html(data.errors);
        $('#error-alert').removeClass("hide");
      }
    });
    e.preventDefault();
  });

$('#start-form').submit(function(e) {
	$('#success-alert').addClass("hide");
	$('#error-alert').addClass("hide");
	var params = $('#start-form').serializeJSON();

	var redirectSuccess = function() {
		$('#success-alert').removeClass("hide").html('Thank you, you\'ll be ' +
			'redirected to the dashboard in 3 seconds ');
		setTimeout(function() {
			window.location = '/';
		}, 3000);
	};
	var failMessage = function(data) {
		$('#error-alert').html(data.errors);
		$('#error-alert').removeClass("hide");
	};
	if (!params.email) {
		failMessage({errors: 'To keep you up to date, enter your email address'});
	} else {
		$.post('/settings', params, function(data) {
			if (data.passed) {
				if (params.follow_app) {
					$.post("/twitter/createfriendship", {
						username: app_user
					}).done(redirectSuccess).fail(failMessage);
				} else {
					redirectSuccess();
				}
			} else {
				failMessage(data);
			}
		})

  }
	e.preventDefault();
});

  //getting avatar uri by ajax
  //TODO handle errors in AJAX
  $.ajax('./avatar_uri').done(function(data){
	  $('#image-header-avatar').attr('src',data);
  });
  // filling the header of the image to be tweeted, fixing issues of floats
  var image_header_name = $('#image-header-name');
  image_header_name.html(image_header_name.text().replace(/ /g,'&nbsp;'));

})

function toggler(callback) {
  $('#preview').show(function() {
//    draw(function() {
      callback();
//    });

  });
}

$('.previewtoggle').click(function() {
  $('#preview').toggle();
})

$(window).resize(function() {
  clearTimeout(timer);

  timer = setTimeout(function() {
    //draw();
  }, 200); // wait for 200ms
});
