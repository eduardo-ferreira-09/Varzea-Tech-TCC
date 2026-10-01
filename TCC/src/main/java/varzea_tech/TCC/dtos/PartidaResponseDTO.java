package varzea_tech.TCC.dtos;

import java.time.LocalDateTime;

public record PartidaResponseDTO(
        Long id,
        String nome,
        String tipoCampo,
        LocalDateTime dataHora,
        String cep,
        String endereco,
        String numero,
        String complemento,
        String fotoQuadra,
        Integer jogadores,
        UsuarioResponseDTO usuario,

        // NOVO: O front-end vai usar isto para mostrar no cartão!
        Integer numeroConfirmados
) {}