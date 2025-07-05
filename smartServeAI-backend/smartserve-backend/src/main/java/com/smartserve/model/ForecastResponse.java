package com.smartserve.model;

/**
 * Data Transfer Object (DTO) representing the response body for food forecasting.
 * This class holds the predicted food quantity and a potential waste reduction value
 * to be sent back to the frontend.
 */
public class ForecastResponse {
    // The quantity of food predicted to be needed.
    private int predictedFoodQuantity;
    // An example field indicating the potential for waste reduction.
    private int wasteReductionPotential; // Example field for waste reduction

    /**
     * Default constructor for JSON deserialization.
     */

    public ForecastResponse() {
    }

    /**
     * Constructor with all fields.
     * @param predictedFoodQuantity The forecasted amount of food.
     * @param wasteReductionPotential The estimated amount of food waste that can be avoided.
     */
    public ForecastResponse(int predictedFoodQuantity, int wasteReductionPotential) {
        this.predictedFoodQuantity = predictedFoodQuantity;
        this.wasteReductionPotential = wasteReductionPotential;
    }

    // --- Getters and Setters for the fields ---
    public int getPredictedFoodQuantity() {
        return predictedFoodQuantity;
    }

    public void setPredictedFoodQuantity(int predictedFoodQuantity) {
        this.predictedFoodQuantity = predictedFoodQuantity;
    }

    public int getWasteReductionPotential() {
        return wasteReductionPotential;
    }

    public void setWasteReductionPotential(int wasteReductionPotential) {
        this.wasteReductionPotential = wasteReductionPotential;
    }
}