
package com.abovecloud9.inventory.service;

import com.abovecloud9.inventory.entity.Entry;
import com.abovecloud9.inventory.repository.EntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StreakService {

    private final EntryRepository entryRepository;

    public StreakService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public int getCurrentStreak() {
        List<Entry> completedEntries =
                entryRepository.findByStatus("Completed");

        Set<LocalDate> completedDates = completedEntries.stream()
                .map(Entry::getEntryDate)
                .filter(date -> date != null)
                .collect(Collectors.toSet());

        LocalDate today = LocalDate.now();

        if (!completedDates.contains(today)
                && !completedDates.contains(today.minusDays(1))) {
            return 0;
        }

        LocalDate currentDate = completedDates.contains(today)
                ? today
                : today.minusDays(1);

        int streak = 0;

        while (completedDates.contains(currentDate)) {
            streak++;
            currentDate = currentDate.minusDays(1);
        }

        return streak;
    }
}
