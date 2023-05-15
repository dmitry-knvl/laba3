$(() => {
    // Создание графика
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
    
    // Преобразования данных
    function findMin(data) {
        data = groupByName(data);
        let value;
        let name;
        data.forEach((d)=>{
            let t = d.values[0]/d.values[d.values.length-1];
            if(!value || value < t) {
                name = d.name;
                value = t;
            }
        });
        return name;
    }

    function findMax(data) {
        data = groupByName(data);
        let value;
        let name;
        data.forEach((d)=>{
            let t = d.values[0]/d.values[d.values.length-1];
            if(!value || value > t) {
                name = d.name;
                value = t;
            }
        });
        return name;
    }
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

    function groupByYear(arr) {
        const nameMap = arr.reduce((acc, obj) => {
          const { year, value } = obj;
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(value);
          return acc;
        }, {});
      
        return Object.entries(nameMap).map(([year, values]) => ({ year, values }));
    }

    function toTableData(data) {
        const result = [];
      
        // Собираем уникальные значения полей year и name
        const years = [...new Set(data.map(item => item.year))];
        const names = [...new Set(data.map(item => item.name))];
      
        // Сортируем исходный массив по полю year
        data.sort((a, b) => a.year - b.year);
      
        // Создаем начальный двумерный массив, заполненный пустыми значениями 
        for(let i = 0; i < years.length; i++) {
            const row = [years[i]];
            for(let j = 0; j < names.length; j++) {
                row.push('');
            }
            result.push(row);
        }
      
        // Заполняем двумерный массив данными из исходного массива
        for(let i = 0; i < data.length; i++) {
            const yearIndex = years.indexOf(data[i].year);
            const nameIndex = names.indexOf(data[i].name);
            result[yearIndex][nameIndex + 1] = data[i].value;
        }
      
        return result;
    }

    function toTableHtml(data) {
        const tableRows = data.map(row => {
        const tableCells = row.map(cell => `<td>${cell}</td>`).join('');
            return `<tr>${tableCells}</tr>`;
        }).join('');

        return `${tableRows}`;
    }

    // Функции обновления
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

        chartOptions.scales.y.title = activeSchema.parameterName;

        Graph.data.labels = lables;
        Graph.data.datasets = datasets;
        Graph.update();
    }

    function updateTableData(){
        let res = '<tr><th>Год</th>';
        groupByName(activeSchema.data).forEach((val) => {
            res += `<th>${val.name}</th>`;
        });
        res += '</tr>';

        res += toTableHtml(toTableData(activeSchema.data));

        if(activeSchema.id == 2 || activeSchema.id == 3){
            res += `<tr>
                        <td><b>Снизилось<br>больше всего:</b></td>
                        <td><b>${findMin(activeSchema.data)}</b></td>
                        <td><b>Снизилось<br>меньше всего:</b></td>
                        <td><b>${findMax(activeSchema.data)}</b></td>
                    </tr>`;
        }
        if(activeSchema.id == 1){
            let m = groupByName(activeSchema.data)[0];
            m = m.values[m.values.length-1] / m.values[0];
            let w = groupByName(activeSchema.data)[1];
            w = w.values[w.values.length-1] / w.values[0];

            res += `<tr>
                        <td><b>Рост у мужчин</b></td>
                        <td><b>${(m*100).toFixed(1)}%</b></td>
                        <td><b>Рост у женщин</b></td>
                        <td><b>${(w*100).toFixed(1)}%</b></td>
                    </tr>`;
        }
        $("#table").html(res);
        console.log(res);
    }

    function update(){
        if(activeSchema.data.length == 0) return;

        $("#selectedSchema").text(activeSchema.parameterName);

        updateChartData();
        updateTableData();
    }

    

    function selectBtnHandler(target){
        fetch("./data/"+target+".json")
        .then(response => response.json())
        .then(data => {
            activeSchema = data.schema;
            update();
        })
        .catch(error => console.error(error));
    }

    var activeSchema = {
        parameterName: "Схема не выбрана",
        data: []
    };


    var Graph = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });

    update();

    $("#salaries_btn").on("click", () => { selectBtnHandler("salaries") });
    $("#gases_btn").on("click", () => { selectBtnHandler("gases") });
    $("#deseases_btn").on("click", () => { selectBtnHandler("deseases") });
});