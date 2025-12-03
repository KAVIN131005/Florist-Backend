package com.example.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.security.MessageDigest;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
  private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
  private final Key key;
  private final long expirationMs;

  public JwtUtil(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.expiration-ms}") long expirationMs) {
    byte[] keyBytes = secret.getBytes();
    // If secret is shorter than 32 bytes (256 bits), derive a 256-bit key using SHA-256
    if (keyBytes.length < 32) {
      try {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        keyBytes = digest.digest(keyBytes);
      } catch (Exception e) {
        // fallback to original bytes if digest fails (very unlikely)
        keyBytes = secret.getBytes();
      }
    }
    this.key = Keys.hmacShaKeyFor(keyBytes);
    this.expirationMs = expirationMs;
  }

  public String generateToken(String username, Map<String, Object> claims) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + expirationMs);
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(username)
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public String getUsername(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build()
        .parseClaimsJws(token).getBody().getSubject();
  }

  public boolean validate(String token) {
    try {
      Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
      log.debug("JWT validation successful for subject: {}, expiration: {}", claims.getSubject(), claims.getExpiration());
      return true;
    } catch (ExpiredJwtException e) {
      log.warn("JWT token expired for subject: {}, expiration: {}", e.getClaims().getSubject(), e.getClaims().getExpiration());
      return false;
    } catch (UnsupportedJwtException e) {
      log.warn("JWT token is unsupported: {}", e.getMessage());
      return false;
    } catch (MalformedJwtException e) {
      log.warn("JWT token is malformed: {}", e.getMessage());
      return false;
    } catch (SecurityException e) {
      log.warn("JWT token signature validation failed: {}", e.getMessage());
      return false;
    } catch (IllegalArgumentException e) {
      log.warn("JWT token is invalid (illegal argument): {}", e.getMessage());
      return false;
    } catch (Exception e) {
      log.warn("JWT token validation failed with unexpected error: {}", e.getMessage());
      return false;
    }
  }
}
