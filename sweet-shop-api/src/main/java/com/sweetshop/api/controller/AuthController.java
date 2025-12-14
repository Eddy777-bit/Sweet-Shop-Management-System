package com.sweetshop.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final com.sweetshop.api.service.AuthService authService;

    public AuthController(com.sweetshop.api.service.AuthService authService) {
        this.authService = authService;
    }

    @org.springframework.web.bind.annotation.PostMapping("/register")
    @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    public void register(
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.sweetshop.api.dto.RegisterRequest request) {
        authService.register(request);
    }

    @org.springframework.web.bind.annotation.PostMapping("/login")
    public com.sweetshop.api.dto.AuthResponse login(
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.sweetshop.api.dto.LoginRequest request) {
        return authService.login(request);
    }
}
