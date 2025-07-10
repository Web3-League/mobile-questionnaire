package com.example.cosmetest.domain.model;

import jakarta.persistence.*;

@Entity // Indique que cette classe est une entité JPA
@Table(name = "etude_volontaire") // Nom de la table dans la base de données
public class EtudeVolontaire {

	@EmbeddedId
	private EtudeVolontaireId id;

	// Relation vers l'étude
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_etude", insertable = false, updatable = false)
	private Etude etude;

	// Relation vers le groupe
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_groupe", insertable = false, updatable = false)
	private Groupe groupe;

	// Relation vers le volontaire
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_volontaire", insertable = false, updatable = false)
	private Volontaire volontaire;

	public EtudeVolontaire() {
	}

	public EtudeVolontaire(EtudeVolontaireId id) {
		this.id = id;
	}

	public EtudeVolontaireId getId() {
		return this.id;
	}

	public void setId(EtudeVolontaireId id) {
		this.id = id;
	}

	public Etude getEtude() {
		return etude;
	}

	public void setEtude(Etude etude) {
		this.etude = etude;
	}

	public Groupe getGroupe() {
		return groupe;
	}

	public void setGroupe(Groupe groupe) {
		this.groupe = groupe;
	}

	public Volontaire getVolontaire() {
		return volontaire;
	}

	public void setVolontaire(Volontaire volontaire) {
		this.volontaire = volontaire;
	}
}
