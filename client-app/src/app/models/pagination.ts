
export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> { // generic type so we can use it for anything.
    data: T; // in our case for the most part, this will be an activity array.
    pagination: Pagination;

    constructor(data: T, pagination: Pagination) { // bc this is a class we need some initial values.
        this.data = data;
        this.pagination = pagination;
    } // when we create a new instance of this class, we need to pass in these two values.
     
    // we need a way to get the paginated data; the properties that we will be sending back in our header. axios can interrogate a response and do something with that respnse. 
}

export class PagingParams { // 240. new class. 
    pageNumber;
    pageSize;
    
    constructor(pageNumber = 1, pageSize = 2) { // 241. removed initial values from above, and set a ctor. since we were getting type error trying to pass params in activitydashboard.
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}

// 239. adding client side pagination. 1st add interface with props. to make it easy, will also want access to the data we get back inside the header.