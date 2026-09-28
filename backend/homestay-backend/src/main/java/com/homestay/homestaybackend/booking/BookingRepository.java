package com.homestay.homestaybackend.booking;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByStatusContainingIgnoreCase(
            String status,
            Pageable pageable
    );

    Page<Booking> findByCustomerId(
            Long customerId,
            Pageable pageable
    );

    Page<Booking> findByRoomId(
            Long roomId,
            Pageable pageable
    );

    Page<Booking> findByStatusContainingIgnoreCaseAndCustomerId(
            String status,
            Long customerId,
            Pageable pageable
    );

    Page<Booking> findByStatusContainingIgnoreCaseAndRoomId(
            String status,
            Long roomId,
            Pageable pageable
    );
}