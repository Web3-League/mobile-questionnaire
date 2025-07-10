package com.example.cosmetest.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class RdvId implements Serializable {

	@Column(name = "idEtude")
	private Integer idEtude;

	@Column(name = "idRdv")
	private Integer idRdv;

	//@Column(name = "sequence")
	//private Integer sequence;

	// Constructeur par défaut
	public RdvId() {
	}

	// Constructeur avec paramètres
	public RdvId(Integer idEtude, Integer idRdv, Integer sequence) {
		this.idEtude = idEtude;
		this.idRdv = idRdv;
		//this.sequence = sequence;
	}

	public RdvId(Integer idEtude, Integer idRdv) {
		this.idEtude = idEtude;
		this.idRdv = idRdv;
	}

	// Getters et Setters
	public Integer getIdEtude() {
		return this.idEtude;
	}

	public void setIdEtude(Integer idEtude) {
		this.idEtude = idEtude;
	}

	public Integer getIdRdv() {
		return this.idRdv;
	}

	public void setIdRdv(Integer idRdv) {
		this.idRdv = idRdv;
	}

	//public Integer getSequence() {
	//	return sequence;
	//}

	//public void setSequence(Integer sequence) {
	//	this.sequence = sequence;
	//}

	// Méthode equals
	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof RdvId))
			return false;
		RdvId castOther = (RdvId) other;

		return (this.getIdEtude() == castOther.getIdEtude()) && (this.getIdRdv() == castOther.getIdRdv());
	}

	// Méthode hashCode
	public int hashCode() {
		int result = 17;

		result = 37 * result + this.getIdEtude();
		result = 37 * result + this.getIdRdv();
		return result;
	}

}
