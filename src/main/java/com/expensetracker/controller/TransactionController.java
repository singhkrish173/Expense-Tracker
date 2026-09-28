package com.expensetracker.controller;

import com.expensetracker.model.Transaction;
import com.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    private Long resolveUserId(Long headerUserId, Long paramUserId) {
        if (paramUserId != null) {
            return paramUserId;
        }
        return headerUserId;
    }

    // Get all transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(headerUserId, paramUserId);
        List<Transaction> transactions = transactionService.getAllTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    // Get single transaction by id
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new transaction
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @Valid @RequestBody Transaction transaction) {
        if (transaction.getUserId() == null && headerUserId != null) {
            transaction.setUserId(headerUserId);
        }
        Transaction saved = transactionService.saveTransaction(transaction);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Update existing transaction
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id,
                                                          @Valid @RequestBody Transaction transaction) {
        try {
            Transaction updated = transactionService.updateTransaction(id, transaction);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Filter by type (income/expense)
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transaction>> getByType(
            @PathVariable String type,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(headerUserId, paramUserId);
        return ResponseEntity.ok(transactionService.getTransactionsByType(type, userId));
    }

    // Filter by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Transaction>> getByCategory(
            @PathVariable String category,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(headerUserId, paramUserId);
        return ResponseEntity.ok(transactionService.getTransactionsByCategory(category, userId));
    }

    // Search transactions
    @GetMapping("/search")
    public ResponseEntity<List<Transaction>> searchTransactions(
            @RequestParam String keyword,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(headerUserId, paramUserId);
        return ResponseEntity.ok(transactionService.searchTransactions(keyword, userId));
    }

    // Filter transactions by type and/or category
    @GetMapping("/filter")
    public ResponseEntity<List<Transaction>> filterTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(headerUserId, paramUserId);
        return ResponseEntity.ok(transactionService.filterTransactions(type, category, userId));
    }

    // Get transactions by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<Transaction>> getByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(headerUserId, paramUserId);
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(transactionService.getTransactionsByDateRange(start, end, userId));
    }

    // Dashboard summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(headerUserId, paramUserId);
        return ResponseEntity.ok(transactionService.getDashboardSummary(userId));
    }

    // Monthly summary
    @GetMapping("/summary/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(
            @RequestParam int month,
            @RequestParam int year,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(headerUserId, paramUserId);
        return ResponseEntity.ok(transactionService.getMonthlySummary(month, year, userId));
    }
}
