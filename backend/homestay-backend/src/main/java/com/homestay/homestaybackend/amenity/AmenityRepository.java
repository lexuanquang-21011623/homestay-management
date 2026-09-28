package com.homestay.homestaybackend.amenity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    Page<Amenity> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );
}