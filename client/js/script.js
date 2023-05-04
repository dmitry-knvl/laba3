$(() => {
    var chartData = { labels: [], datasets: [] };
    var ctx = document.getElementById('graph').getContext('2d');
    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'y'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Год'
                }
            }
        }
    };

    function groupByName(arr) {
        const nameMap = arr.reduce((acc, obj) => {
          const { name, value } = obj;
          if (!acc[name]) {
            acc[name] = [];
          }
          acc[name].push(value);
          return acc;
        }, {});
      
        return Object.entries(nameMap).map(([name, values]) => ({ name, values }));
      }

    function updateChartData() {
        var lables = Array.from(new Set(activeSchema.data.map((obj) => obj.year)));

        var datasets = [];
        groupByName(activeSchema.data).forEach((rawDataset) => {
            datasets.push({
                label: rawDataset.name,
                data: rawDataset.values,
                borderColor: `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
            });
        });

        chartData.labels = lables;
        chartData.datasets = datasets;

        chartOptions.scales.y.title = activeSchema.parameterName;
    }

    var activeSchema = {
        parameterName: "Схема не выбрана",
        data: [
            {
                "year": 2007,
                "value": 0,
                "name": "График1"
            },
            {
                "year": 2009,
                "value": 50,
                "name": "График1"
            },
            {
                "year": 2023,
                "value": 100,
                "name": "График1"
            }
        ]
    };

    updateChartData();

    var Graph = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });

    

});