package com.homestay.homestaybackend.review;

import com.homestay.homestaybackend.booking.Booking;
import com.homestay.homestaybackend.booking.BookingRepository;
import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            BookingRepository bookingRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
    }

    public Page<Review> getReviews(
            int page,
            int size,
            String sortBy,
            String direction,
            Integer rating,
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

        if (rating != null && bookingId != null) {
            return reviewRepository.findByRatingAndBookingId(
                    rating,
                    bookingId,
                    pageable
            );
        }

        if (rating != null) {
            return reviewRepository.findByRating(
                    rating,
                    pageable
            );
        }

        if (bookingId != null) {
            return reviewRepository.findByBookingId(
                    bookingId,
                    pageable
            );
        }

        return reviewRepository.findAll(pageable);
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review not found with id: " + id
                        ));
    }

    public Review createReview(
            Review review,
            Long bookingId
    ) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId
                        ));

        review.setBooking(booking);

        return reviewRepository.save(review);
    }

    public Review updateReview(
            Long id,
            Review review,
            Long bookingId
    ) {
        Review existingReview = getReviewById(id);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId
                        ));

        existingReview.setBooking(booking);
        existingReview.setRating(review.getRating());
        existingReview.setComment(review.getComment());

        return reviewRepository.save(existingReview);
    }

    public void deleteReview(Long id) {
        Review review = getReviewById(id);
        reviewRepository.delete(review);
    }
}