
package com.abovecloud9.inventory.service;

import com.abovecloud9.inventory.entity.Entry;
import com.abovecloud9.inventory.repository.EntryRepository;
import org.springframework.stereotype.Service;
import com.abovecloud9.inventory.exception.EntryNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class EntryService {

    private final EntryRepository entryRepository;

    public EntryService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public Entry createEntry(Entry entry) {
        return entryRepository.save(entry);
    }

    public List<Entry> getAllEntries() {
        return entryRepository.findAll();
    }

    public Optional<Entry> getEntryById(Long id) {
        return entryRepository.findById(id);
    }

    public Entry updateEntry(Long id, Entry updatedEntry) {
        Entry existingEntry = entryRepository.findById(id)
                .orElseThrow(() ->
        new EntryNotFoundException("Entry not found with id: " + id));

        existingEntry.setTitle(updatedEntry.getTitle());
        existingEntry.setTopic(updatedEntry.getTopic());
        existingEntry.setDifficulty(updatedEntry.getDifficulty());
        existingEntry.setStatus(updatedEntry.getStatus());
        existingEntry.setEntryDate(updatedEntry.getEntryDate());
        existingEntry.setNotes(updatedEntry.getNotes());

        return entryRepository.save(existingEntry);
    }

    public void deleteEntry(Long id) {
        if (!entryRepository.existsById(id)) {
            throw new EntryNotFoundException("Entry not found with id: " + id);
        }

        entryRepository.deleteById(id);
    }
}
