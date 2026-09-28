package com.homestay.homestaybackend.cart;

import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Lấy giỏ hàng của user.
     *
     * GET /api/cart/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                cartService.getOrCreateCart(userId)
        );
    }

    /**
     * Thêm phòng vào giỏ hàng.
     *
     * POST /api/cart/{userId}/items
     *
     * Body:
     * {
     *     "roomId": 1,
     *     "quantity": 2
     * }
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest request
    ) {

        return ResponseEntity.ok(
                cartService.addToCart(
                        userId,
                        request.getRoomId(),
                        request.getQuantity()
                )
        );
    }

    /**
     * Cập nhật số lượng CartItem.
     *
     * PUT /api/cart/{userId}/items/{cartItemId}
     *
     * Body:
     * {
     *     "quantity": 3
     * }
     */
    @PutMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable Long userId,
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemRequest request
    ) {

        return ResponseEntity.ok(
                cartService.updateCartItem(
                        userId,
                        cartItemId,
                        request.getQuantity()
                )
        );
    }

    /**
     * Xóa một CartItem.
     *
     * DELETE /api/cart/{userId}/items/{cartItemId}
     */
    @DeleteMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long cartItemId
    ) {

        return ResponseEntity.ok(
                cartService.removeFromCart(
                        userId,
                        cartItemId
                )
        );
    }

    /**
     * Xóa toàn bộ giỏ hàng.
     *
     * DELETE /api/cart/{userId}
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(
            @PathVariable Long userId
    ) {

        cartService.clearCart(userId);

        return ResponseEntity.noContent().build();
    }

    public static class AddToCartRequest {

        private Long roomId;

        @Positive(message = "Quantity must be greater than 0")
        private Integer quantity;

        public AddToCartRequest() {
        }

        public Long getRoomId() {
            return roomId;
        }

        public void setRoomId(Long roomId) {
            this.roomId = roomId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public static class UpdateCartItemRequest {

        @Positive(message = "Quantity must be greater than 0")
        private Integer quantity;

        public UpdateCartItemRequest() {
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}