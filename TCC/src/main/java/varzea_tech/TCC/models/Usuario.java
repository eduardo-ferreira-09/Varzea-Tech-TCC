package varzea_tech.TCC.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome não pode estar vazio")
    private String nome;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Formato de email inválido")
    private String email;

    // REGRA NOVA DE SENHA! (Mínimo 8, 1 maiúscula, 1 minúscula, 1 número)
    @NotBlank(message = "A senha é obrigatória")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
            message = "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número")
    private String senha;

    @NotBlank(message = "O WhatsApp/Telefone é obrigatório")
    private String whatsapp;

    // NOVOS CAMPOS
    @NotNull(message = "A idade é obrigatória")
    private Integer idade;

    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    public Usuario() {
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
}