package com.example.cosmetest.business.service;

import com.example.cosmetest.domain.model.Identifiant;
import com.example.cosmetest.data.repository.IdentifiantRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Service pour charger les détails utilisateur pour Spring Security
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final IdentifiantRepository identifiantRepository;

    public CustomUserDetailsService(IdentifiantRepository identifiantRepository) {
        this.identifiantRepository = identifiantRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Identifiant identifiant = identifiantRepository.findByIdentifiant(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + username));

        return new User(
                identifiant.getIdentifiant(),
                identifiant.getMdpIdentifiant(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + identifiant.getRole()))
        );
    }
}