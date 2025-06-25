package com.clg.consistify.exception;

public class UsernameAlreadyExistException extends RuntimeException{
    public UsernameAlreadyExistException(String message){
        super(message);
    }
}
