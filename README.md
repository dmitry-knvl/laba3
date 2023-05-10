### ЛАБОРАТОРНАЯ РАБОТА №3
# Системы контроля версий (VCS)

*Целью* лабораторной работы является изучение предназначения и различных способов организаций систем контроля версий и ознакомление с операциями над файлами в репозитории и с приемами групповой работы над проектом.

**Задание**: создать общий интерфейс для представления статистических данных согласно вариантам участников команды в России за последние 15 лет.

Для выполнения лабораторной работы была разработана ***Клиент-серверная*** архитектура. 

Серверная часть была реализована на языке `C#` с использованием фреймворка [`Serverito`](https://github.com/RonenNess/Serverito).
Клиентская часть была реализована с использованием языка разметки `HTML` и языка стилей `CSS`.
Для реализации визуальной составляющей (таблицы и графики) был использован фреймворк [`Chart.js`](https://github.com/chartjs/Chart.js).

<details> <summary>Пример кода сервера</summary>
        
```c#
string directory = "./../../../client";

var server = new HttpListener();

server.Prefixes.Add("http://localhost:8080/");

server.Start();
Console.WriteLine("Server started");

while (true) {
    HttpListenerContext context = server.GetContext();

    HttpListenerResponse response = context.Response;

    string path = directory+context.Request.RawUrl;
    if (context.Request.RawUrl == "/") path += "index.html";
    Console.WriteLine("Raw URL: {0}", context.Request.RawUrl);

    if (File.Exists(path)) {
        Console.WriteLine("URL: {0} ({1}) – OK", context.Request.Url.OriginalString, path);
        byte[] buffer = File.ReadAllBytes(path);

        response.ContentLength64 = buffer.Length;
        Stream output = response.OutputStream;
        output.Write(buffer, 0, buffer.Length);

        context.Response.Close();
    }
    else {
        Console.WriteLine("URL: {0} ({1}) – Not Found", context.Request.Url.OriginalString, path);
        context.Response.StatusCode = 404;
        context.Response.Close();
    }
}
```    
    
</details>

Запустив сервер и [перейдя на него](http://localhost:8080/), откроется страница с выбором, данные какого варианта просмотреть:
- **Вариант 8** - Медианная заработная плата
- **Вариант 12** - Выбросы парниковых газов
- **Вариант 15** - Инфекционные заболевания

<details> <summary>Пример кода страницы</summary>
    
```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="./css/index.css">
    <link rel="preload" href="./fonts/MontserratAlternates-Regular.ttf" as="font">
    <link rel="preload" href="./fonts/MontserratAlternates-Bold.ttf" as="font">

    <title>Лабараторная работа №3</title>
    
    <script src="js/jquery.js"></script>
    <script src="js/chart.js"></script>
    <script src="js/script.js"></script>
</head>
<body>
    <div class="scheme">
    <nav class="navigation">
        <h1 class="title">Выберете схему:</h1>
        <ul class="variant__list">
            <li class="variant__item variant__item--8">
                <button class="variant__btn" id="salaries_btn" >Вариант 8</button>
            </li>
            <li class="variant__item variant__item--12">
                <button class="variant__btn" id="deseases_btn" >Вариант 12</button>
            </li>
            <li class="variant__item variant__item--15">
                <button class="variant__btn" id="gases_btn" >Вариант 15</button>
            </li>
        </ul>
    </nav>
    <section class="table-scheme">
        <p class="text">таблица</p>
        <table class="table" id="table"></table>
    </section>
    <section class="graph-scheme">
        <p class="text">график</p>
        <canvas class="graph" id="graph"></canvas>
    </section>
    </div>
</body>
</html>
```
    
</details>

Сами данные хранятся в дата-файлах с расширением `.json`.

<details> <summary>Пример кода файла с данными</summary>
    
```json
{
    "schema": {
        "parameterName": "Salaries",
        "data": [
            {
                "year": 2007,
                "value": 11875.5,
                "name": "М"
            },
            {
                "year": 2008,
                "value": 14625.5,
                "name": "М"
            },
            {
                "year": 2009,
                "value": 15895.5,
                "name": "М"
            },
            {
                "year": 2010,
                "value": 17973.3,
                "name": "М"
            },
            {
                "year": 2011,
                "value": 20115,
                "name": "М"
            },
            {
                "year": 2012,
                "value": 21617,5,
                "name": "М"
            },
            {
                "year": 2013,
                "value": 23059,
                "name": "М"
            },
            {
                "year": 2014,
                "value": 25263,
                "name": "М"
            },
            {
                "year": 2015,
                "value": 26731,
                "name": "М"
            },
            {
                "year": 2016,
                "value": 28997,75,
                "name": "М"
            },
            {
                "year": 2017,
                "value": 31124,5,
                "name": "М"
            },
            {
                "year": 2018,
                "value": 34436,
                "name": "М"
            },
            {
                "year": 2019,
                "value": 37486,5,
                "name": "М"
            },
            {
                "year": 2020,
                "value": 40627,75,
                "name": "М"
            },            
            {
                "year": 2021,
                "value": 44854,
                "name": "М"
            },            
            {
                "year": 2022,
                "value": 44333,
                "name": "М"
            }
        ]
    } 
}
```
    
</details>

---

![C#](https://img.shields.io/badge/c%23-%23239120.svg?style=for-the-badge&logo=c-sharp&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![HTML](https://img.shields.io/badge/html-%23E34F26.svg?style=for-the-badge)
![CSS](https://img.shields.io/badge/css-%231572B6.svg?style=for-the-badge)
