package com.ecommerce.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class Dev {

    @Autowired //field injection
    private Laptop laptop;


    //constructor injection
    public Dev(Laptop laptop) {
        this.laptop = laptop;
    }

    @Autowired //setter injection
    public void setLaptop(Laptop laptop){
        this.laptop = laptop;
    }

    public void build(){

        laptop.compile();
        System.out.println("working on an awesome project");
    }

}
