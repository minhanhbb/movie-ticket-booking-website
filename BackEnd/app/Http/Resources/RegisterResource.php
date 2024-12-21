<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegisterResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "user_id"       => $this->user_id,  
            "user_name"     => $this->user_name,  
            "sex"           => $this->sex,  
            "email"         => $this->email,  
            "avatar"        => $this->avatar,  
            "phone"         => $this->phone,  
            "address"       => $this->address,  
            "fullname"      => $this->fullname,  
            "coin"          => $this->coin,  
            "role_id"       => $this->roles->first()->role_type,  
            "status"        => $this->status,  
            "created_at"    => $this->created_at,  
            "updated_at"    => $this->updated_at,  
        ];
    }
}
