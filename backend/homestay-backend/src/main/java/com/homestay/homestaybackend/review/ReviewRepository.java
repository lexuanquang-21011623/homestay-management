package com.homestay.homestaybackend.review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByRating(
            Integer rating,
            Pageable pageable
    );

    Page<Review> findByBookingId(
            Long bookingId,
            Pageable pageable
    );

    Page<Review> findByRatingAndBookingId(
            Integer rating,
            Long bookingId,
            Pageable pageable
    );
}