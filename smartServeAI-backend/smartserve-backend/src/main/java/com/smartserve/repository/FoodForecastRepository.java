package com.smartserve.repository;

import com.smartserve.model.FoodForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodForecastRepository extends JpaRepository<FoodForecast, Long> {

    // Find historical forecasts for an item up to a certain date (exclusive)
    List<FoodForecast> findByItemNameAndDate(String itemName, LocalDate date);
}
