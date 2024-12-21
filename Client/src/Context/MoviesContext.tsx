import React, { createContext, useReducer, useContext, ReactNode, useEffect, useCallback, useState } from "react";
import { notification } from "antd"; // Import Ant Design's notification
import instance from "../server"; // Đảm bảo đường dẫn đúng
import { Movie } from "../interface/Movie"; // Đảm bảo đường dẫn đúng

interface MovieState {
  movies: Movie[];
}

interface MovieAction {
  type: string;
  payload?: any;
}

const initialState: MovieState = {
  movies: [],
};

const MovieContext = createContext<
  | {
      state: MovieState;
      dispatch: React.Dispatch<MovieAction>;
      addOrUpdateMovie: (data: any, id?: string) => Promise<void>;
      fetchMovies: () => Promise<void>;
    }
  | undefined
>(undefined);

const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case "SET_MOVIES":
      return { ...state, movies: action.payload };
    case "DELETE_MOVIE":
      return {
        ...state,
        movies: state.movies.filter((movie) => movie.id !== action.payload),
      };
    case "ADD_MOVIE":
      return { ...state, movies: [...state.movies, action.payload] };
    case "UPDATE_MOVIE":
      return {
        ...state,
        movies: state.movies.map((movie) =>
          movie.id === action.payload.id
            ? { ...movie, ...action.payload }
            : movie
        ),
      };
      case 'UPDATE_MOVIE_STATUS':
    return {
        ...state,
        movies: state.movies.map(movie =>
            movie.id === action.payload.id
                ? { ...movie, status: action.payload.status }
                : movie
        ),
    };

    default:
      return state;
  }
  
};

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

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
  const fetchMovies = useCallback(async () => {
    try {
      let response;
      if (userRole === "manager") {
        response = await instance.get('/manager/movies');
      } else {
        response = await instance.get('/movies');
      }
      if (response.data && response.data.data) {
        dispatch({ type: "SET_MOVIES", payload: response.data.data.original });
        // console.log("du lieu phim:", response.data.data.original );
        
      } else {
        console.error("Định dạng phản hồi API không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phim:", error);
    }
  }, []);

  // Hàm thêm hoặc cập nhật phim
  const addOrUpdateMovie = async (data: any, id?: string) => {
    const formData = new FormData();
    formData.append("movie_name", data.movie_name);

    // Thêm các thông tin khác vào formData
    (data.movie_category_id as number[]).forEach((movie_category_id: number) => {
      formData.append("movie_category_id[]", movie_category_id.toString());
    });

    (data.actor_id as number[]).forEach((actorId: number) => {
      formData.append("actor_id[]", actorId.toString());
    });

    (data.director_id as number[]).forEach((director_id: number) => {
      formData.append("director_id[]", director_id.toString());
    });

    formData.append("cinema_id", data.cinema_id);
    formData.append("release_date", data.release_date);
    formData.append("age_limit", data.age_limit);
    formData.append("description", data.description);
    formData.append("duration", data.duration);
    formData.append("trailer", data.trailer);
    formData.append("country", data.country);

    if (id) {
      formData.append("_method", "put");
    }

    if (data.posterFile) {
      formData.append("poster", data.posterFile);
    }
    if (data.thumbnailFile) {
      formData.append("thumbnail", data.thumbnailFile);
    }

    try {
      const response = id
        ? await instance.post(`/manager/movies/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await instance.post("/manager/movies", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (id) {
        dispatch({ type: "UPDATE_MOVIE", payload: response.data.data });
        notification.success({
          message: "Cập nhật thành công",
          description: "Phim đã được cập nhật thành công.",
        });
      } else {
        dispatch({ type: "ADD_MOVIE", payload: response.data.data });
        notification.success({
          message: "Thêm thành công",
          description: "Phim đã được thêm thành công.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu cầu của bạn.",
      });
    }
  };

  useEffect(() => {
    fetchMovies(); // Gọi fetchMovies khi MovieProvider được mount
  }, [fetchMovies]);

  return (
    <MovieContext.Provider value={{ state, dispatch, addOrUpdateMovie, fetchMovies }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext phải được sử dụng trong MovieProvider");
  }
  return context;
};
