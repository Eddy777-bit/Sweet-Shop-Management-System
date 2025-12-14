package com.sweetshop.api.service;

import com.sweetshop.api.dto.SweetDto;
import com.sweetshop.api.model.Sweet;
import com.sweetshop.api.repository.SweetRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class SweetService {

    private final SweetRepository sweetRepository;

    public SweetService(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    public SweetDto addSweet(SweetDto sweetDto) {
        Sweet sweet = new Sweet();
        sweet.setName(sweetDto.getName());
        sweet.setCategory(sweetDto.getCategory());
        sweet.setPrice(sweetDto.getPrice());
        sweet.setQuantity(sweetDto.getQuantity());

        Sweet savedSweet = sweetRepository.save(sweet);

        return mapToDto(savedSweet);
    }

    public List<SweetDto> getAllSweets() {
        return sweetRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void deleteSweet(String id) {
        sweetRepository.deleteById(id);
    }

    public SweetDto purchaseSweet(String id) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));

        if (sweet.getQuantity() > 0) {
            sweet.setQuantity(sweet.getQuantity() - 1);
            return mapToDto(sweetRepository.save(sweet));
        } else {
            throw new RuntimeException("Sweet is out of stock");
        }
    }

    private SweetDto mapToDto(Sweet sweet) {
        SweetDto dto = new SweetDto();
        dto.setId(sweet.getId());
        dto.setName(sweet.getName());
        dto.setCategory(sweet.getCategory());
        dto.setPrice(sweet.getPrice());
        dto.setQuantity(sweet.getQuantity());
        return dto;
    }
}
