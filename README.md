### ЛАБОРАТОРНАЯ РАБОТА №3
# Системы контроля версий (VCS)
Для выполнения лабораторной работы была разработана *Клиент-серверная* архитектура.

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

Запустив сервер, переходим 

---
![C#](https://img.shields.io/badge/c%23-%23239120.svg?style=for-the-badge&logo=c-sharp&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![HTML](https://img.shields.io/badge/html-%23E34F26.svg?style=for-the-badge)
![CSS](https://img.shields.io/badge/css-%231572B6.svg?style=for-the-badge)
