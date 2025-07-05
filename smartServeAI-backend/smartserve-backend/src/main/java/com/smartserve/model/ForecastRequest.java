package com.smartserve.model;

import java.util.List;

/**
 * Data Transfer Object (DTO) representing the request body for food forecasting.
 * This class is designed to match the JSON structure sent from the React frontend.
 * It contains nested EventDetails and a list of HistoricalDataItem.
 */
public class ForecastRequest {
    // Nested object to hold event-specific details.
    private EventDetails eventDetails;
    // List of historical data items, used by the forecasting service.
    private List<HistoricalDataItem> historicalData;

    // Constructors, Getters, Setters

    /**
     * Default constructor for JSON deserialization.
     */
    public ForecastRequest() {
    }

    /**
     * Constructor with all fields.
     * @param eventDetails The details of the event for which to forecast.
     * @param historicalData A list of past event data.
     */
    public ForecastRequest(EventDetails eventDetails, List<HistoricalDataItem> historicalData) {
        this.eventDetails = eventDetails;
        this.historicalData = historicalData;
    }

    // --- Getters and Setters for the fields ---
    public EventDetails getEventDetails() {
        return eventDetails;
    }

    public void setEventDetails(EventDetails eventDetails) {
        this.eventDetails = eventDetails;
    }

    public List<HistoricalDataItem> getHistoricalData() {
        return historicalData;
    }

    public void setHistoricalData(List<HistoricalDataItem> historicalData) {
        this.historicalData = historicalData;
    }
}