package com.smartserve;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main Spring Boot application class.
 * This class serves as the entry point for the Spring Boot application.
 * It also configures Cross-Origin Resource Sharing (CORS) globally.
 */
@SpringBootApplication
public class FoodForecastApplication {

	public static void main(String[] args) {
		// Starts the Spring Boot application.
		SpringApplication.run(FoodForecastApplication.class, args);
	}

	/**
	 * Configures CORS (Cross-Origin Resource Sharing) to allow requests from the React frontend.
	 * This is crucial for enabling communication between the frontend (e.g., localhost:3000)
	 * and the backend (e.g., localhost:8080) when they are served from different origins.
	 * @return A WebMvcConfigurer bean that defines CORS mappings.
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				// Apply CORS to all API endpoints under /api/**.
				registry.addMapping("/api/**")
						// Allow requests from the React application's origin.
						// This should match the URL where your React app is running.
						.allowedOrigins("http://localhost:3000")
						// Allow specific HTTP methods for cross-origin requests.
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						// Allow all headers in the request.
						.allowedHeaders("*")
						// Allow sending of credentials (like cookies, HTTP authentication).
						.allowCredentials(true);
			}
		};
	}
}