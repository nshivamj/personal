package com.gs.ia.taxonomy.service.impl;

import com.gs.ia.taxonomy.model.POJO.EmployeePojo;
import com.gs.ia.taxonomy.model.OrganizationalUnit;
import com.gs.ia.taxonomy.repository.OrganizationUnitRepository;
import com.gs.ia.taxonomy.model.OrganizationalUnitDelegate;
import com.gs.ia.taxonomy.repository.OrganizationalUnitDelegateRepository;
import com.gs.ia.taxonomy.service.OrganizationalUnitService;
//import javafx.event.Event;
import com.gs.ia.taxonomy.service.RestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OrganizationalUnitServiceImpl implements OrganizationalUnitService {

    @Autowired
    OrganizationUnitRepository organizationUnitRepository;

    @Autowired
    OrganizationalUnitDelegateRepository organizationalUnitDelegateRepository;

    @Autowired
    RestService restService;

    @Override
    public List<OrganizationalUnit> getAllOrganizationUnits() {
        return organizationUnitRepository.findAll();
    }

    @Override
    public OrganizationalUnit getOrganizationUnitById(Long id) {
        OrganizationalUnit organizationalUnit = organizationUnitRepository.findById(id).orElse(null);

        //organizationalUnit = enrichWithEmployee(organizationalUnit);
        return organizationalUnit;
    }

    private OrganizationalUnit enrichWithEmployee(OrganizationalUnit organizationalUnit) {
        EmployeePojo result = restService.getEmployeeDetails();
        organizationalUnit.getApprover().setDetails(result);
        for (OrganizationalUnitDelegate delegate : organizationalUnit.getDelegates()) {
            delegate.getEmployee().setDetails(result);
        }
        return organizationalUnit;
    }

    @Override
    public OrganizationalUnit getOrganizationUnitByCode(String code) {
        Long id = Long.valueOf(code.replaceFirst ("OU0*", ""));
        return organizationUnitRepository.findById(id).orElse(null);
    }

    @Override
    public OrganizationalUnit saveOrganizationUnit(OrganizationalUnit organizationalUnitDetails) {
        return organizationUnitRepository.save(organizationalUnitDetails);
    }

    @Override
    public void deleteOrganizationUnit(OrganizationalUnit organizationalUnit) {
        organizationUnitRepository.delete(organizationalUnit);
    }

    @Override
    public OrganizationalUnit updateOrganizationUnit(OrganizationalUnit organizationalUnit, OrganizationalUnit organizationalUnitNew)
    {
        //organizationalUnit.setCode(organizationalUnitNew.getCode());
        organizationalUnit.setDescription(organizationalUnitNew.getDescription());
        organizationalUnit.setName(organizationalUnitNew.getName());
        organizationalUnit.setStatus(organizationalUnitNew.getStatus());
        organizationalUnit = updateOrganizationUnitWithDelegates(organizationalUnit, organizationalUnitNew.getDelegates());

        return organizationalUnit;
    }

    private OrganizationalUnit updateOrganizationUnitWithDelegates(OrganizationalUnit organizationalUnit, Set<OrganizationalUnitDelegate> organizationalUnitDelegates){
        organizationalUnit.getDelegates().clear();
        for (OrganizationalUnitDelegate delegate: organizationalUnitDelegates) {
            OrganizationalUnitDelegate organizationalUnitDelegate = organizationalUnitDelegateRepository.findByOrganizationalUnitAndId(organizationalUnit,delegate.getId())
                    .orElse(new OrganizationalUnitDelegate());

            organizationalUnitDelegate.setEmployee(delegate.getEmployee());
            organizationalUnitDelegate.setOrganizationalUnit(organizationalUnit);
            organizationalUnit.getDelegates().add(organizationalUnitDelegate);

        }
        return organizationalUnit;
    }


}
