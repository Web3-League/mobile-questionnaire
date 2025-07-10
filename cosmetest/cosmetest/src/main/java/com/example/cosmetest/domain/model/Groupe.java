package com.example.cosmetest.domain.model;
// Generated 15 d�c. 2024, 15:56:41 by Hibernate Tools 6.5.1.Final

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity // Indique que cette classe est une entité JPA
@Table(name = "groupe") // Permet de spécifier le nom de la table
public class Groupe implements java.io.Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID_GROUPE")
	private Integer idGroupe;
	private int idEtude;
	private String intitule;
	private String description;
	private int ageMinimum;
	private int ageMaximum;
	private String ethnie;
	private int nbSujet;
	private int iv;

	// ========== NOUVELLES RELATIONS ==========

	// Relation vers l'étude parente
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idEtude", insertable = false, updatable = false)
	private Etude etude;

	// Relation vers les associations etude_volontaire
	@OneToMany(mappedBy = "id.idGroupe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<EtudeVolontaire> volontairesAssignes = new ArrayList<>();

	public Groupe() {
	}

	public Groupe(int idEtude, String intitule, int ageMinimum, int ageMaximum, int nbSujet, int iv) {
		this.idEtude = idEtude;
		this.intitule = intitule;
		this.ageMinimum = ageMinimum;
		this.ageMaximum = ageMaximum;
		this.nbSujet = nbSujet;
		this.iv = iv;
	}

	public Groupe(int idEtude, String intitule, String description, int ageMinimum, int ageMaximum, String ethnie,
			int nbSujet, int iv) {
		this.idEtude = idEtude;
		this.intitule = intitule;
		this.description = description;
		this.ageMinimum = ageMinimum;
		this.ageMaximum = ageMaximum;
		this.ethnie = ethnie;
		this.nbSujet = nbSujet;
		this.iv = iv;
	}

	public Integer getIdGroupe() {
		return this.idGroupe;
	}

	public void setIdGroupe(Integer idGroupe) {
		this.idGroupe = idGroupe;
	}

	public int getIdEtude() {
		return this.idEtude;
	}

	public void setIdEtude(int idEtude) {
		this.idEtude = idEtude;
	}

	public String getIntitule() {
		return this.intitule;
	}

	public void setIntitule(String intitule) {
		this.intitule = intitule;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getAgeMinimum() {
		return this.ageMinimum;
	}

	public void setAgeMinimum(int ageMinimum) {
		this.ageMinimum = ageMinimum;
	}

	public int getAgeMaximum() {
		return this.ageMaximum;
	}

	public void setAgeMaximum(int ageMaximum) {
		this.ageMaximum = ageMaximum;
	}

	public String getEthnie() {
		return this.ethnie;
	}

	public void setEthnie(String ethnie) {
		this.ethnie = ethnie;
	}

	public int getNbSujet() {
		return this.nbSujet;
	}

	public void setNbSujet(int nbSujet) {
		this.nbSujet = nbSujet;
	}

	public int getIv() {
		return this.iv;
	}

	public void setIv(int iv) {
		this.iv = iv;
	}

	public Etude getEtude() {
		return etude;
	}

	public void setEtude(Etude etude) {
		this.etude = etude;
	}

	public List<EtudeVolontaire> getVolontairesAssignes() {
		return volontairesAssignes;
	}

	public void setVolontairesAssignes(List<EtudeVolontaire> volontairesAssignes) {
		this.volontairesAssignes = volontairesAssignes;
	}
}
