package com.clg.consistify.DTO.BotBody;

public class BotTaskBody {
    String name="react problem";
    String description="how to use lazy";

    public String getName() {
        return name;
    }
    public BotTaskBody(String name,String description){
        this.description=description;
        this.name=name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
