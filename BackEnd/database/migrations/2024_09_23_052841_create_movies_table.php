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
        Schema::create('movies', function (Blueprint $table) {
            $table->id('id');
            $table->string('movie_name');
            $table->string('slug')->unique();
            $table->string('poster')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('trailer')->nullable();
            $table->string('duration')->nullable();
            $table->string('age_limit')->nullable();
            $table->string('country')->nullable();
            $table->text('description')->nullable();
            $table->date('release_date')->nullable();
            $table->float('rating')->nullable();
            $table->integer('views')->default(0)->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
