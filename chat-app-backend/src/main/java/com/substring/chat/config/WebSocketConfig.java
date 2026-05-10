package com.substring.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // /chat is for connection establishment
        registry.addEndpoint("/chat")
                .setAllowedOrigins(AppConstants.FRONT_END_BASE_URL)
                .withSockJS();
    }
    // /chat endpoint par connection establish hoga

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        config.enableSimpleBroker("/topic");
        // if client subscribes -> /topic/messages, server can send .

        config.setApplicationDestinationPrefixes("/app");
        //  client sends messages at route -> /app/chat
        //server-side : @MEssaginhMapping("/chat")
    }
}
