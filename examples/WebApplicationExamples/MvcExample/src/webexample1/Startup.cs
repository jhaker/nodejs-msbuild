using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(webexample1.Startup))]
namespace webexample1
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
