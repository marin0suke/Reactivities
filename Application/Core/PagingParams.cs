using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50; // 237. set max page size. user selects size they want but have a max. 
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10; // default value - if client doesn't specify.
        public int PageSize
        {
            get => _pageSize; // same as return statement but shorter.
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // set page size with max parameters depending on what client inputs.
        }
        
    }
}

// 237. new class