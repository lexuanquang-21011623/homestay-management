package com.homestay.homestaybackend.payment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findByStatusContainingIgnoreCase(
            String status,
            Pageable pageable
    );

    Page<Payment> findByPaymentMethodContainingIgnoreCase(
            String paymentMethod,
            Pageable pageable
    );

    Page<Payment> findByBookingId(
            Long bookingId,
            Pageable pageable
    );

    Page<Payment> findByStatusContainingIgnoreCaseAndBookingId(
            String status,
            Long bookingId,
            Pageable pageable
    );
}