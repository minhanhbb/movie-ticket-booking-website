<?php
namespace App\Traits;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

trait AuthorizesInService
{
    use AuthorizesRequests;

    public function authorizeInService($ability, $arguments = [])
    {
        return $this->authorize($ability, $arguments);
    }
}
