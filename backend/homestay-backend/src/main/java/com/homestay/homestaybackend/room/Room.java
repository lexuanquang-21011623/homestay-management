package com.homestay.homestaybackend.room;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.homestay.homestaybackend.property.Property;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Room name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Room number is required")
    @Column(nullable = false)
    private String roomNumber;

    @Positive(
            message = "Capacity must be greater than 0"
    )
    private Integer capacity;

    @Positive(
            message = "Price must be greater than 0"
    )
    private Double price;

    @PositiveOrZero(
            message = "Available quantity must be 0 or greater"
    )
    @Column(nullable = false)
    private Integer availableQuantity = 0;

    private String description;

    @ManyToOne
    @JoinColumn(
            name = "property_id",
            nullable = false
    )
    @JsonIgnore
    private Property property;

    public Room() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(
            Integer availableQuantity
    ) {
        this.availableQuantity =
                availableQuantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }
}