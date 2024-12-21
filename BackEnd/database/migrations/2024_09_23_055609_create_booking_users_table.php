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
        Schema::create('booking_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id'); // Đảm bảo cột khóa ngoại là unsignedBigInteger
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreign('booking_id')->references('id')->on('booking')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_users');
    }
};
