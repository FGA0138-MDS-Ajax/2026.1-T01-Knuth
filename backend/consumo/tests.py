from decimal import Decimal
import json
from django.test import TestCase, SimpleTestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from .services import MotorCalculoEnergetico, CalculoEnergeticoError
from .models import SimulacaoConsumo

User = get_user_model()


# ==============================================================================
# 1. TESTES UNITÁRIOS (Foco no Motor de Cálculo - services.py)
# ==============================================================================
class MotorCalculoEnergeticoTest(SimpleTestCase):

    def test_calcula_media_mensal_com_periodos_validos(self):
        """Valida o cálculo correto da média para 3, 6 e 9 meses com 2 casas decimais."""
        # Teste com 3 meses
        resultado_3 = MotorCalculoEnergetico.calcular_media_mensal([100, 150, 200])
        self.assertEqual(resultado_3["meses_analisados"], 3)
        self.assertEqual(resultado_3["consumo_total_kwh"], Decimal("450.00"))
        self.assertEqual(resultado_3["consumo_medio_mensal_kwh"], Decimal("150.00"))

        # Teste com 6 meses (Valida arredondamento de dízima: 950 / 6 = 158.3333...)
        resultado_6 = MotorCalculoEnergetico.calcular_media_mensal([100, 150, 200, 100, 150, 250])
        self.assertEqual(resultado_6["meses_analisados"], 6)
        self.assertEqual(resultado_6["consumo_total_kwh"], Decimal("950.00"))
        self.assertEqual(resultado_6["consumo_medio_mensal_kwh"], Decimal("158.33"))

    def test_nao_permite_quantidade_de_meses_invalida(self):
        """O período de análise deve ser obrigatoriamente de 3, 6 ou 9 meses."""
        periodos_invalidos = [
            [150, 200],  # 2 meses
            [100, 120, 130, 140],  # 4 meses
            [100, 110, 120, 130, 140, 150, 160]  # 7 meses
        ]
        for periodo in periodos_invalidos:
            with self.assertRaises(CalculoEnergeticoError) as contexto:
                MotorCalculoEnergetico.calcular_media_mensal(periodo)
            self.assertEqual(str(contexto.exception), "O período de análise deve ser de 3, 6 ou 9 meses.")

    def test_nao_permite_valores_nao_numericos(self):
        """O sistema deve rejeitar strings ou caracteres que não sejam números."""
        with self.assertRaises(CalculoEnergeticoError) as contexto:
            MotorCalculoEnergetico.calcular_media_mensal([100, "duzentos", 300])
        self.assertEqual(str(contexto.exception), "Os valores de consumo devem ser numéricos.")

    def test_valida_limites_minimos_e_maximos_de_consumo(self):
        """Rejeita valores abaixo de 10 kWh ou acima de 999 kWh por mês."""
        # Teste limite mínimo
        with self.assertRaises(CalculoEnergeticoError) as contexto_min:
            MotorCalculoEnergetico.calcular_media_mensal([9, 150, 200])
        self.assertEqual(str(contexto_min.exception), "O consumo mínimo aceito é de 10 kWh.")

        # Teste limite máximo
        with self.assertRaises(CalculoEnergeticoError) as contexto_max:
            MotorCalculoEnergetico.calcular_media_mensal([100, 1000, 200])
        self.assertEqual(str(contexto_max.exception), "O consumo máximo aceito é de 999 kWh.")


