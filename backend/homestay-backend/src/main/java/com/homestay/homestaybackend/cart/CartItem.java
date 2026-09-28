package com.homestay.homestaybackend.cart;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.homestay.homestaybackend.room.Room;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;

@Entity
@Table(
        name = "cart_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "cart_id",
                                "room_id"
                        }
                )
        }
)
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "cart_id",
            nullable = false
    )
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    @JoinColumn(
            name = "room_id",
            nullable = false
    )
    private Room room;

    @Positive(
            message = "Quantity must be greater than 0"
    )
    @Column(nullable = false)
    private Integer quantity;

    public CartItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}