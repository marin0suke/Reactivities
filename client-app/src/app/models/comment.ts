export interface ChatComment { // calling it this so it doesn't conflict w semantic ui component called comment.
    id: number;
    createdAt: Date; // 219. changed this from string to Date to resolve UTC dates. 
    body: string;
    username: string;
    displayName: string;
    image: string;
}

// 215. adding signalr to the client.