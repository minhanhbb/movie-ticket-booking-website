<?php

namespace App\Traits;

use Exception;
use GuzzleHttp\Client;

trait UploadImageTrait
{
    protected $client;
    protected $apiKey;

    /**
     * Initialize the Guzzle client and API key for ImgBB
     */
    protected function initializeClient()
    {
        if (!$this->client) {
            $this->client = new Client([
                'timeout' => 30, // Đặt thời gian chờ để ngăn chặn treo không xác định
                'verify' => false, // Tắt xác minh SSL
            ]);
        }

        if (!$this->apiKey) {
            $this->apiKey = env('IMGBB_API_KEY');

            if (!$this->apiKey) {
                throw new Exception('IMGBB API key is missing in environment variables.');
            }
        }
    }

    /**
     * Upload an image to ImgBB
     *
     * @param string $filePath The absolute path of the image file to upload
     * @return string The URL of the uploaded image
     * @throws Exception If the upload fails
     */
    public function uploadImage($filePath)
    {
        $this->initializeClient(); // Initialize Guzzle client and API key

        if (!file_exists($filePath)) {
            throw new Exception("The file at path {$filePath} does not exist.");
        }

        $imageName = basename($filePath); // Extract file name from path

        try {
            $response = $this->client->request('POST', 'https://api.imgbb.com/1/upload', [
                'query' => [
                    'key' => $this->apiKey, // Provide ImgBB API key
                ],
                'multipart' => [
                    [
                        'name'     => 'image',
                        'contents' => fopen($filePath, 'r'), // Open file for reading
                        'filename' => $imageName,
                    ],
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['success']) && $data['success']) {
                return $data['data']['display_url']; // Return the URL of the uploaded image
            } else {
                $errorMsg = $data['error']['message'] ?? 'Unknown error occurred during upload.';
                throw new Exception("Image upload failed: {$errorMsg}");
            }
        } catch (Exception $e) {
            throw new Exception("An error occurred while uploading the image: " . $e->getMessage());
        }
    }
}
