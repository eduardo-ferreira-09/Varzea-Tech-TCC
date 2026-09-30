package varzea_tech.TCC.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import varzea_tech.TCC.models.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    // NOVO: Permite ao back-end pesquisar utilizadores pelo número
    Optional<Usuario> findByWhatsapp(String whatsapp);
}