package com.example.cosmetest.domain.model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "etude", indexes = {
		@Index(name = "idx_etude_ref", columnList = "ref"),
		@Index(name = "idx_fulltext_etude", columnList = "titre, commentaires")
})
public class Etude implements java.io.Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID_ETUDE")
	private Integer idEtude;

	@Column(name = "REF", nullable = false)
	private String ref;

	private String type;
	private String titre;

	private Date dateDebut;
	private Date dateFin;
	private String washout;
	private String commentaires;
	private String examens;

	// Renommer en capaciteVolontaires et changer le type en Integer
	@Column(name = "NB_SUJETS")
	private Integer capaciteVolontaires;

	private int paye;

	// ========== RELATIONS EXISTANTES ==========
	@OneToMany(mappedBy = "etude", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Rdv> rdvs = new ArrayList<>();

	// ========== NOUVELLES RELATIONS ==========

	// Relation vers les groupes de cette étude
	@OneToMany(mappedBy = "idEtude", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Groupe> groupes = new ArrayList<>();

	// Relation vers toutes les associations etude_volontaire de cette étude
	@OneToMany(mappedBy = "id.idEtude", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<EtudeVolontaire> volontairesParticipants = new ArrayList<>();

	public Etude() {
	}

	public Etude(String ref, Date dateDebut, Date dateFin, int paye) {
		this.ref = ref;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.paye = paye;
	}

	public Etude(String ref, String type, String titre, String description, Date dateDebut, Date dateFin,
			String commentaires, Integer capaciteVolontaires, int paye, Integer montant) {
		this.ref = ref;
		this.type = type;
		this.titre = titre;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.commentaires = commentaires;
		this.capaciteVolontaires = capaciteVolontaires;
		this.paye = paye;
	}

	public Integer getIdEtude() {
		return this.idEtude;
	}

	public void setIdEtude(Integer idEtude) {
		this.idEtude = idEtude;
	}

	public String getRef() {
		return this.ref;
	}

	public void setRef(String ref) {
		this.ref = ref;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTitre() {
		return this.titre;
	}

	public void setTitre(String titre) {
		this.titre = titre;
	}

	public Date getDateDebut() {
		return this.dateDebut;
	}

	public void setDateDebut(Date dateDebut) {
		this.dateDebut = dateDebut;
	}

	public Date getDateFin() {
		return this.dateFin;
	}

	public void setDateFin(Date dateFin) {
		this.dateFin = dateFin;
	}

	public String getWashout() {
		return this.washout;
	}

	public void setWashout(String washout) {
		this.washout = washout;
	}

	public String getCommentaires() {
		return this.commentaires;
	}

	public void setCommentaires(String commentaires) {
		this.commentaires = commentaires;
	}

	public String getExamens() {
		return this.examens;
	}

	public void setExamens(String examens) {
		this.examens = examens;
	}

	public Integer getCapaciteVolontaires() {
		return this.capaciteVolontaires;
	}

	public void setCapaciteVolontaires(Integer capaciteVolontaires) {
		this.capaciteVolontaires = capaciteVolontaires;
	}

	// Pour maintenir la compatibilité avec l'ancien code
	public String getNbSujets() {
		return this.capaciteVolontaires != null ? this.capaciteVolontaires.toString() : null;
	}

	public void setNbSujets(String nbSujets) {
		try {
			this.capaciteVolontaires = nbSujets != null ? Integer.parseInt(nbSujets) : null;
		} catch (NumberFormatException e) {
			this.capaciteVolontaires = null;
		}
	}

	public int getPaye() {
		return this.paye;
	}

	public void setPaye(int paye) {
		this.paye = paye;
	}

	public List<Rdv> getRdvs() {
		return rdvs;
	}

	public void setRdvs(List<Rdv> rdvs) {
		this.rdvs = rdvs;
	}

	public List<Groupe> getGroupes() {
		return groupes;
	}

	public void setGroupes(List<Groupe> groupes) {
		this.groupes = groupes;
	}

	public List<EtudeVolontaire> getVolontairesParticipants() {
		return volontairesParticipants;
	}

	public void setVolontairesParticipants(List<EtudeVolontaire> volontairesParticipants) {
		this.volontairesParticipants = volontairesParticipants;
	}

}