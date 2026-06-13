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
        $query = $this->db->query("SELECT c.id_checkin, c.data_e_hora, c.status,
        co.nome as nome_convidado, co.email, co.sobrenome as sobrenome_convidado, co.id_convidado, co.confirmacao, co.cpf as cpf_convidado, u.nome as nome_usuario, u.cpf  as cpf_usuario
        FROM convidado co  LEFT JOIN checkin c  ON c.convidado_idconvidado = co.id_convidado LEFT JOIN usuario u ON c.usuario_idusuario = u.id_usuario WHERE co.confirmacao IN ('confirmado', 'pendente') ");

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
                'id_checkin' => $row['id_checkin'],

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

            throw new Exception('Erro ao criar checkin', 500);
        }
    }
    public function cancelarCheckin($emailConvidado, $idCheckin, $jwt)
    {
        try {



            $convidado = new ConvidadoService()->buscarConvidadoPorEmail($emailConvidado);

            if ($convidado['sucesso'] === false) {
                throw new Exception($convidado['mensagem'], $convidado['codigo']);
            }


            if ($convidado['dados']['confirmacao'] === 'confirmado' && $jwt->dados->cargo_usuario !== 'administrador') {
                throw new Exception('Não é possivel cancelar um convidado já confirmado', 409);
            }

            $this->db->beginTransaction();

           $stmt1 = $this->db->prepare('UPDATE convidado SET confirmacao = :status WHERE email = :email_antigo');
    $stmt1->execute([
        ':status' => 'cancelado', 
        ':email_antigo' => $emailConvidado
    ]);

   
    $stmt2 = $this->db->prepare('UPDATE checkin SET status = :status_checkin WHERE id_checkin = :id_checkin');
    $stmt2->execute([
        ':status_checkin' => 'não realizado',
        ':id_checkin' => $idCheckin
    ]);

          $this->db->commit();

            return [
                'sucesso' => true,
                'mensagem' => 'Checkin cancelado com sucesso'
            ];
        } catch (PDOException $e) {


          
$this->db->rollBack();
            throw new Exception('Erro ao cancelar checkin' . $e->getMessage(), 500);
        }
    }
}
