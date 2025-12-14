package com.sweetshop.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;

@Data
@Document(collection = "sweets")
public class Sweet {
    @Id
    private String id;
    private String name;
    private String category;
    private BigDecimal price;
    private Integer quantity;
}
