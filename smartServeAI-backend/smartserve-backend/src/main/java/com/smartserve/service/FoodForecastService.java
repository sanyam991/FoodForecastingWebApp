package com.smartserve.service;

import com.smartserve.model.ForecastResponse;
import com.smartserve.model.HistoricalDataItem;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class responsible for handling the food preparation forecasting logic.
 * In a real-world application, this would involve integrating with a machine learning model
 * and potentially fetching historical data from a persistent storage.
 */
@Service
public class FoodForecastService {

    /**
     * This method simulates the food preparation forecasting logic.
     *
     * In a real-world application, this would typically involve:
     * 1. Data preprocessing (e.g., cleaning, feature engineering from historicalData).
     * 2. Loading and applying a trained machine learning model (e.g., using libraries like
     * Deeplearning4j, or calling an external ML serving microservice).
     * 3. Considering various complex factors like seasonality, day of week, special events,
     * weather patterns, and local demand trends.
     * 4. Integrating a feedback loop (e.g., storing actual consumption vs. prediction for
     * periodic model retraining and improvement).
     *
     * For this example, a simple rule-based prediction is used to demonstrate the flow.
     *
     * @param historicalData A list of past event data, including footfall, food prepared, and consumed.
     * This data can be used for more advanced ML models.
     * @param eventType The type of the upcoming event (e.g., "Holiday Party", "Corporate Lunch").
     * @param audienceProfile The demographic profile of the expected audience (e.g., "Families", "Professionals").
     * @param footfall The expected number of attendees for the event.
     * @return ForecastResponse containing the predicted food quantity and a mock waste reduction potential.
     */
    public ForecastResponse predictFoodPreparation(
            List<HistoricalDataItem> historicalData,
            String eventType,
            String audienceProfile,
            int footfall
    ) {
        // --- START: Mock Forecasting Logic (Replace with actual ML model integration) ---

        // Initial base forecast: Assume 20% more food than expected footfall.
        double baseForecast = footfall * 1.2;

        // Adjust forecast based on event type.
        switch (eventType) {
            case "Holiday Party":
                baseForecast *= 1.15; // Increase for holiday parties (higher consumption).
                break;
            case "Corporate Lunch":
                baseForecast *= 0.95; // Decrease slightly for corporate lunches (more controlled portions).
                break;
            case "Weekend Brunch":
                baseForecast *= 1.08; // Slight increase for brunches.
                break;
            case "Birthday Celebration":
                baseForecast *= 1.0; // No specific adjustment for birthdays in this mock.
                break;
            case "Other":
                // No specific adjustment for 'Other' event types.
                break;
        }

        // Adjust forecast based on audience profile.
        switch (audienceProfile) {
            case "Families":
                baseForecast *= 1.07; // Families might consume slightly more per person.
                break;
            case "Professionals":
                baseForecast *= 0.98; // Professionals might consume slightly less.
                break;
            case "Young Adults":
                baseForecast *= 1.05; // Young adults might consume more.
                break;
            case "Students":
                baseForecast *= 1.10; // Students might consume more.
                break;
            case "Mixed":
                // No specific adjustment for 'Mixed' audience.
                break;
        }

        // Simulate a very simple "feedback loop" concept using historical data.
        // In a real system, historicalData would be used to train/refine a complex ML model.
        // Here, we just calculate an average consumption rate from the mock historical data
        // and apply a small adjustment based on it.
        double averageConsumptionRate = historicalData.stream()
                .mapToDouble(item -> (double) item.getFoodConsumed() / item.getFootfall())
                .average()
                .orElse(1.0); // Default to 1.0 if no historical data is available to prevent division by zero.

        // Apply this average consumption rate as a final adjustment.
        baseForecast *= averageConsumptionRate;

        // Round the predicted quantity to the nearest whole number.
        int predictedFoodQuantity = (int) Math.round(baseForecast);

        // Calculate a mock waste reduction potential.
        // This is a simplified calculation: comparing against a higher, less optimized
        // "simple estimate" (e.g., footfall * 2.0) to show potential savings from a more precise forecast.
        // Changed the multiplier for simpleEstimate to make waste reduction more apparent.
        int simpleEstimate = (int) Math.round(footfall * 2.0); // Increased from 1.5 to 2.0
        int wasteReductionPotential = Math.max(0, simpleEstimate - predictedFoodQuantity);

        // --- END: Mock Forecasting Logic ---

        // Return the forecast response.
        return new ForecastResponse(predictedFoodQuantity, wasteReductionPotential);
    }
}