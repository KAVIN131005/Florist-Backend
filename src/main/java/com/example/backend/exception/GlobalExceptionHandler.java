// exception/GlobalExceptionHandler.java
package com.example.backend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.backend.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
  
  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
  
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException ex) {
    String msg = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
    log.error("Validation error: {}", msg);
    return ResponseEntity.badRequest().body(new ApiResponse(false, msg));
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiResponse> notFound(ResourceNotFoundException ex) {
    log.error("Resource not found: {}", ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, ex.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse> generic(Exception ex) {
    log.error("Unhandled exception: ", ex);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, ex.getMessage()));
  }
}
