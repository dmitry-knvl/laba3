using System;
using System.IO;
using System.Net;
class Program
{
    static void Main(string[] args)
    {
        // Директория, которую мы будем отображать
        string directory = "./../../../client";

        // Создаем экземпляр HttpListener для прослушивания подключений и ответа на запросы
        var server = new HttpListener();

        // Добавляем префикс, по которому будем слушать запросы
        server.Prefixes.Add("http://localhost:8080/");
    
        // Начинаем прослушивание запросов
        server.Start();
        Console.WriteLine("Server started");

        while (true) {
            // Получаем контекст входящего подключения
            HttpListenerContext context = server.GetContext();

            // Получаем объект для установки ответа
            HttpListenerResponse response = context.Response;

            // Задаём путь к первому открываемому файлу
            string path = directory+context.Request.RawUrl;
            if (context.Request.RawUrl == "/") path += "index.html";
            Console.WriteLine("Raw URL: {0}", context.Request.RawUrl);

            if (File.Exists(path)) {
                // Если файл найден, отправляем ответ на запрос
                Console.WriteLine("URL: {0} ({1}) – OK", context.Request.Url.OriginalString, path);
                // Считываем содержимое файла в виде массива байтов
                byte[] buffer = File.ReadAllBytes(path);

                // Устанавливаем размер ответа
                response.ContentLength64 = buffer.Length;
                // Получаем выходной поток
                Stream output = response.OutputStream;
                // Записываем в выходной поток ответ (массив байтов)
                output.Write(buffer, 0, buffer.Length);

                // Закрываем поток
                context.Response.Close();
            }
            else {
                // Если файл не найден, отправляем 404 ошибку
                Console.WriteLine("URL: {0} ({1}) – Not Found", context.Request.Url.OriginalString, path);
                // Устанавливаем код статуса
                context.Response.StatusCode = 404;
                // Закрываем поток
                context.Response.Close();
            }
        }
    }
}



