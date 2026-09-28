package com.homestay.homestaybackend.property;

import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Page<Property> getProperties(
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
            return propertyRepository.findByNameContainingIgnoreCase(
                    keyword,
                    pageable
            );
        }

        return propertyRepository.findAll(pageable);
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with id: " + id
                        ));
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property property) {

        Property existingProperty = getPropertyById(id);

        existingProperty.setName(property.getName());
        existingProperty.setAddress(property.getAddress());
        existingProperty.setDescription(property.getDescription());
        existingProperty.setPhone(property.getPhone());

        return propertyRepository.save(existingProperty);
    }

    public void deleteProperty(Long id) {

        Property property = getPropertyById(id);

        propertyRepository.delete(property);
    }
}