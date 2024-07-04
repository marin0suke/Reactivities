import { User } from "./user";

export interface IProfile {
    username: string;
    displayName : string;
    image?: string;
    bio?: string;
    photos?: Photo[] // 195. 
}

// 173. update - unsafe declaration merging between classes and interfaces. we had to differentiate the names. 

export class Profile implements IProfile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }

    username: string;
    displayName : string;
    image?: string;
    bio?: string;
    photos?: Photo[] // 195. also has to be added here bc linting issues. 
}

// 170. adding the attendees component (client side attendance) adding interface for user profile. 
// 173. creating class so in ctor - we can auto set the props based on currently logged in user. 


export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}

// 195. adding profile data. added Photo interface.