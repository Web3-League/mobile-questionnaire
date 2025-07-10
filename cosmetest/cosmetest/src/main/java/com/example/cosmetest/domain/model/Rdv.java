package com.example.cosmetest.domain.model;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "rdv", indexes = {
		@Index(name = "idx_id_volontaire", columnList = "idVolontaire"),
		@Index(name = "idx_date", columnList = "date"),
		@Index(name = "idx_id_volontaire_date", columnList = "idVolontaire, date"),
		@Index(name = "idx_uuid", columnList = "uuid", unique = true)
})
public class Rdv {

	@EmbeddedId
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private RdvId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idEtude", referencedColumnName = "ID_ETUDE", insertable = false, updatable = false)
	private Etude etude;

	private Integer idVolontaire;
	private Integer idGroupe;
	private Date date;
	private String heure;
	private String etat;
	private String commentaires;

	public Rdv() {
	}

	public Rdv(RdvId id) {
		this.id = id;
	}

	public Rdv(RdvId id, Integer idVolontaire, Integer idGroupe, Date date, String heure, String etat,
			String commentaires) {
		this.id = id;
		this.idVolontaire = idVolontaire;
		this.idGroupe = idGroupe;
		this.date = date;
		this.heure = heure;
		this.etat = etat;
		this.commentaires = commentaires;
	}

	public RdvId getId() {
		return this.id;
	}

	public void setId(RdvId id) {
		this.id = id;
	}

	public Integer getIdVolontaire() {
		return this.idVolontaire;
	}

	public void setIdVolontaire(Integer idVolontaire) {
		this.idVolontaire = idVolontaire;
	}

	public Integer getIdGroupe() {
		return this.idGroupe;
	}

	public void setIdGroupe(Integer idGroupe) {
		this.idGroupe = idGroupe;
	}

	public Date getDate() {
		return this.date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getHeure() {
		return this.heure;
	}

	public void setHeure(String heure) {
		this.heure = heure;
	}

	public String getEtat() {
		return this.etat;
	}

	public void setEtat(String etat) {
		this.etat = etat;
	}

	public String getCommentaires() {
		return this.commentaires;
	}

	public void setCommentaires(String commentaires) {
		this.commentaires = commentaires;
	}

	public Etude getEtude() {
		return this.etude;
	}

	public void setEtude(Etude etude) {
		this.etude = etude;
	}

}