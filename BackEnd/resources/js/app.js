import './bootstrap';
window.Echo.channel('seats')
    .listen('SeatReset', (e) => {
        console.log('Seats reset:', e.seats);  // Sử dụng 'seats' thay vì 'seat'

        // Kiểm tra xem e.seats có phải là một mảng không
        if (Array.isArray(e.seats)) {
            alert("Seats have been reset: " + e.seats.join(", "));
        } else {
            console.error('Seats data is not an array:', e.seats);
        }
    });
