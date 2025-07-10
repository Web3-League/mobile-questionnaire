package com.example.cosmetest.presentation.controller;

import com.example.cosmetest.business.dto.VolontaireDTO;
import com.example.cosmetest.business.dto.VolontaireDetailDTO;
import com.example.cosmetest.business.service.VolontaireService;
import com.example.cosmetest.domain.model.Volontaire;
import com.example.cosmetest.utils.ReflectionUtils;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.io.ByteArrayOutputStream;
import java.util.stream.Collectors;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Contrôleur REST pour la gestion des volontaires
 */
@RestController
@RequestMapping("/api/volontaires")
public class VolontaireController {

    private static final Logger logger = LoggerFactory.getLogger(VolontaireController.class);
    private final VolontaireService volontaireService;

    public VolontaireController(VolontaireService volontaireService) {
        this.volontaireService = volontaireService;
    }

    /**
     * Récupère tous les volontaires
     *
     * @return liste des volontaires
     */
    @GetMapping
    public ResponseEntity<Page<VolontaireDTO>> getAllVolontaires(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean includeArchived,
            @RequestParam(required = false) String search) {

        logger.info("Récupération des volontaires : page={}, size={}, includeArchived={}, search={}",
                page, size, includeArchived, search);

        Page<VolontaireDTO> volontaires = volontaireService.getVolontairesPaginated(page, size, includeArchived, search);
        return ResponseEntity.ok(volontaires);
    }

