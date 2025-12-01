package com.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class RazorpayConfig {

    @Value("${app.razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key.secret}")
    private String razorpayKeySecret;

    @Bean
    public RazorpayClient razorpayClient() {
        try {
            log.info("Initializing Razorpay client with key: {}", razorpayKeyId);
            return new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        } catch (Exception e) {
            log.error("Failed to initialize Razorpay client", e);
            throw new RuntimeException("Failed to initialize Razorpay client", e);
        }
    }

    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }
    
    public String getRazorpayKeySecret() {
        return razorpayKeySecret;
    }
}