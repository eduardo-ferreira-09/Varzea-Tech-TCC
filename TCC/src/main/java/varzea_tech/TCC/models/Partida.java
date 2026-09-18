package varzea_tech.TCC.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "partidas")
public class Partida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String regiao;

    @Column(nullable = false)
    private Integer jogadores;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}