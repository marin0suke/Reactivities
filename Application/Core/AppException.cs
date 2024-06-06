
namespace Application.Core
{
    public class AppException
    {
        public AppException(int statusCode, string message, string details = null) 
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
   
        }
        public int StatusCode { get; set; } 
        public string Message { get; set; }
        public string Details { get; set; }
    }
}

//107. handling exceptions - this new cs class was created in this lesson, with new props 3x and the AppExceptionmethod ?