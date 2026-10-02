package varzea_tech.TCC.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import varzea_tech.TCC.dtos.LoginDTO;
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
        return new UsuarioResponseDTO(usuarioSalvo.getId(), usuarioSalvo.getNome(), usuarioSalvo.getEmail(), usuarioSalvo.getWhatsapp(), usuarioSalvo.getPosicao(), usuarioSalvo.getFotoPerfil());
    }

    @GetMapping
    public List<UsuarioResponseDTO> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(u -> new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getWhatsapp(),  u.getPosicao(), u.getFotoPerfil()))
                .toList();
    }

    @PutMapping("/{id}")
    public UsuarioResponseDTO atualizarUsuario(@PathVariable Long id, @Valid @RequestBody Usuario usuarioAtualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado com o ID: " + id));

        usuarioExistente.setNome(usuarioAtualizado.getNome());
        usuarioExistente.setEmail(usuarioAtualizado.getEmail());
        usuarioExistente.setSenha(usuarioAtualizado.getSenha());
        usuarioExistente.setWhatsapp(usuarioAtualizado.getWhatsapp());


        usuarioExistente.setIdade(usuarioAtualizado.getIdade());
        usuarioExistente.setCpf(usuarioAtualizado.getCpf());

        Usuario usuarioSalvo = usuarioRepository.save(usuarioExistente);
        return new UsuarioResponseDTO(usuarioSalvo.getId(), usuarioSalvo.getNome(), usuarioSalvo.getEmail(), usuarioSalvo.getWhatsapp(), usuarioSalvo.getPosicao(), usuarioSalvo.getFotoPerfil());
    }

    @DeleteMapping("/{id}")
    public void deletarUsuario(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@Valid @RequestBody LoginDTO loginData) {

        // Procura pelo Email. Se não encontrar, tenta procurar pelo Telefone (WhatsApp)
        Usuario usuario = usuarioRepository.findByEmail(loginData.identificacao())
                .orElseGet(() -> usuarioRepository.findByWhatsapp(loginData.identificacao()).orElse(null));

        // Valida se encontrou alguém e se a senha está correta
        if (usuario == null || !usuario.getSenha().equals(loginData.senha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email/Telefone ou senha incorretos!");
        }

        UsuarioResponseDTO resposta = new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getWhatsapp(),
                usuario.getPosicao(),
                usuario.getFotoPerfil()
        );

        return ResponseEntity.ok(resposta);
    }
}