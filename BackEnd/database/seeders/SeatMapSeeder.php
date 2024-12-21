<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SeatMapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('seat_map')->insert([
            [
                'name' => 'Standard Hall',
                'description' => 'A typical cinema hall with Regular and VIP seats.',
                'matrix_row' => 8,
                'matrix_column' => 10,
                'row_regular_seat' => 5,
                'row_vip_seat' => 5,
                'row_couple_seat' => 2,
                'seat_structure' => json_encode($this->generateSeatStructure(8, 10, [
                    'Regular' => [1, 6],
                    'VIP' => [7, 8],
                ])),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Premium Hall',
                'description' => 'Premium cinema hall with Couple and VIP seats.',
                'matrix_row' => 6,
                'matrix_column' => 8,
                'row_regular_seat' => 5,
                'row_vip_seat' => 5,
                'row_couple_seat' => 2,
                'seat_structure' => json_encode($this->generateSeatStructure(6, 8, [
                    'Couple' => [1, 2],
                    'VIP' => [3, 6],
                ])),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Generate seat structure.
     */
    private function generateSeatStructure(int $rows, int $columns, array $types): array
    {
        $structure = [];
        foreach (range(1, $rows) as $rowIndex) {
            $rowLabel = chr(64 + $rowIndex); // Generate row labels (A, B, C, ...)
            foreach (range(1, $columns) as $colIndex) {
                $type = 'Regular';
                foreach ($types as $seatType => $rowsRange) {
                    if ($rowIndex >= $rowsRange[0] && $rowIndex <= $rowsRange[1]) {
                        $type = $seatType;
                        break;
                    }
                }

                $linkedSeat = $type === 'Couple' && $colIndex % 2 === 0
                    ? "{$rowLabel}" . ($colIndex - 1)
                    : null;

                $structure[] = [
                    'label' => "{$rowLabel}{$colIndex}",
                    'linkedSeat' => $linkedSeat,
                    'row' => $rowLabel,
                    'column' => $colIndex,
                    'type' => $type,
                    'status' => 1,
                    'is_double' => $type === 'Couple' ? 1 : 0,
                ];
            }
        }

        return $structure;
    }
}
