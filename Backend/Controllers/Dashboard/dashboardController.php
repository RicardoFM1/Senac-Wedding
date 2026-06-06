<?php
require_once __DIR__ . "/../../Services/Convidado/convidadoService.php";

class DashboardController
{
    public function listarDashboard()
    {
        $convidados = new ConvidadoService()->listarConvidados();

        $convidadosConfirmados = null;
        $convidadosNaoConfirmados = null;
        $convidadosCancelados = null;

        foreach ($convidados['dados'] as $convidado) {
            if ($convidado['confirmacao'] === 'confirmado') {
                $convidadosConfirmados++;
            }

            if ($convidado['confirmacao'] === 'não confirmado') {
                $convidadosNaoConfirmados++;
            }

            if ($convidado['confirmacao'] === 'cancelado') {
                $convidadosCancelados++;
            }
        }

        http_response_code(200);
        echo json_encode([
            'sucesso' => true,
            'dados' => [
                'convidados' => [
                    'listagem' => $convidados['dados'] ?? [],
                    'confirmados' => $convidadosConfirmados,
                    'nao_confirmados' => $convidadosNaoConfirmados,
                    'cancelados' => $convidadosCancelados,
                    'total' => count($convidados['dados'])
                ]
            ]
        ]);
        exit;
    }
}
