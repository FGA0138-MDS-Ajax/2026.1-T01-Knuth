"""
Testes de segurança e CRUD — Painel Administrativo (RF10)

Cobertura:
  - Acesso sem autenticação    → 403
  - Acesso com usuário comum   → 403
  - Acesso com admin (is_staff)→ 200/201/204
  - CRUD completo: bandeiras, eletrodomesticos, modulos, quizzes
  - GET /api/admin/estatisticas/
"""
import json

from django.contrib.auth.models import User
from django.test import Client, TestCase

from consumo.models import Eletrodomestico
from educacao.models import ModuloEducativo
from .models import BandeiraTarifaria, QuizPergunta


class SetupMixin:
    """Cria usuários e objetos base reutilizados em todos os testes."""

    def _setup(self):
        self.client = Client()

        # Usuário comum
        self.usuario_comum = User.objects.create_user(
            username='comum@teste.com',
            password='senha123',
            is_staff=False,
        )

        # Administrador
        self.admin = User.objects.create_user(
            username='admin@teste.com',
            password='senha123',
            is_staff=True,
        )

        # Módulo educativo base (necessário para quizzes)
        self.modulo = ModuloEducativo.objects.create(
            modulo_id=99,
            titulo='Módulo Teste',
            descricao='Descrição teste',
            duracao='5 min',
            ordem=99,
            ativo=True,
        )

    def _login_admin(self):
        self.client.login(username='admin@teste.com', password='senha123')

    def _login_comum(self):
        self.client.login(username='comum@teste.com', password='senha123')

    def _logout(self):
        self.client.logout()


# ──────────────────────────────────────────────────────────────────────────────
# Testes de segurança (403)
# ──────────────────────────────────────────────────────────────────────────────

class TestSegurancaAdmin(SetupMixin, TestCase):
    """
    Garante que TODAS as rotas /api/admin/** retornam 403 para
    usuários não autenticados e usuários comuns.
    """
    ROTAS_GET = [
        '/api/admin/bandeiras/',
        '/api/admin/eletrodomesticos/',
        '/api/admin/modulos/',
        '/api/admin/quizzes/',
        '/api/admin/estatisticas/',
    ]

    def setUp(self):
        self._setup()

    def test_sem_autenticacao_retorna_403(self):
        for rota in self.ROTAS_GET:
            with self.subTest(rota=rota):
                resp = self.client.get(rota)
                self.assertEqual(resp.status_code, 403, f"Rota {rota} deveria retornar 403 sem login")

    def test_usuario_comum_retorna_403(self):
        self._login_comum()
        for rota in self.ROTAS_GET:
            with self.subTest(rota=rota):
                resp = self.client.get(rota)
                self.assertEqual(resp.status_code, 403, f"Rota {rota} deveria retornar 403 para usuário comum")

    def test_usuario_comum_post_retorna_403(self):
        self._login_comum()
        resp = self.client.post(
            '/api/admin/bandeiras/',
            data=json.dumps({"nome": "verde", "valor_adicional_reais": "0.00"}),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 403)

    def test_admin_nao_recebe_403(self):
        self._login_admin()
        for rota in self.ROTAS_GET:
            with self.subTest(rota=rota):
                resp = self.client.get(rota)
                self.assertNotEqual(resp.status_code, 403, f"Admin não deve receber 403 em {rota}")


# ──────────────────────────────────────────────────────────────────────────────
# CRUD — Bandeiras Tarifárias
# ──────────────────────────────────────────────────────────────────────────────

class TestBandeiras(SetupMixin, TestCase):

    def setUp(self):
        self._setup()
        self._login_admin()

    def test_listar_bandeiras_vazio(self):
        resp = self.client.get('/api/admin/bandeiras/')
        self.assertEqual(resp.status_code, 200)
        dados = resp.json()
        self.assertIn('resultados', dados)

    def test_criar_bandeira(self):
        payload = {
            "nome": "verde",
            "valor_adicional_reais": "0.00",
            "descricao": "Condições favoráveis.",
            "ativa": True,
        }
        resp = self.client.post(
            '/api/admin/bandeiras/',
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 201)
        dados = resp.json()
        self.assertEqual(dados['nome'], 'verde')
        self.assertTrue(dados['ativa'])

    def test_atualizar_bandeira(self):
        bandeira = BandeiraTarifaria.objects.create(
            nome='amarela', valor_adicional_reais='1.50', descricao='Atenção.', ativa=False
        )
        payload = {"ativa": True, "descricao": "Atualizada."}
        resp = self.client.put(
            f'/api/admin/bandeiras/{bandeira.id}/',
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()['ativa'])

    def test_deletar_bandeira(self):
        bandeira = BandeiraTarifaria.objects.create(
            nome='vermelha_1', valor_adicional_reais='3.00', ativa=False
        )
        resp = self.client.delete(f'/api/admin/bandeiras/{bandeira.id}/')
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(BandeiraTarifaria.objects.filter(pk=bandeira.id).exists())

    def test_deletar_bandeira_inexistente(self):
        resp = self.client.delete('/api/admin/bandeiras/9999/')
        self.assertEqual(resp.status_code, 404)


# ──────────────────────────────────────────────────────────────────────────────
# CRUD — Eletrodomésticos
# ──────────────────────────────────────────────────────────────────────────────

