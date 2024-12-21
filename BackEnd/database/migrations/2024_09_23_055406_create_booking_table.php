<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('showtime_id');
            $table->unsignedBigInteger('pay_method_id');
            $table->double('amount');
            $table->string('barcode')->nullable();
            $table->string('qrcode')->nullable();
            $table->string('booking_code')->nullable();
            $table->enum('status', ['Thanh toán thành công', 'Thanh toán thất bại', 'Đã hủy', 'Đang xử lý', 'Đã in vé'])->default('Đang xử lý');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('pay_method_id')->references('id')->on('pay_method')->onDelete('cascade');
            $table->foreign('showtime_id')->references('id')->on('showtimes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking');
    }
};
