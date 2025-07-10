package com.example.cosmetest.data.repository;

import com.example.cosmetest.domain.model.Etude;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'accès aux données des études
 * Fait partie de la couche d'accès aux données (DAL)
 */
@Repository
public interface EtudeRepository extends JpaRepository<Etude, Integer> {

    /**
     * Trouve une étude par sa référence
     * @param ref Référence de l'étude
     * @return Étude correspondante
     */
    Optional<Etude> findByRef(String ref);

    /**
     * Vérifie si une étude existe avec cette référence
     * @param ref Référence à vérifier
     * @return true si une étude existe avec cette référence
     */
    boolean existsByRef(String ref);

    /**
     * Trouve les études par type
     * @param type Type d'étude
     * @return Liste des études
     */
    List<Etude> findByType(String type);

    /**
     * Trouve les études dont le titre contient le mot-clé
     * @param keyword Mot-clé à rechercher
     * @return Liste des études
     */
    List<Etude> findByTitreContaining(String keyword);

    /**
     * Trouve les études entre deux dates
     * @param debut Date de début
     * @param fin Date de fin
     * @return Liste des études
     */
    @Query("SELECT e FROM Etude e WHERE e.dateDebut >= :debut AND e.dateFin <= :fin")
    List<Etude> findByDateDebutAndDateFin(@Param("debut") Date debut, @Param("fin") Date fin);

    /**
     * Trouve les études actives à une date donnée
     * @param date Date à vérifier
     * @return Liste des études
     */
    @Query("SELECT e FROM Etude e WHERE e.dateDebut <= :date AND e.dateFin > :date")
    List<Etude> findActiveEtudesAtDate(@Param("date") LocalDate date);


    /**
     * Trouve les études par indicateur de paiement
     * @param paye Indicateur de paiement (1 pour payé, 0 pour non payé)
     * @return Liste des études
     */
    List<Etude> findByPaye(int paye);

    /**
     * Recherche en texte intégral dans le titre et les commentaires
     * @param searchTerm Terme de recherche
     * @return Liste des études
     */
    @Query("SELECT e FROM Etude e WHERE e.titre LIKE %:searchTerm% OR e.commentaires LIKE %:searchTerm% OR e.ref LIKE %:searchTerm%")
    List<Etude> searchByTitreOrCommentairesOrRef(@Param("searchTerm") String searchTerm);

    /**
     * Compte le nombre d'études par type
     * @param type Type d'étude
     * @return Nombre d'études
     */
    @Query("SELECT COUNT(e) FROM Etude e WHERE e.type = :type")
    Long countByType(@Param("type") String type);

    /**
     * Recherche des études dont la date de fin est après la date spécifiée
     * @param date Date de référence
     * @return Liste des études
     */
    List<Etude> findByDateFinAfter(Date date);

    /**
     * Recherche des études dont la date de début est avant la date spécifiée
     * @param date Date de référence
     * @return Liste des études
     */
    List<Etude> findByDateDebutBefore(Date date);

    /**
     * Recherche des études dont la date de fin est avant la date spécifiée
     * @param date Date de référence
     * @return Liste des études terminées
     */
    List<Etude> findByDateFinBefore(Date date);

    /**
     * Recherche des études dont la date de début est après la date spécifiée
     * @param date Date de référence
     * @return Liste des études à venir
     */
    List<Etude> findByDateDebutAfter(Date date);

    List<Etude> findByRefContainingIgnoreCaseOrTitreContainingIgnoreCase(
            String ref,
            String titre,
            Pageable pageable
    );

    @Query("SELECT COUNT(e) FROM Etude e WHERE :today BETWEEN e.dateDebut AND e.dateFin")
    long countCurrentEtudes(@Param("today") LocalDate today);

}