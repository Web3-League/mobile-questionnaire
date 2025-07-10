package com.example.cosmetest.data.repository;

import com.example.cosmetest.domain.model.VolontaireHc;
import com.example.cosmetest.domain.model.VolontaireHcId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'accès aux données de l'entité VolontaireHc
 */
@Repository
public interface VolontaireHcRepository extends JpaRepository<VolontaireHc, VolontaireHcId> {

    /**
     * Trouve toutes les habitudes de consommation associées à un volontaire
     * 
     * @param idVol l'identifiant du volontaire
     * @return les habitudes de consommation du volontaire
     */
    Optional<VolontaireHc> findByIdIdVol(int idVol);

    /**
     * Vérifie si des habitudes de consommation existent pour un volontaire
     * 
     * @param idVol l'identifiant du volontaire
     * @return true si des habitudes existent, false sinon
     */
    boolean existsByIdIdVol(int idVol);

    /**
     * Méthodes pour trouver par lieu d'achat spécifique
     */
    List<VolontaireHc> findByIdAchatGrandesSurfaces(String valeur);

    List<VolontaireHc> findByIdAchatInstitutParfumerie(String valeur);

    List<VolontaireHc> findByIdAchatInternet(String valeur);

    List<VolontaireHc> findByIdAchatPharmacieParapharmacie(String valeur);

    List<VolontaireHc> findByIdIdVolIn(List<Integer> idList);

    @Query(value = "SELECT * FROM volontaire_hc WHERE id_vol = :idVol", nativeQuery = true)
    Optional<VolontaireHc> findByNativeSql(@Param("idVol") Integer idVol);
}