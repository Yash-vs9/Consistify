// File: UserNotFoundException.java
package com.clg.consistify.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}