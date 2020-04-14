package com.gs.ia.taxonomy.service.impl;

import com.gs.ia.taxonomy.model.POJO.EmployeePojo;
import com.gs.ia.taxonomy.service.RestService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

public class RestService2Impl {


    public EmployeePojo getEmployeeDetails(String kerberos) {

        String url = "http://localhost:9090/api/v1/employees/"+ kerberos;
        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.getForObject(url, EmployeePojo.class);
        } catch (RestClientResponseException e) {
            return null;
        }
    }

    <T> ResponseEntity consumeWebService(String url, Class<T> responseType) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.getForEntity(url, responseType);
        } catch (RestClientResponseException e) {
            return ResponseEntity
                    .status(e.getRawStatusCode())
                    .body(e.getResponseBodyAsString());
        }
    }

}
