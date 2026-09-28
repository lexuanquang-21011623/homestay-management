package com.homestay.homestaybackend.room;

import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import com.homestay.homestaybackend.property.Property;
import com.homestay.homestaybackend.property.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final PropertyRepository propertyRepository;

    public RoomService(
            RoomRepository roomRepository,
            PropertyRepository propertyRepository
    ) {
        this.roomRepository = roomRepository;
        this.propertyRepository = propertyRepository;
    }

    public Page<Room> getRooms(
            int page,
            int size,
            String sortBy,
            String direction,
            String keyword,
            Long propertyId
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
                && propertyId != null) {

            return roomRepository
                    .findByNameContainingIgnoreCaseAndPropertyId(
                            keyword,
                            propertyId,
                            pageable
                    );
        }

        if (keyword != null && !keyword.isBlank()) {

            return roomRepository
                    .findByNameContainingIgnoreCase(
                            keyword,
                            pageable
                    );
        }

        if (propertyId != null) {

            return roomRepository.findByPropertyId(
                    propertyId,
                    pageable
            );
        }

        return roomRepository.findAll(pageable);
    }

    public Room getRoomById(Long id) {

        return roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id: " + id
                        ));
    }

    public Room createRoom(Room room, Long propertyId) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with id: " + propertyId
                        ));

        room.setProperty(property);

        return roomRepository.save(room);
    }

    public Room updateRoom(
            Long id,
            Room room,
            Long propertyId
    ) {

        Room existingRoom = getRoomById(id);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with id: " + propertyId
                        ));

        existingRoom.setName(room.getName());
        existingRoom.setRoomNumber(room.getRoomNumber());
        existingRoom.setCapacity(room.getCapacity());
        existingRoom.setPrice(room.getPrice());

        // Cập nhật số lượng phòng còn lại
        existingRoom.setAvailableQuantity(
                room.getAvailableQuantity()
        );

        existingRoom.setDescription(room.getDescription());
        existingRoom.setProperty(property);

        return roomRepository.save(existingRoom);
    }

    public void deleteRoom(Long id) {

        Room room = getRoomById(id);

        roomRepository.delete(room);
    }
}