    /**
     * Récupère tous les volontaires sans pagination pour le matching
     *
     * @return liste complète des volontaires
     */
    @GetMapping("/allstats")
    public ResponseEntity<List<VolontaireDTO>> getAllVolontairesForMatching(
            @RequestParam(defaultValue = "false") boolean includeArchived) {

        logger.info("Récupération de tous les volontaires pour matching : includeArchived={}", includeArchived);

        List<VolontaireDTO> volontaires;

        if (includeArchived) {
            // Utiliser la méthode existante sans paramètre
            volontaires = volontaireService.getAllVolontaires();
        } else {
            // Filtrer manuellement les volontaires archivés
            volontaires = volontaireService.getAllVolontaires()
                    .stream()
                    .filter(v -> !Boolean.TRUE.equals(v.getArchive()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(volontaires);
    }


    /**
     * Récupère tous les volontaires actifs (non archivés)
     *
     * @return liste des volontaires actifs
     */
    @GetMapping("/actifs")
    public ResponseEntity<List<VolontaireDTO>> getAllActiveVolontaires() {
        List<VolontaireDTO> volontaires = volontaireService.getAllActiveVolontaires();
        return ResponseEntity.ok(volontaires);
    }

    /**
     * Récupère un volontaire par son ID (version simplifiée)
     *
     * @param id l'identifiant du volontaire
     * @return le volontaire correspondant
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getVolontaireById(@PathVariable Integer id) {
        logger.info("Recherche du volontaire avec l'ID: {}", id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        return volontaireService.getVolontaireById(id)
                .map(volontaire -> {
                    // Utiliser la réflexion pour convertir en Map adaptée au frontend
                    Map<String, Object> frontendData = ReflectionUtils.convertDtoToFrontendMap(volontaire);

                    // Vérifier que l'ID est bien présent
                    if (!frontendData.containsKey("id")) {
                        logger.warn("Conversion DTO -> Map n'a pas généré d'ID valide");
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Erreur lors de la récupération de l'ID du volontaire");
                    }

                    return ResponseEntity.ok(frontendData);
                })
                .orElseGet(() -> {
                    logger.warn("Volontaire non trouvé avec l'ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    /**
     * Récupère un volontaire par son ID (version détaillée)
     *
     * @param id l'identifiant du volontaire
     * @return le volontaire détaillé correspondant
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<VolontaireDetailDTO> getVolontaireDetailById(@PathVariable Integer id) {
        logger.info("Recherche des détails du volontaire avec l'ID: {}", id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        return volontaireService.getVolontaireDetailById(id)
                .map(volontaireDetail -> {
                    logger.info("Détails du volontaire trouvés avec l'ID: {}", id);
                    return ResponseEntity.ok(volontaireDetail);
                })
                .orElseGet(() -> {
                    logger.warn("Détails du volontaire non trouvés avec l'ID: {}", id);
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Volontaire détaillé non trouvé avec l'ID: " + id);
                });
    }

    /**
     * Crée un nouveau volontaire (version simplifiée)
     *
     * @param volontaireDTO les données du volontaire à créer
     * @return le volontaire créé
     */
    @PostMapping
    public ResponseEntity<VolontaireDTO> createVolontaire(@Valid @RequestBody VolontaireDTO volontaireDTO) {
        logger.info("Création d'un nouveau volontaire");
        try {
            VolontaireDTO createdVolontaire = volontaireService.createVolontaire(volontaireDTO);
            logger.info("Volontaire créé avec l'ID: {}", createdVolontaire.getVolontaireId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVolontaire);
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors de la création du volontaire: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    /**
     * Crée un nouveau volontaire (version détaillée)
     *
     * @param volontaireDetailDTO les données détaillées du volontaire à créer
     * @return le volontaire détaillé créé
     */
    @PostMapping("/details")
    public ResponseEntity<VolontaireDetailDTO> createVolontaireDetail(@Valid @RequestBody VolontaireDetailDTO volontaireDetailDTO) {
        logger.info("Création d'un nouveau volontaire détaillé");

        // Vérifie si volontaireId est défini lorsque c'est un objet détaillé pour un volontaire existant
        if (volontaireDetailDTO.getVolontaireId() != null) {
            logger.info("Vérification de l'existence du volontaire avec l'ID: {}", volontaireDetailDTO.getVolontaireId());
        }

        try {
            VolontaireDetailDTO createdVolontaire = volontaireService.createVolontaireDetail(volontaireDetailDTO);
            logger.info("Volontaire détaillé créé avec l'ID: {}", createdVolontaire.getVolontaireId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVolontaire);
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors de la création du volontaire détaillé: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    /**
     * Met à jour un volontaire existant (version simplifiée)
     *
     * @param id l'identifiant du volontaire à mettre à jour
     * @param volontaireDTO les nouvelles données du volontaire
     * @return le volontaire mis à jour
     */
    @PutMapping("/{id}")
    public ResponseEntity<VolontaireDTO> updateVolontaire(@PathVariable Integer id, @Valid @RequestBody VolontaireDTO volontaireDTO) {
        logger.info("Mise à jour du volontaire avec l'ID: {}", id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        try {
            return volontaireService.updateVolontaire(id, volontaireDTO)
                    .map(updatedVolontaire -> {
                        logger.info("Volontaire mis à jour avec l'ID: {}", id);
                        return ResponseEntity.ok(updatedVolontaire);
                    })
                    .orElseGet(() -> {
                        logger.warn("Volontaire non trouvé pour la mise à jour avec l'ID: {}", id);
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Volontaire non trouvé avec l'ID: " + id);
                    });
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors de la mise à jour du volontaire: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    /**
     * Met à jour un volontaire existant (version détaillée)
     *
     * @param id l'identifiant du volontaire à mettre à jour
     * @param volontaireDetailDTO les nouvelles données détaillées du volontaire
     * @return le volontaire détaillé mis à jour
     */
    @PutMapping("/{id}/details")
    public ResponseEntity<VolontaireDetailDTO> updateVolontaireDetail(@PathVariable Integer id, @Valid @RequestBody VolontaireDetailDTO volontaireDetailDTO) {
        logger.info("Mise à jour des détails du volontaire avec l'ID: {}", id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        try {
            return volontaireService.updateVolontaireDetail(id, volontaireDetailDTO)
                    .map(updatedDetail -> {
                        logger.info("Détails du volontaire mis à jour avec l'ID: {}", id);
                        return ResponseEntity.ok(updatedDetail);
                    })
                    .orElseGet(() -> {
                        logger.warn("Détails du volontaire non trouvés pour la mise à jour avec l'ID: {}", id);
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Volontaire détaillé non trouvé avec l'ID: " + id);
                    });
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors de la mise à jour des détails du volontaire: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    /**
     * Archive un volontaire
     *
     * @param id l'identifiant du volontaire à archiver
     * @return le volontaire archivé
     */
    @PutMapping("/{id}/archive")
    public ResponseEntity<VolontaireDTO> archiveVolontaire(@PathVariable Integer id) {
        logger.info("Archivage du volontaire avec l'ID: {}", id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        return volontaireService.toggleArchiveVolontaire(id, true)
                .map(archivedVolontaire -> {
                    logger.info("Volontaire archivé avec l'ID: {}", id);
                    return ResponseEntity.ok(archivedVolontaire);
                })
                .orElseGet(() -> {
                    logger.warn("Volontaire non trouvé pour l'archivage avec l'ID: {}", id);
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Volontaire non trouvé avec l'ID: " + id);
                });
    }

    /**
     * Désarchive un volontaire
     *
     * @param id l'identifiant du volontaire à désarchiver
     * @return le volontaire désarchivé
     */
    @PutMapping("/{id}/unarchive")
    public ResponseEntity<VolontaireDTO> unarchiveVolontaire(@PathVariable Integer id) {
        logger.info("Désarchivage du volontaire avec l'ID: {}", id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        return volontaireService.toggleArchiveVolontaire(id, false)
                .map(unarchivedVolontaire -> {
                    logger.info("Volontaire désarchivé avec l'ID: {}", id);
                    return ResponseEntity.ok(unarchivedVolontaire);
                })
                .orElseGet(() -> {
                    logger.warn("Volontaire non trouvé pour le désarchivage avec l'ID: {}", id);
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Volontaire non trouvé avec l'ID: " + id);
                });
    }

    /**
     * Supprime un volontaire
     *
     * @param id l'identifiant du volontaire à supprimer
     * @return statut de la suppression
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVolontaire(@PathVariable Integer id) {
        logger.info("Suppression du volontaire avec l'ID: {}", id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        if (volontaireService.deleteVolontaire(id)) {
            logger.info("Volontaire supprimé avec l'ID: {}", id);
            return ResponseEntity.noContent().build();
        } else {
            logger.warn("Volontaire non trouvé pour la suppression avec l'ID: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Volontaire non trouvé avec l'ID: " + id);
        }
    }

    /**
     * Recherche les volontaires par mot-clé utilisant l'index fulltext
     * Recherche dans nom, prénom, téléphones et email
     *
     * @param keyword mot-clé de recherche
     * @param page numéro de page (pagination)
     * @param size taille de la page (pagination)
     * @return liste des volontaires correspondants au critère de recherche
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchVolontaires(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        logger.info("Recherche de volontaires avec le mot-clé: {}", keyword);

        if (keyword == null || keyword.trim().isEmpty()) {
            logger.warn("Recherche avec un mot-clé vide");
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Le mot-clé de recherche ne peut pas être vide"
            ));
        }

        try {
            // Utilisation du service pour rechercher les volontaires
            Page<VolontaireDTO> results = volontaireService.searchVolontaires(keyword, PageRequest.of(page, size));

            logger.info("Recherche complétée, {} résultats trouvés", results.getTotalElements());

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Erreur lors de la recherche de volontaires: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Une erreur est survenue lors de la recherche de volontaires",
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Gestionnaire d'exception pour les erreurs de conversion de type de paramètre
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String paramName = ex.getName();
        String value = (ex.getValue() != null) ? ex.getValue().toString() : "null";

        // Log détaillé de l'erreur
        logger.error("Erreur de conversion du paramètre '{}' avec la valeur '{}': {}",
                paramName, value, ex.getMessage());

        // Vérification spécifique pour le cas 'undefined'
        if ("undefined".equals(value)) {
            logger.error("Tentative d'accès avec ID 'undefined'. Cette erreur provient généralement du frontend.");

            Map<String, Object> responseBody = Map.of(
                    "timestamp", LocalDate.now(),
                    "status", HttpStatus.BAD_REQUEST.value(),
                    "error", "Bad Request",
                    "message", "ID invalide: 'undefined'. Veuillez fournir un ID valide.",
                    "path", (ex.getParameter() != null && ex.getParameter().getMethod() != null)
                            ? ex.getParameter().getMethod().toString()
                            : "unknown"
            );

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
        }

        // Réponse pour les autres types d'erreurs de conversion
        Map<String, Object> responseBody = Map.of(
                "timestamp", LocalDate.now(),
                "status", HttpStatus.BAD_REQUEST.value(),
                "error", "Bad Request",
                "message", "Erreur de format pour le paramètre: " + paramName + ". La valeur '" + value + "' ne peut pas être convertie.",
                "path", (ex.getParameter() != null && ex.getParameter().getMethod() != null)
                        ? ex.getParameter().getMethod().toString()
                        : "unknown"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    /**
     * Récupère les informations d'une photo d'un volontaire
     *
     * @param id l'identifiant du volontaire
     * @param type le type de photo (face, droite, gauche, etc.)
     * @return l'URL de la photo ou une réponse appropriée si la photo n'existe pas
     */
    @GetMapping("/{id}/photos/{type}")
    public ResponseEntity<?> getVolontairePhoto(@PathVariable Integer id, @PathVariable String type) {
        logger.info("Récupération de la photo de type '{}' pour le volontaire avec l'ID: {}", type, id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        try {
            Map<String, Object> photoInfo = volontaireService.getVolontairePhoto(id, type);

            if (photoInfo == null) {
                logger.warn("Volontaire non trouvé avec l'ID: {} ou type de photo non reconnu: {}", id, type);
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(photoInfo);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de la photo: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de la récupération de la photo", "error", e.getMessage()));
        }
    }

    /**
     * Récupère toutes les photos disponibles pour un volontaire
     *
     * @param id l'identifiant du volontaire
     * @return la liste des photos disponibles pour ce volontaire
     */
    @GetMapping("/{id}/photos")
    public ResponseEntity<?> getAllVolontairePhotos(@PathVariable Integer id) {
        logger.info("Récupération de toutes les photos pour le volontaire avec l'ID: {}", id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        try {
            // Récupérer d'abord les infos du volontaire pour l'inclure dans la réponse
            return volontaireService.getVolontaireById(id)
                    .map(volontaire -> {
                        List<Map<String, Object>> photos = volontaireService.getAllVolontairePhotos(id);

                        Map<String, Object> response = new HashMap<>();
                        response.put("volontaireId", id);
                        response.put("nom", volontaire.getNomVol());
                        response.put("dateNaissance", volontaire.getDateNaissance());
                        response.put("photoCount", photos.size());
                        response.put("photos", photos);

                        if (photos.isEmpty()) {
                            response.put("message", "Aucune photo disponible pour ce volontaire");
                        }

                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        logger.warn("Volontaire non trouvé avec l'ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des photos: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de la récupération des photos", "error", e.getMessage()));
        }
    }

    /**
     * Récupère directement l'image d'une photo d'un volontaire
     *
     * @param id l'identifiant du volontaire
     * @param type le type de photo (face, droite, gauche, etc.)
     * @return l'image de la photo ou une réponse 404 si elle n'existe pas
     */
    @GetMapping("/{id}/photos/{type}/image")
    public ResponseEntity<byte[]> getVolontairePhotoImage(@PathVariable Integer id, @PathVariable String type) {
        logger.info("Récupération de l'image de type '{}' pour le volontaire avec l'ID: {}", type, id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        try {
            Map<String, Object> photoInfo = volontaireService.getVolontairePhoto(id, type);

            if (photoInfo == null || !(Boolean) photoInfo.get("exists")) {
                logger.warn("Photo non trouvée pour le volontaire ID: {} et le type: {}", id, type);
                return ResponseEntity.notFound().build();
            }

            String photoUrl = (String) photoInfo.get("photoUrl");
            // Télécharger l'image
            URI uri = URI.create(photoUrl);
            URL url = uri.toURL();
            URLConnection connection = url.openConnection();
            try (InputStream inputStream = connection.getInputStream()) {
                // Convertir l'image en tableau d'octets
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                byte[] imageBytes = outputStream.toByteArray();

                // Configurer les en-têtes HTTP
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG);
                headers.setCacheControl(CacheControl.maxAge(1, TimeUnit.DAYS));
                headers.setPragma("cache");

                logger.info("Image récupérée avec succès pour le volontaire ID: {} et le type: {}", id, type);
                return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'image: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère directement la miniature d'une photo d'un volontaire
     *
     * @param id l'identifiant du volontaire
     * @param type le type de photo (face, droite, gauche, etc.)
     * @return la miniature de la photo ou une réponse 404 si elle n'existe pas
     */
    @GetMapping("/{id}/photos/{type}/thumbnail")
    public ResponseEntity<byte[]> getVolontairePhotoThumbnail(@PathVariable Integer id, @PathVariable String type) {
        logger.info("Récupération de la miniature de type '{}' pour le volontaire avec l'ID: {}", type, id);

        if (id == null) {
            logger.error("ID de volontaire invalide: null");
            return ResponseEntity.badRequest().build();
        }

        try {
            Map<String, Object> photoInfo = volontaireService.getVolontairePhoto(id, type);

            if (photoInfo == null || !(Boolean) photoInfo.get("exists")) {
                logger.warn("Photo non trouvée pour le volontaire ID: {} et le type: {}", id, type);
                return ResponseEntity.notFound().build();
            }

            String photoUrl = (String) photoInfo.get("photoUrl");

            // Télécharger l'image
            URI uri = URI.create(photoUrl);
            URL url = uri.toURL();
            URLConnection connection = url.openConnection();
            try (InputStream inputStream = connection.getInputStream()) {
                // Convertir l'image en tableau d'octets
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                byte[] imageBytes = outputStream.toByteArray();

                // Configurer les en-têtes HTTP
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG);
                headers.setCacheControl(CacheControl.maxAge(1, TimeUnit.DAYS));
                headers.setPragma("cache");

                logger.info("Miniature récupérée avec succès pour le volontaire ID: {} et le type: {}", id, type);
                return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de la miniature: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    /**
     * Récupère plusieurs volontaires par leurs identifiants
     * @param ids Liste d'identifiants séparés par des virgules
     * @return Liste de volontaires
     */
    @GetMapping("/ids/{ids}")
    public ResponseEntity<List<Volontaire>> getVolontairesByIds(@PathVariable String ids) {
        try {
            // Convertir la chaîne d'IDs en liste d'entiers
            List<Integer> idList = Arrays.stream(ids.split(","))
                    .map(String::trim)
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());

            // Récupérer les volontaires
            List<Volontaire> volontaires = volontaireService.findAllByIdIn(idList);

            // Renvoyer la liste des volontaires
            return ResponseEntity.ok(volontaires);
        } catch (NumberFormatException e) {
            // Gérer les erreurs de format d'ID
            return ResponseEntity.badRequest().build();
        }
    }
}