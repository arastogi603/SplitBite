package com.splitbite.controller;

import com.splitbite.model.Order;
import com.splitbite.repository.OrderRepository;
import com.splitbite.service.OrderService;
import com.splitbite.dto.OrderRequestDTO;
import com.splitbite.dto.PythonFilterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate; // Added missing import
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map; // Added missing import

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public Order createCart(@Valid @RequestBody OrderRequestDTO dto) {
        Order order = new Order();
        order.setHostName(dto.getName());
        order.setRestaurantName(dto.getRestaurantName());

        // 1. MUST SET THE PRICE FROM DTO
        order.setPrice(dto.getPrice());

        order.setLatitude(dto.getLatitude());
        order.setLongitude(dto.getLongitude());
        order.setTimeWindowMinutes(dto.getTimeWindowMinutes());
        order.setExpiryTime(LocalDateTime.now().plusMinutes(dto.getTimeWindowMinutes()));

        // 2. USE THE SERVICE instead of orderRepository.save(order)
        // This triggers the logic to set hostPrice = price
        return orderService.createOrder(order);
    }

    @GetMapping("/feed") // Removed the duplicate @GetMapping here
    public List<Order> getFilteredFeed(@RequestParam Double lat, @RequestParam Double lon) {
        List<Order> allOrders = orderRepository.findByStatus("OPEN");

        PythonFilterRequest requestBody = new PythonFilterRequest();
        requestBody.setTarget_lat(lat);
        requestBody.setTarget_long(lon);
        requestBody.setOrders(allOrders);

        // Updated to LOCALHOST for your demo
        String pythonServiceUrl = "http://localhost:8000/filter-nearby";
        RestTemplate restTemplate = new RestTemplate();

        // Casting result safely
        Map<String, List<Order>> result = restTemplate.postForObject(pythonServiceUrl, requestBody, Map.class);

        return result.get("nearby_orders");
    } // Fixed the closing brace here

    @GetMapping("/{id}") // Moved this outside of the getFilteredFeed method
    public Order getOrderDetails(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @PostMapping("/{id}/delivered")
    public ResponseEntity<Order> markAsDelivered(@PathVariable Long id) {
        Order updatedOrder = orderService.markAsDelivered(id);
        return ResponseEntity.ok(updatedOrder);
    }
    @PostMapping("/{id}/verify-otp")
    public ResponseEntity<String> verifyOtp(@PathVariable Long id, @RequestParam String otp) {
        boolean isValid = orderService.verifyOtp(id, otp);
        return isValid ? ResponseEntity.ok("Verified") : ResponseEntity.status(400).body("Invalid OTP");
    }
    // Ensure you only have ONE joinCart method
    @PostMapping("/{id}/join")
    public ResponseEntity<Order> joinCart(
            @PathVariable Long id,
            @RequestParam Double price,
            @RequestParam String items) { // Must match frontend
        Order updatedOrder = orderService.processJoinRequest(id, price, items);
        return ResponseEntity.ok(updatedOrder);
    }
}