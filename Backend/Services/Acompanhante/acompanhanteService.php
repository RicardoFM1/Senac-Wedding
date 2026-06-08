<?php

use Firebase\JWT\JWT;

require_once __DIR__ . "/../../Connection/db.php";

class AcompanhanteService
{
    protected $db;


    public function __construct()
    {
        $this->db = db();
    }

    public function buscarAcompanhantePorEmail($emailAcompanhante)
    {
        if (empty($emailAcompanhante)) {
            throw new Exception('Dados inválidos', 400);
        }

        $buscar = $this->db->prepare('SELECT * FROM acompanhante WHERE email = :email');

        $buscar->execute([
            ':email' => $emailAcompanhante
        ]);

        $acompanhante = $buscar->fetch();

        if (empty($acompanhante)) {
            return [
                'sucesso' => false,
                'mensagem' => "Acompanhante não encontrado",
                'codigo' => 404
            ];
        }

        return [
            'sucesso' => true,
            'dados' => [
                'acompanhante' => $acompanhante
            ]
        ];
    }



    public function listarAcompanhantes()
    {
        $query = $this->db->query("SELECT a.id_acompanhante, a.nome AS nome_acompanhante,
        a.sobrenome AS sobrenome_acompanhante, a.cpf AS cpf_acompanhante, a.email as email_acompanhante, a.idade,
        co.nome as nome_convidado, co.cpf as cpf_convidado
        FROM acompanhante a INNER JOIN convidado co ON a.convidado_idconvidado = co.id_convidado");

        $query->execute();
        $resultado = [];

        while ($row = $query->fetch()) {
            $resultado[] = [
                'id_acompanhante' => $row['id_acompanhante'],
                'nome' => $row['nome_acompanhante'],
                'sobrenome' => $row['sobrenome_acompanhante'],
                'cpf' => $row['cpf_acompanhante'],
                'email' => $row['email_acompanhante'],
                'idade' => $row['idade'],
                'convidado' => [
                    'nome' => $row['nome_convidado'],
                    'cpf' => $row['cpf_convidado']
                ]
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $resultado
            
        ];
    }

    public function criarAcompanhante($acompanhanteDados)
    {
        try {


            $criar = $this->db->prepare('INSERT INTO acompanhante (nome, sobrenome, email, cpf, idade, convidado_idconvidado)
        VALUES (:nome, :sobrenome, :email, :cpf, :idade, :convidado_idconvidado)');

            $criar->execute([
                ':nome' => $acompanhanteDados['nome'],
                ':sobrenome' => $acompanhanteDados['sobrenome'],
                ':email' => $acompanhanteDados['email'],
                ':cpf' => isset($acompanhanteDados['cpf']) ? $acompanhanteDados['cpf'] : null,
                ':idade' => $acompanhanteDados['idade'],
                ':convidado_idconvidado' => $acompanhanteDados['convidado_idconvidado']

            ]);

            $idInserido = $this->db->lastInsertId();

            $buscar = $this->db->prepare("SELECT a.id_acompanhante, a.nome, a.sobrenome, a.cpf, a.email, a.idade, co.nome as nome_convidado, co.cpf as cpf_convidado
                FROM acompanhante a INNER JOIN convidado co ON a.convidado_idconvidado = co.id_convidado WHERE a.id_acompanhante = :id");
            $buscar->execute([':id' => $idInserido]);
            $novo = $buscar->fetch();

            $obj = [
                'id_acompanhante' => $novo['id_acompanhante'],
                'nome' => $novo['nome'],
                'sobrenome' => $novo['sobrenome'],
                'cpf' => $novo['cpf'],
                'email' => $novo['email'],
                'idade' => $novo['idade'],
                'convidado' => [
                    'nome' => $novo['nome_convidado'],
                    'cpf' => $novo['cpf_convidado']
                ]
            ];

            return [
                'sucesso' => true,
                'dados' => [
                    'acompanhante' => $obj
                ],
                'mensagem' => 'Acompanhante criado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'email')) {
                throw new Exception('Email já em uso', 409);
            }

            if (str_contains($e->getMessage(), 'fk_acompanhante_convidado')) {
                throw new Exception('Convidado referenciado não encontrado', 404);
            }

            throw new Exception('Erro ao criar acompanhante' . $e->getMessage(), 500);
        }
    }




    public function atualizarAcompanhante($acompanhanteDados, $emailAcompanhante)
    {
        try {


            $acompanhante = $this->buscarAcompanhantePorEmail($emailAcompanhante);

            if ($acompanhante['sucesso'] === false) {
                throw new Exception($acompanhante['mensagem'], $acompanhante['codigo']);
            }



            $atualizar = $this->db->prepare('UPDATE acompanhante SET nome = :nome, sobrenome = :sobrenome, 
            email = :email, cpf = :cpf, idade = :idade, convidado_idconvidado = :convidado_idconvidado
            WHERE email = :email_antigo');

            $atualizar->execute([
                ':nome' => $acompanhanteDados['nome'],
                ':sobrenome' => $acompanhanteDados['sobrenome'],
                ':email' => $acompanhanteDados['email'],
                ':cpf' => isset($acompanhanteDados['cpf']) ? $acompanhanteDados['cpf'] : null,
                ':idade' => $acompanhanteDados['idade'],
                ':convidado_idconvidado' => $acompanhanteDados['convidado_idconvidado'],
                ':email_antigo' => $emailAcompanhante
            ]);

            // Buscar o acompanhante atualizado com dados do convidado
            $buscar = $this->db->prepare("SELECT a.id_acompanhante, a.nome, a.sobrenome, a.cpf, a.email, a.idade, co.nome as nome_convidado, co.cpf as cpf_convidado
                FROM acompanhante a INNER JOIN convidado co ON a.convidado_idconvidado = co.id_convidado WHERE a.email = :email");
            $buscar->execute([':email' => $acompanhanteDados['email']]);
            $atualizado = $buscar->fetch();

            $obj = [
                'id_acompanhante' => $atualizado['id_acompanhante'],
                'nome' => $atualizado['nome'],
                'sobrenome' => $atualizado['sobrenome'],
                'cpf' => $atualizado['cpf'],
                'email' => $atualizado['email'],
                'idade' => $atualizado['idade'],
                'convidado' => [
                    'nome' => $atualizado['nome_convidado'],
                    'cpf' => $atualizado['cpf_convidado']
                ]
            ];

            return [
                'sucesso' => true,
                'dados' => [
                    'acompanhante' => $obj
                ],
                'mensagem' => 'Acompanhante atualizado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'email')) {
                throw new Exception('Email já em uso', 409);
            }

            if (str_contains($e->getMessage(), 'fk_acompanhante_convidado')) {
                throw new Exception('Convidado referenciado não encontrado', 404);
            }

            throw new Exception('Erro ao atualizar acompanhante', 500);
        }
    }


    public function deletarAcompanhante($emailAcompanhante)
    {
        try {
            $acompanhante = $this->buscarAcompanhantePorEmail($emailAcompanhante);

            if ($acompanhante['sucesso'] === false) {
                throw new Exception($acompanhante['mensagem'], $acompanhante['codigo']);
            }



            $deletar = $this->db->prepare('DELETE FROM acompanhante WHERE email = :email');

            $deletar->execute([
                ':email' => $emailAcompanhante
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Acompanhante deletado'
            ];
        } catch (PDOException $e) {
            throw new Exception('Erro ao deletar acompanhante', 500);
        }
    }
}
