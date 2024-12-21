import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from "antd";
import { Booking } from "../../../interface/Booking";

// Define the schema for form validation
const bookingSchema = z.object({
  user_id: z.number().min(1, "User ID is required."),
  showtime_id: z.number().min(1, "Showtime ID is required."),
  pay_method_id: z.number().min(1, "Payment Method ID is required."),
  amount: z.number().min(1, "Amount must be at least 1."),
  status: z.string().min(1, "Status is required."),
});

const OrdersForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Booking>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    // Fetch existing booking data if ID is provided
    const fetchBooking = async () => {
      if (id) {
        setLoading(true);
        try {
          const { data } = await instance.get(`/order/${id}`);
          reset(data.data);
        } catch (error) {
          console.error("Error fetching booking data:", error);
          notification.error({
            message: "Error loading booking data",
            description: "Unable to fetch booking details.",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooking();
  }, [id, reset]);

  const handleFormSubmit = async (data: Booking) => {
    try {
      if (id) {
        // Update an existing booking
        await instance.put(`/order/${id}`, data);
        notification.success({
          message: "Booking updated successfully!",
        });
      } else {
        // Create a new booking
        await instance.post("/order", data);
        notification.success({
          message: "Booking created successfully!",
        });
      }
      navigate("/admin/orders");
    } catch (error) {
      console.error("Error submitting booking:", error);
      notification.error({
        message: "Error submitting booking",
        description: "Failed to save booking data.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="shadow p-4 rounded bg-light"
      >
        <h1 className="text-center mb-4">
          {id ? "Update Booking" : "Create Booking"}
        </h1>

        {/* User ID */}
        <div className="mb-3">
          <label htmlFor="user_id" className="form-label">
            User ID
          </label>
          <input
            type="number"
            className={`form-control ${errors.user_id ? "is-invalid" : ""}`}
            {...register("user_id")}
          />
          {errors.user_id && (
            <span className="text-danger">{errors.user_id.message}</span>
          )}
        </div>

        {/* Showtime ID */}
        <div className="mb-3">
          <label htmlFor="showtime_id" className="form-label">
            Showtime ID
          </label>
          <input
            type="number"
            className={`form-control ${errors.showtime_id ? "is-invalid" : ""}`}
            {...register("showtime_id")}
          />
          {errors.showtime_id && (
            <span className="text-danger">{errors.showtime_id.message}</span>
          )}
        </div>

        {/* Payment Method ID */}
        <div className="mb-3">
          <label htmlFor="pay_method_id" className="form-label">
            Payment Method ID
          </label>
          <input
            type="number"
            className={`form-control ${
              errors.pay_method_id ? "is-invalid" : ""
            }`}
            {...register("pay_method_id")}
          />
          {errors.pay_method_id && (
            <span className="text-danger">{errors.pay_method_id.message}</span>
          )}
        </div>

        {/* Amount */}
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            type="number"
            className={`form-control ${errors.amount ? "is-invalid" : ""}`}
            {...register("amount")}
          />
          {errors.amount && (
            <span className="text-danger">{errors.amount.message}</span>
          )}
        </div>

       {/* Status */}
<div className="mb-3">
  <label htmlFor="status" className="form-label">
    Status
  </label>
  <select
    className={`form-control ${errors.status ? "is-invalid" : ""}`}
    {...register("status")}
  >
    <option value="">Select Status</option>
    <option value="Pain">Pain</option>
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
  </select>
  {errors.status && (
    <span className="text-danger">{errors.status.message}</span>
  )}
</div>


        <div className="mb-3">
          <button className="btn btn-primary w-100">
            {id ? "Update Booking" : "Create Booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrdersForm;
