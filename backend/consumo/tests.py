from decimal import Decimal
from datetime import timedelta
import json
from django.test import TestCase, SimpleTestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from .services import MotorCalculoEnergetico, CalculoEnergeticoError, SimuladorRF05
from .models import SimulacaoConsumo, Eletrodomestico

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

    # --------------------------------------------------------------------------
    # NOVOS TESTES UNITÁRIOS ADICIONADOS AO FINAL DA SECÇÃO
    # --------------------------------------------------------------------------
    def test_model_eletrodomestico_str_representation(self):
        """Corrigido: Valida a representação em string real do modelo com a potência inclusa."""
        eletro = Eletrodomestico(nome="Micro-ondas", potencia_media_watts=1200, destaque=True)
        self.assertEqual(str(eletro), "Micro-ondas (1200W)")

    # --------------------------------------------------------------------------
    # TESTES UNITÁRIOS — calcular_consumo_eletrodomestico (RF04)
    # --------------------------------------------------------------------------

    def test_calcula_consumo_eletrodomestico_valores_validos(self):
        """Chuveiro 5500W por 10 minutos: consumo esperado 0.92 kWh e custo R$ 0.78."""
        resultado = MotorCalculoEnergetico.calcular_consumo_eletrodomestico(
            potencia_watts=5500,
            tempo_minutos=10,
            tarifa_kwh=Decimal("0.85")
        )
        self.assertEqual(resultado["consumo_estimado_kwh"], Decimal("0.92"))
        self.assertEqual(resultado["custo_estimado_reais"], Decimal("0.78"))
        self.assertEqual(resultado["tarifa_utilizada"], Decimal("0.85"))
        self.assertEqual(resultado["bandeira_tarifaria"], "verde")

    def test_calcula_consumo_eletrodomestico_potencia_zero(self):
        """Potência zero deve lançar CalculoEnergeticoError."""
        with self.assertRaises(CalculoEnergeticoError) as ctx:
            MotorCalculoEnergetico.calcular_consumo_eletrodomestico(
                potencia_watts=0, tempo_minutos=10, tarifa_kwh=Decimal("0.85")
            )
        self.assertEqual(str(ctx.exception), "A potência deve ser maior que zero.")

    def test_calcula_consumo_eletrodomestico_tempo_zero(self):
        """Tempo de uso zero deve lançar CalculoEnergeticoError."""
        with self.assertRaises(CalculoEnergeticoError) as ctx:
            MotorCalculoEnergetico.calcular_consumo_eletrodomestico(
                potencia_watts=1000, tempo_minutos=0, tarifa_kwh=Decimal("0.85")
            )
        self.assertEqual(str(ctx.exception), "O tempo de uso deve ser maior que zero.")

    def test_calcula_consumo_eletrodomestico_tarifa_zero(self):
        """Tarifa zero deve lançar CalculoEnergeticoError."""
        with self.assertRaises(CalculoEnergeticoError) as ctx:
            MotorCalculoEnergetico.calcular_consumo_eletrodomestico(
                potencia_watts=1000, tempo_minutos=30, tarifa_kwh=Decimal("0")
            )
        self.assertEqual(str(ctx.exception), "A tarifa deve ser maior que zero.")

    def test_calcula_consumo_eletrodomestico_valores_nao_numericos(self):
        """Valores não numéricos devem lançar CalculoEnergeticoError."""
        with self.assertRaises(CalculoEnergeticoError) as ctx:
            MotorCalculoEnergetico.calcular_consumo_eletrodomestico(
                potencia_watts="mil", tempo_minutos=30, tarifa_kwh=Decimal("0.85")
            )
        self.assertIn("numéricos", str(ctx.exception))


