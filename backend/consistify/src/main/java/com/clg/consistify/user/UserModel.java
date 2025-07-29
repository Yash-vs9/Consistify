package com.clg.consistify.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;
    private String rank;
    @Column(nullable = false, columnDefinition = "int default 0")
    private int xp = 0;

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    @ElementCollection
    private List<String> friendRequests = new ArrayList<>();


    @ManyToMany
    @JoinTable(
            name = "user_friends",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    @JsonIgnore
    private Set<UserModel> friends = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private List<QueryModel> queries=new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskModel> tasks = new ArrayList<>();
    private String role;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectModel> projects = new ArrayList<>();
    public void addProject(ProjectModel project) {
        projects.add(project);
        project.setUser(this);
    }

    public void removeProject(ProjectModel project) {
        projects.remove(project);
        project.setUser(null);
    }
    public List<ProjectModel> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectModel> projects) {
        this.projects = projects;
    }

    public UserModel() {

    }



    public Long getId() {
        return id;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public List<String> getFriendRequests() {
        return friendRequests;
    }

    public void setFriendRequests(List<String> friendRequests) {
        this.friendRequests = friendRequests;
    }

    public Set<UserModel> getFriends() {
        return friends;
    }

    public void setFriends(Set<UserModel> friends) {
        this.friends = friends;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<TaskModel> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskModel> tasks) {
        this.tasks = tasks;
    }


    public List<QueryModel> getQueries() {
        return queries;
    }

    public void setQueries(List<QueryModel> queries) {
        this.queries = queries;
    }
}