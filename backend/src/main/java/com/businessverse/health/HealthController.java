package com.businessverse.health;

import com.businessverse.common.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * System health and runtime telemetry endpoint.
 */
@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @Value("${spring.application.name:businessverse-backend}")
    private String applicationName;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", applicationName);
        health.put("version", "0.0.1-SNAPSHOT");
        health.put("activeProfile", activeProfile);
        health.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(ApiResponse.success(health, "Service is healthy and ready"));
    }

    @GetMapping("/system-info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("serviceName", "India BusinessVerse Intelligence Engine");
        info.put("tagline", "Explore. Connect. Analyze. Simulate.");
        info.put("javaVersion", System.getProperty("java.version"));
        info.put("osName", System.getProperty("os.name"));
        info.put("provenanceMode", "STRICT_ENFORCED");
        info.put("knowledgeGraphStatus", "READY_FOR_INGESTION");

        return ResponseEntity.ok(ApiResponse.success(info, "System metadata retrieved"));
    }
}
