package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.dto.CadastroPetRecordDTO;
import com.projeto.sistema_castracao_faesb.model.*;
import com.projeto.sistema_castracao_faesb.model.enums.StatusProcesso;
import com.projeto.sistema_castracao_faesb.repository.CadastroCastracaoRepository;
import com.projeto.sistema_castracao_faesb.repository.PetRepository;
import com.projeto.sistema_castracao_faesb.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;


    @Service
    public class CadastroService {

        @Autowired
        private TutorRepository tutorRepository;
        @Autowired
        private PetRepository petRepository;
        @Autowired
        private CadastroCastracaoRepository cadastroRepository;
        @Autowired
        private UploadService uploadService; // Centralizado no UploadService
        @Autowired
        private ConfiguracaoPixService pixService;

        @Transactional
        public void cadastrar(CadastroPetRecordDTO dados, MultipartFile arquivo) {
            if (arquivo == null || arquivo.isEmpty()) {
                throw new RuntimeException("O envio do comprovante PIX é obrigatório.");
            }

            String cpfLimpo = dados.cpf().replaceAll("\\D", "");

            // LÓGICA DO TUTOR
            Tutor tutor = tutorRepository.findByCpf(cpfLimpo)
                    .orElseGet(() -> {
                        Tutor novo = new Tutor();
                        novo.setCpf(cpfLimpo);
                        novo.setCidade("Tatuí");
                        return novo;
                    });

            // Atualiza dados sempre que cadastrar um novo pet
            tutor.setNome(dados.nomeTutor());
            tutor.setEmail(dados.email());
            tutor.setWhatsapp(dados.whatsapp());
            tutor.setLogradouro(dados.logradouro());
            tutor.setNumero(dados.numero());
            tutor.setBairro(dados.bairro());
            tutor = tutorRepository.save(tutor);

            // LÓGICA DO PET
            Pet pet = new Pet();
            pet.setNomeAnimal(dados.nomePet());
            pet.setEspecie(dados.especie());
            pet.setSexo(dados.sexo());
            pet.setIdadeAprox(dados.idadeAprox());
            pet.setRaca(dados.raca() != null ? dados.raca() : "Não Definida");
            pet.setTutor(tutor);
            pet = petRepository.save(pet);

            // LÓGICA DO CADASTRO
            CadastroCastracao cadastro = new CadastroCastracao();
            cadastro.setPet(pet);
            cadastro.setTutor(tutor);
            cadastro.setStatusProcesso(StatusProcesso.AGUARDANDO_CONFERENCIA);
            cadastro.setDataSolicitacao(LocalDateTime.now());

            // LÓGICA DO PAGAMENTO
            Pagamento pagamento = new Pagamento();
            ConfiguracaoPix configAtiva = pixService.buscarChaveAtiva();
            pagamento.setValorContribuicao(configAtiva.getValorTaxa());pagamento.setContaDestino(configAtiva);
            pagamento.setConfirmado(false);
            pagamento.setCadastro(cadastro);

            // UPLOAD (Usando o seu UploadService dedicado)
            String url = uploadService.upload(arquivo);
            pagamento.setComprovanteUrl(url);

            cadastro.setPagamento(pagamento);
            cadastroRepository.save(cadastro);
        }

        @Transactional
        public void atualizarStatusProcesso(Long id, String novoStatus) {
            CadastroCastracao cadastro = cadastroRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Cadastro não encontrado com ID: " + id));

            try {
                // Converte a String vinda do Front-end para o Enum do Java
                StatusProcesso status = StatusProcesso.valueOf(novoStatus.toUpperCase());
                cadastro.setStatusProcesso(status);

                // Opcional: Se quiser limpar observações médicas ao remarcar
                if (status == StatusProcesso.PAGAMENTO_CONFIRMADO) {
                    // cadastro.setObservacoesMedicas(null);
                }

                cadastroRepository.save(cadastro);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Status inválido: " + novoStatus);
            }
        }

        public List<Pet> buscarPetsPorCpf(String cpf) {
            return petRepository.findByTutorCpf(cpf);
        }

        public List<Pet> listarTodos() {
            return petRepository.findAll();
        }

    }
