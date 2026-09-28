package com.expensetracker.service;

import com.expensetracker.model.Transaction;
import com.expensetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions(Long userId) {
        if (userId != null) {
            return transactionRepository.findByUserIdOrderByDateDesc(userId);
        }
        return transactionRepository.findAllByOrderByDateDesc();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        return transactionRepository.findById(id)
                .map(transaction -> {
                    transaction.setDescription(updatedTransaction.getDescription());
                    transaction.setAmount(updatedTransaction.getAmount());
                    transaction.setType(updatedTransaction.getType());
                    transaction.setCategory(updatedTransaction.getCategory());
                    transaction.setDate(updatedTransaction.getDate());
                    transaction.setNote(updatedTransaction.getNote());
                    if (updatedTransaction.getUserId() != null) {
                        transaction.setUserId(updatedTransaction.getUserId());
                    }
                    return transactionRepository.save(transaction);
                })
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }

    public List<Transaction> getTransactionsByType(String type, Long userId) {
        if (userId != null) {
            return transactionRepository.findByUserIdAndType(userId, type);
        }
        return transactionRepository.findByType(type);
    }

    public List<Transaction> getTransactionsByCategory(String category, Long userId) {
        if (userId != null) {
            return transactionRepository.findByUserIdAndCategory(userId, category);
        }
        return transactionRepository.findByCategory(category);
    }

    public List<Transaction> searchTransactions(String keyword, Long userId) {
        if (userId != null) {
            return transactionRepository.searchByKeywordAndUserId(keyword, userId);
        }
        return transactionRepository.searchByKeyword(keyword);
    }

    public List<Transaction> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate, Long userId) {
        if (userId != null) {
            return transactionRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        }
        return transactionRepository.findByDateBetween(startDate, endDate);
    }

    public List<Transaction> getTransactionsByMonthAndYear(int month, int year, Long userId) {
        if (userId != null) {
            return transactionRepository.findByMonthAndYearAndUserId(month, year, userId);
        }
        return transactionRepository.findByMonthAndYear(month, year);
    }

    public Map<String, Object> getDashboardSummary(Long userId) {
        Map<String, Object> summary = new HashMap<>();

        Double totalIncome;
        Double totalExpense;
        long count;

        if (userId != null) {
            totalIncome = transactionRepository.getTotalByUserIdAndType(userId, "income");
            totalExpense = transactionRepository.getTotalByUserIdAndType(userId, "expense");
            count = transactionRepository.countByUserId(userId);
        } else {
            totalIncome = transactionRepository.getTotalByType("income");
            totalExpense = transactionRepository.getTotalByType("expense");
            count = transactionRepository.count();
        }

        Double balance = (totalIncome != null ? totalIncome : 0.0) - (totalExpense != null ? totalExpense : 0.0);

        summary.put("totalIncome", totalIncome != null ? totalIncome : 0.0);
        summary.put("totalExpense", totalExpense != null ? totalExpense : 0.0);
        summary.put("balance", balance);
        summary.put("transactionCount", count);

        return summary;
    }

    public Map<String, Object> getMonthlySummary(int month, int year, Long userId) {
        Map<String, Object> summary = new HashMap<>();

        Double monthlyIncome;
        Double monthlyExpense;
        List<Transaction> monthlyTransactions;

        if (userId != null) {
            monthlyIncome = transactionRepository.getMonthlyTotalByUserIdAndType(userId, "income", month, year);
            monthlyExpense = transactionRepository.getMonthlyTotalByUserIdAndType(userId, "expense", month, year);
            monthlyTransactions = transactionRepository.findByMonthAndYearAndUserId(month, year, userId);
        } else {
            monthlyIncome = transactionRepository.getMonthlyTotalByType("income", month, year);
            monthlyExpense = transactionRepository.getMonthlyTotalByType("expense", month, year);
            monthlyTransactions = transactionRepository.findByMonthAndYear(month, year);
        }

        Double monthlyBalance = (monthlyIncome != null ? monthlyIncome : 0.0) - (monthlyExpense != null ? monthlyExpense : 0.0);

        summary.put("monthlyIncome", monthlyIncome != null ? monthlyIncome : 0.0);
        summary.put("monthlyExpense", monthlyExpense != null ? monthlyExpense : 0.0);
        summary.put("monthlyBalance", monthlyBalance);
        summary.put("transactions", monthlyTransactions);
        summary.put("transactionCount", monthlyTransactions.size());

        return summary;
    }

    public List<Transaction> filterTransactions(String type, String category, Long userId) {
        if (userId != null) {
            if (type != null && !type.isEmpty() && category != null && !category.isEmpty()) {
                return transactionRepository.findByUserIdAndTypeAndCategory(userId, type, category);
            } else if (type != null && !type.isEmpty()) {
                return transactionRepository.findByUserIdAndType(userId, type);
            } else if (category != null && !category.isEmpty()) {
                return transactionRepository.findByUserIdAndCategory(userId, category);
            }
            return transactionRepository.findByUserIdOrderByDateDesc(userId);
        }

        if (type != null && !type.isEmpty() && category != null && !category.isEmpty()) {
            return transactionRepository.findByTypeAndCategory(type, category);
        } else if (type != null && !type.isEmpty()) {
            return transactionRepository.findByType(type);
        } else if (category != null && !category.isEmpty()) {
            return transactionRepository.findByCategory(category);
        }
        return transactionRepository.findAllByOrderByDateDesc();
    }
}
