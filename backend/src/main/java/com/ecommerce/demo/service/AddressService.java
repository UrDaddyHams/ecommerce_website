package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Address;
import com.ecommerce.demo.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    public List<Address> getAddressesByCustomerId(Long idCustomer) {
        // Updated method call here
        return addressRepository.findByCustomer_IdCustomer(idCustomer);
    }

    public Optional<Address> getAddressById(Long id) {
        return addressRepository.findById(id);
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public Optional<Address> updateAddress(Long id, Address addressDetails) {
        return addressRepository.findById(id)
                .map(existingAddress -> {
                    existingAddress.setStreet(addressDetails.getStreet());
                    existingAddress.setCity(addressDetails.getCity());
                    existingAddress.setPostalCode(addressDetails.getPostalCode());
                    existingAddress.setCountry(addressDetails.getCountry());
                    return addressRepository.save(existingAddress);
                });
    }

    public boolean deleteAddress(Long id) {
        if (addressRepository.existsById(id)) {
            try {
                addressRepository.deleteById(id);
                return true;
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                return false;
            }
        }
        return false;
    }
}