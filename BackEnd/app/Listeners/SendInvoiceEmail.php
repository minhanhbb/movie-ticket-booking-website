<?php

namespace App\Listeners;

use App\Events\InvoiceCreated;
use App\Events\InvoiceSendMail;
use App\Mail\InvoiceMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendInvoiceEmail
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(InvoiceSendMail $event)
    {
        // Ghi log thông tin khi listener được kích hoạt
        Log::info('SendInvoiceEmail Listener triggered', [
            'invoiceData' => $event->booking
        ]);

        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        $user = Auth::user();

        if ($user && $user->email) {
            // Gửi email nếu người dùng đã đăng nhập và có địa chỉ email
            Mail::to($user->email)->queue(new InvoiceMail($event->booking));
        } else {
            // Ghi log nếu không có người dùng hoặc email không hợp lệ
            Log::warning('Unable to send invoice email: User not authenticated or email is missing', [
                'invoiceData' => $event->booking
            ]);
        }
    }

}
