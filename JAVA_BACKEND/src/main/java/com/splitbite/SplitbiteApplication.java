package com.splitbite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // The "Brain" that enables all Spring features
public class SplitbiteApplication {

    public static void main(String[] args) {
        // This starts the server and connects to Postgres
        SpringApplication.run(SplitbiteApplication.class, args);
    }
}