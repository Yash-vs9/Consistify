package com.clg.consistify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ConsistifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConsistifyApplication.class, args);
	}

}
