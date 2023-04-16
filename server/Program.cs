using Serverito;

namespace ЛабРаб3 {
	class Program
	{
		static void Main(string[] args)
		{
			ServeritoListener server = new ServeritoListener("http://localhost:8000/");
			server.AddView(new URL("/"), (ServeritoContext context) =>
			{
				Utils.WriteToResponse(context.Context, "Hello World!");
			});
			server.Start();
		}
	}
}
