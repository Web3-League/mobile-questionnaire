package com.example.cosmetest.business.mapper;

import com.example.cosmetest.business.dto.EtudeVolontaireDTO;
import com.example.cosmetest.domain.model.EtudeVolontaire;
import com.example.cosmetest.domain.model.EtudeVolontaireId;

import org.springframework.stereotype.Component;

/**
 * Mapper pour convertir entre les entités EtudeVolontaire et les DTOs
 * Cette classe fait partie de la couche BLL et assure la transformation
 * des objets entre la couche de données et la couche de présentation
 */
@Component
public class EtudeVolontaireMapper {

    /**
     * Convertit une entité EtudeVolontaire en DTO
     * @param etudeVolontaire Entité EtudeVolontaire
     * @return DTO correspondant
     */
    public EtudeVolontaireDTO toDto(EtudeVolontaire etudeVolontaire) {
        if (etudeVolontaire == null || etudeVolontaire.getId() == null) {
            return null;
        }

        EtudeVolontaireId id = etudeVolontaire.getId();
        EtudeVolontaireDTO dto = new EtudeVolontaireDTO();
        dto.setIdEtude(id.getIdEtude());
        dto.setIdGroupe(id.getIdGroupe());
        dto.setIdVolontaire(id.getIdVolontaire());
        dto.setIv(id.getIv());
        dto.setNumsujet(id.getNumsujet());
        dto.setPaye(id.getPaye());
        dto.setStatut(id.getStatut());

        return dto;
    }

    /**
     * Convertit un DTO en entité EtudeVolontaire
     * @param dto DTO à convertir
     * @return Entité EtudeVolontaire correspondante
     */
    public EtudeVolontaire toEntity(EtudeVolontaireDTO dto) {
        if (dto == null) {
            return null;
        }

        EtudeVolontaireId id = new EtudeVolontaireId();
        id.setIdEtude(dto.getIdEtude());
        id.setIdGroupe(dto.getIdGroupe());
        id.setIdVolontaire(dto.getIdVolontaire());
        id.setIv(dto.getIv());
        id.setNumsujet(dto.getNumsujet());
        id.setPaye(dto.getPaye());
        id.setStatut(dto.getStatut());

        return new EtudeVolontaire(id);
    }

    /**
     * Met à jour l'identifiant d'une entité existante avec les valeurs du DTO
     * @param dto DTO contenant les nouvelles valeurs
     * @param etudeVolontaire Entité à mettre à jour
     * @return Entité mise à jour
     */
    public EtudeVolontaire updateEntityFromDto(EtudeVolontaireDTO dto, EtudeVolontaire etudeVolontaire) {
        if (dto == null || etudeVolontaire == null) {
            return etudeVolontaire;
        }

        EtudeVolontaireId id = etudeVolontaire.getId();
        if (id == null) {
            id = new EtudeVolontaireId();
            etudeVolontaire.setId(id);
        }

        id.setIdEtude(dto.getIdEtude());
        id.setIdGroupe(dto.getIdGroupe());
        id.setIdVolontaire(dto.getIdVolontaire());
        id.setIv(dto.getIv());
        id.setNumsujet(dto.getNumsujet());
        id.setPaye(dto.getPaye());
        id.setStatut(dto.getStatut());

        return etudeVolontaire;
    }
}