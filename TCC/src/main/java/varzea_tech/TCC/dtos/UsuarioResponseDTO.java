package varzea_tech.TCC.dtos;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String whatsapp // NOVO CAMPO
) {}