
package com.abovecloud9.inventory.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name = "entries")
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
@Size(max = 100, message = "Title cannot exceed 100 characters")
private String title;

@NotBlank(message = "Topic is required")
@Size(max = 50, message = "Topic cannot exceed 50 characters")
private String topic;

@NotBlank(message = "Difficulty is required")
@Pattern(
    regexp = "Easy|Medium|Hard|N/A",
    message = "Difficulty must be Easy, Medium, Hard, or N/A"
)
private String difficulty;

@NotBlank(message = "Status is required")
@Pattern(
    regexp = "Completed|In Progress|Skipped",
    message = "Status must be Completed, In Progress, or Skipped"
)
private String status;

@NotNull(message = "Entry date is required")
private LocalDate entryDate;

@Size(max = 500, message = "Notes cannot exceed 500 characters")
private String notes;

    public Entry() {
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
