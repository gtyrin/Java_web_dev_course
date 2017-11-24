package org.ytsiuryn.fscrew.web;

import java.util.List;

import org.ytsiuryn.fscrew.entity.Crew;
import org.ytsiuryn.fscrew.entity.CrewMan;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface CrewRepository extends PagingAndSortingRepository<Crew, Integer> {

    List<Crew> findByCrewMan(@Param("crew-man") CrewMan crewMan);
    List<Crew> findByIsCommander(@Param("is-commander") boolean isCommander);

}