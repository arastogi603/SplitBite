package com.splitbite.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
public class OrderRequestDTO {

    @NotBlank(message = "Host name is required")
    private String name; // Matches dto.getName() in Controller

    @NotBlank(message = "Restaurant name is required")
    private String restaurantName;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Price is required")
    private Double price; // Added NotNull for safety

    @NotNull(message = "Time window is required")
    @Min(value = 1, message = "Time window must be at least 1 minute")
    private Integer timeWindowMinutes;
}