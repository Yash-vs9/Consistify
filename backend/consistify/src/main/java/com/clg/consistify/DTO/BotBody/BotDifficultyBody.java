package com.clg.consistify.DTO.BotBody;

import java.util.Date;

public class BotDifficultyBody {
    String name;
    Date startingDate;
    Date lastDate;
    public BotDifficultyBody(String name,Date startingDate,Date lastDate){
        this.name=name;
        this.lastDate=lastDate;
        this.startingDate=startingDate;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(Date startingDate) {
        this.startingDate = startingDate;
    }

    public Date getLastDate() {
        return lastDate;
    }

    public void setLastDate(Date lastDate) {
        this.lastDate = lastDate;
    }
}
