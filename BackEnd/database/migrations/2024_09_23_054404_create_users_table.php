<?php

use App\Models\Rank;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use function GuzzleHttp\default_ca_bundle;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('id');
            $table->string('user_name')->nullable();
            $table->enum('sex', ['male', 'female', 'undisclosed'])->default('undisclosed');
            $table->string('password');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->string('cover')->nullable();
            $table->string('description')->nullable();
            $table->string('address')->nullable();
            $table->string('fullname')->nullable();
            $table->decimal('points',15,0)->default(0);
            $table->string('google_id')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->unsignedBigInteger('cinema_id')->nullable();
            $table->boolean('status')->default(true);
            $table->foreignIdFor(Rank::class)->default(1)->constrained();
            $table->foreign('cinema_id')->references('id')->on('cinema')->onDelete('cascade');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
