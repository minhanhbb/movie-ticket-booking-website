import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { Button, notification } from "antd";
import { SeatMapAdmin } from "../../../interface/SeatMap";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'; // Ant Design icons
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import './SeatMap.css'
const seatMapSchema = z.object({
  name: z.string().min(1, "Tên sơ đồ chỗ ngồi là bắt buộc").max(255, "Tên sơ đồ quá dài"),
  description: z.string().min(1, "Mô tả là bắt buộc").max(500, "Mô tả quá dài"),
  matrix_row: z.number({ invalid_type_error: "Vui lòng nhập số hàng" }).min(12, "Số hàng phải từ 12 trở lên").max(15, "Số hàng không vượt quá 15"),
  matrix_column: z.number({ invalid_type_error: "Vui lòng nhập số cột" }).min(12, "Số cột phải từ 12 trở lên").max(15, "Số cột không vượt quá 15"),
  row_regular_seat: z.number({ invalid_type_error: "Vui lòng nhập số hàng ghế thường" }).min(1, "Số hàng ghế thường phải lớn hơn hoặc bằng 1"),
  row_vip_seat: z.number({ invalid_type_error: "Vui lòng nhập số hàng ghế VIP" }).min(1, "Số hàng ghế VIP phải lớn hơn hoặc bằng 1"),
  row_couple_seat: z.number({ invalid_type_error: "Vui lòng nhập số hàng ghế đôi" }).min(0, "Số hàng ghế đôi không thể nhỏ hơn 0"),
  seat_structure: z.array(z.object({
    label: z.string(),
    linkedSeat: z.string().nullable(),
    row: z.string(),
    column: z.number(),
    type: z.string(),
    status: z.number(),
    is_double: z.number()
  })).optional()
}).superRefine((data, ctx) => {
  const totalSeats = data.row_regular_seat + data.row_vip_seat + data.row_couple_seat;

  if (totalSeats !== data.matrix_row) {
    // Gắn lỗi vào từng trường với `code: "custom"`
    ctx.addIssue({
      code: "custom", // Loại lỗi
      path: ["row_regular_seat"],
      message: "Tổng số hàng ghế (Thường + VIP + Đôi) phải bằng số hàng đã nhập",
    });
    ctx.addIssue({
      code: "custom",
      path: ["row_vip_seat"],
      message: "Tổng số hàng ghế (Thường + VIP + Đôi) phải bằng số hàng đã nhập",
    });
    ctx.addIssue({
      code: "custom",
      path: ["row_couple_seat"],
      message: "Tổng số hàng ghế (Thường + VIP + Đôi) phải bằng số hàng đã nhập",
    });
  }
});
const SeatMapForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seatMap, setSeatMap] = useState<SeatMapAdmin | null>(null);
  const [seatMatrix, setSeatMatrix] = useState<any[][]>([]);
  const [seatStructure, setSeatStructure] = useState<any[]>([]);
  const { handleSubmit, register, setValue, formState: { errors } } = useForm<Partial<SeatMapAdmin>>({
    resolver: zodResolver(seatMapSchema)
  });
  const nav = useNavigate()
  const [isSeatMapVisible, setIsSeatMapVisible] = useState(false);  // Thêm trạng thái để theo dõi việc hiển thị sơ đồ ghế




  useEffect(() => {
    if (id) {
      instance.get(`/manager/seat-maps/${id}`).then(({ data }) => {
        setSeatMap(data);
        Object.keys(data).forEach((key) => {
          setValue(key as keyof SeatMapAdmin, data[key]);
        });

        const rows = data.matrix_column || 0;
        const cols = data.matrix_row || 0;
        const matrix = Array.from({ length: rows }, () => Array(cols).fill(null));
        setSeatMatrix(matrix);

        updateSeatTypes(matrix, data);
        setSeatStructure(data.seat_structure || []);
      });
    }
  }, [id, setValue]);

 const updateSeatTypes = (matrix: any[][], data: any) => {
    const { row_regular_seat, row_vip_seat, row_couple_seat } = data;
    let updatedMatrix = [...matrix];
    let seatStructure = [];

    for (let i = 0; i < row_regular_seat; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        updatedMatrix[i][j] = { type: "regular", occupied: false };
        seatStructure.push({
          label: `${String.fromCharCode(65 + i)}${j + 1}`,
          linkedSeat: null,
          row: String.fromCharCode(65 + i),
          column: j + 1,
          type: "Regular",
          status: 1,
          is_double: 0,
        });
      }
    }

    for (let i = row_regular_seat; i < row_regular_seat + row_vip_seat; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        updatedMatrix[i][j] = { type: "vip", occupied: false };
        seatStructure.push({
          label: `${String.fromCharCode(65 + i)}${j + 1}`,
          linkedSeat: null,
          row: String.fromCharCode(65 + i),
          column: j + 1,
          type: "VIP",
          status: 1,
          is_double: 0,
        });
      }
    }

    for (let i = row_regular_seat + row_vip_seat; i < row_regular_seat + row_vip_seat + row_couple_seat; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        updatedMatrix[i][j] = { type: "couple", occupied: false };
        seatStructure.push({
          label: `${String.fromCharCode(65 + i)}${j + 1}`,
          linkedSeat: null,
          row: String.fromCharCode(65 + i),
          column: j + 1,
          type: "Couple",
          status: 1,
          is_double: 1,
        });
      }
    }

    setSeatMatrix(updatedMatrix);
    return seatStructure;
  };

  const handleSeatClick = (row: number, col: number) => {
    const updatedMatrix = [...seatMatrix];
    const seat = updatedMatrix[row][col];
    const updatedSeatStructure = [...seatStructure];
  
    if (seat && seat.type === "couple") {
      // Chọn ghế đôi (linkedSeat)
      let linkedCol = col + 1; // Mặc định ghế bên phải
      if (col % 2 !== 0) {
        // Nếu là ghế lẻ, chọn ghế bên trái
        linkedCol = col - 1;
      }
  
      const linkedSeat = updatedMatrix[row][linkedCol];
  
      if (linkedSeat && linkedSeat.type === "couple") {
        // Cập nhật trạng thái ghế hiện tại và ghế liên kết
        const isOccupied = !seat.occupied; // Đảo trạng thái
        updatedMatrix[row][col] = { ...seat, occupied: isOccupied };
        updatedMatrix[row][linkedCol] = { ...linkedSeat, occupied: isOccupied };
  
        // Cập nhật seatStructure
        const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}`;
        const linkedSeatLabel = `${String.fromCharCode(65 + row)}${linkedCol + 1}`;
  
        const seatIndex = updatedSeatStructure.findIndex(
          (s) => s.label === seatLabel
        );
        const linkedSeatIndex = updatedSeatStructure.findIndex(
          (s) => s.label === linkedSeatLabel
        );
  
        if (isOccupied) {
          // Nếu chọn ghế, thêm ghế vào cấu trúc
          if (seatIndex === -1) {
            updatedSeatStructure.push({
              label: seatLabel,
              linkedSeat: linkedSeatLabel,
              row: String.fromCharCode(65 + row),
              column: col + 1,
              type: "Couple",
              status: 0,
              is_double: 1,
            });
          }
          if (linkedSeatIndex === -1) {
            updatedSeatStructure.push({
              label: linkedSeatLabel,
              linkedSeat: seatLabel,
              row: String.fromCharCode(65 + row),
              column: linkedCol + 1,
              type: "Couple",
              status: 0,
              is_double: 1,
            });
          }
        } else {
          // Nếu bỏ chọn ghế, xóa ghế khỏi cấu trúc
          if (seatIndex !== -1) {
            updatedSeatStructure.splice(seatIndex, 1);
          }
          if (linkedSeatIndex !== -1) {
            updatedSeatStructure.splice(linkedSeatIndex, 1);
          }
        }
      }
    } else if (seat) {
      // Xử lý ghế không phải ghế đôi
      updatedMatrix[row][col] = { ...seat, occupied: !seat.occupied };
      const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}`;
      const seatIndex = updatedSeatStructure.findIndex(
        (s) => s.label === seatLabel
      );
  
      if (seatIndex !== -1) {
        updatedSeatStructure[seatIndex].status = updatedMatrix[row][col].occupied ? 0 : 1;
      } else {
        if (updatedMatrix[row][col].occupied) {
          updatedSeatStructure.push({
            label: seatLabel,
            linkedSeat: null,
            row: String.fromCharCode(65 + row),
            column: col + 1,
            type: seat.type === "regular" ? "Regular" : seat.type === "vip" ? "VIP" : "Couple",
            status: 0,
            is_double: seat.type === "couple" ? 1 : 0,
          });
        }
      }
    }
  
    setSeatMatrix(updatedMatrix);
    setSeatStructure(updatedSeatStructure);
  };
  
  const handleRowSelect = (rowIndex: number, selectAll: boolean) => {
    const updatedMatrix = [...seatMatrix];
    const updatedSeatStructure = [...seatStructure];
  
    // Cập nhật trạng thái ghế trong hàng
    updatedMatrix[rowIndex] = updatedMatrix[rowIndex].map((seat, colIndex) => {
      const seatLabel = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
      const seatIndex = updatedSeatStructure.findIndex(
        (s) => s.label === seatLabel
      );
  
      if (selectAll) {
        // Tích tất cả ghế
        if (seat) {
          seat.occupied = true;
          if (seatIndex !== -1) {
            updatedSeatStructure[seatIndex].status = 0; // Đã được chọn
          } else {
            updatedSeatStructure.push({
              label: seatLabel,
              linkedSeat: null,
              row: String.fromCharCode(65 + rowIndex),
              column: colIndex + 1,
              type:
                seat.type === "regular"
                  ? "Regular"
                  : seat.type === "vip"
                  ? "VIP"
                  : "Couple",
              status: 0,
              is_double: seat.type === "couple" ? 1 : 0,
            });
          }
        }
      } else {
        // Bỏ tích tất cả ghế
        if (seat) {
          seat.occupied = false;
          if (seatIndex !== -1) {
            updatedSeatStructure[seatIndex].status = 1; // Không được chọn
          }
        }
      }
  
      return seat;
    });
  
    setSeatMatrix(updatedMatrix);
    setSeatStructure(updatedSeatStructure);
  };
  
  
  const onSubmit = async (data: Partial<SeatMapAdmin>) => {
    try {
      // Only keep selected seats (those that are occupied)
      const selectedSeats = seatStructure.filter((seat) => seat.status === 0);  // Assuming 0 means occupied
  
      // Build the seat map data
      const seatMapData = { 
        ...data, 
        seat_structure: selectedSeats 
      };
  
      if (id) {
        await instance.put(`/manager/seat-maps/${id}`, seatMapData);
        notification.success({ message: "Bản đồ chỗ ngồi đã được cập nhật thành công!" });
        nav('/admin/seat-maps')
      } else {
        const res = await instance.post(`/manager/seat-maps`, seatMapData);
        notification.success({ message: "Bản đồ chỗ ngồi đã được thêm thành công!" });
        setIsSeatMapVisible(true);
        navigate(`/admin/seat-maps/edit/${res.data.id}`);
      }
      
    } catch (error) {
      notification.error({ message: "Error submitting data." });
    }
  };
  
  

  return (
    <div className="container mt-5">
      
      <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded bg-light" >
        <h1 className="text-center mb-4">{id ? "Thêm Ghế" : "Thêm Sơ Đồ Ghế"}</h1>
        {!isSeatMapVisible && (
          <>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Tên Sơ Đồ</label>
          <input
            {...register("name")}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
        {errors.name && (
            <span className="text-danger">{errors.name.message}</span>
          )}
        </div>  
        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <input
            {...register("description")}
            className={`form-control ${errors.matrix_row ? "is-invalid" : ""}`}
            
          />
            {errors.description && (
            <span className="text-danger">{errors.description.message}</span>
          )}
        </div>

        {/* Matrix Row */}
        <div className="mb-3">
          <label className="form-label">Số Hàng</label>
          <input
            type="number"
            {...register("matrix_row",{valueAsNumber: true})}
            className={`form-control ${errors.matrix_row ? "is-invalid" : ""}`}
          />
           {errors.matrix_row && (
            <span className="text-danger">{errors.matrix_row.message}</span>
          )}
        </div>

        {/* Matrix Column */}
        <div className="mb-3">
          <label className="form-label">Số Cột</label>
          <input
            type="number"
            {...register("matrix_column",{valueAsNumber: true})}
            className={`form-control ${errors.matrix_column ? "is-invalid" : ""}`}
          />
          {errors.matrix_column && (
            <span className="text-danger">{errors.matrix_column.message}</span>
          )}
        </div>

        {/* Row Regular Seat */}
        <div className="mb-3">
          <label className="form-label">Số Hàng Ghế Thường</label>
          <input
    type="number"
    {...register("row_regular_seat", { valueAsNumber: true })}
    className={`form-control ${errors.row_regular_seat ? "is-invalid" : ""}`}
  />
  {errors.row_regular_seat && (
    <span className="text-danger">{errors.row_regular_seat.message}</span>
  )}
        </div>

        {/* Row VIP Seat */}
        <div className="mb-3">
          <label className="form-label">Số Hàng Ghế VIP</label>
          <input
            type="number"
            {...register("row_vip_seat", { valueAsNumber: true })}
    className={`form-control ${errors.row_vip_seat ? "is-invalid" : ""}`}
          />
         {errors.row_vip_seat && (
            <span className="text-danger">{errors.row_vip_seat.message}</span>
          )}
        </div>

        {/* Row Couple Seat */}
        <div className="mb-3">
          <label className="form-label">Số Hàng Ghế Đôi</label>
          <input
            type="number"
            {...register("row_couple_seat", { valueAsNumber: true })}
    className={`form-control ${errors.row_couple_seat ? "is-invalid" : ""}`}
          />
          {errors.row_couple_seat && (
            <span className="text-danger">{errors.row_couple_seat.message}</span>
          )}
        </div>
        </>
   )}

{/* Seat Matrix */}
{isSeatMapVisible && (
<div className="mb-3">
  <h3 className="text-center">Ma Trận Ghế</h3>
<div className="custom-seat-matrix">
    {seatMatrix.map((row, rowIndex) => (
      <div key={rowIndex} className="custom-seat-row">
        {/* Render cột chữ cái cho hàng ghế */}
        <div className="custom-seat-row-label">{String.fromCharCode(65 + rowIndex)}</div>

        {/* Render các ghế trong hàng */}
        {row.map((seat, colIndex) => (
          <button
            key={colIndex}
            type="button"
            className={`custom-seat ${seat?.occupied ? "custom-occupied" : `custom-${seat?.type}`}`}
            onClick={() => handleSeatClick(rowIndex, colIndex)}
          >
            {seat?.occupied ? "X" : seat?.type === "regular" ? "R" : seat?.type === "vip" ? "V" : "C"}
          </button>
        ))}

        {/* Hai nút bên phải mỗi hàng ghế */}
       
        <div className="custom-seat-row-buttons">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="custom-seat-row-button"
          onClick={() => handleRowSelect(rowIndex, true)}
          style={{
            marginLeft: "12px",
            visibility: row.some(seat => seat?.type === "couple") ? "hidden" : "visible",
          }}
        />
        <Button
          danger
          icon={<DeleteOutlined />}
          className="custom-seat-row-button"
          onClick={() => handleRowSelect(rowIndex, false)}
          style={{
            marginLeft: "12px",
            width: "40px",
            height: "40px",
            visibility: row.some(seat => seat?.type === "couple") ? "hidden" : "visible",
          }}
        />
      </div>
      </div>
    ))}
</div>

</div>
 )}
<button type="submit" className="btn btn-primary w-100">
  {id ? "Cập nhật" : "Thêm"}
</button>

      </form>
    </div>
  );
};

export default SeatMapForm;
