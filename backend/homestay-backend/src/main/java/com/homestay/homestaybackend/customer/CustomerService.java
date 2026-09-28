package com.homestay.homestaybackend.customer;

import com.homestay.homestaybackend.exception.ResourceNotFoundException;
import com.homestay.homestaybackend.user.User;
import com.homestay.homestaybackend.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            UserRepository userRepository
    ) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public Page<Customer> getCustomers(
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
            return customerRepository
                    .findByFullNameContainingIgnoreCase(
                            keyword,
                            pageable
                    );
        }

        return customerRepository.findAll(pageable);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + id
                        ));
    }

    public Customer getCustomerByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        ));

        return customerRepository.findByEmail(user.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with email: " + user.getEmail()
                        ));
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(
            Long id,
            Customer customer
    ) {
        Customer existingCustomer = getCustomerById(id);

        existingCustomer.setFullName(customer.getFullName());
        existingCustomer.setPhone(customer.getPhone());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setAddress(customer.getAddress());

        return customerRepository.save(existingCustomer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
}