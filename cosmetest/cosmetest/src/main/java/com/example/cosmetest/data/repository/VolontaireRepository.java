package com.example.cosmetest.data.repository;

import com.example.cosmetest.domain.model.Volontaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.List;

/**
 * Repository pour l'accès aux données de l'entité Volontaire
 */
@Repository
public interface VolontaireRepository extends JpaRepository<Volontaire, Integer> {

    Page<Volontaire> findByArchiveFalse(Pageable pageable);
    Page<Volontaire> findAll(Pageable pageable);

    /**
     * Trouve des volontaires par nom
     * @param nomVol le nom du volontaire
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findByNomVol(String nomVol);

    /**
     * Trouve des volontaires par prénom
     * @param prenomVol le prénom du volontaire
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findByPrenomVol(String prenomVol);

    /**
     * Trouve des volontaires par nom et prénom
     * @param nomVol le nom du volontaire
     * @param prenomVol le prénom du volontaire
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findByNomVolAndPrenomVol(String nomVol, String prenomVol);

    /**
     * Trouve des volontaires par email
     * @param emailVol l'email du volontaire
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findByEmailVol(String emailVol);

    /**
     * Trouve des volontaires par sexe
     * @param sexe le sexe du volontaire
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findBySexe(String sexe);

    /**
     * Trouve des volontaires par ethnie
     * @param ethnie l'ethnie du volontaire
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findByEthnie(String ethnie);

    /**
     * Trouve des volontaires par ville
     * @param villeVol la ville du volontaire
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findByVilleVol(String villeVol);

    /**
     * Trouve des volontaires par code postal
     * @param cpVol le code postal du volontaire
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findByCpVol(String cpVol);

    /**
     * Trouve des volontaires par état d'archivage
     * @param archive l'état d'archivage (true/false)
     * @return la liste des volontaires trouvés
     */
    List<Volontaire> findByArchive(Boolean archive);

    /**
     * Trouve des volontaires par plage d'âge
     * @param dateDebut la date de naissance maximale (pour l'âge minimum)
     * @param dateFin la date de naissance minimale (pour l'âge maximum)
     * @return la liste des volontaires dont la date de naissance est comprise entre les deux dates
     */
    @Query("SELECT v FROM Volontaire v WHERE v.dateNaissance BETWEEN :dateFin AND :dateDebut")
    List<Volontaire> findByAgeBetween(@Param("dateDebut") Date dateDebut, @Param("dateFin") Date dateFin);

    /**
     * Recherche fulltext utilisant l'index idx_fulltext_vol
     * Cette méthode tire parti de l'index défini sur les colonnes:
     * nom_vol, prenom_vol, tel_domicile_vol, tel_portable_vol, email_vol
     *
     * @param keyword mot-clé de recherche (avec wildcards % déjà ajoutés)
     * @param pageable configuration de pagination
     * @return page de volontaires correspondant au critère de recherche
     */
    @Query(value = "SELECT v FROM Volontaire v WHERE " +
            "LOWER(v.nomVol) LIKE LOWER(:keyword) OR " +
            "LOWER(v.prenomVol) LIKE LOWER(:keyword) OR " +
            "CAST(v.telDomicileVol AS string) LIKE :keyword OR " +
            "CAST(v.telPortableVol AS string) LIKE :keyword OR " +
            "LOWER(v.emailVol) LIKE LOWER(:keyword)")
    Page<Volontaire> findByFullTextSearch(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Version SQL native optimisée exploitant directement l'index fulltext
     * Cette méthode est plus efficace pour les grandes bases de données
     *
     * @param keyword mot-clé de recherche (avec wildcards % déjà ajoutés)
     * @param pageable configuration de pagination
     * @return page de volontaires correspondant au critère de recherche
     */
    @Query(value = "SELECT * FROM volontaire WHERE " +
            "LOWER(nom_vol) LIKE LOWER(:keyword) OR " +
            "LOWER(prenom_vol) LIKE LOWER(:keyword) OR " +
            "CAST(tel_domicile_vol AS CHAR) LIKE :keyword OR " +
            "CAST(tel_portable_vol AS CHAR) LIKE :keyword OR " +
            "LOWER(email_vol) LIKE LOWER(:keyword)",
            countQuery = "SELECT COUNT(*) FROM volontaire WHERE " +
                    "LOWER(nom_vol) LIKE LOWER(:keyword) OR " +
                    "LOWER(prenom_vol) LIKE LOWER(:keyword) OR " +
                    "CAST(tel_domicile_vol AS CHAR) LIKE :keyword OR " +
                    "CAST(tel_portable_vol AS CHAR) LIKE :keyword OR " +
                    "LOWER(email_vol) LIKE LOWER(:keyword)",
            nativeQuery = true)
    Page<Volontaire> findByFullTextSearchNative(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Trouve des volontaires par phototype
     * @param phototype le phototype recherché
     * @return la liste des volontaires correspondants
     */
    List<Volontaire> findByPhototype(String phototype);

    /**
     * Trouve des volontaires compatibles pour les études de santé
     * @param santeCompatible la valeur de compatibilité (Oui/Non)
     * @return la liste des volontaires correspondants
     */
    List<Volontaire> findBySanteCompatible(String santeCompatible);

    /**
     * Trouve des volontaires par type de peau du visage
     * @param typePeauVisage le type de peau recherché
     * @return la liste des volontaires correspondants
     */
    List<Volontaire> findByTypePeauVisage(String typePeauVisage);

    /**
     * Trouve les volontaires qui ont déclaré avoir de l'acné
     * @param acne la valeur de l'acné (Oui/Non)
     * @return la liste des volontaires correspondants
     */
    List<Volontaire> findByAcne(String acne);

    /**
     * Recherche de volontaires par texte (recherche plein texte)
     * @param searchText le texte à rechercher
     * @return la liste des volontaires correspondant à la recherche
     */
    @Query(value = "SELECT * FROM volontaire v WHERE " +
            "LOWER(v.nom_vol) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.prenom_vol) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(v.email_vol) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "CAST(v.tel_domicile_vol AS CHAR) LIKE CONCAT('%', :searchText, '%') OR " +
            "CAST(v.tel_portable_vol AS CHAR) LIKE CONCAT('%', :searchText, '%'))",
            nativeQuery = true)
    List<Volontaire> searchVolontaires(@Param("searchText") String searchText);

    /**
     * Compte le nombre de volontaires non archivés
     * @return le nombre de volontaires actifs
     */
    int countByArchive(boolean archive);

    @Query("SELECT COUNT(v) FROM Volontaire v WHERE v.dateI BETWEEN :startDate AND :endDate")
    int countByDateIBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT v FROM Volontaire v ORDER BY v.dateI DESC")
    List<Volontaire> findRecentVolontaires(Pageable pageable);

    @Query("SELECT v FROM Volontaire v WHERE " +
            "(LOWER(v.nomVol) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(v.prenomVol) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(v.emailVol) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Volontaire> searchAll(@Param("search") String search, Pageable pageable);

    @Query("SELECT v FROM Volontaire v WHERE v.archive = false AND " +
            "(LOWER(v.nomVol) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(v.prenomVol) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(v.emailVol) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Volontaire> searchActive(@Param("search") String search, Pageable pageable);

    public abstract java.util.List<Volontaire> findAllByIdVolIn(java.util.List<Integer> ids);}
