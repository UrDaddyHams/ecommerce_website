package com.ecommerce.demo.service;

import com.ecommerce.demo.model.Supplier;
import com.ecommerce.demo.repository.SupplierRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    @Transactional
    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Transactional
    public Optional<Supplier> updateSupplier(Long id, Supplier supplierDetails) {
        return supplierRepository.findById(id)
                .map(existingSupplier -> {
                    if (supplierDetails.getSupplierName() != null) {
                        existingSupplier.setSupplierName(supplierDetails.getSupplierName());
                    }
                    if (supplierDetails.getPhone() != null) {
                        existingSupplier.setPhone(supplierDetails.getPhone());
                    }
                    if (supplierDetails.getEmail() != null) {
                        existingSupplier.setEmail(supplierDetails.getEmail());
                    }
                    return supplierRepository.save(existingSupplier);
                });
    }

    @Transactional
    public boolean deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            return false;
        }
        try {
            supplierRepository.deleteById(id);
            supplierRepository.flush();
            return true;
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Cannot delete this supplier because they are tied to existing products.");
        }
    }
}