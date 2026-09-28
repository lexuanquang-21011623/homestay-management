package com.homestay.homestaybackend.checkout;

import com.homestay.homestaybackend.booking.Booking;
import com.homestay.homestaybackend.booking.BookingRepository;
import com.homestay.homestaybackend.cart.Cart;
import com.homestay.homestaybackend.cart.CartItem;
import com.homestay.homestaybackend.cart.CartRepository;
import com.homestay.homestaybackend.customer.Customer;
import com.homestay.homestaybackend.customer.CustomerRepository;
import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import com.homestay.homestaybackend.payment.Payment;
import com.homestay.homestaybackend.payment.PaymentRepository;
import com.homestay.homestaybackend.room.Room;
import com.homestay.homestaybackend.room.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CheckoutService {

    private final CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public CheckoutService(
            CartRepository cartRepository,
            CustomerRepository customerRepository,
            RoomRepository roomRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository
    ) {
        this.cartRepository = cartRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public CheckoutResponse checkout(
            Long userId,
            CheckoutRequest request
    ) {

        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: "
                                        + request.getCustomerId()
                        )
                );

        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart not found for user id: "
                                        + userId
                        )
                );

        if (cart.getItems() == null
                || cart.getItems().isEmpty()) {

            throw new IllegalArgumentException(
                    "Cart is empty"
            );
        }

        List<Long> bookingIds = new ArrayList<>();

        double totalAmount = 0.0;

        /*
         * Xử lý từng sản phẩm/phòng trong giỏ hàng.
         *
         * Quan trọng:
         * findByIdWithLock() sử dụng PESSIMISTIC_WRITE.
         *
         * Khi 2 người cùng checkout một phòng,
         * transaction đầu tiên sẽ khóa bản ghi Room.
         * Transaction thứ hai phải chờ transaction đầu
         * tiên hoàn thành rồi mới đọc được số lượng mới.
         */
        for (CartItem cartItem : cart.getItems()) {

            Long roomId = cartItem
                    .getRoom()
                    .getId();

            Room room = roomRepository
                    .findByIdWithLock(roomId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Room not found with id: "
                                            + roomId
                            )
                    );

            Integer requestedQuantity =
                    cartItem.getQuantity();

            if (requestedQuantity == null
                    || requestedQuantity <= 0) {

                throw new IllegalArgumentException(
                        "Invalid quantity for room: "
                                + room.getName()
                );
            }

            Integer availableQuantity =
                    room.getAvailableQuantity();

            if (availableQuantity == null) {
                throw new IllegalArgumentException(
                        "Available quantity is not set for room: "
                                + room.getName()
                );
            }

            /*
             * Kiểm tra tồn kho SAU KHI đã lấy lock.
             *
             * Đây là phần quan trọng để xử lý:
             *
             * Người A: còn 1 -> mua 1
             * Người B: cũng muốn mua 1
             *
             * A được lock trước:
             * 1 -> 0
             *
             * Sau đó B lấy được lock và thấy:
             * availableQuantity = 0
             *
             * => B bị từ chối.
             */
            if (availableQuantity < requestedQuantity) {

                throw new IllegalArgumentException(
                        "Room "
                                + room.getName()
                                + " is out of stock. Available: "
                                + availableQuantity
                );
            }

            /*
             * Trừ tồn kho.
             */
            int newAvailableQuantity =
                    availableQuantity - requestedQuantity;

            room.setAvailableQuantity(
                    newAvailableQuantity
            );

            roomRepository.save(room);

            /*
             * Tạo Booking.
             */
            Booking booking = new Booking();

            booking.setCustomer(customer);

            booking.setRoom(room);

            booking.setCheckInDate(
                    LocalDate.now()
            );

            booking.setCheckOutDate(
                    LocalDate.now().plusDays(1)
            );

            booking.setNumberOfGuests(
                    room.getCapacity()
            );

            booking.setRoomQuantity(
                    requestedQuantity
            );

            double bookingTotal =
                    room.getPrice()
                            * requestedQuantity;

            booking.setTotalPrice(
                    bookingTotal
            );

            booking.setStatus(
                    "CONFIRMED"
            );

            Booking savedBooking =
                    bookingRepository.save(booking);

            bookingIds.add(
                    savedBooking.getId()
            );

            /*
             * Tạo Payment.
             *
             * Bài yêu cầu chỉ cần submit để lưu
             * thanh toán vào database nên trạng thái
             * ban đầu để PENDING.
             */
            Payment payment = new Payment();

            payment.setBooking(
                    savedBooking
            );

            payment.setAmount(
                    bookingTotal
            );

            payment.setPaymentMethod(
                    request.getPaymentMethod()
            );

            payment.setStatus(
                    "PENDING"
            );

            payment.setPaymentDate(
                    LocalDateTime.now()
            );

            payment.setTransactionCode(
                    "CHECKOUT-"
                            + savedBooking.getId()
            );

            paymentRepository.save(payment);

            totalAmount += bookingTotal;
        }

        /*
         * Checkout thành công:
         * xóa toàn bộ item khỏi giỏ hàng.
         */
        cart.getItems().clear();

        cartRepository.save(cart);

        return new CheckoutResponse(
                "Checkout successful",
                bookingIds,
                totalAmount
        );
    }
}