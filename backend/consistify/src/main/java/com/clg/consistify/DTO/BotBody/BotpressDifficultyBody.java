package com.clg.consistify.DTO.BotBody;

public class BotpressDifficultyBody {
    String type="task_difficulty";
    PayloadDifficultyDTO payload;
    String conversationId="12345";

    public PayloadDifficultyDTO getPayload() {
        return payload;
    }

    public void setPayload(PayloadDifficultyDTO payload) {
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }
}
