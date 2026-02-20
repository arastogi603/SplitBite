package com.splitbite.repository;

import com.splitbite.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Custom query to find only active carts
    List<Order> findByStatus(String status);
}