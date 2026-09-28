package com.homestay.homestaybackend.cart;

import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import com.homestay.homestaybackend.room.Room;
import com.homestay.homestaybackend.room.RoomRepository;
import com.homestay.homestaybackend.user.User;
import com.homestay.homestaybackend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            RoomRepository roomRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId)
                );

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Cart addToCart(Long userId, Long roomId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        Cart cart = getOrCreateCart(userId);

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found with id: " + roomId)
                );

        CartItem cartItem = cartItemRepository
                .findByCartIdAndRoomId(cart.getId(), roomId)
                .orElse(null);

        if (cartItem == null) {

            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setRoom(room);
            cartItem.setQuantity(quantity);

        } else {

            int newQuantity = cartItem.getQuantity() + quantity;
            cartItem.setQuantity(newQuantity);
        }

        cartItemRepository.save(cartItem);

        return getOrCreateCart(userId);
    }

    @Transactional
    public Cart updateCartItem(
            Long userId,
            Long cartItemId,
            Integer quantity
    ) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart item not found with id: " + cartItemId
                        )
                );

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException(
                    "Cart item does not belong to current user"
            );
        }

        cartItem.setQuantity(quantity);

        cartItemRepository.save(cartItem);

        return getOrCreateCart(userId);
    }

    @Transactional
    public Cart removeFromCart(
            Long userId,
            Long cartItemId
    ) {

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart item not found with id: " + cartItemId
                        )
                );

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException(
                    "Cart item does not belong to current user"
            );
        }

        cartItemRepository.delete(cartItem);

        return getOrCreateCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {

        Cart cart = getOrCreateCart(userId);

        cart.getItems().clear();

        cartRepository.save(cart);
    }
}