package com.homestay.homestaybackend.property;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<Page<Property>> getProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(
                propertyService.getProperties(
                        page,
                        size,
                        sortBy,
                        direction,
                        keyword
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                propertyService.getPropertyById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(
            @Valid @RequestBody Property property
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(propertyService.createProperty(property));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody Property property
    ) {
        return ResponseEntity.ok(
                propertyService.updateProperty(id, property)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id
    ) {
        propertyService.deleteProperty(id);

        return ResponseEntity.noContent().build();
    }
}