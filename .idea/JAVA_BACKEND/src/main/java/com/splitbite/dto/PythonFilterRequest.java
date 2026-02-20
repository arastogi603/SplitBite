package com.splitbite.dto;

import com.splitbite.model.Order;
import java.util.List;
import lombok.Data;

@Data
public class PythonFilterRequest {
    private Double target_lat;
    private Double target_long;
    private List<Order> orders;
}