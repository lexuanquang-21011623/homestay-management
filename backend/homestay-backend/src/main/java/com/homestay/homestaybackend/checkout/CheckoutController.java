package com.homestay.homestaybackend.checkout;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    /**
     * Thanh toán toàn bộ giỏ hàng.
     *
     * POST /api/checkout/{userId}
     *
     * Body:
     * {
     *     "customerId": 1,
     *     "paymentMethod": "CASH"
     * }
     */
    @PostMapping("/{userId}")
    public ResponseEntity<CheckoutResponse> checkout(
            @PathVariable Long userId,
            @Valid @RequestBody CheckoutRequest request
    ) {

        CheckoutResponse response =
                checkoutService.checkout(
                        userId,
                        request
                );

        return ResponseEntity.ok(response);
    }
}