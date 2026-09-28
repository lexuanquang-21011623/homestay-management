package com.homestay.homestaybackend.payment;

import com.homestay.homestaybackend.booking.Booking;
import com.homestay.homestaybackend.booking.BookingRepository;
import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    public Page<Payment> getPayments(
            int page,
            int size,
            String sortBy,
            String direction,
            String keyword,
            Long bookingId
    ) {
        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );

        if (keyword != null
                && !keyword.isBlank()
                && bookingId != null) {

            return paymentRepository
                    .findByStatusContainingIgnoreCaseAndBookingId(
                            keyword,
                            bookingId,
                            pageable
                    );
        }

        if (keyword != null && !keyword.isBlank()) {

            return paymentRepository
                    .findByStatusContainingIgnoreCase(
                            keyword,
                            pageable
                    );
        }

        if (bookingId != null) {

            return paymentRepository.findByBookingId(
                    bookingId,
                    pageable
            );
        }

        return paymentRepository.findAll(pageable);
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id: " + id
                        ));
    }

    public Payment createPayment(
            Payment payment,
            Long bookingId
    ) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId
                        ));

        payment.setBooking(booking);

        return paymentRepository.save(payment);
    }

    public Payment updatePayment(
            Long id,
            Payment payment,
            Long bookingId
    ) {
        Payment existingPayment = getPaymentById(id);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId
                        ));

        existingPayment.setBooking(booking);
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setPaymentMethod(payment.getPaymentMethod());
        existingPayment.setStatus(payment.getStatus());
        existingPayment.setPaymentDate(payment.getPaymentDate());
        existingPayment.setTransactionCode(payment.getTransactionCode());

        return paymentRepository.save(existingPayment);
    }

    public void deletePayment(Long id) {
        Payment payment = getPaymentById(id);
        paymentRepository.delete(payment);
    }
}