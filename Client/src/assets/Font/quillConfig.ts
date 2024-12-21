
export const stripHtml = (html: string): string => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || '';
  };
  
  export const extractLinks = (html: string): { images: string[]; youtubeLinks: string[] } => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
  
    // Trích xuất tất cả các liên kết hình ảnh
    const images: string[] = Array.from(tempElement.querySelectorAll('img'))
      .map(img => img.src)
      .filter(src => src); // Lọc các giá trị src hợp lệ
  
    // Trích xuất tất cả các liên kết YouTube
    const youtubeLinks: string[] = Array.from(tempElement.querySelectorAll('a'))
      .map(a => a.href)
      .filter(
        href =>
          href.includes('youtube.com/watch') || href.includes('youtu.be/')
      ); // Lọc các link YouTube hợp lệ
  
    return { images, youtubeLinks };
  };
  