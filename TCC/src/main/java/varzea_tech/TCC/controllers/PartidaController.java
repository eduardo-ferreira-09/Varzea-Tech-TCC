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
    // NOVA ROTA: Barra de pesquisa (Filtro)
    @GetMapping("/buscar")
    public List<PartidaResponseDTO> buscarPartidas(@RequestParam String termo) {

        // Vai à base de dados procurar o termo tanto no Nome da arena como no Endereço
        List<Partida> partidas = partidaRepository.findByNomeContainingIgnoreCaseOrEnderecoContainingIgnoreCase(termo, termo);

        // Converte os resultados para o formato seguro (DTO) e devolve
        return partidas.stream()
                .map(this::converterParaDTO)
                .toList();
    }
    @PutMapping("/{id}")
    public PartidaResponseDTO atualizarPartida(@PathVariable Long id, @Valid @RequestBody Partida partidaAtualizada) {
        Partida partidaExistente = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada com o ID: " + id));

        partidaExistente.setNome(partidaAtualizada.getNome());
        // NOVOS CAMPOS (A regiao foi removida daqui)
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

    private PartidaResponseDTO converterParaDTO(Partida partida) {
        UsuarioResponseDTO usuarioDTO = null;
        if (partida.getUsuario() != null) {
            usuarioDTO = new UsuarioResponseDTO(
                    partida.getUsuario().getId(),
                    partida.getUsuario().getNome(),
                    partida.getUsuario().getEmail(),
                    partida.getUsuario().getWhatsapp() // NOVO CAMPO
            );
        }
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
                usuarioDTO
        );
    }
}