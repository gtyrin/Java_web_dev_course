package org.ytsiuryn.fscrew.web;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;
import org.ytsiuryn.fscrew.entity.CrewMan;
import org.ytsiuryn.fscrew.entity.CrewManAdmission;

// tag::code[]
public interface CrewManAdmissionRepository extends PagingAndSortingRepository<CrewManAdmission, Integer> {
    List<CrewManAdmission> findByCrewMan(@Param("crew-man") CrewMan crewMan);
}
// end::code[]
