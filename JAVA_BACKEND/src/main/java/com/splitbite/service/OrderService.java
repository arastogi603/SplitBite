package com.splitbite.service;

import com.splitbite.model.Order;
import com.splitbite.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Random; // Keep this here [cite: 2026-02-18]

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // REMOVE the extra import from here! [cite: 2026-02-18]

    public Order processJoinRequest(Long orderId, Double joinerFoodPrice, String items) {
        // 1. Fetch the existing order from the database
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // 2. Fetch Host portion (stored during room creation)
        // This fixes the "Host Portion: 0.00" error on the frontend
        double hostFoodPrice = (order.getHostPrice() != null) ? order.getHostPrice() : 0.0;

        // 3. Set the Joiner's individual food price (Person 2's input)
        order.setPrice(joinerFoodPrice);

        // 4. Update Total Food Cart: Host Food (100) + Joiner Food (20) = 120
        // This ensures both users see the full bill amount
        order.setTotalCartValue(hostFoodPrice + joinerFoodPrice);

        // 5. Calculate what Joiner owes Host: Joiner Food (20) + Platform Fee (2) = 22
        order.setJoinerAmount(joinerFoodPrice + 2.0);

        // 6. Generate a random 4-digit OTP for the handoff
        // This fixes the "----" display on the Joiner's screen
        Random random = new Random();
        String generatedOtp = String.format("%04d", random.nextInt(10000));
        order.setOtp(generatedOtp);

        // 7. Update status to LOCKED and save the items requested
        order.setItemsRequested(items);
        order.setStatus("LOCKED");

        return orderRepository.save(order);
    }

    public Order markAsDelivered(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setDelivered(true); // This triggers the yellow OTP card
        return orderRepository.save(order);
    }

    // Add this method below your @Autowired repository
    public Order createOrder(Order order) {
        // This moves the initial input (₹100) into the dedicated hostPrice column
        // Without this, hostPrice remains NULL in the DB, causing the 0.00 display
        if (order.getPrice() != null) {
            order.setHostPrice(order.getPrice());
        }

        // Set initial values for a fresh session
        order.setStatus("OPEN");
        order.setDelivered(false);
        order.setTotalCartValue(order.getHostPrice()); // Initial total is just the host's food

        return orderRepository.save(order);
    }

    public boolean verifyOtp(Long orderId, String inputOtp) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getOtp().equals(inputOtp) && order.isDelivered()) {
            order.setStatus("COMPLETED"); // Completes the lifecycle
            orderRepository.save(order);
            return true;
        }
        return false;
    }
}