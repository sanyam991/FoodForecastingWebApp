package com.smartserve.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    private String itemName;
    @Getter
    private int expectedFootfall;
    @Getter
    private int quantityRecommended;
    @Getter
    private LocalDate date;  // Using LocalDate now

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setExpectedFootfall(int expectedFootfall) {
        this.expectedFootfall = expectedFootfall;
    }

    public void setQuantityRecommended(int quantityRecommended) {
        this.quantityRecommended = quantityRecommended;
    }
    public LocalDate getDate() {
        return date;
    }

    public String getItemName() {
        return itemName;
    }

    public int getExpectedFootfall() {
        return expectedFootfall;
    }

    public int getQuantityRecommended() {
        return quantityRecommended;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }

}
