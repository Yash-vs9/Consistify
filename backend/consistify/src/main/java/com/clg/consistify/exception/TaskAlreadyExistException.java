package com.clg.consistify.exception;

public class TaskAlreadyExistException extends RuntimeException{
    public TaskAlreadyExistException(String message){
        super(message);
    }
}
