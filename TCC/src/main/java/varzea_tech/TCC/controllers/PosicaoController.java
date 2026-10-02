package varzea_tech.TCC.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/posicoes")
public class PosicaoController {

    @GetMapping
    public List<String> listarPosicoes(@RequestParam String modalidade) {
        return switch (modalidade.toUpperCase()) {
            case "FUTSAL" -> List.of("Goleiro", "Fixo", "Ala (Direito)", "Ala (Esquerdo)", "Pivô");
            case "CAMPO" -> List.of("Goleiro", "Zagueiro", "Lateral (Direito)", "Lateral (Esquerdo)", "Volante", "Meio-Campo", "Ponta (Direita)", "Ponta (Esquerda)", "Centro-Avante");
            case "SOCIETY" -> List.of("Goleiro", "Zagueiro", "Meia", "Ala (Direito)", "Ala (Esquerdo)", "Atacante");
            default -> List.of("Modalidade inválida. Use: FUTSAL, CAMPO ou SOCIETY");
        };
    }
}