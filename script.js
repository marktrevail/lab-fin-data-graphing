$( document ).ready(function() {

// ---------------------------------------------------------------------------
// Set default date values in form - and load the chart
// ---------------------------------------------------------------------------

var dateTo = moment().format('YYYY-MM-DD');
var dateFrom = moment().subtract(28,'d').format('YYYY-MM-DD');

$('#input_date_to').val(dateTo);
$('#input_date_from').val(dateFrom);

var chart;  // Define global variable for chart
refreshChart();

// ---------------------------------------------------------------------------
// Set listeners for form changes
// ---------------------------------------------------------------------------

$('#input_date_to').on('change', refreshChart);
$('#input_date_from').on('change', refreshChart);
$('#input_ccy').on('change', refreshChart);

// ---------------------------------------------------------------------------
// Function to refresh chart on form changes
// ---------------------------------------------------------------------------

  function refreshChart() {

    // Define chart area
    let canvas = document.getElementById('chart');
    let ctx = canvas.getContext('2d');

    // Get dates and ccy from form
    let dateTo = $('#input_date_to').val();
    let dateFrom = $('#input_date_from').val();
    let ccy = $('#input_ccy').val();

    // Make request to coindesk
    axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${dateFrom}&end=${dateTo}&currency=${ccy}`)
    .then((response) => {

      // Parse response from coindesk
      let lables = Object.keys(response.data.bpi);
      let data = Object.values(response.data.bpi);
      let minValue = Math.min(...data);
      let maxValue = Math.max(...data);

      // Update min and max values
      $('#minValue').html(minValue);
      $('#maxValue').html(maxValue);

      // Create chart with data
      if (chart) {
        chart.destroy(); // Get rid of the old chart
      };

      chart = new Chart(ctx, {
        type: 'line',

        data: {
            labels: lables,
            datasets: [{
                label: 'Bitcoin Price',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data
            }]
          },

        options: {}  // Could add configuration options here
      });
    });

  };

});

