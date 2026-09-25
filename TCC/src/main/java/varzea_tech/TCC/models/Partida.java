package varzea_tech.TCC.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da partida não pode estar vazio")
    private String nome;

    @NotBlank(message = "A região é obrigatória")
    private String regiao;

    @NotNull(message = "A quantidade de jogadores é obrigatória")
    @Min(value = 10, message = "A partida precisa de pelo menos 10 jogadores (5 para cada lado)")
    private Integer jogadores;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Partida() {
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getRegiao() {
        return regiao;
    }

    public void setRegiao(String regiao) {
        this.regiao = regiao;
    }

    public Integer getJogadores() {
        return jogadores;
    }

    public void setJogadores(Integer jogadores) {
        this.jogadores = jogadores;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}