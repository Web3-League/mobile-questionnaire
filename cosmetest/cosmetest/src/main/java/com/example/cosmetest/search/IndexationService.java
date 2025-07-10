package com.example.cosmetest.search;

import com.example.cosmetest.business.dto.RdvDTO;
import com.example.cosmetest.data.repository.EtudeRepository;
import com.example.cosmetest.data.repository.RdvRepository;
import com.example.cosmetest.domain.model.Etude;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IndexationService {

    @Autowired
    private MeilisearchService meilisearchService;

    @Autowired
    private EtudeRepository etudeRepository; // Supposé être votre repository pour les études

    @Autowired
    private RdvRepository rdvRepository; // Supposé être votre repository pour les RDV

    public void indexAllData() {
        // Indexation des études
        List<Etude> etudes = etudeRepository.findAll();
        int etudesIndexed = meilisearchService.indexEtudes(etudes);
        System.out.println("Nombre d'études indexées : " + etudesIndexed);

        // Convertir Rdv en RdvDTO
        List<RdvDTO> rdvs = rdvRepository.findAll().stream()
                .map(rdv -> {
                    RdvDTO dto = new RdvDTO();
                    dto.setIdRdv(rdv.getId().getIdRdv());
                    dto.setIdEtude(rdv.getId().getIdEtude());
                    dto.setDate(rdv.getDate());
                    dto.setEtat(rdv.getEtat());
                    dto.setCommentaires(rdv.getCommentaires());
                    // Ajoutez d'autres champs selon votre modèle
                    return dto;
                })
                .collect(Collectors.toList());

        int rdvsIndexed = meilisearchService.indexRdvs(rdvs);
        System.out.println("Nombre de RDV indexés : " + rdvsIndexed);
    }

    // Méthode pour indexer de nouveaux éléments
    public void indexNewEtudes(List<Etude> newEtudes) {
        int etudesIndexed = meilisearchService.indexEtudes(newEtudes);
        System.out.println("Nouveaux études indexées : " + etudesIndexed);
    }

    public void indexNewRdvs(List<RdvDTO> newRdvs) {
        int rdvsIndexed = meilisearchService.indexRdvs(newRdvs);
        System.out.println("Nouveaux RDV indexés : " + rdvsIndexed);
    }
}