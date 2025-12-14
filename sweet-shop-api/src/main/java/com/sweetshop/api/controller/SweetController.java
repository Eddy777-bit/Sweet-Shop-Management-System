package com.sweetshop.api.controller;

import com.sweetshop.api.dto.SweetDto;
import com.sweetshop.api.service.SweetService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {
    private final SweetService sweetService;

    public SweetController(SweetService sweetService) {
        this.sweetService = sweetService;
    }

    @org.springframework.web.bind.annotation.PostMapping
    @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    public SweetDto addSweet(
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody SweetDto sweetDto) {
        return sweetService.addSweet(sweetDto);
    }

    @org.springframework.web.bind.annotation.GetMapping
    public java.util.List<SweetDto> getAllSweets() {
        return sweetService.getAllSweets();
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void deleteSweet(@org.springframework.web.bind.annotation.PathVariable String id) {
        sweetService.deleteSweet(id);
    }

    @org.springframework.web.bind.annotation.PostMapping("/{id}/purchase")
    public SweetDto purchaseSweet(@org.springframework.web.bind.annotation.PathVariable String id) {
        return sweetService.purchaseSweet(id);
    }
}
