<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('room', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('cinema_id');
            $table->unsignedBigInteger('seat_map_id');
            $table->string('room_name');
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->foreign('cinema_id')->references('id')->on('cinema')->onDelete('cascade');
            $table->foreign('seat_map_id')->references('id')->on('seat_map')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room');
    }
};
