package com.sweetshop.api.repository;

import com.sweetshop.api.model.Sweet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SweetRepository extends MongoRepository<Sweet, String> {
}
