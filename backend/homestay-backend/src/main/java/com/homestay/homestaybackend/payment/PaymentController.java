package com.homestay.homestaybackend.payment;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<Page<Payment>> getPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long bookingId
    ) {
        return ResponseEntity.ok(
                paymentService.getPayments(
                        page,
                        size,
                        sortBy,
                        direction,
                        keyword,
                        bookingId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                paymentService.getPaymentById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(
            @Valid @RequestBody Payment payment,
            @RequestParam Long bookingId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        paymentService.createPayment(
                                payment,
                                bookingId
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody Payment payment,
            @RequestParam Long bookingId
    ) {
        return ResponseEntity.ok(
                paymentService.updatePayment(
                        id,
                        payment,
                        bookingId
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(
            @PathVariable Long id
    ) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}