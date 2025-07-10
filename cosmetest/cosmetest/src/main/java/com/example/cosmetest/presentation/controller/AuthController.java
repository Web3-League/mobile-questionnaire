package com.example.cosmetest.presentation.controller;

import java.util.Map;
import java.util.HashMap;

import com.example.cosmetest.presentation.request.LoginRequest;
import com.example.cosmetest.presentation.response.JwtResponse;
import com.example.cosmetest.business.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService,
                          AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
    }

    // === ROUTES /api/auth ===

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        try {
            // 1) Authentifier via Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getLogin(),
                            loginRequest.getMotDePasse()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 2) Générer le token JWT via votre service
            String jwt = authService.authenticate(
                    loginRequest.getLogin(),
                    loginRequest.getMotDePasse()
            );

            if (jwt == null) {
                // Authentification échouée
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Identifiants incorrects");
            }

            // 3) Construire manuellement l'en-tête Set-Cookie (pour navigateurs web)
            String cookieValue = "jwt=" + jwt
                    + "; Path=/"
                    + "; Max-Age=86400"  // 1 jour (exprimé en secondes)
                    + "; HttpOnly"
                    //+ "; Secure"
                    + "; SameSite=Lax"; // Autorise cross-site

            // 4) Fixer l'en-tête
            response.setHeader("Set-Cookie", cookieValue);
            
            // 5) Ajouter l'en-tête Authorization (pour clients API)
            response.setHeader("Authorization", "Bearer " + jwt);

            // 6) Ajouter le token dans la réponse JSON (pour applications mobiles)
            String username = authService.getUsernameFromToken(jwt);
            JwtResponse jwtResponse = new JwtResponse(jwt, username);

            return ResponseEntity.ok(jwtResponse);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Identifiants incorrects");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur interne : " + e.getMessage());
        }
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        // 1) Générer un Set-Cookie pour expirer le précédent
        String cookieValue = "jwt="
                + "; Path=/"
                + "; Max-Age=0"   // expire immédiatement
                + "; HttpOnly"
                //+ "; Secure"
                + "; SameSite=Lax";

        // 2) Fixer l'en-tête
        response.setHeader("Set-Cookie", cookieValue);

        // 3) Retourner la confirmation
        return ResponseEntity.ok("Déconnexion réussie");
    }

    boolean isProduction = !"dev".equals(
            System.getenv().getOrDefault("SPRING_PROFILES_ACTIVE", "dev")
    );


    @GetMapping("/api/auth/user")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non authentifié");
        }
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("login", authentication.getName());
        userMap.put("roles", authentication.getAuthorities());
        return ResponseEntity.ok(userMap);
    }

    @GetMapping("/api/auth/validate")
    public ResponseEntity<?> validateToken(Authentication auth) {
        // Vérifie s'il y a un auth non-null et isAuthenticated()
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non authentifié");
        }
        // Facultatif: on pourrait renvoyer des infos (login, rôles), ou juste un message
        return ResponseEntity.ok("Token valide");
    }

    // === ROUTE /api/users/me ===

    /**
     * Endpoint pour récupérer les informations de l'utilisateur connecté
     * Accessible via /api/users/me
     * C'est essentiellement une copie de getUserInfo mais avec une URL différente
     */
    @GetMapping("/api/users/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        return getUserInfo(authentication);
    }
}