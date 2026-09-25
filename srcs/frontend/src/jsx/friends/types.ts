export interface UserPreview {
  id: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  profilePhotoId: string;
}

export interface Friend {
  id: string;
  friend: UserPreview;
  createdAt: string;
}

export interface OutgoingRequest {
  id: string;
  receiver: UserPreview;
  createdAt: string;
}

export interface IncomingRequests {
  id: string;
  sender: UserPreview;
  createdAt: string;
}

export interface BlockedUsers {
  id: string;
  blocked: UserPreview;
  createdAt: string;
}

export interface Relationships {
  friends: Friend[];
  incomingRequests: IncomingRequests[];
  outgoingRequests: OutgoingRequest[];
  blockedUsers: BlockedUsers[];
}
