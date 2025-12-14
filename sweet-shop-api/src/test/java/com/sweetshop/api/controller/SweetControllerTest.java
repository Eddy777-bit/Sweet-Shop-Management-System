package com.sweetshop.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.api.dto.SweetDto;
import com.sweetshop.api.service.SweetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.test.context.bean.override.mockito.MockitoBean; // Not needed if I use explicit import or qualified name
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(SweetController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SweetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @org.springframework.test.context.bean.override.mockito.MockitoBean
    private SweetService sweetService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCreateSweet() throws Exception {
        SweetDto sweetDto = new SweetDto();
        sweetDto.setName("Ladoo");
        sweetDto.setCategory("Indian");
        sweetDto.setPrice(new BigDecimal("10.50"));
        sweetDto.setQuantity(100);

        SweetDto savedSweet = new SweetDto();
        savedSweet.setId("123");
        savedSweet.setName("Ladoo");
        savedSweet.setCategory("Indian");
        savedSweet.setPrice(new BigDecimal("10.50"));
        savedSweet.setQuantity(100);

        when(sweetService.addSweet(any(SweetDto.class))).thenReturn(savedSweet);

        mockMvc.perform(post("/api/sweets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sweetDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("123"))
                .andExpect(jsonPath("$.name").value("Ladoo"));
    }
}
