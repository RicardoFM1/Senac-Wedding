<?php
date_default_timezone_set('America/Sao_Paulo');

use Firebase\JWT\JWT;

require_once __DIR__ . "/../../Connection/db.php";

class CheckinService
{
    protected $db;


    public function __construct()
    {
        $this->db = db();
    }



    public function listarCheckins()
    {
        $query = $this->db->query("SELECT c.data_e_hora, c.status,
        co.nome as nome_convidado, co.email, co.sobrenome as sobrenome_convidado, co.id_convidado, co.confirmacao, co.cpf as cpf_convidado, u.nome as nome_usuario, u.cpf  as cpf_usuario
        FROM convidado co LEFT JOIN checkin c ON c.convidado_idconvidado = co.id_convidado LEFT JOIN usuario u ON c.usuario_idusuario = u.id_usuario");

        $query->execute();
        $resultado = [];

        while ($row = $query->fetch()) {
            $dataFormatada = null;
            
            if ($row['data_e_hora'] !== null) {

                $dt = new DateTime($row['data_e_hora']);
                $dataFormatada = $dt->format('d/m/Y H:i:s');
            }

            $resultado[] = [
                'id_convidado' => $row['id_convidado'],
                'data_e_hora' =>  $dataFormatada,
                'status' => $row['status'],

                'convidado' => [
                    'nome' => $row['nome_convidado'],
                    'sobrenome' => $row['sobrenome_convidado'],
                    'email' => $row['email'],
                    'confirmacao' => $row['confirmacao'],
                    'cpf' => $row['cpf_convidado']
                ],
                'usuario' => [
                    'nome' => $row['nome_usuario'],
                    'cpf' => $row['cpf_usuario']
                ]
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $resultado

        ];
    }

    public function criarCheckin($checkinDados, $jwt)
    {
        try {

            $buscarConvidado = $this->db->prepare('SELECT * FROM convidado WHERE id_convidado = :id_convidado');
            $buscarConvidado->execute([
                ':id_convidado' => $checkinDados['convidado_idconvidado']
            ]);

            $convidado = $buscarConvidado->fetch();

            if (empty($convidado)) {
                throw new Exception('Convidado não encontrado', 404);
            }

            if ($convidado['confirmacao'] === 'confirmado') {
                throw new Exception('Convidado já confirmado', 409);
            }

            $dataFormatada = date('Y-m-d H:i:s');

            $criar = $this->db->prepare('INSERT INTO checkin (usuario_idusuario, convidado_idconvidado, data_e_hora)
        VALUES (:usuario_idusuario, :convidado_idconvidado, :data_e_hora)');

            $criar->execute([
                ':usuario_idusuario' => $jwt->dados->id_usuario,
                ':convidado_idconvidado' => $checkinDados['convidado_idconvidado'],
                ':data_e_hora' => $dataFormatada
            ]);

            $idInserido = $this->db->lastInsertId();

            $atualizarConvidado = $this->db->prepare('UPDATE convidado SET confirmacao = "confirmado" WHERE id_convidado = :id_convidado');

            $atualizarConvidado->execute([
                ':id_convidado' => $checkinDados['convidado_idconvidado']
            ]);

            $atualizarCheckin = $this->db->prepare('UPDATE checkin SET status = "realizado" WHERE id_checkin = :id_checkin');

            $atualizarCheckin->execute([
                ':id_checkin' => $idInserido
            ]);



            return [
                'sucesso' => true,
                'mensagem' => 'Checkin criado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'convidado_idconvidado')) {
                throw new Exception('Convidado já confirmado', 409);
            }

            if (str_contains($e->getMessage(), 'fk_checkin_usuario')) {
                throw new Exception('Usuário referenciado não encontrado', 409);
            }

            if (str_contains($e->getMessage(), 'fk_checkin_convidado')) {
                throw new Exception('Convidado referenciado não encontrado', 404);
            }

            throw new Exception('Erro ao criar checkin' , 500);
        }
    }
}
