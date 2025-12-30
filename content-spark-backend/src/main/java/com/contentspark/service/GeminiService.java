package com.contentspark.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateContent(String prompt) {
        System.out.println("========== GEMINI API CALL ==========");
        System.out.println("Prompt: " + prompt);
        System.out.println("API URL: " + apiUrl);
        System.out.println("API Key Present: " + (apiKey != null && !apiKey.isEmpty()));
        System.out.println("API Key Length: " + (apiKey != null ? apiKey.length() : 0));
        if (apiKey != null && apiKey.length() > 8) {
            System.out.println("API Key Start: " + apiKey.substring(0, 8) + "...");
            System.out.println("API Key End: ..." + apiKey.substring(apiKey.length() - 4));
        }

        String url = apiUrl + "?key=" + apiKey;
        System.out.println("Full URL (without key): " + apiUrl + "?key=***");

        // Construct request payload
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));

        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", Collections.singletonList(content));

        System.out.println("Request Payload: " + payload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            System.out.println("Sending request to Gemini API...");
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            System.out.println("Response Status: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String result = (String) parts.get(0).get("text");
                        System.out.println("Generated content length: " + result.length());
                        System.out.println("========== SUCCESS ==========");
                        return result;
                    }
                }
            }
            System.out.println("========== UNEXPECTED RESPONSE STRUCTURE ==========");
        } catch (HttpClientErrorException e) {
            System.err.println("========== HTTP CLIENT ERROR ==========");
            System.err.println("Status Code: " + e.getStatusCode());
            System.err.println("Status Text: " + e.getStatusText());
            System.err.println("Response Body: " + e.getResponseBodyAsString());
            System.err.println("Headers: " + e.getResponseHeaders());
            e.printStackTrace();
            throw new RuntimeException("Gemini API Error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        } catch (HttpServerErrorException e) {
            System.err.println("========== HTTP SERVER ERROR ==========");
            System.err.println("Status Code: " + e.getStatusCode());
            System.err.println("Status Text: " + e.getStatusText());
            System.err.println("Response Body: " + e.getResponseBodyAsString());
            e.printStackTrace();
            throw new RuntimeException(
                    "Gemini API Server Error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("========== GENERAL ERROR ==========");
            System.err.println("Exception Type: " + e.getClass().getName());
            System.err.println("Message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }

        return "Error generating content.";
    }
}
