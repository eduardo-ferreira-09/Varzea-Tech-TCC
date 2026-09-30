package varzea_tech.TCC.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import varzea_tech.TCC.dtos.UsuarioResponseDTO;
import varzea_tech.TCC.models.Usuario;
import varzea_tech.TCC.repositories.UsuarioRepository;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public UsuarioResponseDTO criarUsuario(@Valid @RequestBody Usuario usuario) {
        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(usuarioSalvo.getId(), usuarioSalvo.getNome(), usuarioSalvo.getEmail());
    }

    @GetMapping
    public List<UsuarioResponseDTO> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(u -> new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail()))
                .toList();
    }


    @PutMapping("/{id}")
    public UsuarioResponseDTO atualizarUsuario(@PathVariable Long id, @Valid @RequestBody Usuario usuarioAtualizado) {
        // Procura o utilizador na base de dados. Se não encontrar, dá erro.
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado com o ID: " + id));


        usuarioExistente.setNome(usuarioAtualizado.getNome());
        usuarioExistente.setEmail(usuarioAtualizado.getEmail());
        usuarioExistente.setSenha(usuarioAtualizado.getSenha());


        Usuario usuarioSalvo = usuarioRepository.save(usuarioExistente);


        return new UsuarioResponseDTO(usuarioSalvo.getId(), usuarioSalvo.getNome(), usuarioSalvo.getEmail());
    }


    @DeleteMapping("/{id}")
    public void deletarUsuario(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }
}