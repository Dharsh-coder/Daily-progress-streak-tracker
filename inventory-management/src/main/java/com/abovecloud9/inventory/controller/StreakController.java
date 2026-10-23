
package com.abovecloud9.inventory.controller;

import com.abovecloud9.inventory.service.StreakService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/streak")
public class StreakController {

    private final StreakService streakService;

    public StreakController(StreakService streakService) {
        this.streakService = streakService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Integer>> getCurrentStreak() {
        int currentStreak = streakService.getCurrentStreak();

        return ResponseEntity.ok(
                Map.of("currentStreak", currentStreak)
        );
    }
}
