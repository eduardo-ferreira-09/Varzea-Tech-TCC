package varzea_tech.TCC.dtos;

import java.time.LocalDateTime;

public record ErroResponseDTO(
        LocalDateTime timestamp,
        Integer status,
        String erro,
        String caminho
) {}