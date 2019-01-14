/*Breadcrum home action*/ 
$('.landingFromNewTrib').on('click',function() { 
    $('#example').DataTable().destroy();
    $('#newpage').hide();  
    $('#main').show();   
})

/*Hidden until loading*/ 
$('#locationdiv').hide(); 

/*Spinner initialization*/ 
$("input[type='number']").inputSpinner()

/*Datepicker calendar initialization*/ 
$("#datepicker" ).datepicker({
    showOn: "button",
    buttonImage: "img/icon-calendar.png",
    buttonImageOnly: true,
    buttonText: "Select date",
    dateFormat: 'dd/mm/yy'
  });
$("#datepicker").datepicker().datepicker("setDate", new Date());

/*Add values to select*/ 
$.ajax({
    type: "GET",
    url: "/getContFortrib",
    success: function(a) {      
        var dataSet = a.data;
        if (dataSet.length == 0)  $( "#nuevoTrib" ).prop( "disabled", true );
        for(var i = 0; i < dataSet.length;i++){  
            var  contributorName = dataSet[i][1] + ' ' + dataSet[i][2];
            var  contributorID = dataSet[i][0];
            $('#contdropdown').append($('<option>', { 
                value: contributorID,
                text :contributorName 
            }));
        }
    },
    error: function (e) {
    },
});

/*AJAX request to get current location based on IP*/
$.ajax({
    type: "GET",
    url: "https://geoip-db.com/json/",
    success: function(a) {  
        var obj = JSON.parse(a);
        if(obj.country_name!=null) $("#country_name").text("País: "+obj.country_name);
        if(obj.city!=null) $("#city").text("Ciudad: "+obj.city);
        if(obj.postal!=null) $("#postal").text("Zip: "+obj.postal);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
          } else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
          }
          function showPosition(position) {
            if(position.coords.latitude!=null) $("#lat").text("Lat: "+position.coords.latitude);
            if(position.coords.longitude) $("#long").text("Long: "+position.coords.longitude);   
          }
          $('.location_load').hide();
          $('#locationdiv').show(); 
    },
    error: function (e) {
    },
});

/*Function that gets data from form and executes the querys to the DB*/ 
$('#nuevoTrib').on('click',function() { 
    var missing = false;
    var direccion = "";
    if($('#country_name').text() != "") direccion = direccion+$('#country_name').text();
    if($('#city').text() != "") direccion = direccion+','+$('#city').text();
    if($('#postal').text() != "") direccion = direccion+','+$('#postal').text();
    if($('#lat').text() != "") direccion = direccion+','+$('#lat').text();
    if($('#long').text() != "") direccion = direccion+','+$('#long').text();
    var data = {
    FK_Contribuyente: $('#contdropdown option:selected').val(),
      Nombre: $('#contdropdown option:selected').text(),
      Fecha_Creacion:$('#datepicker').val(),
      Cuantia:$('#cuantia').val(),
      Recaudado:$('#tribCheck').is(":checked"),
      Notas:$('#direccion').val(),
      Lugar_Recogida:direccion,
    }
    $('#datepicker').focus(function() {
        $("#datepicker").removeClass("invalid-calendar");
        $("#datepicker").addClass("form-calendar");
      });

      if(data.Recaudado == true) data.Recaudado ='Si'
      else data.Recaudado ='No'

    if(data.Date == ""){
        $("#datepicker").removeClass("form-calendar");
        $("#datepicker").addClass("invalid-calendar");
        missing = true;
    }
if(missing == false){
   $.ajax({
        type: "POST",
        url: "/addTrib",
        data: data,
        success: function(a) {  
           if(a.error == 1){
            $('.modal-body').empty();
            $('.modal-body').append("<p style='margin-bottom: 00px;text-align: center;'>Tributo no creado: Ya existente</p>"); 
            $('#exampleModal').modal('show');
            }
            else {
            $('.modal-body').empty();
            $('.modal-body').append("<p style='margin-bottom: 00px;text-align: center;'>Tributo creado exitosamente</p>"); 
            $('#exampleModal').modal('show');
            }
        },
        error: function (e) {
        },
    });
}
});

