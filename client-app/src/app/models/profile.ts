import { User } from "./user";

export interface IProfile {
    username: string;
    displayName : string;
    image?: string;
    bio?: string;
    followersCount: number; // 229.
    followingCount: number; // 229.
    following: boolean; // 229.
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
    followersCount = 0; // 229. linting update - to keep ts happy we need to have the new props within the class with initial values.
    followingCount = 0; // 229.
    following = false; // 229.
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