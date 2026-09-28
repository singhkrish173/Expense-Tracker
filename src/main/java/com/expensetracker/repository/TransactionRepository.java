package com.expensetracker.repository;

import com.expensetracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByType(String type);

    List<Transaction> findByCategory(String category);

    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Transaction> findByTypeAndCategory(String type, String category);

    @Query("SELECT t FROM Transaction t WHERE " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Transaction> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT t FROM Transaction t WHERE " +
           "MONTH(t.date) = :month AND YEAR(t.date) = :year")
    List<Transaction> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type")
    Double getTotalByType(@Param("type") String type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE " +
           "t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    Double getMonthlyTotalByType(@Param("type") String type, @Param("month") int month, @Param("year") int year);

    List<Transaction> findAllByOrderByDateDesc();

    // User-specific queries
    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndType(Long userId, String type);

    List<Transaction> findByUserIdAndCategory(Long userId, String category);

    List<Transaction> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserIdAndTypeAndCategory(Long userId, String type, String category);

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND (" +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.category) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Transaction> searchByKeywordAndUserId(@Param("keyword") String keyword, @Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND " +
           "MONTH(t.date) = :month AND YEAR(t.date) = :year")
    List<Transaction> findByMonthAndYearAndUserId(@Param("month") int month, @Param("year") int year, @Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId AND t.type = :type")
    Double getTotalByUserIdAndType(@Param("userId") Long userId, @Param("type") String type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId AND " +
           "t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    Double getMonthlyTotalByUserIdAndType(@Param("userId") Long userId, @Param("type") String type, @Param("month") int month, @Param("year") int year);

    long countByUserId(Long userId);
}
