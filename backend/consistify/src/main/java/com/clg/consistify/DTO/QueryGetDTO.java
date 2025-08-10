package com.clg.consistify.DTO;

import com.clg.consistify.user.Comment;
import com.clg.consistify.user.QueryModel;
import jakarta.persistence.ElementCollection;

import java.util.List;

public class QueryGetDTO {
    private Long id;
    private String queryName;
    private String queryDescription;
    private int likes;
    private List<Comment> comments;
    @ElementCollection
    private List<String> skillsRequired;
    private String username;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public QueryGetDTO(QueryModel model) {
        this.id=model.getQueryId();
        this.queryName = model.getName();
        this.queryDescription = model.getDescription();
        this.likes = model.getLikes();
        this.comments = model.getComments();
        this.skillsRequired = model.getSkillsRequired();
        this.username=model.getUser().getUsername();
    }
    public String getQueryName() {
        return queryName;
    }

    public void setQueryName(String queryName) {
        this.queryName = queryName;
    }

    public String getQueryDescription() {
        return queryDescription;
    }

    public void setQueryDescription(String queryDescription) {
        this.queryDescription = queryDescription;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<String> getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(List<String> skillsRequired) {
        this.skillsRequired = skillsRequired;
    }
}
