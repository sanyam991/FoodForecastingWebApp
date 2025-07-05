package com.smartserve.model;

/**
 * Data Transfer Object (DTO) representing a single item of historical food preparation data.
 * This class defines the structure for past event records, including how much food was prepared
 * and consumed, along with event details.
 */
public class HistoricalDataItem {
    // Date of the historical event.
    private String date;
    // Type of the historical event.
    private String eventType;
    // Audience profile for the historical event.
    private String audienceProfile;
    // Actual footfall (number of attendees) for the historical event.
    private int footfall;
    // Amount of food prepared for the historical event.
    private int foodPrepared;
    // Amount of food actually consumed during the historical event.
    private int foodConsumed;

    // Constructors, Getters, Setters

    /**
     * Default constructor for JSON deserialization.
     */
    public HistoricalDataItem() {
    }

    /**
     * Constructor with all fields.
     * @param date Date of the event.
     * @param eventType Type of the event.
     * @param audienceProfile Profile of the audience.
     * @param footfall Actual number of attendees.
     * @param foodPrepared Quantity of food prepared.
     * @param foodConsumed Quantity of food consumed.
     */
    public HistoricalDataItem(String date, String eventType, String audienceProfile, int footfall, int foodPrepared, int foodConsumed) {
        this.date = date;
        this.eventType = eventType;
        this.audienceProfile = audienceProfile;
        this.footfall = footfall;
        this.foodPrepared = foodPrepared;
        this.foodConsumed = foodConsumed;
    }

    // --- Getters and Setters for the fields ---

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getEventType() {
        return eventType;
    }

    public String setEventType(String eventType) {
        return eventType;
    }

    public String getAudienceProfile() {
        return audienceProfile;
    }

    public String setAudienceProfile(String audienceProfile) {
        return audienceProfile;
    }

    public int getFootfall() {
        return footfall;
    }

    public void setFootfall(int footfall) {
        this.footfall = footfall;
    }

    public int getFoodPrepared() {
        return foodPrepared;
    }

    public void setFoodPrepared(int foodPrepared) {
        this.foodPrepared = foodPrepared;
    }

    public int getFoodConsumed() {
        return foodConsumed;
    }

    public void setFoodConsumed(int foodConsumed) {
        this.foodConsumed = foodConsumed;
    }
}