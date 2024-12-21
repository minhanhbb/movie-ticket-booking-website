<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Models\Cinema;
use App\Models\Showtime;
use App\Policies\GeneralPolicy;
use App\Policies\ShowtimePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;


class AuthServiceProvider extends ServiceProvider
{




    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Showtime::class => GeneralPolicy::class,
        // Cinema::class => GeneralPolicy::class,
    ];

    /**
     * Đăng ký bất kỳ dịch vụ xác thực / ủy quyền.
     */
    // public function boot(): void
    // {
    //     $this->registerPolicies();

    //     // Đặt policy mặc định cho tất cả các model
    //     Gate::policy('*', GeneralPolicy::class);
    // }
}
