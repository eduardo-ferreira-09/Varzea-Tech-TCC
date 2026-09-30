package varzea_tech.TCC.dtos;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
        @NotBlank(message = "A identificação (email ou telefone) é obrigatória")
        String identificacao,

        @NotBlank(message = "A senha é obrigatória")
        String senha
) {}