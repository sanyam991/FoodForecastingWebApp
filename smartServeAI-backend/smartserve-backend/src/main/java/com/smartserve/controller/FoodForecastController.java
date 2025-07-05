package com.smartserve.controller;

import com.smartserve.model.ForecastRequest;
import com.smartserve.model.ForecastResponse;
import com.smartserve.service.FoodForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling food preparation forecasting requests.
 * This class exposes a POST endpoint for receiving forecast requests
 * and delegating the logic to the FoodForecastService.
 */
@RestController
@RequestMapping("/api/forecast") // Base path for all endpoints in this controller.
public class FoodForecastController {

    private final FoodForecastService foodForecastService;

    /**
     * Constructor for FoodForecastController. Spring's @Autowired
     * annotation handles injecting the FoodForecastService dependency.
     */
    @Autowired
    public FoodForecastController(FoodForecastService foodForecastService) {
        this.foodForecastService = foodForecastService;
    }

    /**
     * Endpoint to get food preparation forecast based on historical data and event details.
     * In a real application, the historical data might be fetched from a database
     * rather than being sent with each request.
     *
     * @param request Contains historical data and details for the new event.
     * @return A ForecastResponse object with the predicted food quantity.
     */
    @PostMapping // Maps HTTP POST requests to this method.
    public ResponseEntity<ForecastResponse> getFoodForecast(@RequestBody ForecastRequest request) {
        // Log the incoming request for debugging
        System.out.println("Received forecast request:");
        // Access event details from the nested object
        System.out.println("  Event Type: " + request.getEventDetails().getEventType());
        System.out.println("  Audience Profile: " + request.getEventDetails().getAudienceProfile());
        System.out.println("  Footfall: " + request.getEventDetails().getFootfall());
        System.out.println("  Event Date: " + request.getEventDetails().getDate()); // Log date
        System.out.println("  Historical Data Items: " + request.getHistoricalData().size());

        // Call the service layer to perform the actual food preparation prediction.
        // We pass individual fields from the nested EventDetails object to the service method.
        ForecastResponse response = foodForecastService.predictFoodPreparation(
                request.getHistoricalData(),
                request.getEventDetails().getEventType(), // Pass individual fields from EventDetails
                request.getEventDetails().getAudienceProfile(),
                request.getEventDetails().getFootfall()
        );

        // Return an HTTP 200 OK response with the ForecastResponse body.
        return ResponseEntity.ok(response);
    }
}