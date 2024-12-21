<?php

namespace App\Http\Controllers\Api\Google;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class GoongMapController extends Controller
{
    public function autocomplete(Request $request)
    {
        $query = $request->input('query');
        $sessionToken = $request->input('sessiontoken');

        if (empty($query)) {
            return response()->json(['error' => 'Query parameter is required'], 400);
        }

        $apiKey = '0BwN8O4Xo9f5nb6XjkfYskkKiXyY2UBUKBwJNrui'; // Replace with your Goong API Key

        try {
            $client = new Client();
            $response = $client->get("https://rsapi.goong.io/Place/AutoComplete", [
                'query' => [
                    'api_key' => $apiKey,
                    'input' => $query,
                    'sessiontoken' => $sessionToken,
                ],
            ]);

            $data = json_decode($response->getBody(), true);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to fetch data from Goong API', 'details' => $e->getMessage()], 500);
        }
    }
}
