
package com.abovecloud9.inventory.repository;

import com.abovecloud9.inventory.entity.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EntryRepository extends JpaRepository<Entry, Long> {

    List<Entry> findByStatus(String status);
    
}
