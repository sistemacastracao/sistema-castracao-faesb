package com.projeto.sistema_castracao_faesb.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class UploadService {

    private final Cloudinary cloudinary;

    // Buscamos as chaves das variáveis de ambiente do servidor (Render/Local)
    public UploadService(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret) {

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true)); // Garante que a URL retornada seja HTTPS
    }

    public String upload(MultipartFile arquivo) {
        try {
            // Enviamos para uma pasta específica para organizar o armazenamento da FAESB
            Map uploadResult = cloudinary.uploader().upload(arquivo.getBytes(),
                    ObjectUtils.asMap("folder", "comprovantes_pix_faesb"));

            // Retornamos a secure_url (HTTPS) para evitar avisos de segurança no navegador
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            System.err.println("ERRO CLOUDINARY: " + e.getMessage());
            throw new RuntimeException("Erro ao subir comprovante para a nuvem FAESB");
        }
    }
}