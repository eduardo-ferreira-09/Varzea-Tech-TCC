package varzea_tech.TCC.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import varzea_tech.TCC.dtos.ErroResponseDTO;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 1. Apanha os erros manuais que nós criámos (ex: "Partida não encontrada!")
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErroResponseDTO> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        ErroResponseDTO erro = new ErroResponseDTO(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(), // Devolve 404 (Não Encontrado)
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    // 2. Apanha os erros de validação (ex: Senha fraca, CPF vazio, @NotBlank, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();

        // Mapeia qual campo falhou e a respetiva mensagem
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String nomeCampo = ((FieldError) error).getField();
            String mensagemErro = error.getDefaultMessage();
            erros.put(nomeCampo, mensagemErro);
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros); // Devolve 400 (Bad Request)
    }
}