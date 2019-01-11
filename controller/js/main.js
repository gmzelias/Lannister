
$('#nuevoContribuyente').on('click',function() { 
    $('.modal-body-dashboard').empty();
    $('.modal-body-dashboard').append("<input type='password'style='margin-bottom: 00px;text-align: center; class='' id='password' placeholder='Password'>"); 
    $('#exampleModal-dashboard').modal('show');
    $('#password').focus(function() {
        $('#password').removeClass("invalid-password");
      });

    $('#checkpassword').on('click',function() { 
        var data = {
            pass : $('#password').val()}
        $.ajax({
            type: "POST",
            url: "/validatePassword",
            data: data,
            success: function(a) {  
              if(a.error == 0){
                $('#exampleModal-dashboard').modal('hide');  
                $.ajax({
                    type: "GET",
                    url: "/nuevoCont",
                    success: function(a) {  
                        $('#main').hide();  
                        $( "#newpage" ).load( "nuevoCont.html", function() {
                            $("#newpage").show();
                        });
                    },
                    error: function (e) {
                    },
                });
              }
              else{
                $('#password').addClass("invalid-password");
              }
            },
            error: function (e) {
            },
        });
    });


});