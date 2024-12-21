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
        Schema::create('seat_layouts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('rows');
            $table->integer('columns');
            $table->integer('row_regular_seat');
            $table->integer('row_vip_seat');
            $table->integer('row_couple_seat');
            $table->enum('status', ['Bản nháp', 'Xuất bản'])->default('Bản nháp');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seat_layouts');
    }
};
