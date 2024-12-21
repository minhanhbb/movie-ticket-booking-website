<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreShowtimeRequest;
use App\Http\Requests\Update\UpdateShowtimeRequest;
use App\Models\Cinema;
use App\Models\Movie;
use App\Models\Room;
use App\Models\Showtime;
use App\Services\Cinema\ShowtimeService;
use Carbon\Carbon;
// use Dotenv\Validator;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;


class ShowtimeController extends Controller
{
    protected $showtimeService;

    public function __construct(ShowtimeService $showtimeService)
    {
        $this->showtimeService = $showtimeService;
    }

    public function index()
    {
        $showtimes = $this->showtimeService->index();
        return $this->success($showtimes);
    }

    public function showtimeByMovieName($movie_name)
    {
        try {
            $showtimes = $this->showtimeService->getShowtimesByMovieName($movie_name);

            if ($showtimes->isEmpty()) {
                return $this->notFound();
            }
            return $this->success($showtimes);
        } catch (ModelNotFoundException $e) {
            return $e->getMessage();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    public function create()
    {
        $movies = Movie::all();  // Fetch all movies
        $rooms = Room::all();    // Fetch all rooms
        $cinemas = Cinema::all();

        return view('showtimes.create', compact('movies', 'rooms', 'cinemas'));
    }


    /**
     * Helper function to check if an array is multidimensional.
     *
     * @param array $array
     * @return bool
     */
    private function isMultiDimensionalArray(array $array): bool
    {
        return isset($array[0]) && is_array($array[0]);
    }



    public function update(UpdateShowtimeRequest $request, $id)
    {
        try {
            $showtime = $this->showtimeService->update($id, $request->validated());
            return $this->success($showtime);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->showtimeService->delete($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function show($id)
    {
        try {
            $showtime = $this->showtimeService->get($id);
            return $this->success($showtime);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    // public function store(StoreShowtimeRequest $request)
    // {
    //     // Retrieve the validated data from the request
    //     $showtimeData = $request->validated();

    //     // Check if the incoming data is an array of arrays (multiple showtimes)
    //     if ($this->isMultiDimensionalArray($showtimeData)) {
    //         $createdShowtimes = [];

    //         foreach ($showtimeData as $singleShowtimeData) {
    //             // Store each showtime in the database and add to the result array
    //             $createdShowtimes[] = $this->showtimeService->store($singleShowtimeData);
    //         }

    //         return $this->success($createdShowtimes, 'Multiple showtimes created successfully.');
    //     } else {
    //         // Handle a single showtime
    //         $createdShowtime = $this->showtimeService->store($showtimeData);
    //         return $this->success($createdShowtime, 'Single showtime created successfully.');
    //     }
    // }

    public function store(StoreShowtimeRequest $request)
    {
        $showtimeData = $request->validated();

        if ($this->isMultiDimensionalArray($showtimeData)) {
            $createdShowtimes = [];

            foreach ($showtimeData as $singleShowtimeData) {
                // Fetch the movie to get the duration
                $movie = Movie::find($singleShowtimeData['movie_id']);
                if (!$movie) {
                    return $this->error('Bộ phim liên quan đến bộ phim được cung cấp không tồn tại.', 404);
                }

                $singleShowtimeData['showtime_start'] = $singleShowtimeData['showtime_date'] . ' ' . $singleShowtimeData['showtime_start'];
                $singleShowtimeData['showtime_end'] = Carbon::parse($singleShowtimeData['showtime_start'])->addMinutes($movie->duration)->format('Y-m-d H:i:s');

                // Check for conflicting showtimes
                $existingShowtimes = Showtime::where('room_id', $singleShowtimeData['room_id'])
                    ->where('showtime_date', $singleShowtimeData['showtime_date'])
                    ->where(function ($query) use ($singleShowtimeData) {
                        $query->whereBetween('showtime_start', [
                            $singleShowtimeData['showtime_start'],
                            $singleShowtimeData['showtime_end'],
                        ])
                            ->orWhereBetween('showtime_end', [
                                $singleShowtimeData['showtime_start'],
                                $singleShowtimeData['showtime_end'],
                            ]);
                    })
                    ->get();

                if ($existingShowtimes->isNotEmpty()) {
                    return $this->errorShowtime(
                        'Phạm vi thời gian được chọn chồng chéo với các thời gian hiển thị hiện có cho căn phòng này.',
                        [
                            'existing_showtimes' => $existingShowtimes,
                        ],
                        409
                    );
                }

                $createdShowtimes[] = $this->showtimeService->store($singleShowtimeData);
            }

            return $this->success($createdShowtimes, 'Nhiều màn trình diễn đã tạo ra thành công.');
        } else {
            // Fetch the movie to get the duration
            $movie = Movie::find($showtimeData['movie_id']);
            if (!$movie) {
                return $this->error('Bộ phim liên quan đến bộ phim được cung cấp không tồn tại.', 404);
            }

            $showtimeData['showtime_start'] = $showtimeData['showtime_date'] . ' ' . $showtimeData['showtime_start'];
            $showtimeData['showtime_end'] = Carbon::parse($showtimeData['showtime_start'])->addMinutes($movie->duration)->format('Y-m-d H:i:s');

            // Check for conflicting showtimes
            $existingShowtimes = Showtime::where('room_id', $showtimeData['room_id'])
                ->where('showtime_date', $showtimeData['showtime_date'])
                ->where(function ($query) use ($showtimeData) {
                    $query->whereBetween('showtime_start', [
                        $showtimeData['showtime_start'],
                        $showtimeData['showtime_end'],
                    ])
                        ->orWhereBetween('showtime_end', [
                            $showtimeData['showtime_start'],
                            $showtimeData['showtime_end'],
                        ]);
                })
                ->get();

            if ($existingShowtimes->isNotEmpty()) {
                return $this->errorShowtime(
                    'Phạm vi thời gian được chọn chồng chéo với các thời gian hiển thị hiện có cho căn phòng này.',
                    [
                        'existing_showtimes' => $existingShowtimes,
                    ],
                    409
                );
            }

            $createdShowtime = $this->showtimeService->store($showtimeData);
            return $this->success($createdShowtime, 'Showtime duy nhất tạo ra thành công.');
        }
    }

    public function errorShowtime(string $message, array $data = [], int $status = 400)
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $status);
    }







    public function storeWithTimeRange(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'room_id' => 'required|integer|exists:rooms,id',
            'movie_id' => 'required|integer|exists:movies,id',
            'date' => 'required|date',
            'opening_time' => 'required|date_format:H:i',
            'closing_time' => 'required|date_format:H:i|after:opening_time',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first());
        }

        try {
            $data = $validator->validated();

            // Fetch the movie to get the duration
            $movie = Movie::find($data['movie_id']);
            if (!$movie) {
                return $this->error('Bộ phim liên quan đến bộ phim được cung cấp không tồn tại.', 404);
            }
            $data['duration'] = $movie->duration;

            // Tính toán thời gian bắt đầu và kết thúc cho suất chiếu mới
            $newShowtimeStart = Carbon::createFromFormat('Y-m-d H:i', $data['date'] . ' ' . $data['opening_time']);
            $newShowtimeEnd = $newShowtimeStart->copy()->addMinutes($data['duration']);

            // Check for conflicting showtimes
            $conflictingShowtimes = Showtime::where('room_id', $data['room_id'])
                ->where('showtime_date', $data['date'])
                ->where(function ($query) use ($newShowtimeStart, $newShowtimeEnd) {
                    $query->where(function ($q) use ($newShowtimeStart, $newShowtimeEnd) {
                        // Check if the new showtime overlaps any existing showtime
                        $q->whereBetween('showtime_start', [$newShowtimeStart, $newShowtimeEnd])
                            ->orWhereBetween('showtime_end', [$newShowtimeStart, $newShowtimeEnd])
                            ->orWhere(function ($subQuery) use ($newShowtimeStart, $newShowtimeEnd) {
                                $subQuery->where('showtime_start', '<=', $newShowtimeStart)
                                    ->where('showtime_end', '>=', $newShowtimeEnd);
                            });
                    });
                })
                ->exists();

            if ($conflictingShowtimes) {
                return $this->errorShowtime(
                    'Phạm vi thời gian được chọn chồng chéo với các thời gian hiển thị hiện có cho căn phòng này.',
                );
            }

            // Generate showtimes using the service
            $createdShowtimes = $this->showtimeService->generateShowtimes($data);

            return $this->success($createdShowtimes, 'Showtimes tạo ra thành công.');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }



    public function status(int $id)
    {
        $movie = Showtime::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }
}
