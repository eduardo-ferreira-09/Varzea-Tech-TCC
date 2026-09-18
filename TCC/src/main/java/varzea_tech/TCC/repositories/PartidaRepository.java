package varzea_tech.TCC.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import varzea_tech.TCC.models.Partida;

@Repository
public interface PartidaRepository extends JpaRepository<Partida, Long> {
}