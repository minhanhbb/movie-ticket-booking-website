import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { notification } from 'antd';
import instance from '../server';
import { Movie } from '../interface/Movie';

  
  interface UserProfile {
    id: string ;  
    user_name: string;
    email: string;
    fullname: string;
    phone: string;
    avatar: string;
    favorite_movies: Movie[];  // Field for favorite movies
    favorites:Favorite[]
    rank_name: string;
    total_amount: number;
    rank: Rank;
    
point_histories: PointHistory[];
    points: number; 
  }
  
  interface Favorite {
    created_at: string; // Thêm thuộc tính created_at
    id:string;
    movie_id:string;// Giả sử có thêm một thuộc tính movie_id để xác định phim yêu thích
  }
  
  interface Rank {
    id: number;
    name: string;
    total_order_amount: number;
    percent_discount: number;
    created_at: string;
    updated_at: string;
  }
  
  interface PointHistory {
    id: number;
    user_id: number;
    points_used: number;
    points_earned: number;
    order_amount: number;
    used_points:number;
    created_at: string;
    updated_at: string;
  }
  

interface UserContextType {
  userProfile: UserProfile | null;
  avatar: string;
  locations: any[];
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>;
  fetchUserProfile: () => void;
  handleUpdateProfile: () => Promise<void>;
  handleAvatarUpload: (file: File) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [avatar, setAvatar] = useState<string>("https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png");
  const [locations, setLocations] = useState<any[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          if (response.data.success) {
            const userProfileData = response.data.user;
            setUserProfile(userProfileData);
            setAvatar(userProfileData.avatar || "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();

      const fetchLocations = async () => {
        try {
          const response = await instance.get("/location");
          if (response.data.status) {
            setLocations(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };

      fetchLocations();
    }
  }, []);

  const handleUpdateProfile = async () => {
    if (!userProfile) return;

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("user_name", userProfile.user_name);
    formData.append("phone", userProfile.phone);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await instance.post(`/user/${userProfile.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        notification.success({ message: "Cập nhật thông tin thành công" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notification.error({ message: "Cập nhật thông tin thất bại" });
    }
  };

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      setAvatar(event.target.result);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        avatar,
        locations,
        setUserProfile,
        setAvatar,
        setAvatarFile,
        fetchUserProfile: () => {
          if (userProfile) {
            // Fetch user profile logic here (if needed)
          }
        },
        handleUpdateProfile,
        handleAvatarUpload,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
