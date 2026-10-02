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

    @GetMapping("/buscar")
    public List<PartidaResponseDTO> buscarPartidas(@RequestParam String termo) {
        List<Partida> partidas = partidaRepository.findByNomeContainingIgnoreCaseOrEnderecoContainingIgnoreCase(termo, termo);
        return partidas.stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @PutMapping("/{id}")
    public PartidaResponseDTO atualizarPartida(@PathVariable Long id, @Valid @RequestBody Partida partidaAtualizada) {
        Partida partidaExistente = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada com o ID: " + id));

        partidaExistente.setNome(partidaAtualizada.getNome());
        partidaExistente.setTipoCampo(partidaAtualizada.getTipoCampo());
        partidaExistente.setDataHora(partidaAtualizada.getDataHora());
        partidaExistente.setCep(partidaAtualizada.getCep());
        partidaExistente.setEndereco(partidaAtualizada.getEndereco());
        partidaExistente.setNumero(partidaAtualizada.getNumero());
        partidaExistente.setComplemento(partidaAtualizada.getComplemento());
        partidaExistente.setFotoQuadra(partidaAtualizada.getFotoQuadra());
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

    @PostMapping("/{id}/inscrever")
    public PartidaResponseDTO inscreverJogador(@PathVariable Long id, @RequestParam Long usuarioId) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada!"));

        Usuario jogador = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Jogador não encontrado!"));

        if (!partida.getJogadoresConfirmados().contains(jogador)) {
            partida.getJogadoresConfirmados().add(jogador);
            partidaRepository.save(partida);
        }

        return converterParaDTO(partida);
    }

    @DeleteMapping("/{id}/remover-inscricao/{usuarioId}")
    public PartidaResponseDTO removerInscricao(@PathVariable Long id, @PathVariable Long usuarioId) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada!"));

        Usuario jogador = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Jogador não encontrado!"));

        if (partida.getJogadoresConfirmados().contains(jogador)) {
            partida.getJogadoresConfirmados().remove(jogador);
            partidaRepository.save(partida);
        }

        return converterParaDTO(partida);
    }

    private PartidaResponseDTO converterParaDTO(Partida partida) {
        UsuarioResponseDTO usuarioDTO = null;
        if (partida.getUsuario() != null) {
            usuarioDTO = new UsuarioResponseDTO(
                    partida.getUsuario().getId(),
                    partida.getUsuario().getNome(),
                    partida.getUsuario().getEmail(),
                    partida.getUsuario().getWhatsapp(),
                    partida.getUsuario().getPosicao(),
                    partida.getUsuario().getFotoPerfil()
            );
        }

        int confirmados = (partida.getJogadoresConfirmados() != null) ? partida.getJogadoresConfirmados().size() : 0;

        return new PartidaResponseDTO(
                partida.getId(),
                partida.getNome(),
                partida.getTipoCampo(),
                partida.getDataHora(),
                partida.getCep(),
                partida.getEndereco(),
                partida.getNumero(),
                partida.getComplemento(),
                partida.getFotoQuadra(),
                partida.getJogadores(),
                usuarioDTO,
                confirmados
        );
    }
}