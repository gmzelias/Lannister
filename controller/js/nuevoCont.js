
/*Datepicker calendar initialization*/ 
 $("#datepicker" ).datepicker({
        showOn: "button",
        buttonImage: "img/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
        dateFormat: 'dd/mm/yy'
      });
$("#datepicker").datepicker().datepicker("setDate", new Date());

$('.ContTable_load').show(); 
$('#contTable').hide();

/*Breadcrum home action*/ 
$('.landingFromCont').on('click',function() { 
    $('#contTable').DataTable().destroy();
    $('#newpage').hide();  
    $('#main').show();   
})

/*Request that returns datatable data and datatable generation*/ 
$.ajax({
    type: "GET",
    url: "/getCont",
    success: function(a) {  
        var dataSet = a.data;
        $('#contTable').DataTable( {
        scrollX:        true,
        scrollCollapse: true,
        paging:         true, 
        "bDestroy": true,    
         data: dataSet,
            columns: [
                { title: "Nombre" },
                { title: "Apellido1" },
                { title: "Apellido2" },
                { title: "Direccion" },
                { title: "Date" },
                { title: "Tributa" }
            ]
        });contTable
        $('.ContTable_load').hide();
        $('#contTable').show(); 
    },
    error: function (e) {
    },
});

$('#nombre').focus(function() {
    $("#nombre").removeClass("invalid-field");
    $("#nombre").addClass("form-control");
  });
  $('#primerapellido').focus(function() {
    $("#primerapellido").removeClass("invalid-field");
    $("#primerapellido").addClass("form-control");
  });
  $('#datepicker').focus(function() {
    $("#datepicker").removeClass("invalid-calendar");
    $("#datepicker").addClass("form-calendar");
  });

/*Function that gets data from form and executes the querys to the DB*/ 
$('#nuevoCont').on('click',function() { 
    var missing = false;
    var data = {
      Nombre: $('#nombre').val(),
      Apellido_Pri:$('#primerapellido').val(),
      Apellido_Sec:$('#segundoapellido').val(),
      Direccion:$('#direccion').val(),
      Tributa:$('#tribCheck').is(":checked"),
      Date:$('#datepicker').val(),
    }

    if(data.Tributa == true) data.Tributa ='Si'
    else data.Tributa ='No'

    if(data.Nombre == ""){
        $("#nombre").removeClass("form-control");
        $("#nombre").addClass("invalid-field");
        missing = true;
    }
    if(data.Apellido_Pri == ""){
        $("#primerapellido").removeClass("form-control");
        $("#primerapellido").addClass("invalid-field");
        missing = true;
    }
    if(data.Date == ""){
        $("#datepicker").removeClass("form-calendar");
        $("#datepicker").addClass("invalid-calendar");
        missing = true;
    }

if(missing == false){
   $.ajax({
        type: "POST",
        url: "/addCont",
        data: data,
        success: function(a) {  
            if(a.error == 1){
            $('.modal-body').empty();
            $('.modal-body').append("<p style='margin-bottom: 00px;text-align: center;'>Usuario no creado: Ya existente</p>"); 
            $('#exampleModal').modal('show');
            }
            else {
                $.ajax({
                    type: "GET",
                    url: "/nuevoCont",
                    /*data: data,*/
                    success: function(a) {  
                    // $('.maindashboard').hide();  
                        $( "#newpage" ).load( "nuevoCont.html", function() {
                            $('.modal-body').empty();
                            $('.modal-body').append("<p style='margin-bottom: 00px;text-align: center;'>Usuario creado exitosamente</p>"); 
                            $('#exampleModal').modal('show');
                        });
                    },
                    error: function (e) {
                    },
                });
            }
        },
        error: function (e) {
        },
    });
}
});