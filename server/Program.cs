using System;
using System.IO;
using System.Net;
class Program
{
    static void Main(string[] args)
    {
        // Директория, которую мы будем отображать
        string directory = @"../client";

        // Создаем экземпляр HttpListener
        var listener = new HttpListener();

        // Добавляем префикс, по которому будем слушать запросы
        listener.Prefixes.Add("http://localhost:8080/");
    
    // Начинаем прослушивание запросов
        listener.Start();

        Console.WriteLine("Server started");

        while (true)
        {
            // Ждем входящий запрос
            var context = listener.GetContext();

            // Получаем запрашиваемый URL
            string url = context.Request.Url.LocalPath;

            // Собираем полный путь к файлу
            string path = directory + url;

            // Если файл существует, отправляем его содержимое в ответ
            if (File.Exists(path))
            {
                context.Response.ContentType = "application/octet-stream";
                context.Response.ContentLength64 = new FileInfo(path).Length;
                context.Response.AddHeader("Content-Disposition", "attachment; filename=" + Path.GetFileName(path));

                using (var stream = File.OpenRead(path))
                {
                    stream.CopyTo(context.Response.OutputStream);
                }
            }
            else
            {
                // Если файл не найден, отправляем 404 ошибку
                context.Response.StatusCode = 404;
                context.Response.Close();
            }
        }
    }
}



