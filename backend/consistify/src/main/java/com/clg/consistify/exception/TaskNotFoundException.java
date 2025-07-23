package com.clg.consistify.exception;

public class TaskNotFoundException extends  RuntimeException{
    public TaskNotFoundException(String message){
        super(message);
    }
}
