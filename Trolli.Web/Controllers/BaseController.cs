using Trolli.Models.ViewModels;
using System.Web.Mvc;

namespace Trolli.Web.Controllers
{
    public class BaseController : Controller
    {
        protected T GetViewModel<T>() where T : BaseViewModel, new()
        {
            T model = new T();

            //customize base view model here

            return model;
        }
    }
}
