using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T> : List<T> // 236. give PagedList generic type since we will be using this on all types of lists throughout app. also derive from List from framework. 
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize); //
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items); // without this we return 0 items. add items we get, passed in as a param into the class that we will be returning.
        }

        public int CurrentPage { get; set; } 
        public int TotalPages { get; set; } 
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task <PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber,   // static method that allows us to create a pages list and return it. 
            int pageSize)
        {
            var count = await source.CountAsync(); // this executes a query to the db. we need to establish the total in the list. 
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); // 
            return new PagedList<T>(items, count, pageNumber, pageSize); // 
        }   
    }

}

// 236. adding a PagedList class. whatever happens, whenever we implement paging, we will be making two queries to the db. 1st is to get the count of the items before pagination takes place.