package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Address;
import com.ecommerce.demo.repository.AddressRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> getAddressesByCustomerId(Long idCustomer) {
        return addressRepository.findByIdCustomer(idCustomer);
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
}