package com.splitbite.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity // Tells JPA this is a database table
@Table(name = "orders")
@Data // Lombok: Generates getters, setters, and toString automatically
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hostName; // Person 1's name
    private String restaurantName;
    private Double hostPrice;
    private Double price; // Matches the 'price' field from create.jsx
    private Double hostFinalAmount;
    private String itemsRequested; // Stores the list of items from Person 2
    // Add these fields to your Order.java model


    private boolean delivered = false;
    private Double totalCartValue;

    // Add these to OrderRequestDTO.java if you want to set them initially
    private String otp;


    // Coordinates for the AI/ML service to filter
    private Double latitude;
    private Double longitude;

    private Integer timeWindowMinutes;
    private LocalDateTime expiryTime;

    private String status; // OPEN, LOCKED, COMPLETED

    private Double hostAmount; // What Person 1 is paying
    private Double joinerAmount; // What Person 2 will pay
}