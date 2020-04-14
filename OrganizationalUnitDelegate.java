/*
 *
 *  Copyright (c) 2018-2020 Givantha Kalansuriya, This source is a part of
 *   Staxrt - sample application source code.
 *   http://staxrt.com
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package com.gs.ia.taxonomy.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.Audited;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;



@Getter
@Setter
@Entity
@Table(name = "ORGANIZATION_UNIT_DELEGATE")
@EntityListeners(AuditingEntityListener.class)
@Audited
public class OrganizationalUnitDelegate extends BaseEntity<String> {

//    private String kerberos;
//
//    @Transient
//    private EmployeePojo details;

    @Embedded
    private Employee employee;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "organization_unit_id")
    private OrganizationalUnit organizationalUnit;

    @JsonBackReference
    public OrganizationalUnit getOrganizationalUnit() {
        return this.organizationalUnit;
    }






}
