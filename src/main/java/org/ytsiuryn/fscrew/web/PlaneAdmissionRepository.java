package org.ytsiuryn.fscrew.web;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;
import org.ytsiuryn.fscrew.entity.Plane;
import org.ytsiuryn.fscrew.entity.PlaneAdmission;

// tag::code[]
public interface PlaneAdmissionRepository extends PagingAndSortingRepository<PlaneAdmission, Integer> {
//    List<PlaneAdmission> findByPlane(@Param("plane") Plane plane);
}
// end::code[]
