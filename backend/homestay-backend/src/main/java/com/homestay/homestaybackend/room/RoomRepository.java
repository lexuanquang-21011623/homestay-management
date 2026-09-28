package com.homestay.homestaybackend.room;

import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Page<Room> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Room> findByPropertyId(Long propertyId, Pageable pageable);

    Page<Room> findByNameContainingIgnoreCaseAndPropertyId(
            String name,
            Long propertyId,
            Pageable pageable
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.id = :id")
    @QueryHints(@QueryHint(
            name = "jakarta.persistence.lock.timeout",
            value = "5000"
    ))
    Optional<Room> findByIdWithLock(@Param("id") Long id);
}