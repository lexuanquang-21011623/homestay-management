package com.homestay.homestaybackend.review;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<Page<Review>> getReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) Long bookingId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviews(
                        page,
                        size,
                        sortBy,
                        direction,
                        rating,
                        bookingId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Review> createReview(
            @Valid @RequestBody Review review,
            @RequestParam Long bookingId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        reviewService.createReview(
                                review,
                                bookingId
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody Review review,
            @RequestParam Long bookingId
    ) {
        return ResponseEntity.ok(
                reviewService.updateReview(
                        id,
                        review,
                        bookingId
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id
    ) {
        reviewService.deleteReview(id);

        return ResponseEntity.noContent().build();
    }
}