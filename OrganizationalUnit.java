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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.envers.Audited;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ORGANIZATION_UNIT")
@EntityListeners(AuditingEntityListener.class)
@Audited
public class OrganizationalUnit extends BaseEntity<String> {

    @NotEmpty
    private String name;

    private String description;

    @NotNull
    private OrganizationalUnitStatus status;

    @Size(min = 3, max = 20, message = "kerberos should between 3 and 20 characters")
    private String owner;

    @AttributeOverrides({ @AttributeOverride(name = "kerberos", column = @Column(name = "approver")) })
    @Embedded
    private Employee approver;


    @OneToMany( fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "organizationalUnit", orphanRemoval=true)
    private Set<OrganizationalUnitDelegate> delegates = new HashSet<>();

    @OneToMany( fetch = FetchType.LAZY, cascade = CascadeType.ALL,mappedBy = "organizationalUnit", orphanRemoval=true)
    @JsonIgnore
    private Set<RiskCategoryOrganizationalUnitMapping> riskCategoryMappings;

    public void addDelegate(OrganizationalUnitDelegate organizationalUnitDelegate){
        if(null ==this.delegates){
            this.delegates= new HashSet<OrganizationalUnitDelegate>();
        }
        organizationalUnitDelegate.setOrganizationalUnit(this);
        this.delegates.add(organizationalUnitDelegate);
    }

    public String getCode() {
        return "OU" + StringUtils.leftPad(Long.toString(this.getId()),5, "0");
    }


    @JsonManagedReference
    public Set<OrganizationalUnitDelegate> getDelegates() {
        return this.delegates;
    }



}
