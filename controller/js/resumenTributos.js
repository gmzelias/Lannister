/*Breadcrum home action*/ 
$('.landingFromResumenTribs').on('click',function() { 
    $('#example').DataTable().destroy();
    $('#newpage').hide();  
    $('#main').show();   
})

$('.summarydiv').hide(); 

/*Request that returns datatable data and datatable generation*/ 
$.ajax({
    type: "GET",
    url: "/TribsEcuations",
    success: function(a) {  
        $(".card-text-Dia").text(a.dataTribs.tribsDay + "$");
        $(".card-text-Mes").text(a.dataTribs.tribsMes+ "$");
        $(".card-text-Ano").text(a.dataTribs.tribsAno+ "$");

        var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var d = new Date(a.dataTribs.tribaveano[0].Fecha_Creacion);
        var monthstochart = months.slice(d.getMonth(), a.dataTribs.tribaveano.length);

        console.log(a.dataTribs.tribaveano);
        var datatochart = [];
        var datatochartsumMonthly = [];
        var sumMonthly = 0;
        for(var i = 0; i <a.dataTribs.tribaveano.length;i++){   
                    
            datatochart.push(a.dataTribs.tribaveano[i].tribaveano);
            console.log(a.dataTribs.tribaveano[i].tribaveano);
            sumMonthly = sumMonthly + a.dataTribs.tribaveano[i].tribaveano;
            console.log(sumMonthly);
            datatochartsumMonthly.push(sumMonthly);
            
        }

        
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthstochart,
                datasets: [{
                    label: 'Recaudacion Mes',
                    data:datatochart,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                },{
                    data:datatochartsumMonthly,
                    label: 'Recaudacion Acumulado',
                    backgroundColor: [
                        'rgba(255, 199, 132, 0.2)',
                        'rgba(154, 62, 235, 0.2)',
                        'rgba(155, 06, 86, 0.2)',
                        'rgba(175, 92, 192, 0.2)',
                        'rgba(153, 02, 255, 0.2)',
                        'rgba(155, 259, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(155,99,132,1)',
                        'rgba(154, 162, 235, 1)',
                        'rgba(155, 206, 86, 1)',
                        'rgba(175, 192, 192, 1)',
                        'rgba(53, 102, 255, 1)',
                        'rgba(155, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
});

        /*Hide loader */
        $('.recap_load').hide();
        $('.summarydiv').show(); 
    },
    error: function (e) {
    },
});


