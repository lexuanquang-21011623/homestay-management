package com.homestay.homestaybackend.cart;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndRoomId(
            Long cartId,
            Long roomId
    );
}