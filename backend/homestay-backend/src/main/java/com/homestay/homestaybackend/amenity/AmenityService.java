package com.homestay.homestaybackend.amenity;

import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AmenityService {

    private final AmenityRepository amenityRepository;

    public AmenityService(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    public Page<Amenity> getAmenities(
            int page,
            int size,
            String sortBy,
            String direction,
            String keyword
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

        if (keyword != null && !keyword.isBlank()) {
            return amenityRepository
                    .findByNameContainingIgnoreCase(
                            keyword,
                            pageable
                    );
        }

        return amenityRepository.findAll(pageable);
    }

    public Amenity getAmenityById(Long id) {
        return amenityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Amenity not found with id: " + id
                        ));
    }

    public Amenity createAmenity(Amenity amenity) {
        return amenityRepository.save(amenity);
    }

    public Amenity updateAmenity(
            Long id,
            Amenity amenity
    ) {
        Amenity existingAmenity = getAmenityById(id);

        existingAmenity.setName(amenity.getName());
        existingAmenity.setDescription(amenity.getDescription());

        return amenityRepository.save(existingAmenity);
    }

    public void deleteAmenity(Long id) {
        Amenity amenity = getAmenityById(id);
        amenityRepository.delete(amenity);
    }
}