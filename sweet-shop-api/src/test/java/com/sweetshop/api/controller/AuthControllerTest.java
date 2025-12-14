package com.sweetshop.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.api.dto.RegisterRequest;
import com.sweetshop.api.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @org.springframework.test.context.bean.override.mockito.MockitoBean
        private AuthService authService;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        void shouldRegisterUser() throws Exception {
                RegisterRequest request = new RegisterRequest();
                request.setUsername("testuser");
                request.setPassword("password123");

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                                .andExpect(status().isCreated()); // Expect 201 Created
        }

        @Test
        void shouldLoginUser() throws Exception {
                com.sweetshop.api.dto.LoginRequest request = new com.sweetshop.api.dto.LoginRequest();
                request.setUsername("testuser");
                request.setPassword("password123");

                org.mockito.Mockito
                                .when(authService.login(org.mockito.ArgumentMatchers
                                                .any(com.sweetshop.api.dto.LoginRequest.class)))
                                .thenReturn(new com.sweetshop.api.dto.AuthResponse("dummy-token", "ROLE_USER"));

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers
                                                .jsonPath("$.token")
                                                .value("dummy-token"));
        }
}