class TestEletrodomesticos(SetupMixin, TestCase):

    def setUp(self):
        self._setup()
        self._login_admin()

    def test_listar_eletrodomesticos(self):
        resp = self.client.get('/api/admin/eletrodomesticos/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('resultados', resp.json())

    def test_criar_eletrodomestico(self):
        payload = {
            "nome": "Liquidificador Teste",
            "potencia_media_watts": 500,
            "tempo_medio_uso_minutos": 10,
            "descricao_uso": "Uso esporádico",
            "destaque": False,
        }
        resp = self.client.post(
            '/api/admin/eletrodomesticos/',
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.json()['nome'], 'Liquidificador Teste')

    def test_atualizar_eletrodomestico(self):
        eletro = Eletrodomestico.objects.create(
            nome='Ventilador Teste', potencia_media_watts=70, destaque=False
        )
        resp = self.client.put(
            f'/api/admin/eletrodomesticos/{eletro.id}/',
            data=json.dumps({"destaque": True}),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()['destaque'])

    def test_deletar_eletrodomestico(self):
        eletro = Eletrodomestico.objects.create(
            nome='Ferro de Passar Teste', potencia_media_watts=1000
        )
        resp = self.client.delete(f'/api/admin/eletrodomesticos/{eletro.id}/')
        self.assertEqual(resp.status_code, 204)


# ──────────────────────────────────────────────────────────────────────────────
# CRUD — Módulos Educativos
# ──────────────────────────────────────────────────────────────────────────────

class TestModulos(SetupMixin, TestCase):

    def setUp(self):
        self._setup()
        self._login_admin()

    def test_listar_modulos(self):
        resp = self.client.get('/api/admin/modulos/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('resultados', resp.json())

    def test_criar_modulo(self):
        payload = {
            "modulo_id": 50,
            "titulo": "Módulo Admin Teste",
            "descricao": "Criado via painel.",
            "duracao": "3 min",
            "ordem": 50,
            "ativo": True,
        }
        resp = self.client.post(
            '/api/admin/modulos/',
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.json()['titulo'], 'Módulo Admin Teste')

    def test_atualizar_modulo(self):
        resp = self.client.put(
            f'/api/admin/modulos/{self.modulo.id}/',
            data=json.dumps({"ativo": False}),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json()['ativo'])

    def test_deletar_modulo(self):
        modulo_temp = ModuloEducativo.objects.create(
            modulo_id=98, titulo='Temp', descricao='Temp', duracao='1 min', ordem=98
        )
        resp = self.client.delete(f'/api/admin/modulos/{modulo_temp.id}/')
        self.assertEqual(resp.status_code, 204)


# ──────────────────────────────────────────────────────────────────────────────
# CRUD — Quizzes
# ──────────────────────────────────────────────────────────────────────────────

class TestQuizzes(SetupMixin, TestCase):

    def setUp(self):
        self._setup()
        self._login_admin()

    def test_listar_quizzes(self):
        resp = self.client.get('/api/admin/quizzes/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('resultados', resp.json())

    def test_criar_quiz(self):
        payload = {
            "modulo_id": 99,  # modulo criado em SetupMixin
            "pergunta": "Qual aparelho consome mais energia?",
            "alternativas": ["Geladeira", "Chuveiro", "TV"],
            "resposta_correta": 1,
            "explicacao": "O chuveiro elétrico tem alta potência.",
        }
        resp = self.client.post(
            '/api/admin/quizzes/',
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 201)
        dados = resp.json()
        self.assertEqual(dados['modulo_id'], 99)
        self.assertEqual(dados['resposta_correta'], 1)

    def test_criar_quiz_modulo_inexistente(self):
        payload = {
            "modulo_id": 9999,
            "pergunta": "?",
            "alternativas": ["A", "B"],
            "resposta_correta": 0,
        }
        resp = self.client.post(
            '/api/admin/quizzes/',
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 404)

    def test_atualizar_quiz(self):
        pergunta = QuizPergunta.objects.create(
            modulo=self.modulo,
            pergunta='Pergunta original?',
            alternativas=['A', 'B'],
            resposta_correta=0,
            explicacao='',
        )
        resp = self.client.put(
            f'/api/admin/quizzes/{pergunta.id}/',
            data=json.dumps({"pergunta": "Pergunta atualizada?", "resposta_correta": 1}),
            content_type='application/json',
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()['pergunta'], 'Pergunta atualizada?')

    def test_deletar_quiz(self):
        pergunta = QuizPergunta.objects.create(
            modulo=self.modulo,
            pergunta='Para deletar.',
            alternativas=['A'],
            resposta_correta=0,
        )
        resp = self.client.delete(f'/api/admin/quizzes/{pergunta.id}/')
        self.assertEqual(resp.status_code, 204)


# ──────────────────────────────────────────────────────────────────────────────
# Estatísticas
# ──────────────────────────────────────────────────────────────────────────────

class TestEstatisticas(SetupMixin, TestCase):

    def setUp(self):
        self._setup()
        self._login_admin()

    def test_estatisticas_retorna_campos_esperados(self):
        resp = self.client.get('/api/admin/estatisticas/')
        self.assertEqual(resp.status_code, 200)
        dados = resp.json()
        self.assertIn('total_usuarios', dados)
        self.assertIn('total_simulacoes', dados)
        self.assertIn('total_modulos', dados)
        self.assertIn('total_conclusoes', dados)

    def test_estatisticas_valores_sao_inteiros(self):
        resp = self.client.get('/api/admin/estatisticas/')
        dados = resp.json()
        for campo in ('total_usuarios', 'total_simulacoes', 'total_modulos', 'total_conclusoes'):
            self.assertIsInstance(dados[campo], int, f"Campo '{campo}' deve ser int")

    def test_estatisticas_contagem_usuarios(self):
        # admin e comum já foram criados no setUp → total >= 2
        resp = self.client.get('/api/admin/estatisticas/')
        self.assertGreaterEqual(resp.json()['total_usuarios'], 2)
