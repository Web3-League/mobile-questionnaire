package com.example.cosmetest.search;

import com.example.cosmetest.business.dto.RdvDTO;
import com.meilisearch.sdk.Client;
import com.meilisearch.sdk.Config;
import com.meilisearch.sdk.Index;
import com.meilisearch.sdk.model.Settings;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.cosmetest.domain.model.Etude;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Service pour gérer l'indexation et la recherche des études via Meilisearch
 */
@Service
public class MeilisearchService {

    @Value("${meilisearch.url:http://localhost:7700}")
    private String meilisearchUrl;

    @Value("${meilisearch.api-key:}")
    private String apiKey;

    @Value("${meilisearch.index.etudes:etudes}")
    private String etudesIndexName;

    private Client client;
    private Index etudesIndex;
    private final String rdvsIndexName = "rdvs"; // Index pour les RDV

    /**
     * Initialise la connexion à Meilisearch
     */
    @PostConstruct
    public void init() {
        try {
            // Configuration du client Meilisearch
            Config config = new Config(meilisearchUrl, apiKey);
            client = new Client(config);

            // Tenter de récupérer l'index
            try {
                etudesIndex = client.index(etudesIndexName);
                System.out.println("Index études existe déjà");
            } catch (Exception e) {
                // Si l'index n'existe pas, on tente de le créer
                System.out.println("Tentative de création de l'index études");
                client.createIndex(etudesIndexName, "idEtude");
                etudesIndex = client.index(etudesIndexName);
                configureEtudesIndex();
            }

            System.out.println("Meilisearch initialized successfully");
        } catch (Exception e) {
            System.err.println("Failed to initialize Meilisearch: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Configure l'index des études
     */
    private void configureEtudesIndex() {
        try {
            // Créer les paramètres
            Settings settings = new Settings();

            // Configurer les attributs recherchables
            String[] searchableAttributes = {"ref", "titre", "description"};
            settings.setSearchableAttributes(searchableAttributes);

            // Configurer les attributs filtrables
            String[] filterableAttributes = {"idEtude", "active", "dateCreation", "etudeRef"};
            settings.setFilterableAttributes(filterableAttributes);

            // Configurer les règles de classement
            String[] rankingRules = {"words", "typo", "proximity", "attribute", "sort", "exactness"};
            settings.setRankingRules(rankingRules);

            // Appliquer les paramètres
            etudesIndex.updateSettings(settings);

            System.out.println("Index configuration completed successfully");
        } catch (Exception e) {
            System.err.println("Failed to configure Meilisearch index: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Indexe ou met à jour une liste d'études dans Meilisearch
     *
     * @param etudes Liste des études à indexer
     * @return Nombre d'études indexées
     */
    public int indexEtudes(List<Etude> etudes) {
        try {
            if (etudes == null || etudes.isEmpty()) {
                return 0;
            }

            // Transformer les études en documents pour Meilisearch
            List<Map<String, Object>> documents = etudes.stream()
                    .map(this::convertEtudeToDocument)
                    .collect(Collectors.toList());

            // Indexer les documents
            String documentsJson = convertListToJson(documents);
            etudesIndex.addDocuments(documentsJson);

            return documents.size();
        } catch (Exception e) {
            System.err.println("Failed to index etudes: " + e.getMessage());
            return 0;
        }
    }

    /**
     * Convertit une liste en JSON
     */
    private String convertListToJson(List<Map<String, Object>> list) throws JSONException {
        JSONArray jsonArray = new JSONArray();
        for (Map<String, Object> item : list) {
            JSONObject jsonObject = new JSONObject();
            for (Map.Entry<String, Object> entry : item.entrySet()) {
                jsonObject.put(entry.getKey(), entry.getValue());
            }
            jsonArray.put(jsonObject);
        }
        return jsonArray.toString();
    }

    /**
     * Convertit une entité Etude en document pour Meilisearch
     */
    private Map<String, Object> convertEtudeToDocument(Etude etude) {
        Map<String, Object> document = new HashMap<>();
        document.put("idEtude", etude.getIdEtude());
        document.put("ref", etude.getRef());
        document.put("titre", etude.getTitre());

        // Adaptez ces champs selon la structure réelle de votre entité Etude
        // Utilisez uniquement les getters disponibles

        return document;
    }

    /**
     * Recherche des études par référence
     *
     * @param reference Référence d'étude à rechercher
     * @param limit Nombre maximum de résultats (par défaut 20)
     * @return Liste des études correspondantes
     */
    public List<Etude> searchEtudesByReference(String reference, int limit) {
        try {
            if (reference == null || reference.trim().isEmpty()) {
                return new ArrayList<>();
            }

            // Recherche simple avec le paramètre q
            String query = reference.trim();

            // Créer un objet JSON pour les paramètres de recherche
            JSONObject searchParams = new JSONObject();
            searchParams.put("q", query);
            searchParams.put("limit", limit);

            // Exécuter la recherche (retourne un objet SearchResult)
            // Adapter cette ligne selon comment votre API Meilisearch fonctionne
            Object searchResult = etudesIndex.rawSearch(searchParams.toString());

            // Convertir les résultats en liste d'études
            // Cela dépend du format de retour exact de votre API
            List<Etude> etudes = new ArrayList<>();

            // Implémentation à adapter selon la structure de votre SearchResult
            System.out.println("Search result: " + searchResult);

            // Retourner la liste des études trouvées
            return etudes;
        } catch (Exception e) {
            System.err.println("Failed to search etudes: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Vérifie si l'index RDV existe et le crée s'il n'existe pas
     */
    public boolean ensureRdvsIndexExists() {
        try {
            return true;
        } catch (Exception e) {
            // Si l'index n'existe pas, le créer
            if (e.getMessage().contains("Index") && e.getMessage().contains("not found")) {
                try {
                    // Créer l'index avec les paramètres appropriés
                    client.createIndex(rdvsIndexName, "compositeId");
                    Index rdvsIndex = client.index(rdvsIndexName);

                    // Configurer l'index
                    Settings settings = new Settings();

                    // Configurer les attributs recherchables
                    settings.setSearchableAttributes(new String[]{"commentaires", "etat", "date"});

                    // Configurer les attributs filtrables
                    settings.setFilterableAttributes(new String[]{"idEtude", "date", "etat"});

                    // Appliquer les paramètres
                    rdvsIndex.updateSettings(settings);

                    return true;
                } catch (Exception createError) {
                    System.err.println("Erreur lors de la création de l'index: " + createError.getMessage());
                    return false;
                }
            }
            System.err.println("Erreur lors de la vérification de l'index: " + e.getMessage());
            return false;
        }
    }

    /**
     * Indexe les RDV dans Meilisearch
     */
    public int indexRdvs(List<RdvDTO> rdvs) {
        if (!ensureRdvsIndexExists()) {
            System.err.println("Impossible de créer l'index 'rdvs'");
            return 0;
        }

        try {
            Index rdvsIndex = client.index(rdvsIndexName);

            // Convertir les RDV en documents pour Meilisearch
            List<Map<String, Object>> documents = new ArrayList<>();
            for (RdvDTO rdv : rdvs) {
                Map<String, Object> document = new HashMap<>();
                document.put("compositeId", rdv.getIdEtude() + "_" + rdv.getIdRdv());
                document.put("idEtude", rdv.getIdEtude());
                document.put("idRdv", rdv.getIdRdv());

                // Adapter selon les méthodes disponibles dans votre RdvDTO
                // Si getEtudeRef n'existe pas, utilisez un autre getter
                // document.put("etudeRef", rdv.getEtudeRef());

                // Alternative: si vous avez un autre getter pour l'information de l'étude
                try {
                    // Essayez d'appeler la méthode getEtudeRef par réflexion
                    java.lang.reflect.Method method = rdv.getClass().getMethod("getEtudeRef");
                    String etudeRef = (String) method.invoke(rdv);
                    document.put("etudeRef", etudeRef);
                } catch (NoSuchMethodException e) {
                    // Si getEtudeRef n'existe pas, essayer getEtude
                    try {
                        String etude = rdv.getEtudeRef();
                        document.put("etudeRef", etude);
                    } catch (Exception e2) {
                        // Si aucun getter approprié n'existe, utiliser une valeur par défaut
                        document.put("etudeRef", "");
                    }
                } catch (Exception e) {
                    document.put("etudeRef", "");
                }

                document.put("date", rdv.getDate().toString());
                document.put("etat", rdv.getEtat());
                document.put("commentaires", rdv.getCommentaires());
                documents.add(document);
            }

            // Convertir en JSON et indexer
            String documentsJson = convertListToJson(documents);
            rdvsIndex.addDocuments(documentsJson);

            return rdvs.size();
        } catch (Exception e) {
            System.err.println("Erreur lors de l'indexation des RDV: " + e.getMessage());
            return 0;
        }
    }

    /**
     * Recherche des RDV par référence d'étude via Meilisearch
     */
    public List<RdvDTO> searchRdvsByEtudeRef(String etudeRef, int limit) {
        List<RdvDTO> rdvs = new ArrayList<>();

        if (!ensureRdvsIndexExists()) {
            System.err.println("Impossible de trouver ou créer l'index 'rdvs'");
            return rdvs;
        }

        try {
            Index rdvsIndex = client.index(rdvsIndexName);

            JSONObject searchParams = new JSONObject();
            searchParams.put("q", "");  // Recherche vide, on utilise le filtre
            searchParams.put("limit", limit);
            searchParams.put("filter", "etudeRef = \"" + etudeRef + "\"");

            // Exécution de la recherche
            String rawResponse = rdvsIndex.rawSearch(searchParams.toString());
            if (rawResponse == null || rawResponse.isEmpty()) {
                System.err.println("Réponse vide de Meilisearch.");
                return rdvs;
            }

            JSONObject searchResult = new JSONObject(rawResponse);
            if (!searchResult.has("hits")) {
                System.err.println("Aucun résultat trouvé dans Meilisearch.");
                return rdvs;
            }

            JSONArray hits = searchResult.getJSONArray("hits");

            for (int i = 0; i < hits.length(); i++) {
                JSONObject json = hits.getJSONObject(i);

                RdvDTO rdv = new RdvDTO();
                rdv.setIdEtude(json.has("idEtude") ? json.getInt("idEtude") : null);
                rdv.setIdRdv(json.has("idRdv") ? json.getInt("idRdv") : null);
                rdv.setCommentaires(json.optString("commentaires", ""));
                rdv.setEtat(json.optString("etat", "INCONNU"));

                // Vérification et parsing sécurisé de la date
                String dateString = json.optString("date", "");
                if (!dateString.isEmpty()) {
                    try {
                        rdv.setDate(Date.valueOf(dateString)); // Vérifie que le format est correct
                    } catch (IllegalArgumentException e) {
                        System.err.println("Date invalide : " + dateString);
                    }
                }

                rdvs.add(rdv);
            }

            return rdvs;
        } catch (Exception e) {
            System.err.println("Erreur lors de la recherche des RDV par référence d'étude : " + e.getMessage());
            e.printStackTrace();
            return rdvs;
        }
    }


    /**
     * Vérifie si Meilisearch est opérationnel
     */
    public boolean isHealthy() {
        try {
            // Vérifier si le client peut récupérer des informations
            client.getIndexes();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Méthode pour réindexer tous les RDV
     */
    public int reindexAllRdvs(List<RdvDTO> allRdvs) {
        try {
            // Supprimer l'index s'il existe
            try {
                client.deleteIndex(rdvsIndexName);
            } catch (Exception e) {
                // Ignorer si l'index n'existe pas
            }

            // Créer un nouvel index et indexer tous les RDV
            return indexRdvs(allRdvs);
        } catch (Exception e) {
            System.err.println("Erreur lors de la réindexation: " + e.getMessage());
            return 0;
        }
    }

    /**
     * Supprime une étude de l'index
     */
    public boolean deleteEtude(String etudeId) {
        try {
            etudesIndex.deleteDocument(etudeId);
            return true;
        } catch (Exception e) {
            System.err.println("Failed to delete etude: " + e.getMessage());
            return false;
        }
    }

    /**
     * Vide complètement l'index des études
     */
    public void clearEtudesIndex() {
        try {
            etudesIndex.deleteAllDocuments();
        } catch (Exception e) {
            System.err.println("Failed to clear etudes index: " + e.getMessage());
        }
    }

    public List<Etude> searchEtudesByQuery(String query, int limit) {
        try {
            JSONObject searchParams = new JSONObject();
            searchParams.put("q", query);
            searchParams.put("limit", limit);

            JSONObject searchResult = new JSONObject(etudesIndex.rawSearch(searchParams.toString()).toString());
            JSONArray hits = searchResult.getJSONArray("hits");

            List<Etude> etudes = new ArrayList<>();

            for (int i = 0; i < hits.length(); i++) {
                JSONObject json = hits.getJSONObject(i);
                Etude etude = new Etude();
                etude.setIdEtude(json.optInt("idEtude"));
                etude.setRef(json.optString("ref"));
                etude.setTitre(json.optString("titre"));
                // Ajoute ici tous les attributs nécessaires

                etudes.add(etude);
            }

            return etudes;
        } catch (Exception e) {
            System.err.println("Erreur recherche Meilisearch: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Recherche d'études par mot-clé avec pagination
     * @param query Terme de recherche
     * @param page Numéro de page (commence à 0)
     * @param size Taille de la page
     * @return Liste d'études correspondant à la recherche
     */
    public List<Etude> searchEtudes(String query, int page, int size) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return new ArrayList<>();
            }

            // Calculer l'offset pour la pagination
            int offset = page * size;

            // Préparer les paramètres de recherche
            JSONObject searchParams = new JSONObject();
            searchParams.put("q", query.trim());
            searchParams.put("limit", size);
            searchParams.put("offset", offset);

            // Ajouter des paramètres de tri si nécessaire
            searchParams.put("sort", new String[]{"ref:asc"});

            // Exécuter la recherche
            String rawResponse = etudesIndex.rawSearch(searchParams.toString());
            if (rawResponse == null || rawResponse.isEmpty()) {
                System.err.println("Réponse vide de Meilisearch.");
                return new ArrayList<>();
            }

            JSONObject searchResult = new JSONObject(rawResponse);
            if (!searchResult.has("hits")) {
                System.err.println("Aucun résultat trouvé dans Meilisearch.");
                return new ArrayList<>();
            }

            JSONArray hits = searchResult.getJSONArray("hits");
            List<Etude> etudes = new ArrayList<>();

            for (int i = 0; i < hits.length(); i++) {
                JSONObject json = hits.getJSONObject(i);
                Etude etude = new Etude();

                // Remplir les propriétés de l'étude à partir du JSON
                etude.setIdEtude(json.optInt("idEtude"));
                etude.setRef(json.optString("ref", ""));
                etude.setTitre(json.optString("titre", ""));

                // Ajouter d'autres propriétés selon votre modèle d'étude
                // Par exemple, si vous avez une propriété "dateDebut" :
                try {
                    String dateDebutStr = json.optString("dateDebut", null);
                    if (dateDebutStr != null && !dateDebutStr.isEmpty()) {
                        etude.setDateDebut(Date.valueOf(dateDebutStr));
                    }
                } catch (Exception e) {
                    // Ignorer les dates invalides
                }

                // De même pour dateFin
                try {
                    String dateFinStr = json.optString("dateFin", null);
                    if (dateFinStr != null && !dateFinStr.isEmpty()) {
                        etude.setDateFin(Date.valueOf(dateFinStr));
                    }
                } catch (Exception e) {
                    // Ignorer les dates invalides
                }

                etudes.add(etude);
            }

            return etudes;
        } catch (Exception e) {
            System.err.println("Erreur lors de la recherche des études: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Compte le nombre total de résultats pour une recherche
     * @param query Terme de recherche
     * @return Nombre total de résultats
     */
    public long countEtudeResults(String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return 0;
            }

            // Préparer les paramètres de recherche pour juste compter les résultats
            JSONObject searchParams = new JSONObject();
            searchParams.put("q", query.trim());
            searchParams.put("limit", 1);  // On n'a besoin que du nombre total, pas des résultats

            // Exécuter la recherche
            String rawResponse = etudesIndex.rawSearch(searchParams.toString());
            if (rawResponse == null || rawResponse.isEmpty()) {
                System.err.println("Réponse vide de Meilisearch.");
                return 0;
            }

            JSONObject searchResult = new JSONObject(rawResponse);

            // Extraire le nombre total d'éléments
            // Selon la version de Meilisearch, le champ peut être "nbHits", "estimatedTotalHits" ou autre
            if (searchResult.has("nbHits")) {
                return searchResult.getLong("nbHits");
            } else if (searchResult.has("estimatedTotalHits")) {
                return searchResult.getLong("estimatedTotalHits");
            } else if (searchResult.has("totalHits")) {
                return searchResult.getLong("totalHits");
            } else {
                // Si aucun champ spécifique pour le nombre total n'est trouvé, essayer de compter les hits
                if (searchResult.has("hits")) {
                    return searchResult.getJSONArray("hits").length();
                }
            }

            return 0;
        } catch (Exception e) {
            System.err.println("Erreur lors du comptage des résultats: " + e.getMessage());
            e.printStackTrace();
            return 0;
        }
    }

}