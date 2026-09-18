package varzea_tech.TCC.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import varzea_tech.TCC.models.Partida;
import varzea_tech.TCC.repositories.PartidaRepository;
import java.util.List;

@Service
public class PartidaService {

    @Autowired
    private PartidaRepository repository;

    public List<Partida> listarTodas() {
        return repository.findAll();
    }

    public Partida salvar(Partida partida) {
        return repository.save(partida);
    }
}