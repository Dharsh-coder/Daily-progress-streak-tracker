
package com.abovecloud9.inventory;

import com.abovecloud9.inventory.entity.Entry;
import com.abovecloud9.inventory.repository.EntryRepository;
import com.abovecloud9.inventory.service.StreakService;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class StreakServiceTest {

    private final EntryRepository entryRepository =
            mock(EntryRepository.class);

    private final StreakService streakService =
            new StreakService(entryRepository);

    private Entry completedEntry(LocalDate date) {
        Entry entry = new Entry();
        entry.setStatus("Completed");
        entry.setEntryDate(date);
        return entry;
    }

    @Test
    void shouldReturnZeroWhenNoCompletedEntriesExist() {
        when(entryRepository.findByStatus("Completed"))
                .thenReturn(List.of());

        assertEquals(0, streakService.getCurrentStreak());
    }

    @Test
    void shouldCountTodayAsOneDay() {
        when(entryRepository.findByStatus("Completed"))
                .thenReturn(List.of(completedEntry(LocalDate.now())));

        assertEquals(1, streakService.getCurrentStreak());
    }

    @Test
    void shouldCountConsecutiveCompletedDays() {
        LocalDate today = LocalDate.now();

        when(entryRepository.findByStatus("Completed"))
                .thenReturn(List.of(
                        completedEntry(today),
                        completedEntry(today.minusDays(1)),
                        completedEntry(today.minusDays(2))
                ));

        assertEquals(3, streakService.getCurrentStreak());
    }

    @Test
    void shouldNotCountDuplicateDatesTwice() {
        LocalDate today = LocalDate.now();

        when(entryRepository.findByStatus("Completed"))
                .thenReturn(List.of(
                        completedEntry(today),
                        completedEntry(today),
                        completedEntry(today.minusDays(1))
                ));

        assertEquals(2, streakService.getCurrentStreak());
    }

    @Test
    void shouldStopAtAMissingDay() {
        LocalDate today = LocalDate.now();

        when(entryRepository.findByStatus("Completed"))
                .thenReturn(List.of(
                        completedEntry(today),
                        completedEntry(today.minusDays(1)),
                        completedEntry(today.minusDays(3))
                ));

        assertEquals(2, streakService.getCurrentStreak());
    }
}

