using System;
using System.IO;
using System.Net;
class Program
{
    static void Main(string[] args)
    {
        // Директория, которую мы будем отображать
        string directory = "./../../../client";

        // Создаем экземпляр HttpListener
        var server = new HttpListener();

        // Добавляем префикс, по которому будем слушать запросы
        server.Prefixes.Add("http://localhost:8080/");
    
    // Начинаем прослушивание запросов
        server.Start();

        Console.WriteLine("Server started");

        while (true) {
            HttpListenerContext context = server.GetContext();
            HttpListenerResponse response = context.Response;

            string path = directory+context.Request.RawUrl.Replace("%20", " ")+"index.html";

            Console.WriteLine("Raw URL: {0}", context.Request.RawUrl);

            if (File.Exists(path)) {
                Console.WriteLine("URL: {0} ({1}) – OK", context.Request.Url.OriginalString, path);
                byte[] buffer = File.ReadAllBytes(path);

                response.ContentLength64 = buffer.Length;
                Stream st = response.OutputStream;
                st.Write(buffer, 0, buffer.Length);

                context.Response.Close();
            }
            else {
                // Если файл не найден, отправляем 404 ошибку
                Console.WriteLine("URL: {0} ({1}) – Not Found", context.Request.Url.OriginalString, path);
                context.Response.StatusCode = 404;
                context.Response.Close();
            }
        }
    }
}



