package com.homestay.homestaybackend.dashboard;

import com.homestay.homestaybackend.booking.BookingRepository;
import com.homestay.homestaybackend.customer.CustomerRepository;
import com.homestay.homestaybackend.payment.Payment;
import com.homestay.homestaybackend.payment.PaymentRepository;
import com.homestay.homestaybackend.property.PropertyRepository;
import com.homestay.homestaybackend.room.RoomRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final PropertyRepository propertyRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public DashboardService(
            PropertyRepository propertyRepository,
            RoomRepository roomRepository,
            CustomerRepository customerRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository
    ) {
        this.propertyRepository = propertyRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    public DashboardResponse getDashboard() {
        long totalProperties = propertyRepository.count();
        long totalRooms = roomRepository.count();
        long totalCustomers = customerRepository.count();
        long totalBookings = bookingRepository.count();
        long totalPayments = paymentRepository.count();

        double totalRevenue = paymentRepository.findAll()
                .stream()
                .map(Payment::getAmount)
                .filter(amount -> amount != null)
                .mapToDouble(Double::doubleValue)
                .sum();

        return new DashboardResponse(
                totalProperties,
                totalRooms,
                totalCustomers,
                totalBookings,
                totalPayments,
                totalRevenue
        );
    }
}

