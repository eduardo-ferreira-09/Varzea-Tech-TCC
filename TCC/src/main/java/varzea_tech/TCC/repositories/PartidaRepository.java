package varzea_tech.TCC.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import varzea_tech.TCC.models.Partida;
import java.util.List;

public interface PartidaRepository extends JpaRepository<Partida, Long> {

    // Método mágico do Spring que procura partes do texto no Nome OU no Endereço
    List<Partida> findByNomeContainingIgnoreCaseOrEnderecoContainingIgnoreCase(String nome, String endereco);

}