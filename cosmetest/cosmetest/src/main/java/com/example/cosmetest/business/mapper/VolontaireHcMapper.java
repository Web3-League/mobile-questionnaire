package com.example.cosmetest.business.mapper;

import com.example.cosmetest.business.dto.VolontaireHcDTO;
import com.example.cosmetest.domain.model.VolontaireHc;
import com.example.cosmetest.domain.model.VolontaireHcId;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper pour convertir entre l'entité VolontaireHc et VolontaireHcDTO
 */
@Component
public class VolontaireHcMapper {

    /**
     * Convertit une entité VolontaireHc en VolontaireHcDTO
     *
     * @param volontaireHc l'entité à convertir
     * @return le DTO correspondant
     */
    public VolontaireHcDTO toDTO(VolontaireHc volontaireHc) {
        if (volontaireHc == null || volontaireHc.getId() == null) {
            return null;
        }

        VolontaireHcId id = volontaireHc.getId();
        VolontaireHcDTO dto = new VolontaireHcDTO();

        // ID du volontaire
        dto.setIdVol(id.getIdVol());

        // Lieux d'achat
        dto.setAchatGrandesSurfaces(id.getAchatGrandesSurfaces());
        dto.setAchatInstitutParfumerie(id.getAchatInstitutParfumerie());
        dto.setAchatInternet(id.getAchatInternet());
        dto.setAchatPharmacieParapharmacie(id.getAchatPharmacieParapharmacie());

        // Produits d'hygiène et soins
        dto.setAntiTranspirant(id.getAntiTranspirant());
        dto.setApresRasage(id.getApresRasage());
        dto.setApresShampoing(id.getApresShampoing());
        dto.setAutobronzant(id.getAutobronzant());
        dto.setCire(id.getCire());
        dto.setCremeDepilatoire(id.getCremeDepilatoire());
        dto.setDeodorant(id.getDeodorant());
        dto.setDissolvantOngles(id.getDissolvantOngles());
        dto.setEauDeToilette(id.getEauDeToilette());
        dto.setEpilateurElectrique(id.getEpilateurElectrique());
        dto.setEpilationDefinitive(id.getEpilationDefinitive());
        dto.setExtensionsCapillaires(id.getExtensionsCapillaires());
        dto.setGelARaser(id.getGelARaser());
        dto.setGelDouche(id.getGelDouche());
        dto.setGelNettoyant(id.getGelNettoyant());
        dto.setGommageCorps(id.getGommageCorps());
        dto.setGommageVisage(id.getGommageVisage());
        dto.setInstitut(id.getInstitut());
        dto.setLaitDouche(id.getLaitDouche());
        dto.setLissageDefrisage(id.getLissageDefrisage());
        dto.setLotionMicellaire(id.getLotionMicellaire());
        dto.setManucures(id.getManucures());
        dto.setMasqueCapillaire(id.getMasqueCapillaire());
        dto.setMasqueCorps(id.getMasqueCorps());
        dto.setMasqueVisage(id.getMasqueVisage());
        dto.setMousseARaser(id.getMousseARaser());
        dto.setNettoyantIntime(id.getNettoyantIntime());
        dto.setOmbreBarbe(id.getOmbreBarbe());
        dto.setParfum(id.getParfum());
        dto.setPermanente(id.getPermanente());
        dto.setProduitCoiffantFixant(id.getProduitCoiffantFixant());
        dto.setProduitsBain(id.getProduitsBain());
        dto.setProduitsBio(id.getProduitsBio());
        dto.setProtecteurSolaireCorps(id.getProtecteurSolaireCorps());
        dto.setProtecteurSolaireLevres(id.getProtecteurSolaireLevres());
        dto.setProtecteurSolaireVisage(id.getProtecteurSolaireVisage());
        dto.setRasoir(id.getRasoir());
        dto.setRasoirElectrique(id.getRasoirElectrique());
        dto.setRasoirMecanique(id.getRasoirMecanique());
        dto.setSavon(id.getSavon());
        dto.setShampoing(id.getShampoing());
        dto.setTondeuseBarbe(id.getTondeuseBarbe());
        dto.setTonique(id.getTonique());

        // Produits de maquillage
        dto.setAnticerne(id.getAnticerne());
        dto.setBaseMaquillage(id.getBaseMaquillage());
        dto.setBlushFardAJoues(id.getBlushFardAJoues());
        dto.setCorrecteurTeint(id.getCorrecteurTeint());
        dto.setCrayonLevres(id.getCrayonLevres());
        dto.setCrayonsYeux(id.getCrayonsYeux());
        dto.setCremeTeintee(id.getCremeTeintee());
        dto.setDemaquillantVisage(id.getDemaquillantVisage());
        dto.setDemaquillantWaterproof(id.getDemaquillantWaterproof());
        dto.setDemaquillantYeux(id.getDemaquillantYeux());
        dto.setEyeliner(id.getEyeliner());
        dto.setFardAPaupieres(id.getFardAPaupieres());
        dto.setFauxCils(id.getFauxCils());
        dto.setFauxOngles(id.getFauxOngles());
        dto.setFondDeTeint(id.getFondDeTeint());
        dto.setGloss(id.getGloss());
        dto.setMaquillageDesSourcils(id.getMaquillageDesSourcils());
        dto.setMaquillagePermanentLevres(id.getMaquillagePermanentLevres());
        dto.setMaquillagePermanentSourcils(id.getMaquillagePermanentSourcils());
        dto.setMaquillagePermanentYeux(id.getMaquillagePermanentYeux());
        dto.setMascara(id.getMascara());
        dto.setMascaraWaterproof(id.getMascaraWaterproof());
        dto.setPoudreLibre(id.getPoudreLibre());
        dto.setRougeALevres(id.getRougeALevres());
        dto.setVernisAOngles(id.getVernisAOngles());

        // Produits de soin
        dto.setColorationMeches(id.getColorationMeches());
        dto.setSoinAmincissant(id.getSoinAmincissant());
        dto.setSoinAntiAgeCorps(id.getSoinAntiAgeCorps());
        dto.setSoinAntiAgeMains(id.getSoinAntiAgeMains());
        dto.setSoinAntiAgeVisage(id.getSoinAntiAgeVisage());
        dto.setSoinAntiCellulite(id.getSoinAntiCellulite());
        dto.setSoinAntiRidesVisage(id.getSoinAntiRidesVisage());
        dto.setSoinAntiRougeursVisage(id.getSoinAntiRougeursVisage());
        dto.setSoinAntiTachesDecollete(id.getSoinAntiTachesDecollete());
        dto.setSoinAntiTachesMains(id.getSoinAntiTachesMains());
        dto.setSoinAntiTachesVisage(id.getSoinAntiTachesVisage());
        dto.setSoinAntiVergetures(id.getSoinAntiVergetures());
        dto.setSoinApresSoleil(id.getSoinApresSoleil());
        dto.setSoinContourDesLevres(id.getSoinContourDesLevres());
        dto.setSoinContourDesYeux(id.getSoinContourDesYeux());
        dto.setSoinEclatDuTeint(id.getSoinEclatDuTeint());
        dto.setSoinHydratantCorps(id.getSoinHydratantCorps());
        dto.setSoinHydratantMains(id.getSoinHydratantMains());
        dto.setSoinHydratantVisage(id.getSoinHydratantVisage());
        dto.setSoinMatifiantVisage(id.getSoinMatifiantVisage());
        dto.setSoinNourissantVisage(id.getSoinNourissantVisage());
        dto.setSoinNourrissantCorps(id.getSoinNourrissantCorps());
        dto.setSoinNourrissantMains(id.getSoinNourrissantMains());
        dto.setSoinOngles(id.getSoinOngles());
        dto.setSoinPieds(id.getSoinPieds());
        dto.setSoinRaffermissantCorps(id.getSoinRaffermissantCorps());
        dto.setSoinRaffermissantVisage(id.getSoinRaffermissantVisage());

        return dto;
    }

