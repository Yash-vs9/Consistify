package com.clg.consistify.services;
import com.clg.consistify.DTO.BotBody.BotSkillBody;
import com.clg.consistify.DTO.BotBody.BotpressSkillBody;
import com.clg.consistify.DTO.BotBody.PayloadSkillDTO;
import com.clg.consistify.DTO.CommentDTO;
import com.clg.consistify.DTO.QueryDTO;
import com.clg.consistify.DTO.QueryGetDTO;
import com.clg.consistify.exception.FieldNullException;
import com.clg.consistify.exception.QueryNotFoundException;
import com.clg.consistify.exception.UserNotFoundException;
import com.clg.consistify.repository.QueryRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.Comment;
import com.clg.consistify.user.QueryModel;
import com.clg.consistify.user.UserModel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.management.Query;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
@Service
public class QueryService {
    private final UserRepository userRepository;
    private final QueryRepository queryRepository;
    private final ExternalApiService externalApiService;

    public QueryService(UserRepository userRepository, QueryRepository queryRepository, ExternalApiService externalApiService) {
        this.userRepository = userRepository;
        this.queryRepository = queryRepository;
        this.externalApiService = externalApiService;
    }

    public void createQuery(QueryDTO body) throws ExecutionException, InterruptedException, JsonProcessingException {

        String userName=SecurityContextHolder.getContext().getAuthentication().getName();
        QueryModel query = new QueryModel();

        if (body.getQueryName() != null && !body.getQueryName().trim().isEmpty()) {
            query.setName(body.getQueryName());
        } else {
            throw new FieldNullException("Field cant be empty");
        }

        if (body.getDescription() != null && !body.getDescription().trim().isEmpty()) {
            query.setDescription(body.getDescription());
        } else {
            throw new FieldNullException("Field cant be empty");
        }

        query.setStatus("PENDING");
        query.setSkillsRequired(new ArrayList<>());
        query.setUser(userRepository.findByUsername(body.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found")));
       QueryModel savedQuery= queryRepository.save(query);
       Long queryId= savedQuery.getQueryId();

//        queryRepository.save(query);

        // Prepare BotpressSkillBody payload
        BotpressSkillBody requestBody = new BotpressSkillBody();
        PayloadSkillDTO payload = new PayloadSkillDTO();

        BotSkillBody task = new BotSkillBody(body.getQueryName(), body.getDescription());
        payload.getTasks().add(task);

        requestBody.setPayload(payload);

        // Guard clause to ensure payload is valid
        if (requestBody.getPayload() != null && requestBody.getPayload().getTasks() != null && !requestBody.getPayload().getTasks().isEmpty()) {

            // Update the first task with the query info (optional but you did it)
            requestBody.getPayload().getTasks().get(0).setDescription(body.getDescription());
            requestBody.getPayload().getTasks().get(0).setName(body.getQueryName());
        }
        CompletableFuture.runAsync(() -> {
            try {
                List<String> difficulty = externalApiService
                        .skillsProcessing(requestBody, body.getQueryName(), userName)
                        .get();
                System.out.println(difficulty);
                updateQuery(queryId,userName,difficulty);
                System.out.println("Updated difficulty: " + difficulty);
            } catch (Exception e) {
                System.err.println("Error fetching difficulty: " + e.getMessage());
            }
        });



    }    public List<QueryGetDTO> getQueries(int pageNo){
        return queryRepository.findAll(PageRequest.of(pageNo,10, Sort.by("queryId")))
                .stream()
                .map((QueryGetDTO::new))
                .toList();
    }
    public void postComment(CommentDTO comment){
        QueryModel query=queryRepository.findById(comment.getQueryId())
                .orElseThrow(()->new QueryNotFoundException("Query Not found"));
        Comment commentObj=new Comment();
        commentObj.setQuery(query);
        commentObj.setReply(comment.getReply());
        commentObj.setUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        query.getComments().add(commentObj);
        queryRepository.save(query);
    }
    @Transactional
    public void updateQuery(Long id, String userName, List<String> skillmap) {
        Optional<QueryModel> existingQuery = queryRepository.findById(id);

        if (existingQuery.isEmpty()) {
            throw new QueryNotFoundException(
                    "No query found with id '" + id+ "' for user '" + userName + "'."
            );
        }

        QueryModel query = existingQuery.get();
        query.setSkillsRequired(skillmap);
        queryRepository.save(query);

        System.out.println("✅ Query updated successfully for " + userName);
    }
    @Transactional
    public void updateLikePlus(Long id) {
        String username=SecurityContextHolder.getContext().getAuthentication().getName();
        QueryModel query = queryRepository.findById(id)
                .orElseThrow(() -> new QueryNotFoundException(
                        "No query found with id '" + id + "'."
                ));
        Optional<UserModel> user= query.getLikedByUsers()
                .stream()
                .filter((u)->u.getUsername().equals(username))
                .findFirst();
        if(user.isEmpty()){
            UserModel rUser=userRepository.findByUsername(username)
                            .orElseThrow(()-> new UserNotFoundException("User not found"));
            query.setLikes(query.getLikes()+1);
            Set<UserModel> likedByUsers=query.getLikedByUsers();
            likedByUsers.add(rUser);
            query.setLikedByUsers(likedByUsers);
        }
        else{
            UserModel rUser=userRepository.findByUsername(username)
                    .orElseThrow(()-> new UserNotFoundException("User not found"));
            query.setLikes(query.getLikes()-1);
            Set<UserModel> likedByUsers=query.getLikedByUsers();
            likedByUsers.remove(rUser);
            query.setLikedByUsers(likedByUsers);
        }
        queryRepository.save(query);
    }

}
