package varzea_tech.TCC.dtos;

public record PartidaResponseDTO(
        Long id,
        String nome,
        String regiao,
        Integer jogadores,
        UsuarioResponseDTO usuario
) {}