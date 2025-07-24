package com.clg.consistify.services;

import com.clg.consistify.DTO.QueryDTO;
import com.clg.consistify.exception.FieldNullException;
import com.clg.consistify.exception.UserNotFoundException;
import com.clg.consistify.repository.QueryRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.QueryModel;
import org.springframework.stereotype.Service;

import javax.management.Query;
import java.util.List;

@Service
public class QueryService {
    private UserRepository userRepository;
    private QueryRepository queryRepository;

    public QueryService(UserRepository userRepository, QueryRepository queryRepository) {
        this.userRepository = userRepository;
        this.queryRepository = queryRepository;
    }

    public void createQuery(QueryDTO body){
        QueryModel query=new QueryModel();
        if(body.getQueryName()!=null && !body.getQueryName().trim().isEmpty()){
            query.setName(body.getQueryName());
        }
        else{
            throw new FieldNullException("Field cant be empty");
        }
        if(body.getDescription()!=null && !body.getDescription().trim().isEmpty()){
            query.setDescription(body.getDescription());
        }
        else{
            throw new FieldNullException("Field cant be empty");

        }
        query.setStatus("PENDING");
        query.setUser(userRepository.findByUsername(body.getUsername())
                .orElseThrow(()-> new UserNotFoundException("User not found")));
        queryRepository.save(query);
    }
    public List<String> skillsNeeded(QueryDTO body){
        return List.of("");
    }
}
