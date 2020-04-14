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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gs.ia.taxonomy.model.POJO.EmployeePojo;
import com.gs.ia.taxonomy.service.impl.RestService2Impl;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;


@Getter
@Setter
@Embeddable
@JsonIgnoreProperties(value = "details", allowGetters = true)
public class Employee {

    @Size(min = 3, max = 20, message = "kerberos should between 3 and 20 characters")
    private String kerberos;

    @Transient
    private EmployeePojo details;

    @PostLoad
    public void populateField() {
        RestService2Impl restService = new RestService2Impl();
        details = restService.getEmployeeDetails(this.kerberos);

    }



}
