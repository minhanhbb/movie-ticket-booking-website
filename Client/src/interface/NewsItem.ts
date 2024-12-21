import { Movie } from "./Movie";
import { NewsCategory } from "./NewsCategory";
import { User } from "./User";

// News.interface.ts
export interface NewsItem {
    id: number;
    slug:string;
    title: string;
    news_category: NewsCategory
    news_category_id: number;
    user:User;
    views: number;
    thumnail: string;
    banner:string;
    content: string ;
    status: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    movie:Movie
  }
  