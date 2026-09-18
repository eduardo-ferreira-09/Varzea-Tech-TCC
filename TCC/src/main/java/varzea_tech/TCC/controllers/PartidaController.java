package varzea_tech.TCC.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import varzea_tech.TCC.models.Partida;
import varzea_tech.TCC.services.PartidaService;
import java.util.List;

@RestController
@RequestMapping("/partidas")
public class PartidaController {

    @Autowired
    private PartidaService service;

    @GetMapping
    public List<Partida> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public Partida criar(@RequestBody Partida partida) {
        return service.salvar(partida);
    }
}