package com.clg.consistify.DTO.BotBody;

public class BotpressSkillBody {
    String type="xp_request";
    PayloadSkillDTO payload;
    String conversationId="12345";

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public PayloadSkillDTO getPayload() {
        return payload;
    }

    public void setPayload(PayloadSkillDTO payload) {
        this.payload = payload;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }
}
