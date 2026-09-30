package varzea_tech.TCC.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da partida não pode estar vazio")
    private String nome;

    // NOVOS CAMPOS
    @NotBlank(message = "O tipo do campo é obrigatório")
    private String tipoCampo;

    @NotNull(message = "A data e hora são obrigatórias")
    private LocalDateTime dataHora;

    @NotBlank(message = "O CEP é obrigatório")
    private String cep;

    @NotBlank(message = "O endereço é obrigatório")
    private String endereco;

    @NotBlank(message = "O número é obrigatório")
    private String numero;

    private String complemento; // Não é obrigatório, pode ser null

    private String fotoQuadra; // URL da imagem, não obrigatório

    @NotNull(message = "A quantidade de jogadores é obrigatória")
    @Min(value = 10, message = "A partida precisa de pelo menos 10 jogadores")
    private Integer jogadores;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Partida() {
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTipoCampo() { return tipoCampo; }
    public void setTipoCampo(String tipoCampo) { this.tipoCampo = tipoCampo; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getFotoQuadra() { return fotoQuadra; }
    public void setFotoQuadra(String fotoQuadra) { this.fotoQuadra = fotoQuadra; }
    public Integer getJogadores() { return jogadores; }
    public void setJogadores(Integer jogadores) { this.jogadores = jogadores; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}