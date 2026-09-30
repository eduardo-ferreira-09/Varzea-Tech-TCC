package varzea_tech.TCC.controllers;

import jakarta.validation.Valid;
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
    public PartidaResponseDTO criarPartida(@Valid @RequestBody Partida partida) {
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


    @PutMapping("/{id}")
    public PartidaResponseDTO atualizarPartida(@PathVariable Long id, @Valid @RequestBody Partida partidaAtualizada) {
        Partida partidaExistente = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada com o ID: " + id));

        partidaExistente.setNome(partidaAtualizada.getNome());
        partidaExistente.setRegiao(partidaAtualizada.getRegiao());
        partidaExistente.setJogadores(partidaAtualizada.getJogadores());

        if (partidaAtualizada.getUsuario() != null && partidaAtualizada.getUsuario().getId() != null) {
            Usuario usuarioCompleto = usuarioRepository.findById(partidaAtualizada.getUsuario().getId()).orElse(null);
            partidaExistente.setUsuario(usuarioCompleto);
        }

        Partida partidaSalva = partidaRepository.save(partidaExistente);
        return converterParaDTO(partidaSalva);
    }


    @DeleteMapping("/{id}")
    public void deletarPartida(@PathVariable Long id) {
        partidaRepository.deleteById(id);
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