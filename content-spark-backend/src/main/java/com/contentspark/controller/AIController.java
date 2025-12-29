package com.contentspark.controller;

import com.contentspark.dto.AIRequest;
import com.contentspark.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend
public class AIController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/generate")
    public Map<String, String> generate(@RequestBody AIRequest request) {
        String generatedText = geminiService.generateContent(request.getPrompt());
        return Collections.singletonMap("text", generatedText);
    }
}
