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

    public function buscarCheckinPorId($idCheckin)
    {
        if (empty($idCheckin)) {
            throw new Exception('Dados inválidos', 400);
        }

        $buscar = $this->db->prepare('SELECT * FROM checkin WHERE id_checkin = :id_checkin');

        $buscar->execute([
            ':id_checkin' => $idCheckin
        ]);

        $checkin = $buscar->fetch();

        if (empty($checkin)) {
            return [
                'sucesso' => false,
                'mensagem' => "Checkin não encontrado",
                'codigo' => 404
            ];
        }

        $dt = new DateTime($checkin['data_e_hora']);
        $checkin['data_e_hora'] = $dt->format('d/m/Y H:i:s');

        return [
            'sucesso' => true,
            'dados' => $checkin
        ];
    }



    public function listarCheckins()
    {
        $query = $this->db->query("SELECT c.id_checkin, c.data_e_hora,
        co.nome as nome_convidado, co.id_convidado, co.confirmacao, co.cpf as cpf_convidado, u.nome as nome_usuario, u.cpf as cpf_usuario
        FROM convidado co LEFT JOIN checkin c ON c.convidado_idconvidado = co.id_convidado LEFT JOIN usuario u ON c.usuario_idusuario = u.id_usuario");

        $query->execute();
        $resultado = [];

        while ($row = $query->fetch()) {
            $dt = new DateTime($row['data_e_hora']);
            $dataFormatada = $dt->format('d/m/Y H:i:s');
            
            $resultado[] = [
                'id_convidado' => $row['id_convidado'],
                'data_e_hora' => $dataFormatada,
                'convidado' => [
                    'nome' => $row['nome_convidado'],
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

            // Buscar checkin criado com dados do convidado e usuario
            $buscar = $this->db->prepare("SELECT c.id_checkin, c.data_e_hora, co.nome as nome_convidado, co.cpf as cpf_convidado, u.nome as nome_usuario, u.cpf as cpf_usuario
                FROM checkin c INNER JOIN convidado co ON c.convidado_idconvidado = co.id_convidado INNER JOIN usuario u ON c.usuario_idusuario = u.id_usuario
                WHERE c.id_checkin = :id_checkin");

            $buscar->execute([
                ':id_checkin' => $idInserido
            ]);

            $row = $buscar->fetch();

            $dt = new DateTime($row['data_e_hora']);
            $dataFormatada = $dt->format('d/m/Y H:i:s');

            $checkinObj = [
                'id_checkin' => $row['id_checkin'],
                'data_e_hora' => $dataFormatada,
                'convidado' => [
                    'nome' => $row['nome_convidado'],
                    'cpf' => $row['cpf_convidado']
                ],
                'usuario' => [
                    'nome' => $row['nome_usuario'],
                    'cpf' => $row['cpf_usuario']
                ]
            ];

            return [
                'sucesso' => true,
                'dados' => [
                    'checkin' => $checkinObj,
                ],
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

            throw new Exception('Erro ao criar checkin' . $e->getMessage(), 500);
        }
    }
}