# ==============================================================================
# 2. TESTES DE INTEGRAÇÃO (Foco nas Rotas da API e Banco de Dados - views.py)
# ==============================================================================
class ConsumoAPITests(TestCase):

    def setUp(self):
        # Cria um usuário de testes para rotas autenticadas
        self.usuario = User.objects.create_user(username="gabriel", password="senha_segura123")
        self.url_calcular = reverse("calcular-consumo-medio")
        self.url_simulacoes = reverse("criar-simulacao-consumo")
        self.url_minhas_simulacoes = reverse("listar-minhas-simulacoes")

    def test_api_calcular_consumo_medio_sucesso(self):
        """Valida se a rota de cálculo isolado responde HTTP 200 e o formato do JSON."""
        payload = {"consumos": [120, 150, 180]}
        resposta = self.client.post(self.url_calcular, data=json.dumps(payload), content_type="application/json")

        self.assertEqual(resposta.status_code, 200)
        dados_resposta = resposta.json()
        self.assertTrue(dados_resposta["ok"])
        self.assertEqual(dados_resposta["resultado"]["consumo_medio_mensal_kwh"], "150.00")

    def test_api_calcular_consumo_medio_erro_validacao(self):
        """Valida se erros do motor retornam HTTP 400 mapeados pela view."""
        payload = {"consumos": [5, 150, 180]}  # 5 kWh quebra a regra de negócio
        resposta = self.client.post(self.url_calcular, data=json.dumps(payload), content_type="application/json")

        self.assertEqual(resposta.status_code, 400)
        dados_resposta = resposta.json()
        self.assertFalse(dados_resposta["ok"])
        self.assertIn("O consumo mínimo aceito", dados_resposta["erro"])

    def test_api_criar_simulacao_usuario_anonimo(self):
        """Cria uma simulação sem login e checa se salvou com usuario = null."""
        payload = {
            "titulo": "Minha Casa Fictícia",
            "consumos": [200, 250, 300]
        }
        resposta = self.client.post(self.url_simulacoes, data=json.dumps(payload), content_type="application/json")

        self.assertEqual(resposta.status_code, 201)
        simulacao_criada = SimulacaoConsumo.objects.get(id=resposta.json()["simulacao_id"])
        self.assertNil = self.assertIsNone(simulacao_criada.usuario)
        self.assertEqual(simulacao_criada.titulo, "Minha Casa Fictícia")
        self.assertEqual(simulacao_criada.total_consumo_mensal_kwh, Decimal("750.00"))

    def test_api_criar_simulacao_usuario_autenticado(self):
        """Faz login na API, cria a simulação e valida o vínculo com o usuário."""
        self.client.login(username="gabriel", password="senha_segura123")
        payload = {
            "titulo": "Apartamento Centro",
            "consumos": [100, 110, 120]
        }
        resposta = self.client.post(self.url_simulacoes, data=json.dumps(payload), content_type="application/json")

        self.assertEqual(resposta.status_code, 201)
        simulacao_criada = SimulacaoConsumo.objects.get(id=resposta.json()["simulacao_id"])
        self.assertEqual(simulacao_criada.usuario, self.usuario)

    def test_api_listar_apenas_minhas_simulacoes(self):
        """Garante segurança de dados: um usuário logado nunca vê simulações alheias."""
        # Criar simulação do Gabriel (usuário logado)
        SimulacaoConsumo.objects.create(
            usuario=self.usuario, titulo="Simulação do Gabriel",
            meses_analisados=3, total_consumo_mensal_kwh=300, consumo_medio_mensal_kwh=100
        )
        # Criar simulação de outro usuário
        outro_usuario = User.objects.create_user(username="lucas", password="456")
        SimulacaoConsumo.objects.create(
            usuario=outro_usuario, titulo="Simulação Secreta do Lucas",
            meses_analisados=3, total_consumo_mensal_kwh=600, consumo_medio_mensal_kwh=200
        )

        self.client.login(username="gabriel", password="senha_segura123")
        resposta = self.client.get(self.url_minhas_simulacoes)

        self.assertEqual(resposta.status_code, 200)
        lista_simulacoes = resposta.json()["simulacoes"]

        # O Gabriel só deve receber 1 simulação no array (a dele)
        self.assertEqual(len(lista_simulacoes), 1)
        self.assertEqual(lista_simulacoes[0]["titulo"], "Simulação do Gabriel")