    /**
     * Convertit un VolontaireHcDTO en entité VolontaireHc
     *
     * @param dto le DTO à convertir
     * @return l'entité correspondante
     */
    public VolontaireHc toEntity(VolontaireHcDTO dto) {
        if (dto == null) {
            return null;
        }

        VolontaireHcId id = new VolontaireHcId();

        // ID du volontaire
        id.setIdVol(dto.getIdVol());

        // Lieux d'achat
        id.setAchatGrandesSurfaces(dto.getAchatGrandesSurfaces());
        id.setAchatInstitutParfumerie(dto.getAchatInstitutParfumerie());
        id.setAchatInternet(dto.getAchatInternet());
        id.setAchatPharmacieParapharmacie(dto.getAchatPharmacieParapharmacie());

        // Produits d'hygiène et soins
        id.setAntiTranspirant(dto.getAntiTranspirant());
        id.setApresRasage(dto.getApresRasage());
        id.setApresShampoing(dto.getApresShampoing());
        id.setAutobronzant(dto.getAutobronzant());
        id.setCire(dto.getCire());
        id.setCremeDepilatoire(dto.getCremeDepilatoire());
        id.setDeodorant(dto.getDeodorant());
        id.setDissolvantOngles(dto.getDissolvantOngles());
        id.setEauDeToilette(dto.getEauDeToilette());
        id.setEpilateurElectrique(dto.getEpilateurElectrique());
        id.setEpilationDefinitive(dto.getEpilationDefinitive());
        id.setExtensionsCapillaires(dto.getExtensionsCapillaires());
        id.setGelARaser(dto.getGelARaser());
        id.setGelDouche(dto.getGelDouche());
        id.setGelNettoyant(dto.getGelNettoyant());
        id.setGommageCorps(dto.getGommageCorps());
        id.setGommageVisage(dto.getGommageVisage());
        id.setInstitut(dto.getInstitut());
        id.setLaitDouche(dto.getLaitDouche());
        id.setLissageDefrisage(dto.getLissageDefrisage());
        id.setLotionMicellaire(dto.getLotionMicellaire());
        id.setManucures(dto.getManucures());
        id.setMasqueCapillaire(dto.getMasqueCapillaire());
        id.setMasqueCorps(dto.getMasqueCorps());
        id.setMasqueVisage(dto.getMasqueVisage());
        id.setMousseARaser(dto.getMousseARaser());
        id.setNettoyantIntime(dto.getNettoyantIntime());
        id.setOmbreBarbe(dto.getOmbreBarbe());
        id.setParfum(dto.getParfum());
        id.setPermanente(dto.getPermanente());
        id.setProduitCoiffantFixant(dto.getProduitCoiffantFixant());
        id.setProduitsBain(dto.getProduitsBain());
        id.setProduitsBio(dto.getProduitsBio());
        id.setProtecteurSolaireCorps(dto.getProtecteurSolaireCorps());
        id.setProtecteurSolaireLevres(dto.getProtecteurSolaireLevres());
        id.setProtecteurSolaireVisage(dto.getProtecteurSolaireVisage());
        id.setRasoir(dto.getRasoir());
        id.setRasoirElectrique(dto.getRasoirElectrique());
        id.setRasoirMecanique(dto.getRasoirMecanique());
        id.setSavon(dto.getSavon());
        id.setShampoing(dto.getShampoing());
        id.setTondeuseBarbe(dto.getTondeuseBarbe());
        id.setTonique(dto.getTonique());

        // Produits de maquillage
        id.setAnticerne(dto.getAnticerne());
        id.setBaseMaquillage(dto.getBaseMaquillage());
        id.setBlushFardAJoues(dto.getBlushFardAJoues());
        id.setCorrecteurTeint(dto.getCorrecteurTeint());
        id.setCrayonLevres(dto.getCrayonLevres());
        id.setCrayonsYeux(dto.getCrayonsYeux());
        id.setCremeTeintee(dto.getCremeTeintee());
        id.setDemaquillantVisage(dto.getDemaquillantVisage());
        id.setDemaquillantWaterproof(dto.getDemaquillantWaterproof());
        id.setDemaquillantYeux(dto.getDemaquillantYeux());
        id.setEyeliner(dto.getEyeliner());
        id.setFardAPaupieres(dto.getFardAPaupieres());
        id.setFauxCils(dto.getFauxCils());
        id.setFauxOngles(dto.getFauxOngles());
        id.setFondDeTeint(dto.getFondDeTeint());
        id.setGloss(dto.getGloss());
        id.setMaquillageDesSourcils(dto.getMaquillageDesSourcils());
        id.setMaquillagePermanentLevres(dto.getMaquillagePermanentLevres());
        id.setMaquillagePermanentSourcils(dto.getMaquillagePermanentSourcils());
        id.setMaquillagePermanentYeux(dto.getMaquillagePermanentYeux());
        id.setMascara(dto.getMascara());
        id.setMascaraWaterproof(dto.getMascaraWaterproof());
        id.setPoudreLibre(dto.getPoudreLibre());
        id.setRougeALevres(dto.getRougeALevres());
        id.setVernisAOngles(dto.getVernisAOngles());

        // Produits de soin
        id.setColorationMeches(dto.getColorationMeches());
        id.setSoinAmincissant(dto.getSoinAmincissant());
        id.setSoinAntiAgeCorps(dto.getSoinAntiAgeCorps());
        id.setSoinAntiAgeMains(dto.getSoinAntiAgeMains());
        id.setSoinAntiAgeVisage(dto.getSoinAntiAgeVisage());
        id.setSoinAntiCellulite(dto.getSoinAntiCellulite());
        id.setSoinAntiRidesVisage(dto.getSoinAntiRidesVisage());
        id.setSoinAntiRougeursVisage(dto.getSoinAntiRougeursVisage());
        id.setSoinAntiTachesDecollete(dto.getSoinAntiTachesDecollete());
        id.setSoinAntiTachesMains(dto.getSoinAntiTachesMains());
        id.setSoinAntiTachesVisage(dto.getSoinAntiTachesVisage());
        id.setSoinAntiVergetures(dto.getSoinAntiVergetures());
        id.setSoinApresSoleil(dto.getSoinApresSoleil());
        id.setSoinContourDesLevres(dto.getSoinContourDesLevres());
        id.setSoinContourDesYeux(dto.getSoinContourDesYeux());
        id.setSoinEclatDuTeint(dto.getSoinEclatDuTeint());
        id.setSoinHydratantCorps(dto.getSoinHydratantCorps());
        id.setSoinHydratantMains(dto.getSoinHydratantMains());
        id.setSoinHydratantVisage(dto.getSoinHydratantVisage());
        id.setSoinMatifiantVisage(dto.getSoinMatifiantVisage());
        id.setSoinNourissantVisage(dto.getSoinNourissantVisage());
        id.setSoinNourrissantCorps(dto.getSoinNourrissantCorps());
        id.setSoinNourrissantMains(dto.getSoinNourrissantMains());
        id.setSoinOngles(dto.getSoinOngles());
        id.setSoinPieds(dto.getSoinPieds());
        id.setSoinRaffermissantCorps(dto.getSoinRaffermissantCorps());
        id.setSoinRaffermissantVisage(dto.getSoinRaffermissantVisage());

        return new VolontaireHc(id);
    }

    /**
     * Convertit une liste d'entités VolontaireHc en liste de VolontaireHcDTO
     *
     * @param volontaireHcs la liste d'entités
     * @return la liste de DTOs
     */
    public List<VolontaireHcDTO> toDTOList(List<VolontaireHc> volontaireHcs) {
        return volontaireHcs.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Met à jour une entité VolontaireHc existante avec les données d'un VolontaireHcDTO
     * Pour VolontaireHc, comme l'identifiant contient toutes les données, c'est une opération de remplacement complet
     *
     * @param entity l'entité à mettre à jour
     * @param dto les données à appliquer
     * @return l'entité mise à jour
     */
    public VolontaireHc updateEntityFromDTO(VolontaireHc entity, VolontaireHcDTO dto) {
        if (entity == null || dto == null) {
            return entity;
        }

        VolontaireHcId id = entity.getId();
        if (id == null) {
            id = new VolontaireHcId();
            entity.setId(id);
        }

        // Mettre à jour l'entité avec toutes les nouvelles valeurs du DTO
        VolontaireHc updatedEntity = toEntity(dto);
        entity.setId(updatedEntity.getId());

        return entity;
    }
}