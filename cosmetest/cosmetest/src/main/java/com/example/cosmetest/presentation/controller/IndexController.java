package com.example.cosmetest.presentation.controller;

import com.example.cosmetest.search.IndexationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/indexation")
public class IndexController {
    @Autowired
    private IndexationService indexationService;

    @PostMapping("/reindex")
    public ResponseEntity<String> reindexData() {
        indexationService.indexAllData();
        return ResponseEntity.ok("Indexation terminée");
    }
}
