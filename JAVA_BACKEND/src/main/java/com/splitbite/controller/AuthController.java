package com.splitbite.controller;

import com.splitbite.dto.AuthRequest;
import com.splitbite.dto.AuthResponse;
import com.splitbite.model.User;
import com.splitbite.repository.UserRepository;
import com.splitbite.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows requests from React frontend
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest authRequest) {
        if (userRepository.findByEmail(authRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Error: Email is already taken!"));
        }

        User user = new User();
        user.setEmail(authRequest.getEmail());
        user.setPassword(passwordEncoder.encode(authRequest.getPassword()));
        user.setName(authRequest.getName());

        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(null, "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        final String jwt = jwtUtil.generateToken(authRequest.getEmail());
        return ResponseEntity.ok(new AuthResponse(jwt, "Login successful"));
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<?> authenticateGoogleUser(@RequestBody AuthRequest authRequest) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(authRequest.getEmail());
            User user;
            
            if (userOptional.isPresent()) {
                user = userOptional.get();
                // Update name if changed
                user.setName(authRequest.getName());
                userRepository.save(user);
            } else {
                user = new User();
                user.setEmail(authRequest.getEmail());
                user.setName(authRequest.getName());
                user.setOauthProvider("google");
                // Set a dummy password for OAuth users to satisfy DB constraints if needed, or allow null
                user.setPassword(passwordEncoder.encode("OAUTH_USER_PASSWORD_PLACEHOLDER")); 
                userRepository.save(user);
            }

            final String jwt = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(jwt, "Google Login successful"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Server Error during OAuth: " + e.getMessage()));
        }
    }
}
