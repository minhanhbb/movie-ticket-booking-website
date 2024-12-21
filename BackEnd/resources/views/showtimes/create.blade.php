@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Add Showtimes</h1>

    <form action="{{ route('showtimes.store') }}" method="POST" id="showtime-form">
        @csrf

        <div id="showtime-entries">
            <div class="showtime-entry">
                <h4>Showtime 1</h4>

                <div class="form-group">
                    <label for="movie_id">Movie:</label>
                    <select name="showtimes[0][movie_id]" class="form-control" required>
                        @foreach ($movies as $movie)
                            <option value="{{ $movie->id }}">{{ $movie->movie_name }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label for="room_id">Room:</label>
                    <select name="showtimes[0][room_id]" class="form-control" required>
                        @foreach ($rooms as $room)
                            <option value="{{ $room->id }}">{{ $room->room_name }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label for="cinema_id">Cinema:</label>
                    <select name="showtimes[0][cinema_id]" class="form-control" required>
                        @foreach ($cinemas as $cinema)
                            <option value="{{ $cinema->id }}">{{ $cinema->cinema_name }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label for="showtime_date">Date:</label>
                    <input type="date" name="showtimes[0][showtime_date]" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="showtime_start">Start Time:</label>
                    <div class="btn-group-toggle" data-toggle="buttons">
                        @foreach ($timeSlots as $timeSlot)
                            <label class="btn btn-outline-primary">
                                <input type="checkbox" name="showtimes[0][showtime_start][]" value="{{ $timeSlot }}" autocomplete="off"> {{ $timeSlot }}
                            </label>
                        @endforeach
                    </div>
                </div>

                <div class="form-group">
                    <label for="showtime_end">End Time:</label>
                    <input type="time" name="showtimes[0][showtime_end]" class="form-control" required>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-secondary" id="add-showtime">Add Another Showtime</button>
        <button type="submit" class="btn btn-primary mt-3">Submit Showtimes</button>
    </form>
</div>

<div id="showtime-template" class="d-none">
    <div class="showtime-entry">
        <h4>Showtime</h4>
        <div class="form-group">
            <label for="movie_id">Movie:</label>
            <select name="showtimes[__INDEX__][movie_id]" class="form-control" required>
                @foreach ($movies as $movie)
                    <option value="{{ $movie->id }}">{{ $movie->movie_name }}</option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="room_id">Room:</label>
            <select name="showtimes[__INDEX__][room_id]" class="form-control" required>
                @foreach ($rooms as $room)
                    <option value="{{ $room->id }}">{{ $room->room_name }}</option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="cinema_id">Cinema:</label>
            <select name="showtimes[__INDEX__][cinema_id]" class="form-control" required>
                @foreach ($cinemas as $cinema)
                    <option value="{{ $cinema->id }}">{{ $cinema->cinema_name }}</option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="showtime_date">Date:</label>
            <input type="date" name="showtimes[__INDEX__][showtime_date]" class="form-control" required>
        </div>

        <div class="form-group">
            <label for="showtime_start">Start Time:</label>
            <div class="btn-group-toggle" data-toggle="buttons">
                @foreach ($timeSlots as $timeSlot)
                    <label class="btn btn-outline-primary">
                        <input type="checkbox" name="showtimes[__INDEX__][showtime_start][]" value="{{ $timeSlot }}" autocomplete="off"> {{ $timeSlot }}
                    </label>
                @endforeach
            </div>
        </div>

        <div class="form-group">
            <label for="showtime_end">End Time:</label>
            <input type="time" name="showtimes[__INDEX__][showtime_end]" class="form-control" required>
        </div>

        <button type="button" class="btn btn-danger remove-showtime">Remove</button>
    </div>
</div>

@endsection

@push('scripts')
<script>
    let index = 1;
    document.getElementById('add-showtime').addEventListener('click', function() {
        const template = document.getElementById('showtime-template').innerHTML;
        const newEntry = template.replace(/__INDEX__/g, index);
        const container = document.getElementById('showtime-entries');
        container.insertAdjacentHTML('beforeend', newEntry);
        index++;
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-showtime')) {
            e.target.closest('.showtime-entry').remove();
        }
    });
</script>
@endpush
