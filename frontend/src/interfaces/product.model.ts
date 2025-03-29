export interface Comment {
  _id: string;
  user: string | { _id: string; username: string };
  text: string;
  date: Date;
  edited: boolean;
  likes?: number;
  likers?: string[];
  dislikes?: number;
  dislikers?: string[];
  loves?: number;
  lovers?: string[];
  parentId?: string | null;
  showReplyForm?: boolean;
  replyText?: string;
  isEditing?: boolean;
  editText?: string;
  rating?: number | null;
  userReaction?: 'like' | 'dislike' | 'love' | null;
  replies?: Comment[];
}

export interface ProductComment {
  _id: string;
  user: string | { _id: string; username: string };
  text: string;
  date: Date;
  edited: boolean;
  likes?: number;
  likers?: string[];
  dislikes?: number;
  dislikers?: string[];
  loves?: number;
  lovers?: string[];
  parentId?: string | null;
  rating?: number | null;
  showReplyForm?: boolean;
  replyText?: string;
  isEditing?: boolean;
  editText?: string;
  userReaction?: 'like' | 'dislike' | 'love' | null;
  replies?: ProductComment[];
}

export interface Product {
  // color: any;
  descriptionDetailed: any;
  _id: string;
  name: string;
  image: string[]; // Array of image paths
  colors: string[]; // Array of colors
  selectedColor?: string;
  price: number;
  description: string;
  category: string;
  season?: string;
  gender: string[]; // Array of gender options
  likes: number;
  likedBy: string[];
  dislikes: number;
  dislikedBy: string[];
  sizes: string[];
  stock: number;  
  quantity: number;
  amount:number;
  comments: Comment[];
  rating?: number | null;
  timestamps?: { createdAt: Date; updatedAt: Date }; // Optional, from backend timestamps
  // Frontend-specific fields
  showMenu?: boolean;
  visible?: boolean;
  isFavorite?: boolean;
  trend?: number;
  trendDirection?: 'up' | 'down';
  totalUnitsSold?: number;
  dateAdded?: Date;
  createdAt: Date;
  brand:String;
}



export interface CommentSubmission {
  user: string;
  text: string;
  rating?: number | null;
}

export interface CommentPayload {
  text: string;
  parentId?: string | null;
  rating?: number;
}

export interface CommentEvent {
  productId: string;
  comment: Comment;
}