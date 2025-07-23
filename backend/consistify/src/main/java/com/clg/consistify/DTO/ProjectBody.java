package com.clg.consistify.DTO;

import com.clg.consistify.user.UserModel;

import java.util.Set;

public class ProjectBody {
    private String projectName;
    private String projectGroup;
    private String projectDescription;
    private int timeLimit;
    private boolean projectStatus;
    private UserModel user;
    private Set<String> collaborators;

    public Set<String> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(Set<String> collaborators) {
        this.collaborators = collaborators;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectGroup() {
        return projectGroup;
    }

    public void setProjectGroup(String projectGroup) {
        this.projectGroup = projectGroup;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public int getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(int timeLimit) {
        this.timeLimit = timeLimit;
    }

    public boolean isProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(boolean projectStatus) {
        this.projectStatus = projectStatus;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }
}
