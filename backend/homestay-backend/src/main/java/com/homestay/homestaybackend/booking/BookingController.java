package com.homestay.homestaybackend.booking;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<Page<Booking>> getBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long roomId
    ) {

        return ResponseEntity.ok(
                bookingService.getBookings(
                        page,
                        size,
                        sortBy,
                        direction,
                        keyword,
                        customerId,
                        roomId
                )
        );
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<Booking>> getBookingsByCustomerId(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingsByCustomerId(
                        customerId,
                        page,
                        size
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody Booking booking,
            @RequestParam Long customerId,
            @RequestParam Long roomId
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        bookingService.createBooking(
                                booking,
                                customerId,
                                roomId
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody Booking booking,
            @RequestParam Long customerId,
            @RequestParam Long roomId
    ) {

        return ResponseEntity.ok(
                bookingService.updateBooking(
                        id,
                        booking,
                        customerId,
                        roomId
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long id
    ) {

        bookingService.deleteBooking(id);

        return ResponseEntity.noContent().build();
    }
}