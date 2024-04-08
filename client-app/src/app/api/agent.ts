import axios, { AxiosResponse } from "axios"; // 61. setting up axios
import { Activity } from "../models/activity";

const sleep = (delay: number) => { // 63. adding loading indicators. 
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api'

axios.interceptors.response.use(async response => { // 63. adding loading indicators. 
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T> (response: AxiosResponse<T> /* AxiosResponse can take a type parameter to match type property in data => over there */) => response.data; // 61. makes life a bit easier - this returns reponse.data. 

const requests = { // 61. obj to store requests from axios. 62. type safety since we will receive diff data types.
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),   
    post: <T> (url: string, body: NonNullable<unknown>) => axios.post<T>(url, body).then(responseBody),  // 61. the .get or .post method is a promise that we will get data at a future point. the .then() method is used to do something when the data is returned.
    put: <T> (url: string, body: NonNullable<unknown> /* 61.changed from {} bc error. allows for any */) => axios.put<T>(url, body).then(responseBody), 
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody), 
}

const Activities = { // 61. set up obj to store our requests for our activities
    list: () => requests.get<Activity[]>('/activities'), // 61. first a request to list the activity. pass in the URL of the activity ('/') will be the baseURL + whatever we put inside the request. in this case, just activities.
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>('/activities', activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`) //. 64. posting data to the server
}

const agent = {
    Activities
}

export default agent;

// response.data stored in responseBody, which is passed into each request stored in requests, which is passed into the list
// which is retrievable through agent, which is then exported. all funnelled cleanly and easy to read.
//ALSO allows us to add type safety to this whole file. 

// 61. right now Activities is set to return promise of type any - will come bck and aplpy type safety