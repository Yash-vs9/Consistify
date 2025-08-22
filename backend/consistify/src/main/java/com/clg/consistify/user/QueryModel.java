package com.clg.consistify.user;

import com.clg.consistify.DTO.QueryGetDTO;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="query")
public class QueryModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long queryId;
    private String name;
    private String description;
    private String status;
    private int likes;

    @ManyToMany(mappedBy = "likedQueries")
    private Set<UserModel> likedByUsers=new HashSet<>();
    @OneToMany(mappedBy = "query", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;
    @ElementCollection
    private List<String> skillsRequired=new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;
    public QueryModel(){}
    public QueryModel(QueryGetDTO body){
        this.name=body.getQueryName();
        this.description=body.getQueryDescription();
        this.likes=body.getLikes();
        this.comments=body.getComments();
        this.skillsRequired=body.getSkillsRequired();

    }

    public Set<UserModel> getLikedByUsers() {
        return likedByUsers;
    }

    public void setLikedByUsers(Set<UserModel> likedByUsers) {
        this.likedByUsers = likedByUsers;
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

    public long getQueryId() {
        return queryId;
    }

    public void setQueryId(long queryId) {
        this.queryId = queryId;
    }

    public String getName() {
        return name;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public List<String> getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(List<String> skillsRequired) {
        this.skillsRequired = skillsRequired;
    }
}
