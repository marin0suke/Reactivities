using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class HttpExtensions // 238. send http results of pagination back to client.
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, 
            int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new 
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            }; // using an anon object for this. 
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader)); // then we add it to the response.
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); // expose so retrievable by browser. 
        }
    }
}

// 238. new static class for extensions.