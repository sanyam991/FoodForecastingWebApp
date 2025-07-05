package com.smartserve.model;

/**
 * Data Transfer Object (DTO) representing the details of an event.
 * This class is used as a nested object within the ForecastRequest
 * to encapsulate all relevant information about a specific event.
 */
public class EventDetails {
    // Type of the event (e.g., "Holiday Party", "Corporate Lunch").
    private String eventType;
    // Profile of the audience attending the event (e.g., "Mixed", "Families").
    private String audienceProfile;
    // Expected number of attendees for the event.
    private int footfall;
    // Date of the event.
    private String date;

    /**
     * Default constructor for JSON deserialization.
     */
    public EventDetails() {
    }

    /**
     * Constructor with all fields.
     * @param eventType The type of the event.
     * @param audienceProfile The profile of the audience.
     * @param footfall The expected number of attendees.
     * @param date The date of the event.
     */
    public EventDetails(String eventType, String audienceProfile, int footfall, String date) {
        this.eventType = eventType;
        this.audienceProfile = audienceProfile;
        this.footfall = footfall;
        this.date = date;
    }

    // --- Getters and Setters for the fields ---
    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getAudienceProfile() {
        return audienceProfile;
    }

    public void setAudienceProfile(String audienceProfile) {
        this.audienceProfile = audienceProfile;
    }

    public int getFootfall() {
        return footfall;
    }

    public void setFootfall(int footfall) {
        this.footfall = footfall;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}