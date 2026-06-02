import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse


class UsuariosAPITestCase(TestCase):
    def setUp(self):
        """
        O Django executa este método antes de CADA teste.
        Aqui criamos o cliente de simulação e um usuário de teste no banco isolado.
        """
        self.client = Client()

        # Criamos um usuário padrão para testar o login
        self.usuario_senha = "senha_segura_123"
        self.usuario = User.objects.create_user(
            username="teste@aluno.unb.br",
            email="teste@aluno.unb.br",
            password=self.usuario_senha,
            first_name="Gabriel Silva"
        )

        # Busca as URLs dinamicamente usando os 'name' definidos em urls.py
        self.url_login = reverse('login')
        self.url_cadastro = reverse('cadastro')

    # ==========================================
    # TESTES DA VIEW DE LOGIN (fazer_login)
    # ==========================================

    def test_login_sucesso(self):
        """Teste de Integração: Login com credenciais totalmente válidas."""
        payload = {
            "username": "teste@aluno.unb.br",
            "senha": "senha_segura_123"
        }
        resposta = self.client.post(
            self.url_login,
            data=json.dumps(payload),
            content_type="application/json"
        )
        dados = resposta.json()

        self.assertEqual(resposta.status_code, 200)
        self.assertTrue(dados["ok"])
        self.assertEqual(dados["mensagem"], "Login realizado com sucesso.")
        self.assertEqual(dados["usuario"]["username"], self.usuario.username)

    def test_login_senha_incorreta(self):
        """Teste de Integração: Bloqueio de login com senha errada (401)."""
        payload = {
            "username": "teste@aluno.unb.br",
            "senha": "senha_errada"
        }
        resposta = self.client.post(
            self.url_login,
            data=json.dumps(payload),
            content_type="application/json"
        )
        dados = resposta.json()

        self.assertEqual(resposta.status_code, 401)
        self.assertFalse(dados["ok"])
        self.assertEqual(dados["erro"], "Nome de usuário ou senha inválidos.")

    def test_login_campos_obrigatorios_ausentes(self):
        """Teste Unitário: Validação de envio de payload sem campos obrigatórios."""
        payload = {
            "username": ""
            # sem o campo senha
        }
        resposta = self.client.post(
            self.url_login,
            data=json.dumps(payload),
            content_type="application/json"
        )
        dados = resposta.json()

        self.assertEqual(resposta.status_code, 400)
        self.assertFalse(dados["ok"])
        self.assertEqual(dados["erro"], "Nome de usuario e senha são obrigatórios.")

    def test_login_metodo_nao_permitido(self):
        """Teste Unitário: Tentar acessar a rota de login via GET deve ser rejeitado."""
        resposta = self.client.get(self.url_login)

        # O @require_POST do Django retorna automaticamente o status 405
        self.assertEqual(resposta.status_code, 405)

        # Como o Django barra antes da view gerar o JSON, validamos apenas se o método foi bloqueado
        # Se vocês preferirem testar o conteúdo em HTML gerado pelo Django:
        self.assertIn("text/html", resposta.headers["Content-Type"])

    # ==========================================
    # TESTES DA VIEW DE CADASTRO (cadastrar_usuario)
    # ==========================================

    def test_cadastro_sucesso(self):
        """Teste de Integração: Cadastro completo de um novo usuário."""
        payload = {
            "nome": "Danielly",
            "email": "danielly@aluno.unb.br",
            "senha": "senha_forte_abc"
        }
        resposta = self.client.post(
            self.url_cadastro,
            data=json.dumps(payload),
            content_type="application/json"
        )
        dados = resposta.json()

        self.assertEqual(resposta.status_code, 201)
        self.assertTrue(dados["ok"])
        self.assertEqual(dados["mensagem"], "Usuário cadastrado com sucesso.")
        self.assertEqual(dados["usuario"]["email"], "danielly@aluno.unb.br")

        # Verifica se realmente persistiu no banco de dados fantasma
        self.assertTrue(User.objects.filter(email="danielly@aluno.unb.br").exists())

    def test_cadastro_email_duplicado(self):
        """Teste de Integração: Impede cadastro com e-mail já existente."""
        payload = {
            "nome": "Outro Nome",
            "email": "teste@aluno.unb.br",  # Mesmo e-mail do usuário criado no setUp
            "senha": "outrasenha123"
        }
        resposta = self.client.post(
            self.url_cadastro,
            data=json.dumps(payload),
            content_type="application/json"
        )
        dados = resposta.json()

        self.assertEqual(resposta.status_code, 400)
        self.assertFalse(dados["ok"])
        self.assertEqual(dados["erro"], "Já existe um usuário com este e-mail.")

    def test_cadastro_json_invalido(self):
        """Teste Unitário: Envio de string malformada que quebra o parser de JSON."""
        string_corrompida = "{nome: 'Erro', email: }"
        resposta = self.client.post(
            self.url_cadastro,
            data=string_corrompida,
            content_type="application/json"
        )
        dados = resposta.json()

        self.assertEqual(resposta.status_code, 400)
        self.assertFalse(dados["ok"])
        self.assertEqual(dados["erro"], "JSON inválido.")