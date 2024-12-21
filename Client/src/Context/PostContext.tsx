import React, { createContext, useReducer, useContext, ReactNode, useState, useEffect } from 'react';
import instance from '../server'; // Adjust the path as needed
import { NewsItem } from '../interface/NewsItem'; // Use your NewsItem interface

interface PostState {
  posts: NewsItem[];
}

interface PostAction {
  type: string;
  payload?: any;
}

const initialState: PostState = {
  posts: [],
};

const PostContext = createContext<{
  state: PostState;
  dispatch: React.Dispatch<PostAction>;
  addOrUpdatePost: (data: any, id?: string) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
} | undefined>(undefined);

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'DELETE_POST':
      return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) };
    case 'ADD_POST':
      return { ...state, posts: [...state.posts, action.payload] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? { ...post, ...action.payload } : post
        ),
      };
      case 'UPDATE_POST_STATUS':
        return {
          ...state,
          posts: state.posts.map((posts) =>
            posts.id === action.payload.id
              ? { ...posts, status: action.payload.status }
              : posts
          ),
        };
    default:
      return state;
  }
};

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);
  const [userRole, setUserRole] = useState<string>("");

  // Fetch user role from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
 
    if (roles.length > 0) {
      setUserRole(roles[0].name);
    } else {
      setUserRole("unknown"); // Gán giá trị mặc định khi không có vai trò
    }
  }, []);
  const fetchPosts = async () => {
    try {
      const response = await instance.get('/manager/news'); // Ensure this endpoint is correct
      dispatch({ type: 'SET_POSTS', payload: response.data.data });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };


  const addOrUpdatePost = async (
    data: { title: string; news_category_id: number; content: string; status: string; thumnail?: File; banner?: File },
    id?: string
  ) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('news_category_id', data.news_category_id.toString());
    formData.append('content', data.content);
    formData.append('status', data.status);

    // Lấy user_id từ localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
      formData.append('user_id', userId); // Thêm user_id vào formData
    } else {
      console.error('User ID not found in localStorage.'); // Xử lý khi không tìm thấy user_id
    }

    if (id) {
      formData.append('_method', 'put');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

    if (data.thumnail) {
      if (!allowedTypes.includes(data.thumnail.type)) {
        console.error('Invalid thumbnail file type');
        return;
      }
      formData.append('thumnail', data.thumnail);
    }

    if (data.banner) {
      if (!allowedTypes.includes(data.banner.type)) {
        console.error('Invalid banner file type');
        return;
      }
      formData.append('banner', data.banner);
    }

    try {
      const response = id
        ? await instance.post(`/manager/news/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await instance.post('/manager/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (id) {
        dispatch({ type: 'UPDATE_POST', payload: response.data.data });
      } else {
        dispatch({ type: 'ADD_POST', payload: response.data.data });
      }
      await fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      await instance.delete(`/manager/news/${id}`);
      dispatch({ type: 'DELETE_POST', payload: id });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  

  // Gọi fetchPosts khi provider mount
  React.useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ state, dispatch, addOrUpdatePost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostsContext must be used within a PostProvider');
  }
  return context;
};
