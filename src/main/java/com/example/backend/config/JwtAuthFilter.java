package com.example.backend.config;

import java.io.IOException;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
  private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);
  private final JwtUtil jwtUtil;
  private final UserRepository userRepo;

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String path = req.getRequestURI();
    log.debug("JwtAuthFilter processing request: {} {}", req.getMethod(), path);
    
    String header = req.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      log.debug("Found Bearer token, validating...");
      
      if (jwtUtil.validate(token)) {
        String email = jwtUtil.getUsername(token);
        log.debug("Token valid for email: {}", email);
        
        User user = userRepo.findByEmail(email).orElse(null);
        if (user != null) {
          log.debug("User found: {} with roles: {}", user.getEmail(), user.getRoles());
          var auth = new UsernamePasswordAuthenticationToken(
              email,
              null,
              user.getRoles().stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r.name())).collect(Collectors.toList())
          );
          SecurityContextHolder.getContext().setAuthentication(auth);
          log.debug("Authentication set in SecurityContext");
        } else {
          log.warn("User not found for email: {}", email);
        }
      } else {
        log.warn("JWT token validation failed");
      }
    } else {
      log.debug("No Bearer token found in request to: {}", path);
    }
    chain.doFilter(req, res);
  }
}
