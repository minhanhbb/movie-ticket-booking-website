// Define the NewsCategory interface
export interface NewsCategory {
  id: number;                     // Unique identifier for the news category
  news_category_name: string;     // Name of the news category
  descriptions: string | null;    // Description of the news category, can be null
  status: 'Show' | 'Hidden';      // Status indicating if the category is shown or hidden
  created_at: string;             // Timestamp of when the category was created
  updated_at: string;             // Timestamp of when the category was last updated
}
