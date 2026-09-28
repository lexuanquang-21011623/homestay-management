package com.homestay.homestaybackend.customer;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<Page<Customer>> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(
                customerService.getCustomers(
                        page,
                        size,
                        sortBy,
                        direction,
                        keyword
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                customerService.getCustomerById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Customer> getCustomerByUserId(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                customerService.getCustomerByUserId(userId)
        );
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(
            @Valid @RequestBody Customer customer
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(customerService.createCustomer(customer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody Customer customer
    ) {
        return ResponseEntity.ok(
                customerService.updateCustomer(id, customer)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Long id
    ) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}