package com.ecommerce.demo.dto;

public class AuthResponse {

    private String token;
    private Long idCustomer;
    private Long idAdmin;
    private String role;

    public AuthResponse() {}

    public AuthResponse(String token, Long idCustomer, Long idAdmin, String role) {
        this.token = token;
        this.idCustomer = idCustomer;
        this.idAdmin = idAdmin;
        this.role = role;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getIdCustomer() { return idCustomer; }
    public void setIdCustomer(Long idCustomer) { this.idCustomer = idCustomer; }

    public Long getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Long idAdmin) { this.idAdmin = idAdmin; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}