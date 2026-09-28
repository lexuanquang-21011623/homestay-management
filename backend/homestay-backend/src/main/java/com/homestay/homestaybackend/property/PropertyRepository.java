package com.homestay.homestaybackend.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    Page<Property> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );

    Page<Property> findByAddressContainingIgnoreCase(
            String address,
            Pageable pageable
    );
}