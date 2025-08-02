package com.clg.consistify.DTO.BotBody;

import org.springframework.security.core.context.SecurityContextHolder;

public class BotpressSkillBody {
    String type="xp_request";
    PayloadSkillDTO payload;
    String conversationId= SecurityContextHolder.getContext().getAuthentication().getName();

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
