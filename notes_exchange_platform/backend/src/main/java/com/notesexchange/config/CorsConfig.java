// package com.notesexchange.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
// import org.springframework.lang.NonNull;

// @Configuration
// public class CorsConfig {
    
//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(@NonNull CorsRegistry registry) {
//                 registry.addMapping("/**")
//                         .allowedOrigins(
//                             "http://localhost:5500",
//                             "http://127.0.0.1:5500",
//                             "http://localhost:8088",
//                             "http://127.0.0.1:8088",
//                             "file://"
//                         )
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                         .allowedHeaders("*")
//                         .allowCredentials(true)
//                         .maxAge(3600L);
//             }
//         };
//     }
// }