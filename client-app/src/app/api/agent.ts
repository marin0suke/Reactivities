import axios, { AxiosError, AxiosResponse } from "axios"; // 61. setting up axios
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";
import { Photo, Profile } from "../models/profile";
import { PaginatedResult } from "../models/pagination";

const sleep = (delay: number) => { // 63. adding loading indicators. 
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = <T> (response: AxiosResponse<T>) => response.data; // 61. makes life a bit easier - this returns response.data.

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

// 151. sending the token up with the request. added request interceptor from axios.

axios.interceptors.response.use(async response => { // 239. adding client side pagination. 63. adding loading indicators. 
    await sleep(1000);
    const pagination = response.headers["pagination"]; // 239. need this to be in where we get the response. response is going to contain a pagination header. so we go grab the pagination prop here.
    if (pagination) { // check we get it successfully.
        response.data = new PaginatedResult(response.data, JSON.parse(pagination)); // grabs data from response and parses from JSON to obj with props in pagination.ts. 
        return response as AxiosResponse<PaginatedResult<unknown>> //type safety with Axios response.bc when we use this response, defining type will give us intellisense. 
    }
    return response; 
}, (error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error("unauthorised")
            break;
        case 403:
            toast.error("forbidden")
            break;
        case 404:
            router.navigate("/not-found");
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate("/server-error");
            break;
    }
    return Promise.reject(error); // 109. will pass error back to component that caused the error.
} )

 // 108 . above interceptors response used to be a try catch block, but changed for error handling, to utilise the 2nd optional param to deal with rejected requests.

const requests = { // 61. obj to store requests from axios. 62. type safety since we will receive diff data types.
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),   
    post: <T> (url: string, body: NonNullable<unknown>) => axios.post<T>(url, body).then(responseBody),  // 61. the .get or .post method is a promise that we will get data at a future point. the .then() method is used to do something when the data is returned.
    put: <T> (url: string, body: NonNullable<unknown> /* 61.changed from {} bc error. allows for any */) => axios.put<T>(url, body).then(responseBody), 
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody), 
}

const Activities = { // 61. set up obj to store our requests for our activities
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params}) // 240. added type params, changed request to axios, added {params} and added .then since axios and not request.
        .then(responseBody), // 239. updating to paginatedresult of type activity[]. 61. first a request to list the activity. pass in the URL of the activity ('/') will be the baseURL + whatever we put inside the request. in this case, just activities.
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity), // 174. updated to ActivityFormValues.
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity), // 174. updated to ActivityFormValues.
    delete: (id: string) => requests.del<void>(`/activities/${id}`), //. 64. posting data to the server
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}) // 173. adding the store methods to attend.
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}
//145. created new const Account that will get the current user, login and register

const Profiles = { // 207. edit handler challenge.  
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => { // 203. method to upload photo - send to api.
        const formData = new FormData();
        formData.append('File', file); // 'File' must match - the name of the property in the API. 
        return axios.post<Photo>('photos', formData, { // added <Photo> to post. now in profileStore in upload method, photo will be type Photo. 
            headers: {'Content-Type': 'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}), // 204. method to set main photo.
    deletePhoto: (id: string) => requests.del(`/photos/${id}`), // 204. method to delete photo. 
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile), // 207. challenge. new request to edit profile. partial bc only displayname and bio.
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}), // 230. adding method to follow and unfollow. 
    listFollowings: (username: string, predicate: string) => 
        requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`) // 232. getting a list of followings.
}

// 195. create obj that we can use to go and get user profile. 

const agent = {
    Activities,
    Account,
    Profiles // 195. added so profileStore can get it via agent.
}

//

export default agent;

// response.data stored in responseBody, which is passed into each request stored in requests, which is passed into the list
// which is retrievable through agent, which is then exported. all funnelled cleanly and easy to read.
//ALSO allows us to add type safety to this whole file. 

// 61. right now Activities is set to return promise of type any - will come bck and aplpy type safety

//110. handling 404 errors - added router.navigate for 404 error instead of a toast. 

//111. handling 400 errors - changed from 400 toast to conditional etc. also the ! approach to bypass type error in error.response wasn't working the way we wanted it to
// so changed it to as AxiosResponse;

// 112. added navigate for 500 error - replaced the toast with store access.