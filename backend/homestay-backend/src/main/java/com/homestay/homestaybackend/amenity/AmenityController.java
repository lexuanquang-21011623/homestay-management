package com.homestay.homestaybackend.amenity;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/amenities")
public class AmenityController {

    private final AmenityService amenityService;

    public AmenityController(AmenityService amenityService) {
        this.amenityService = amenityService;
    }

    @GetMapping
    public ResponseEntity<Page<Amenity>> getAmenities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(
                amenityService.getAmenities(
                        page,
                        size,
                        sortBy,
                        direction,
                        keyword
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Amenity> getAmenityById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                amenityService.getAmenityById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Amenity> createAmenity(
            @Valid @RequestBody Amenity amenity
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        amenityService.createAmenity(amenity)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Amenity> updateAmenity(
            @PathVariable Long id,
            @Valid @RequestBody Amenity amenity
    ) {
        return ResponseEntity.ok(
                amenityService.updateAmenity(
                        id,
                        amenity
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmenity(
            @PathVariable Long id
    ) {
        amenityService.deleteAmenity(id);

        return ResponseEntity.noContent().build();
    }
}