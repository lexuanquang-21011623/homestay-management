package com.homestay.homestaybackend.booking;

import com.homestay.homestaybackend.customer.Customer;
import com.homestay.homestaybackend.customer.CustomerRepository;
import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import com.homestay.homestaybackend.room.Room;
import com.homestay.homestaybackend.room.RoomRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;

    public BookingService(
            BookingRepository bookingRepository,
            CustomerRepository customerRepository,
            RoomRepository roomRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    public Page<Booking> getBookings(
            int page,
            int size,
            String sortBy,
            String direction,
            String keyword,
            Long customerId,
            Long roomId
    ) {
        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );

        if (keyword != null
                && !keyword.isBlank()
                && customerId != null) {

            return bookingRepository
                    .findByStatusContainingIgnoreCaseAndCustomerId(
                            keyword,
                            customerId,
                            pageable
                    );
        }

        if (keyword != null
                && !keyword.isBlank()
                && roomId != null) {

            return bookingRepository
                    .findByStatusContainingIgnoreCaseAndRoomId(
                            keyword,
                            roomId,
                            pageable
                    );
        }

        if (keyword != null && !keyword.isBlank()) {

            return bookingRepository
                    .findByStatusContainingIgnoreCase(
                            keyword,
                            pageable
                    );
        }

        if (customerId != null) {

            return bookingRepository.findByCustomerId(
                    customerId,
                    pageable
            );
        }

        if (roomId != null) {

            return bookingRepository.findByRoomId(
                    roomId,
                    pageable
            );
        }

        return bookingRepository.findAll(pageable);
    }

    public Page<Booking> getBookingsByCustomerId(
            Long customerId,
            int page,
            int size
    ) {
        customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + customerId
                        ));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id")
        );

        return bookingRepository.findByCustomerId(
                customerId,
                pageable
        );
    }

    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + id
                        ));
    }

    public Booking createBooking(
            Booking booking,
            Long customerId,
            Long roomId
    ) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + customerId
                        ));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id: " + roomId
                        ));

        booking.setCustomer(customer);
        booking.setRoom(room);

        if (booking.getRoomQuantity() == null) {
            booking.setRoomQuantity(1);
        }

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(
            Long id,
            Booking booking,
            Long customerId,
            Long roomId
    ) {

        Booking existingBooking = getBookingById(id);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + customerId
                        ));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id: " + roomId
                        ));

        existingBooking.setCustomer(customer);
        existingBooking.setRoom(room);
        existingBooking.setCheckInDate(booking.getCheckInDate());
        existingBooking.setCheckOutDate(booking.getCheckOutDate());
        existingBooking.setNumberOfGuests(booking.getNumberOfGuests());

        if (booking.getRoomQuantity() == null) {
            existingBooking.setRoomQuantity(1);
        } else {
            existingBooking.setRoomQuantity(
                    booking.getRoomQuantity()
            );
        }

        existingBooking.setTotalPrice(booking.getTotalPrice());
        existingBooking.setStatus(booking.getStatus());

        return bookingRepository.save(existingBooking);
    }

    public void deleteBooking(Long id) {

        Booking booking = getBookingById(id);

        bookingRepository.delete(booking);
    }
}