import React, { useState, useEffect, useRef } from 'react';
import './Header1.css';
import { FaBell, FaCog, FaUserCircle, FaCamera } from 'react-icons/fa';
import { Modal } from 'antd';
import { User } from '../../../interface/User';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';  // Import thư viện quét mã vạch
import instance from '../../../server';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [barcodeData, setBarcodeData] = useState<string | null>(null);  // Lưu dữ liệu quét được
    const videoRef = useRef<HTMLVideoElement | null>(null);  // ref để điều khiển video
    const barcodeReader = useRef(new BrowserMultiFormatReader()); // Khởi tạo đối tượng quét mã vạch
    const navigate = useNavigate();
    const location = useLocation();
    const [lastScannedCode, setLastScannedCode] = useState<string | null>(null); // Lưu mã đã quét gần nhất
    const [isProcessing, setIsProcessing] = useState(false); // Trạng thái ngăn gọi API liên tục
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

    useEffect(() => {
        const storedUser = localStorage.getItem('user_profile');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_profile");
        setIsLoggedIn(false);
        navigate('/');
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const toggleCamera = async () => {
        if (isCameraOn) {
            // Tắt camera
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                setVideoStream(null);
            }
            setIsCameraOn(false);
            setIsModalVisible(false);
        } else {
            // Bật camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoStream(stream);
                setIsCameraOn(true);
                setIsModalVisible(true);
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        }
    };

    const handleBarcodeScan = (result: string) => {
        if (isProcessing) return; // Ngăn gọi API nếu đang xử lý
        if (lastScannedCode === result) return; // Nếu mã giống mã trước đó, không gọi API

        setLastScannedCode(result); // Lưu mã vạch đã quét
        setIsProcessing(true); // Bắt đầu xử lý API

        const isUrl = result.startsWith("http://") || result.startsWith("https://");
        if (isUrl) {
            navigate(result.replace(/^http:\/\/localhost:5173/, ""));
            setIsProcessing(false); // Xử lý xong
        } else if (/^\d+$/.test(result)) {
            if (userRole === "manager") {
                instance.post('/manager/checkInSeat', { code: result })
                .then(response => {
                    // console.log("Full Response:", response);
                    if (response.status === 200) {
                        const { status, message, data } = response.data;
                        if (status) {
                            Modal.success({
                                title: 'Check-in Thành Công',
                                content: (
                                    <div>
                                        <p><strong>Thông báo:</strong> {message}</p>
                                        <p><strong>Tên ghế:</strong> {data.seat_name}</p>
                                    </div>
                                ),
                            });
                            toggleCamera();
                        } else {
                            Modal.error({
                                title: 'Check-in Thất Bại',
                                content: message,
                            });
                        }
                    } else {
                        throw new Error("Invalid response status");
                    }
                })
                .catch(error => {
                    console.error("Request Error:", error);
                    const errorMessage =
                        error.response?.data?.message || 'Có lỗi xảy ra khi check-in!';
                    Modal.error({
                        title: 'Lỗi',
                        content: errorMessage,
                    });
                })
                .finally(() => {
                    setIsProcessing(false);
                });
              } else if (userRole === "staff") {
                instance.post('/staff/checkInSeat', { code: result })
                .then(response => {
                    console.log("Full Response:", response);
                    if (response.status === 200) {
                        const { status, message, data } = response.data;
                        if (status) {
                            Modal.success({
                                title: 'Check-in Thành Công',
                                content: (
                                    <div>
                                        <p><strong>Thông báo:</strong> {message}</p>
                                        <p><strong>Tên ghế:</strong> {data.seat_name}</p>
                                    </div>
                                ),
                            });
                            toggleCamera();
                        } else {
                            Modal.error({
                                title: 'Check-in Thất Bại',
                                content: message,
                            });
                            toggleCamera(); 
                        }
                    } else {
                        throw new Error("Invalid response status");
                    }
                })
                .catch(error => {
                    console.error("Request Error:", error);
                    const errorMessage =
                        error.response?.data?.message || 'Có lỗi xảy ra khi check-in!';
                    Modal.error({
                        title: 'Lỗi',
                        content: errorMessage,
                    });
                })
                .finally(() => {
                    setIsProcessing(false);
                });
              }else {
                instance.post('/checkInSeat', { code: result })
                .then(response => {
                    console.log("Full Response:", response);
                    if (response.status === 200) {
                        const { status, message, data } = response.data;
                        if (status) {
                            Modal.success({
                                title: 'Check-in Thành Công',
                                content: (
                                    <div>
                                        <p><strong>Thông báo:</strong> {message}</p>
                                        <p><strong>Tên ghế:</strong> {data.seat_name}</p>
                                    </div>
                                ),
                            });
                            toggleCamera();
                        } else {
                            Modal.error({
                                title: 'Check-in Thất Bại',
                                content: message,
                            });
                            toggleCamera();
                        }
                    } else {
                        throw new Error("Invalid response status");
                    }
                })
                .catch(error => {
                    console.error("Request Error:", error);
                    const errorMessage =
                        error.response?.data?.message || 'Có lỗi xảy ra khi check-in!';
                    Modal.error({
                        title: 'Lỗi',
                        content: errorMessage,
                    });
                })
                .finally(() => {
                    setIsProcessing(false);
                });
              }
        } else {
            Modal.warning({
                title: 'Dữ liệu không hợp lệ',
                content: 'Vui lòng quét lại mã hợp lệ.',
            });
            setIsProcessing(false); // Hoàn tất xử lý
        }
    };


    useEffect(() => {
        if (isCameraOn && videoStream) {
            const videoElement = videoRef.current;
            if (videoElement) {
                barcodeReader.current.decodeFromVideoDevice('', videoElement, (result, error) => {
                    if (result) {
                        handleBarcodeScan(result.getText());
                    }
                    if (error && error.name !== 'NotFoundException') {
                        // console.error("Barcode scanning error:", error);
                    }
                });
            }
        } else {
            barcodeReader.current.reset(); // Dừng quét khi camera tắt
        }
    }, []);




    const getPageName = () => {
        const path = location.pathname;
        const pageName = path.split('/').pop();
        switch (pageName) {
            case 'dashboard': return 'Bảng Điều Khiển Admin';
            case 'user': return 'Quản Lí Người Dùng';
            // Các trường hợp khác...
            default: return 'Welcome';
        }
    };




    useEffect(() => {
        if (videoRef.current && videoStream) {
            videoRef.current.srcObject = videoStream;
        }
    }, [videoStream]);

    useEffect(() => {
        if (barcodeData) navigate(barcodeData.replace(/^http:\/\/localhost:5173/, ""));
    }, [barcodeData, navigate]);

    useEffect(() => {
        return () => {
            barcodeReader.current.reset();
        };
    }, []);


    useEffect(() => {
        // Bắt đầu quét mã vạch khi camera bật
        if (isCameraOn && videoStream) {
            const videoElement = videoRef.current;
            if (videoElement) {
                barcodeReader.current.decodeFromVideoDevice('', videoElement, (result, error) => {
                    if (result) {
                        handleBarcodeScan(result.getText());  // Quét thành công
                    }
                    if (error) {
                        // console.error(error);
                    }
                });
            }
        } else {
            barcodeReader.current.reset(); // Dừng quét khi camera tắt
        }
    }, [isCameraOn, videoStream]);
    // console.log("Video Stream:", videoStream);

    return (
        <div className="header1">
            <h1>{getPageName()}</h1>
            <div className="header-actions">
                <div className="icons-container">
                    <div className="icon" onClick={toggleCamera}>
                        <FaCamera style={{ color: isCameraOn ? 'green' : '#004d40' }} />
                    </div>
                    <div className="icon">
                        <FaBell />
                        <span className="notification-badge">3</span>
                    </div>
                    <div className="icon">
                        <Link to={'/admin/website-settings'} style={{ color: "#004d40" }} >
                            <FaCog />
                        </Link>
                    </div>
                    <div className="icon profile-pic" onClick={toggleProfile}>
                        <FaUserCircle />
                        {isProfileOpen && user && (
                            <div className="profile-dropdown">
                                <div className="profile-info">
                                    <img
                                        src={user.avatar || "https://via.placeholder.com/80"}
                                        alt="User Avatar"
                                        className="profile-avatar"
                                    />
                                    <div className="profile-details">
                                        <p className="profile-name">{user.fullname || user.user_name}</p>
                                        <p className="profile-email">{user.email}</p>
                                    </div>
                                </div>
                                <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                title="Camera"
                visible={isModalVisible}
                onCancel={() => {
                    toggleCamera();
                }}
                footer={null}
                centered
                width="50%"
            >
                {isCameraOn && videoStream && (
                    <video
                        ref={videoRef}  // Sử dụng ref để gán video stream
                        autoPlay
                        playsInline
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            objectFit: 'cover',  // Đảm bảo video không bị méo
                        }}
                    />
                )}
                {barcodeData && (
                    <div className="barcode-result">
                        <p>Quét Mã Thành Công: <a href={barcodeData}>{barcodeData}</a></p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Header;