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
        return addressRepository.findByIdCustomer(idCustomer);
    }

    public Optional<Address> getAddressById(Long id) {
        return addressRepository.findById(id);
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    // UPDATE method matching your exact Address.java getters/setters
    public Optional<Address> updateAddress(Long id, Address addressDetails) {
        return addressRepository.findById(id)
                .map(existingAddress -> {
                    existingAddress.setStreet(addressDetails.getStreet());
                    existingAddress.setCity(addressDetails.getCity());
                    existingAddress.setPostalCode(addressDetails.getPostalCode());
                    existingAddress.setCountry(addressDetails.getCountry());
                    existingAddress.setIdCustomer(addressDetails.getIdCustomer());
                    return addressRepository.save(existingAddress);
                });
    }

    public boolean deleteAddress(Long id) {
        if (addressRepository.existsById(id)) {
            try {
                addressRepository.deleteById(id);
                return true;
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                // Cannot delete because an Order depends on this Address
                return false;
            }
        }
        return false;
    }
}