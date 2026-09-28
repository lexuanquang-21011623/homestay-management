package com.homestay.homestaybackend.checkout;

import java.util.List;

public class CheckoutResponse {

    private String message;

    private List<Long> bookingIds;

    private Double totalAmount;

    public CheckoutResponse() {
    }

    public CheckoutResponse(
            String message,
            List<Long> bookingIds,
            Double totalAmount
    ) {
        this.message = message;
        this.bookingIds = bookingIds;
        this.totalAmount = totalAmount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Long> getBookingIds() {
        return bookingIds;
    }

    public void setBookingIds(List<Long> bookingIds) {
        this.bookingIds = bookingIds;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}