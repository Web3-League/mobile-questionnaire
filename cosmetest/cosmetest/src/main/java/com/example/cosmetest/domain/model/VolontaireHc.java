package com.example.cosmetest.domain.model;

import jakarta.persistence.*;


@Entity
@Table(name = "volontaire_hc")
public class VolontaireHc {
	
	@EmbeddedId
	private VolontaireHcId id;

	public VolontaireHc() {
	}

	public VolontaireHc(VolontaireHcId id) {
		this.id = id;
	}

	public VolontaireHcId getId() {
		return this.id;
	}

	public void setId(VolontaireHcId id) {
		this.id = id;
	}

}
