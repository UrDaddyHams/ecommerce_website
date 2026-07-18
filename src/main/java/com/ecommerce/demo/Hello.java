package com.ecommerce.demo;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Hello {


    @RequestMapping("/")
    public String greet(){
        return "Hello world";
    }
}