# ==============================================================================
# 2. TESTES DE INTEGRAÇÃO (Foco nas Rotas da API e Banco de Dados - views.py)
# ==============================================================================
class ConsumoAPITests(TestCase):

    def setUp(self):
        # Cria um usuário de testes para rotas autenticadas
        self.usuario = User.objects.create_user(username="gabriel", password="senha_segura123")
        self.url_calcular = reverse("calcular-media")
        self.url_simulacoes = reverse("criar-simulacao")
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
        """Segurança: Garante que a API bloqueia com 401 a criação de simulação se o usuário não estiver logado."""
        payload = {
            "titulo": "Minha Casa Fictícia",
            "consumos": [200, 250, 300]
        }
        resposta = self.client.post(self.url_simulacoes, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(resposta.status_code, 401)

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


# ------------------------------------------------------------------------------
# NOVA CLASSE DE INTEGRAÇÃO ADICIONADA AO FINAL DA SECÇÃO DE INTEGRAÇÃO
# ------------------------------------------------------------------------------
class EletrodomesticosAPITests(TestCase):

    def setUp(self):
        self.usuario = User.objects.create_user(username="teste_eletro", password="123")
        self.url_listagem = reverse("listar-eletrodomesticos")

        # Apenas itens com destaque=True aparecem na listagem padrão (Top 10)
        self.geladeira = Eletrodomestico.objects.create(
            nome="Geladeira",
            potencia_media_watts=250,
            tempo_medio_uso_minutos=240,
            descricao_uso="Funcionamento efetivo estimado em 4 horas por dia",
            destaque=True
        )
        self.refrigerador = Eletrodomestico.objects.create(
            nome="Refrigerador",
            potencia_media_watts=300,
            tempo_medio_uso_minutos=240,
            descricao_uso="Funcionamento efetivo estimado em 4 horas por dia",
            destaque=True
        )
        # Item sem destaque — só aparece na busca
        self.fogao = Eletrodomestico.objects.create(
            nome="Fogão",
            potencia_media_watts=50,
            tempo_medio_uso_minutos=15,
            descricao_uso="Uso aproximado de 15 minutos",
            destaque=False
        )

    def test_api_listagem_padrao_retorna_apenas_destaques(self):
        """Sem busca, a API deve retornar apenas os itens com destaque=True."""
        resposta = self.client.get(self.url_listagem)
        self.assertEqual(resposta.status_code, 200)
        dados = resposta.json()
        self.assertEqual(len(dados["eletrodomesticos"]), 2)
        for item in dados["eletrodomesticos"]:
            self.assertTrue(item["destaque"])

    def test_api_listagem_retorna_campos_completos_da_rf04(self):
        """Valida que a API devolve todos os campos exigidos pela RF04."""
        self.client.login(username="teste_eletro", password="123")
        resposta = self.client.get(self.url_listagem)

        self.assertEqual(resposta.status_code, 200)
        dados = resposta.json()
        self.assertGreater(len(dados["eletrodomesticos"]), 0)

        item = dados["eletrodomesticos"][0]
        # Campos básicos (RF03)
        self.assertIn("nome", item)
        self.assertIn("potencia_media_watts", item)
        self.assertIn("destaque", item)
        # Campos novos da RF04
        self.assertIn("consumo_estimado_kwh", item)
        self.assertIn("custo_estimado_reais", item)
        self.assertIn("descricao_uso", item)
        self.assertIn("tempo_medio_uso_minutos", item)
        self.assertIn("tarifa_utilizada", item)
        self.assertIn("bandeira_tarifaria", item)
        self.assertIn("observacao", item)

    def test_api_busca_pelo_parametro_correto(self):
        """A busca deve usar o parâmetro 'busca' e encontrar item não-destaque."""
        resposta = self.client.get(self.url_listagem, {"busca": "fog"})
        self.assertEqual(resposta.status_code, 200)
        dados = resposta.json()
        # O fogão não é destaque, mas deve aparecer na busca
        self.assertEqual(len(dados["eletrodomesticos"]), 1)
        self.assertEqual(dados["eletrodomesticos"][0]["nome"], "Fogão")

    def test_api_busca_sem_resultado_retorna_mensagem(self):
        """Busca que não encontra nada deve retornar HTTP 200 com mensagem informativa."""
        resposta = self.client.get(self.url_listagem, {"busca": "eletrodomestico_inexistente_xyz"})
        self.assertEqual(resposta.status_code, 200)
        dados = resposta.json()
        self.assertTrue(dados["ok"])
        self.assertEqual(dados["eletrodomesticos"], [])
        self.assertIn("mensagem", dados)
        self.assertIn("inform", dados["mensagem"])  # valida que a mensagem é informativa

    def test_api_busca_normaliza_acentos(self):
        """A busca deve encontrar 'Fogão' ao digitar 'fogao' (sem acento)."""
        resposta = self.client.get(self.url_listagem, {"busca": "fogao"})
        self.assertEqual(resposta.status_code, 200)
        dados = resposta.json()
        self.assertEqual(len(dados["eletrodomesticos"]), 1)
        self.assertEqual(dados["eletrodomesticos"][0]["nome"], "Fogão")

    def test_api_permite_listagem_deslogado(self):
        """O catálogo de eletrodomésticos é público — não exige login."""
        resposta = self.client.get(self.url_listagem)
        self.assertEqual(resposta.status_code, 200)


# ------------------------------------------------------------------------------
# testes da RF05 e garantia de regras de negocios 
# ------------------------------------------------------------------------------

class RF05SimuladorTests(TestCase):
    def setUp(self): ##testar os maiores consumidores
        self.geladeira = Eletrodomestico.objects.create(
            nome="Geladeira", 
            potencia_media_watts=250, 
            tempo_medio_uso_minutos=480
        )
        self.chuveiro = Eletrodomestico.objects.create(
            nome="Chuveiro Elétrico", 
            potencia_media_watts=5500, 
            tempo_medio_uso_minutos=40
        )
        self.ar_condicionado = Eletrodomestico.objects.create(
            id=14,
            nome="Ar Condicionado",
            potencia_media_watts=1500,
            tempo_medio_uso_minutos=480
        )
    # ==========================================
    # CENÁRIOS: FAMÍLIAS SEM AR-CONDICIONADO
    # Roteiro: Ideal <= 180 | Média <= 210 | Acima > 210
    # ==========================================

    def test_sem_ar_dentro_do_ideal(self):
        resultado = SimuladorRF05.gerar_analise_e_recomendacoes(
            consumo_real_kwh=180, 
            ids_eletrodomesticos=[self.geladeira.nome, self.chuveiro.nome]
        )
        self.assertEqual(resultado["status_consumo"], "dentro_do_ideal")
        self.assertIn("Excelente", resultado["recomendacao"])

    def test_sem_ar_na_media(self):
        resultado = SimuladorRF05.gerar_analise_e_recomendacoes(
            consumo_real_kwh=210, 
            ids_eletrodomesticos=[self.geladeira.nome, self.chuveiro.nome]
        )
        self.assertEqual(resultado["status_consumo"], "na_media")
        self.assertIn("Você está na média do DF", resultado["recomendacao"])

    def test_sem_ar_acima_do_ideal(self):
        resultado = SimuladorRF05.gerar_analise_e_recomendacoes(
            consumo_real_kwh=211, 
            ids_eletrodomesticos=[self.geladeira.nome, self.chuveiro.nome]
        )
        self.assertEqual(resultado["status_consumo"], "acima_do_ideal")
        self.assertIn("Chuveiro Elétrico", resultado["recomendacao"])

    # ==========================================
    # CENÁRIOS: FAMÍLIAS COM AR-CONDICIONADO
    # Roteiro: Ideal <= 350 | Média <= 450 | Acima > 450
    # ==========================================

    def test_com_ar_dentro_do_ideal(self):
        resultado = SimuladorRF05.gerar_analise_e_recomendacoes(
            consumo_real_kwh=350, 
            ids_eletrodomesticos=[self.geladeira.nome, self.ar_condicionado.nome]
        )
        self.assertEqual(resultado["status_consumo"], "dentro_do_ideal")

    def test_com_ar_na_media(self):
        resultado = SimuladorRF05.gerar_analise_e_recomendacoes(
            consumo_real_kwh=450, 
            ids_eletrodomesticos=[self.geladeira.nome, self.chuveiro.nome, self.ar_condicionado.nome]
        )
        self.assertEqual(resultado["status_consumo"], "na_media")

    def test_com_ar_acima_do_ideal(self):
        resultado = SimuladorRF05.gerar_analise_e_recomendacoes(
            consumo_real_kwh=451, 
            ids_eletrodomesticos=[self.geladeira.nome, self.chuveiro.nome, self.ar_condicionado.nome]
        )
        self.assertEqual(resultado["status_consumo"], "acima_do_ideal")
        # O chuveiro ainda deve ser apontado como o maior vilão
        self.assertIn("Chuveiro Elétrico", resultado["recomendacao"])

    # ==========================================
    # REGRAS DE EXCEÇÃO E BLINDAGEM
    # ==========================================

    def test_geladeira_nunca_e_recomendada_para_desligar(self):
        resultado = SimuladorRF05.gerar_analise_e_recomendacoes(
            consumo_real_kwh=250, 
            ids_eletrodomesticos=[self.geladeira.nome]
        )
        self.assertEqual(resultado["status_consumo"], "acima_do_ideal")
        self.assertNotIn("Geladeira", resultado["recomendacao"])
        self.assertIn("Verifique se não existem luzes acesas", resultado["recomendacao"])

# ------------------------------------------------------------------------------
# TESTES DA RF09 — RELATÓRIO DE GASTOS
# ------------------------------------------------------------------------------

class RelatorioGastosRF09Tests(TestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(username="usuario_rf09", password="senha123")
        self.outro_usuario = User.objects.create_user(username="outro_rf09", password="senha123")
        self.url_rf05 = reverse("analise-consumo-rf05")
        self.url_relatorio = reverse("relatorio-gastos")

        Eletrodomestico.objects.create(
            nome="Chuveiro elétrico",
            potencia_media_watts=5500,
            tempo_medio_uso_minutos=10,
            descricao_uso="Uso médio de 10 minutos por dia",
            destaque=True,
        )

    def test_rf05_salva_simulacao_com_data_e_custo(self):
        self.client.login(username="usuario_rf09", password="senha123")
        resposta = self.client.post(
            self.url_rf05,
            data=json.dumps({
                "consumo_real_kwh": 250,
                "eletrodomesticos_selecionados": ["Chuveiro elétrico"],
            }),
            content_type="application/json",
        )

        self.assertEqual(resposta.status_code, 201)
        self.assertEqual(SimulacaoConsumo.objects.filter(usuario=self.usuario).count(), 1)

        simulacao = SimulacaoConsumo.objects.get(usuario=self.usuario)
        self.assertIsNotNone(simulacao.criado_em)
        self.assertEqual(simulacao.meses_analisados, 1)
        self.assertEqual(simulacao.consumo_medio_mensal_kwh, Decimal("250.00"))
        self.assertEqual(simulacao.custo_estimado_reais, Decimal("212.50"))

    def test_relatorio_funciona_com_apenas_um_mes(self):
        SimulacaoConsumo.objects.create(
            usuario=self.usuario,
            titulo="Análise única",
            meses_analisados=1,
            total_consumo_mensal_kwh=Decimal("180.00"),
            consumo_medio_mensal_kwh=Decimal("180.00"),
            custo_estimado_reais=Decimal("153.00"),
            status_consumo="dentro_do_ideal",
            recomendacao="Consumo dentro do esperado.",
        )

        self.client.login(username="usuario_rf09", password="senha123")
        resposta = self.client.get(self.url_relatorio)

        self.assertEqual(resposta.status_code, 200)
        dados = resposta.json()
        self.assertTrue(dados["ok"])
        self.assertEqual(len(dados["series_mensais"]), 1)
        self.assertIsNone(dados["series_mensais"][0]["variacao_percentual"])
        self.assertEqual(dados["resumo"]["total_simulacoes"], 1)

    def test_relatorio_isola_dados_por_usuario(self):
        SimulacaoConsumo.objects.create(
            usuario=self.usuario,
            titulo="Simulação do usuário correto",
            meses_analisados=1,
            total_consumo_mensal_kwh=Decimal("120.00"),
            consumo_medio_mensal_kwh=Decimal("120.00"),
            custo_estimado_reais=Decimal("102.00"),
        )
        SimulacaoConsumo.objects.create(
            usuario=self.outro_usuario,
            titulo="Simulação de outro usuário",
            meses_analisados=1,
            total_consumo_mensal_kwh=Decimal("999.00"),
            consumo_medio_mensal_kwh=Decimal("999.00"),
            custo_estimado_reais=Decimal("849.15"),
        )

        self.client.login(username="usuario_rf09", password="senha123")
        resposta = self.client.get(self.url_relatorio)

        self.assertEqual(resposta.status_code, 200)
        historico = resposta.json()["historico"]
        titulos = [item["titulo"] for item in historico]

        self.assertEqual(titulos, ["Simulação do usuário correto"])
        self.assertNotIn("Simulação de outro usuário", titulos)

    def test_relatorio_calcula_variacao_entre_meses(self):
        primeira = SimulacaoConsumo.objects.create(
            usuario=self.usuario,
            titulo="Mês anterior",
            meses_analisados=1,
            total_consumo_mensal_kwh=Decimal("200.00"),
            consumo_medio_mensal_kwh=Decimal("200.00"),
            custo_estimado_reais=Decimal("170.00"),
        )
        segunda = SimulacaoConsumo.objects.create(
            usuario=self.usuario,
            titulo="Mês atual",
            meses_analisados=1,
            total_consumo_mensal_kwh=Decimal("150.00"),
            consumo_medio_mensal_kwh=Decimal("150.00"),
            custo_estimado_reais=Decimal("127.50"),
        )

        agora = timezone.now()
        SimulacaoConsumo.objects.filter(id=primeira.id).update(criado_em=agora - timedelta(days=35))
        SimulacaoConsumo.objects.filter(id=segunda.id).update(criado_em=agora)

        self.client.login(username="usuario_rf09", password="senha123")
        resposta = self.client.get(self.url_relatorio)

        self.assertEqual(resposta.status_code, 200)
        series = resposta.json()["series_mensais"]
        self.assertEqual(len(series), 2)
        self.assertEqual(series[1]["variacao_percentual"], "-25.00")
