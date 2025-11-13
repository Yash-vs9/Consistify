package com.clg.consistify.config;

import com.clg.consistify.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Autowired
    private JwtUtils jwtService; // your service that decodes JWT tokens

    @Override
    protected Principal determineUser(ServerHttpRequest request,
                                      WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {
        // Extract token from query param (e.g. ws://localhost:8080/ws?token=...)
        String query = request.getURI().getQuery();
        if (query != null && query.startsWith("token=")) {
            String token = query.substring(6);
            String username = jwtService.extractUsername(token);
            if (username != null) {
                System.out.println(username);
                return () -> username;
            }
        }

        return super.determineUser(request, wsHandler, attributes);
    }
}
