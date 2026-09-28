package com.homestay.homestaybackend.room;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<Page<Room>> getRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long propertyId
    ) {

        return ResponseEntity.ok(
                roomService.getRooms(
                        page,
                        size,
                        sortBy,
                        direction,
                        keyword,
                        propertyId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                roomService.getRoomById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(
            @Valid @RequestBody Room room,
            @RequestParam Long propertyId
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        roomService.createRoom(
                                room,
                                propertyId
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody Room room,
            @RequestParam Long propertyId
    ) {

        return ResponseEntity.ok(
                roomService.updateRoom(
                        id,
                        room,
                        propertyId
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Long id
    ) {

        roomService.deleteRoom(id);

        return ResponseEntity.noContent().build();
    }
}