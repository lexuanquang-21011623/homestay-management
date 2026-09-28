package com.homestay.homestaybackend.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Page<Customer> findByFullNameContainingIgnoreCase(
            String fullName,
            Pageable pageable
    );

    Page<Customer> findByPhoneContaining(
            String phone,
            Pageable pageable
    );

    Optional<Customer> findByEmail(String email);
}