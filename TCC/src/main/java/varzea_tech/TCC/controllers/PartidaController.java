package varzea_tech.TCC.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import varzea_tech.TCC.dtos.PartidaResponseDTO;
import varzea_tech.TCC.dtos.UsuarioResponseDTO;
import varzea_tech.TCC.models.Partida;
import varzea_tech.TCC.models.Usuario;
import varzea_tech.TCC.repositories.PartidaRepository;
import varzea_tech.TCC.repositories.UsuarioRepository;

import java.util.List;

@RestController
@RequestMapping("/partidas")
public class PartidaController {

    @Autowired
    private PartidaRepository partidaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public PartidaResponseDTO criarPartida(@RequestBody Partida partida) {
        // Vai buscar o utilizador completo à base de dados usando o ID antes de guardar
        if (partida.getUsuario() != null && partida.getUsuario().getId() != null) {
            Usuario usuarioCompleto = usuarioRepository.findById(partida.getUsuario().getId()).orElse(null);
            partida.setUsuario(usuarioCompleto);
        }

        Partida partidaSalva = partidaRepository.save(partida);
        return converterParaDTO(partidaSalva);
    }

    @GetMapping
    public List<PartidaResponseDTO> listarPartidas() {
        List<Partida> partidas = partidaRepository.findAll();
        return partidas.stream()
                .map(this::converterParaDTO)
                .toList();
    }

    private PartidaResponseDTO converterParaDTO(Partida partida) {
        UsuarioResponseDTO usuarioDTO = null;
        if (partida.getUsuario() != null) {
            usuarioDTO = new UsuarioResponseDTO(
                    partida.getUsuario().getId(),
                    partida.getUsuario().getNome(),
                    partida.getUsuario().getEmail()
            );
        }
        return new PartidaResponseDTO(
                partida.getId(),
                partida.getNome(),
                partida.getRegiao(),
                partida.getJogadores(),
                usuarioDTO
        );
    }
}