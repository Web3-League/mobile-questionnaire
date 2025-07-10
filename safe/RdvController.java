package com.example.cosmetest.presentation.controller;

import com.example.cosmetest.business.dto.RdvDTO;
import com.example.cosmetest.business.service.RdvService;
import com.example.cosmetest.domain.model.RdvId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

/**
 * Contrôleur REST pour les rendez-vous
 * Fait partie de la couche de présentation et gère les requêtes HTTP
 */
@RestController
@RequestMapping("/api/rdvs")
public class RdvController {

    private final RdvService rdvService;

    @Autowired
    public RdvController(RdvService rdvService) {
        this.rdvService = rdvService;
    }

    /**
     * Récupère tous les rendez-vous
     * @return Liste de tous les rendez-vous
     */
    @GetMapping
    public ResponseEntity<List<RdvDTO>> getAllRdvs() {
        List<RdvDTO> rdvDTOs = rdvService.getAllRdvs();
        return ResponseEntity.ok(rdvDTOs);
    }

    /**
     * Récupère les rendez-vous avec pagination
     * @param page Numéro de page
     * @param size Taille de la page
     * @param sortBy Champ de tri
     * @param direction Direction du tri
     * @return Page de rendez-vous
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<RdvDTO>> getAllRdvsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<RdvDTO> rdvDTOPage = rdvService.getAllRdvsPaginated(pageable);

        return ResponseEntity.ok(rdvDTOPage);
    }

    /**
     * Récupère un rendez-vous par son ID
     * @param idEtude ID de l'étude
     * @param idRdv ID du rendez-vous
     * @return Le rendez-vous ou 404 si non trouvé
     */
    @GetMapping("/{idEtude}/{idRdv}")
    public ResponseEntity<RdvDTO> getRdvById(
            @PathVariable int idEtude,
            @PathVariable int idRdv) {

        RdvId rdvId = new RdvId(idEtude, idRdv);
        Optional<RdvDTO> rdvOpt = rdvService.getRdvById(rdvId);

        return rdvOpt
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupère les rendez-vous d'un volontaire
     * @param idVolontaire ID du volontaire
     * @return Liste des rendez-vous
     */
    @GetMapping("/volontaire/{idVolontaire}")
    public ResponseEntity<List<RdvDTO>> getRdvsByVolontaire(@PathVariable Integer idVolontaire) {
        List<RdvDTO> rdvDTOs = rdvService.getRdvsByVolontaire(idVolontaire);
        return ResponseEntity.ok(rdvDTOs);
    }

    /**
     * Récupère les rendez-vous à une date spécifique
     * @param date Date recherchée
     * @return Liste des rendez-vous
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<RdvDTO>> getRdvsByDate(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {

        List<RdvDTO> rdvDTOs = rdvService.getRdvsByDate(date);
        return ResponseEntity.ok(rdvDTOs);
    }

    /**
     * Récupère les rendez-vous d'un volontaire à une date spécifique
     * @param idVolontaire ID du volontaire
     * @param date Date recherchée
     * @return Liste des rendez-vous
     */
    @GetMapping("/volontaire/{idVolontaire}/date/{date}")
    public ResponseEntity<List<RdvDTO>> getRdvsByVolontaireAndDate(
            @PathVariable Integer idVolontaire,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {

        List<RdvDTO> rdvDTOs = rdvService.getRdvsByVolontaireAndDate(idVolontaire, date);
        return ResponseEntity.ok(rdvDTOs);
    }

    /**
     * Récupère les rendez-vous d'un volontaire sur une période
     * @param idVolontaire ID du volontaire
     * @param startDate Date de début
     * @param endDate Date de fin
     * @return Liste des rendez-vous
     */
    @GetMapping("/volontaire/{idVolontaire}/period")
    public ResponseEntity<List<RdvDTO>> getRdvsByVolontaireAndDateRange(
            @PathVariable Integer idVolontaire,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {

        List<RdvDTO> rdvDTOs = rdvService.getRdvsByVolontaireAndDateRange(idVolontaire, startDate, endDate);
        return ResponseEntity.ok(rdvDTOs);
    }

    /**
     * Récupère les rendez-vous d'un groupe
     * @param idGroupe ID du groupe
     * @return Liste des rendez-vous
     */
    @GetMapping("/groupe/{idGroupe}")
    public ResponseEntity<List<RdvDTO>> getRdvsByGroupe(@PathVariable Integer idGroupe) {
        List<RdvDTO> rdvDTOs = rdvService.getRdvsByGroupe(idGroupe);
        return ResponseEntity.ok(rdvDTOs);
    }

    /**
     * Récupère les rendez-vous par état
     * @param etat État recherché
     * @return Liste des rendez-vous
     */
    @GetMapping("/etat/{etat}")
    public ResponseEntity<List<RdvDTO>> getRdvsByEtat(@PathVariable String etat) {
        List<RdvDTO> rdvDTOs = rdvService.getRdvsByEtat(etat);
        return ResponseEntity.ok(rdvDTOs);
    }

    /**
     * Crée un nouveau rendez-vous
     * @param rdvDTO Données du rendez-vous
     * @return Rendez-vous créé
     */
    @PostMapping
    public ResponseEntity<RdvDTO> createRdv(@RequestBody RdvDTO rdvDTO) {
        RdvDTO savedRdv = rdvService.saveRdv(rdvDTO);
        return new ResponseEntity<>(savedRdv, HttpStatus.CREATED);
    }

    /**
     * Met à jour un rendez-vous existant
     * @param idEtude ID de l'étude
     * @param idRdv ID du rendez-vous
     * @param rdvDTO Nouvelles données
     * @return Rendez-vous mis à jour
     */
    @PutMapping("/{idEtude}/{idRdv}")
    public ResponseEntity<RdvDTO> updateRdv(
            @PathVariable int idEtude,
            @PathVariable int idRdv,
            @RequestBody RdvDTO rdvDTO) {

        // Vérifier que l'ID dans le chemin correspond à l'ID dans le DTO
        if (rdvDTO.getIdEtude() != idEtude || rdvDTO.getIdRdv() != idRdv) {
            return ResponseEntity.badRequest().build();
        }

        RdvId rdvId = new RdvId(idEtude, idRdv);

        // Vérifier que le RDV existe
        if (!rdvService.getRdvById(rdvId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        RdvDTO updatedRdv = rdvService.saveRdv(rdvDTO);

        return ResponseEntity.ok(updatedRdv);
    }

    /**
     * Supprime un rendez-vous
     * @param idEtude ID de l'étude
     * @param idRdv ID du rendez-vous
     * @return Réponse vide avec statut 204
     */
    @DeleteMapping("/{idEtude}/{idRdv}")
    public ResponseEntity<Void> deleteRdv(
            @PathVariable int idEtude,
            @PathVariable int idRdv) {

        RdvId rdvId = new RdvId(idEtude, idRdv);

        // Vérifier que le RDV existe
        if (!rdvService.getRdvById(rdvId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        rdvService.deleteRdv(rdvId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Met à jour l'état d'un rendez-vous
     * @param idEtude ID de l'étude
     * @param idRdv ID du rendez-vous
     * @param nouvelEtat Nouvel état
     * @return Réponse vide avec statut 200
     */
    @PatchMapping("/{idEtude}/{idRdv}/etat")
    public ResponseEntity<Void> updateRdvEtat(
            @PathVariable int idEtude,
            @PathVariable int idRdv,
            @RequestParam String nouvelEtat) {

        RdvId rdvId = new RdvId(idEtude, idRdv);

        // Vérifier que le RDV existe
        if (!rdvService.getRdvById(rdvId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        rdvService.updateRdvEtat(rdvId, nouvelEtat);
        return ResponseEntity.ok().build();
    }

    /**
     * Recherche avancée de rendez-vous avec plusieurs critères
     * Utilise les index définis sur les champs idVolontaire, date, etc.
     * @param idEtude Recherche par ID d'étude (optionnel)
     * @param idVolontaire Recherche par ID de volontaire (optionnel) - utilise l'index idx_id_volontaire
     * @param date Recherche par date (optionnel) - utilise l'index idx_date
     * @param etat Recherche par état (optionnel)
     * @param keyword Recherche par mot-clé dans les commentaires (optionnel)
     * @param page Numéro de page
     * @param size Taille de la page
     * @return Liste des rendez-vous correspondants aux critères
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchRdvs(
            @RequestParam(required = false) Integer idEtude,
            @RequestParam(required = false) Integer idVolontaire,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @RequestParam(required = false) String etat,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Préparation de la pagination
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));

        // Si tous les paramètres sont null, retourner tous les rendez-vous paginés
        if (idEtude == null && idVolontaire == null && date == null && etat == null
                && (keyword == null || keyword.trim().isEmpty())) {
            return ResponseEntity.ok(rdvService.getAllRdvsPaginated(pageable));
        }

        // Si on a à la fois idVolontaire et date, utiliser l'index combiné
        if (idVolontaire != null && date != null) {
            List<RdvDTO> rdvs = rdvService.getRdvsByVolontaireAndDate(idVolontaire, date);

            // Appliquer les autres filtres si nécessaire
            if (idEtude != null) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getIdEtude() == idEtude)
                        .toList();
            }

            if (etat != null) {
                rdvs = rdvs.stream()
                        .filter(rdv -> etat.equals(rdv.getEtat()))
                        .toList();
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getCommentaires() != null &&
                                rdv.getCommentaires().toLowerCase().contains(keyword.toLowerCase()))
                        .toList();
            }

            // Effectuer la pagination manuellement
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), rdvs.size());

            if (start >= rdvs.size()) {
                return ResponseEntity.ok(Page.empty());
            }

            return ResponseEntity.ok(new PageImpl<>(
                    rdvs.subList(start, end),
                    pageable,
                    rdvs.size()));
        }

        // Si on a seulement idVolontaire, utiliser l'index correspondant
        if (idVolontaire != null) {
            List<RdvDTO> rdvs = rdvService.getRdvsByVolontaire(idVolontaire);

            // Appliquer les autres filtres
            if (idEtude != null) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getIdEtude() == idEtude)
                        .toList();
            }

            if (etat != null) {
                rdvs = rdvs.stream()
                        .filter(rdv -> etat.equals(rdv.getEtat()))
                        .toList();
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getCommentaires() != null &&
                                rdv.getCommentaires().toLowerCase().contains(keyword.toLowerCase()))
                        .toList();
            }

            // Effectuer la pagination manuellement
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), rdvs.size());

            if (start >= rdvs.size()) {
                return ResponseEntity.ok(Page.empty());
            }

            return ResponseEntity.ok(new PageImpl<>(
                    rdvs.subList(start, end),
                    pageable,
                    rdvs.size()));
        }

        // Si on a seulement la date, utiliser l'index correspondant
        if (date != null) {
            List<RdvDTO> rdvs = rdvService.getRdvsByDate(date);

            // Appliquer les autres filtres
            if (idEtude != null) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getIdEtude() == idEtude)
                        .toList();
            }

            if (etat != null) {
                rdvs = rdvs.stream()
                        .filter(rdv -> etat.equals(rdv.getEtat()))
                        .toList();
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getCommentaires() != null &&
                                rdv.getCommentaires().toLowerCase().contains(keyword.toLowerCase()))
                        .toList();
            }

            // Effectuer la pagination manuellement
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), rdvs.size());

            if (start >= rdvs.size()) {
                return ResponseEntity.ok(Page.empty());
            }

            return ResponseEntity.ok(new PageImpl<>(
                    rdvs.subList(start, end),
                    pageable,
                    rdvs.size()));
        }

        // Si on a seulement l'état
        if (etat != null) {
            List<RdvDTO> rdvs = rdvService.getRdvsByEtat(etat);

            // Appliquer les autres filtres
            if (idEtude != null) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getIdEtude() == idEtude)
                        .toList();
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getCommentaires() != null &&
                                rdv.getCommentaires().toLowerCase().contains(keyword.toLowerCase()))
                        .toList();
            }

            // Effectuer la pagination manuellement
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), rdvs.size());

            if (start >= rdvs.size()) {
                return ResponseEntity.ok(Page.empty());
            }

            return ResponseEntity.ok(new PageImpl<>(
                    rdvs.subList(start, end),
                    pageable,
                    rdvs.size()));
        }

        // Si on a seulement idEtude
        if (idEtude != null) {
            List<RdvDTO> rdvs = rdvService.getAllRdvs().stream()
                    .filter(rdv -> rdv.getIdEtude() == idEtude)
                    .toList();

            // Appliquer d'autres filtres si nécessaire
            if (keyword != null && !keyword.trim().isEmpty()) {
                rdvs = rdvs.stream()
                        .filter(rdv -> rdv.getCommentaires() != null &&
                                rdv.getCommentaires().toLowerCase().contains(keyword.toLowerCase()))
                        .toList();
            }

            // Effectuer la pagination manuellement
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), rdvs.size());

            if (start >= rdvs.size()) {
                return ResponseEntity.ok(Page.empty());
            }

            return ResponseEntity.ok(new PageImpl<>(
                    rdvs.subList(start, end),
                    pageable,
                    rdvs.size()));
        }

        // Si on a seulement le mot-clé, utiliser la recherche existante
        if (keyword != null && !keyword.trim().isEmpty()) {
            List<RdvDTO> rdvs = rdvService.searchRdvsByCommentaires(keyword);

            // Effectuer la pagination manuellement
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), rdvs.size());

            if (start >= rdvs.size()) {
                return ResponseEntity.ok(Page.empty());
            }

            return ResponseEntity.ok(new PageImpl<>(
                    rdvs.subList(start, end),
                    pageable,
                    rdvs.size()));
        }

        // Fallback - ne devrait jamais arriver étant donné les conditions ci-dessus
        return ResponseEntity.ok(rdvService.getAllRdvsPaginated(pageable));
    }
}