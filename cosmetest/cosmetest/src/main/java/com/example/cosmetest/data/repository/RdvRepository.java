package com.example.cosmetest.data.repository;

import com.example.cosmetest.domain.model.Rdv;
import com.example.cosmetest.domain.model.RdvId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface RdvRepository extends JpaRepository<Rdv, RdvId> {

    @Query("SELECT r FROM Rdv r WHERE r.idVolontaire = :idVolontaire")
    List<Rdv> findByIdVolontaire(@Param("idVolontaire") Integer idVolontaire);

    @Query("SELECT r FROM Rdv r WHERE r.date = :date")
    List<Rdv> findByDate(@Param("date") Date date);

    @Query("SELECT r FROM Rdv r WHERE r.idVolontaire = :idVolontaire AND r.date = :date")
    List<Rdv> findByIdVolontaireAndDate(@Param("idVolontaire") Integer idVolontaire, @Param("date") Date date);

    @Query("SELECT r FROM Rdv r WHERE r.idGroupe = :idGroupe")
    List<Rdv> findByIdGroupe(@Param("idGroupe") Integer idGroupe);

    @Query("SELECT r FROM Rdv r WHERE r.etat = :etat")
    List<Rdv> findByEtat(@Param("etat") String etat);

    @Query("SELECT r FROM Rdv r WHERE r.idVolontaire = :idVolontaire AND r.date >= :startDate AND r.date <= :endDate")
    List<Rdv> findByVolontaireAndDateRange(
            @Param("idVolontaire") Integer idVolontaire,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Query("SELECT COUNT(r) FROM Rdv r WHERE r.idGroupe = :idGroupe")
    Long countRdvsByGroupe(@Param("idGroupe") Integer idGroupe);

    @Query("SELECT r FROM Rdv r WHERE r.commentaires LIKE %:keyword%")
    List<Rdv> findByCommentairesContaining(@Param("keyword") String keyword);

    @Query("SELECT r FROM Rdv r WHERE r.date > :date ORDER BY r.date ASC")
    List<Rdv> findByDateAfterOrderByDateAsc(@Param("date") Date date);

    @Query("SELECT COUNT(r) FROM Rdv r WHERE r.date = :date")
    int countByDate(@Param("date") Date date);

    @Query("SELECT COUNT(r) FROM Rdv r WHERE r.etat = :etat AND r.date BETWEEN :startDate AND :endDate")
    int countByEtatAndDateBetween(@Param("etat") String etat, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT COUNT(r) FROM Rdv r WHERE r.date BETWEEN :startDate AND :endDate")
    int countByDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT r FROM Rdv r WHERE r.id.idEtude = :idEtude ORDER BY r.date DESC")
    List<Rdv> findById_IdEtudeOrderByDateDesc(@Param("idEtude") Integer idEtude);

    @Query("SELECT r FROM Rdv r WHERE r.idVolontaire = :idVolontaire AND r.id.idEtude = :idEtude")
    Optional<Rdv> findByVolontaireIdAndEtudeId(@Param("idVolontaire") Integer idVolontaire, @Param("idEtude") int idEtude);

    @Query("SELECT r FROM Rdv r WHERE r.date >= :date ORDER BY r.date ASC, r.heure ASC")
    Page<Rdv> findByDateGreaterThanEqualOrderByDateAscHeureAsc(@Param("date") Date date, Pageable pageable);

    // Dans RdvRepository
    @Query("SELECT MAX(r.id.idRdv) FROM Rdv r WHERE r.id.idEtude = :idEtude")
    Integer findMaxRdvIdForEtude(@Param("idEtude") Integer idEtude);

    @Query("SELECT r FROM Rdv r WHERE r.id.idEtude = :idEtude")
    List<Rdv> findByIdEtude(@Param("idEtude") Integer idEtude);

    //@Query("SELECT MAX(r.id.sequence) FROM Rdv r WHERE r.id.idEtude = :idEtude AND r.idVolontaire = :idVolontaire")
    //Integer findMaxSequenceByEtudeAndVolontaire(
    //        @Param("idEtude") Integer idEtude,
    //        @Param("idVolontaire") Integer idVolontaire
    //);

    //@Query("SELECT MAX(r.id.sequence) FROM Rdv r WHERE r.id.idEtude = :idEtude AND r.id.idRdv = :idRdv")
    //Integer findMaxSequenceByEtudeAndRdv(
    //        @Param("idEtude") Integer idEtude,
    //        @Param("idRdv") Integer idRdv
    //);
}