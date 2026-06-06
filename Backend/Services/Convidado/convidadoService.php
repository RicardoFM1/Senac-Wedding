<?php

use Firebase\JWT\JWT;

require_once __DIR__ . "/../../Connection/db.php";

class ConvidadoService
{
    protected $db;


    public function __construct()
    {
        $this->db = db();
    }

    public function buscarConvidadoPorEmail($emailConvidado)
    {
        if (empty($emailConvidado)) {
            throw new Exception('Dados inválidos', 400);
        }

        $buscar = $this->db->prepare('SELECT * FROM convidado WHERE email = :email');

        $buscar->execute([
            ':email' => $emailConvidado
        ]);

        $convidado = $buscar->fetch();

        if (empty($convidado)) {
            return [
                'sucesso' => false,
                'mensagem' => "Convidado não encontrado",
                'codigo' => 404
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $convidado
        ];
    }

    public function buscarConvidadoPorIdMesa($idMesa)
    {
        if (empty($idMesa)) {
            throw new Exception('Dados inválidos', 400);
        }

        $buscar = $this->db->prepare('SELECT * FROM convidado WHERE id_mesa = :id_mesa');

        $buscar->execute([
            ':id_mesa' => $idMesa
        ]);

        $convidados = $buscar->fetchAll();

        if (empty($convidados)) {
            return [
                'sucesso' => false,
                'mensagem' => "Convidado não encontrado",
                'codigo' => 404
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $convidados
        ];
    }


    public function listarConvidados()
    {
        $query = $this->db->query("SELECT * FROM convidado");

        $query->execute();

        $convidados = $query->fetchAll();

        return [
            'sucesso' => true,
            'dados' => $convidados,
            'total' => count($convidados)
        ];
    }

    public function criarConvidado($convidadoDados)
    {
        try {

            $convidadoDados['cpf'] = preg_replace('/\D/', '', $convidadoDados['cpf']);
            $convidadoDados['telefone'] = preg_replace('/\D/', '', $convidadoDados['telefone']);

            $mesaReferenciada = new MesaService()->buscarMesaPorId($convidadoDados['mesa_idmesa']);
            $convidadoReferenciando = $this->buscarConvidadoPorIdMesa($convidadoDados['mesa_idmesa']);

            if ($convidadoReferenciando['sucesso'] === 'true') {
                if (count($convidadoReferenciando['dados']) >= $mesaReferenciada['dados']['capacidade']) {
                    throw new Exception('Mesa lotada', 409);
                }
            }


            $criar = $this->db->prepare('INSERT INTO convidado (nome, sobrenome, email, cpf, telefone, categoria, mesa_idmesa)
        VALUES (:nome, :sobrenome, :email, :cpf, :telefone, :categoria, :mesa_idmesa)');

            $criar->execute([
                ':nome' => $convidadoDados['nome'],
                ':sobrenome' => $convidadoDados['sobrenome'],
                ':email' => $convidadoDados['email'],
                ':cpf' => $convidadoDados['cpf'],
                ':telefone' => $convidadoDados['telefone'],
                ':categoria' => $convidadoDados['categoria'],
                ':mesa_idmesa' => $convidadoDados['mesa_idmesa']

            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Convidado criado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'email')) {
                throw new Exception('Email já em uso', 409);
            }

            if (str_contains($e->getMessage(), 'cpf')) {
                throw new Exception('Cpf já em uso', 409);
            }

            if (str_contains($e->getMessage(), 'fk_convidado_mesa')) {
                throw new Exception('Mesa referenciada não encontrada', 404);
            }

            throw new Exception('Erro ao criar convidado', 500);
        }
    }




    public function atualizarConvidado($convidadoDados, $emailConvidado)
    {
        try {
            $convidadoDados['cpf'] = preg_replace('/\D/', '', $convidadoDados['cpf']);
            $convidadoDados['telefone'] = preg_replace('/\D/', '', $convidadoDados['telefone']);

            $convidado = $this->buscarConvidadoPorEmail($emailConvidado);

            if ($convidado['sucesso'] === false) {
                throw new Exception($convidado['mensagem'], $convidado['codigo']);
            }

            if ($convidadoDados['confirmacao'] !== 'cancelado') {
                throw new Exception('Só é possível cancelar um convidado', 400);
            }

            if ($convidado['dados']['confirmacao'] === 'confirmado') {
                throw new Exception('Não é possivel atualizar um convidado já confirmado', 409);
            }

            $mesaReferenciada = new MesaService()->buscarMesaPorId($convidadoDados['mesa_idmesa']);
            $convidadoReferenciando = $this->buscarConvidadoPorIdMesa($convidadoDados['mesa_idmesa']);

            if ($convidadoReferenciando['sucesso'] === 'true') {
                if (count($convidadoReferenciando['dados']) >= $mesaReferenciada['dados']['capacidade'] && $convidadoDados['mesa_idmesa'] !== $convidado['dados']['mesa_idmesa']) {
                    throw new Exception('Mesa lotada', 409);
                }
            }

            $atualizar = $this->db->prepare('UPDATE convidado SET nome = :nome, sobrenome = :sobrenome, 
            email = :email, cpf = :cpf, telefone = :telefone, categoria = :categoria, confirmacao = :confirmacao,
            mesa_idmesa = :mesa_idmesa 
            WHERE email = :email_antigo');

            $atualizar->execute([
                ':nome' => $convidadoDados['nome'],
                ':sobrenome' => $convidadoDados['sobrenome'],
                ':email' => $convidadoDados['email'],
                ':cpf' => $convidadoDados['cpf'],
                ':telefone' => $convidadoDados['telefone'],
                ':categoria' => $convidadoDados['categoria'],
                ':mesa_idmesa' => $convidadoDados['mesa_idmesa'],
                ':email_antigo' => $emailConvidado
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Convidado atualizado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'email')) {
                throw new Exception('Email já em uso', 409);
            }

            if (str_contains($e->getMessage(), 'cpf')) {
                throw new Exception('Cpf já em uso', 409);
            }

            if (str_contains($e->getMessage(), 'fk_convidado_mesa')) {
                throw new Exception('Mesa referenciada não encontrada', 404);
            }

            throw new Exception('Erro ao atualizar convidado', 500);
        }
    }


    public function deletarConvidado($emailConvidado)
    {
        try {
            $convidado = $this->buscarConvidadoPorEmail($emailConvidado);

            if ($convidado['sucesso'] === false) {
                throw new Exception($convidado['mensagem'], $convidado['codigo']);
            }

            if ($convidado['dados']['confirmacao'] === 'confirmado') {
                throw new Exception('Não é possível deletar um convidado já confirmado', 409);
            }

            $deletar = $this->db->prepare('DELETE FROM convidado WHERE email = :email');

            $deletar->execute([
                ':email' => $emailConvidado
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Convidado deletado'
            ];
        } catch (PDOException $e) {
            throw new Exception('Erro ao deletar convidado', 500);
        }
    }
}
