export interface Director {
    id: number;  // Primary Key, kiểu bigint, UNSIGNED
    director_name: string;  // Tên đạo diễn, varchar(255)
    descripcion: string;  // Mô tả, varchar(255), có thể null
    photo: string | null;  // Ảnh, varchar(255), có thể null
    country: string ;  // Quốc gia, varchar(255), có thể null
    link_wiki: string;  // Link Wikipedia, varchar(255), có thể null
  }
  