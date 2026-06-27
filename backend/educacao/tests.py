import json
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import ModuloEducativo, ProgressoModulo

User = get_user_model()


# ==============================================================================
# HELPERS — fábrica de módulos para os testes
# ==============================================================================

def criar_modulo(modulo_id, titulo="Módulo Teste", ordem=None, ativo=True):
    """Cria um ModuloEducativo no banco de testes com valores padrão."""
    return ModuloEducativo.objects.create(
        modulo_id=modulo_id,
        titulo=titulo or f"Módulo {modulo_id}",
        descricao=f"Descrição do módulo {modulo_id}.",
        duracao="5 min",
        ordem=ordem if ordem is not None else modulo_id,
        ativo=ativo,
    )


# ==============================================================================
# 1. TESTES DO MODELO
# ==============================================================================

class ModuloEducativoModelTest(TestCase):

    def test_str_representation(self):
        """Valida a representação em string do modelo."""
        modulo = criar_modulo(1, titulo="Entendendo sua conta de luz")
        self.assertEqual(str(modulo), "Módulo 1 — Entendendo sua conta de luz")

    def test_modulo_id_e_unico(self):
        """Dois módulos não podem ter o mesmo modulo_id."""
        from django.db import IntegrityError
        criar_modulo(1)
        with self.assertRaises(IntegrityError):
            criar_modulo(1)

    def test_modulos_ordenados_por_ordem(self):
        """A ordenação padrão do QuerySet deve seguir o campo 'ordem'."""
        criar_modulo(modulo_id=3, ordem=3)
        criar_modulo(modulo_id=1, ordem=1)
        criar_modulo(modulo_id=2, ordem=2)

        ids = list(ModuloEducativo.objects.values_list("modulo_id", flat=True))
        self.assertEqual(ids, [1, 2, 3])

    def test_str_progresso_modulo(self):
        """Valida a representação em string do ProgressoModulo."""
        usuario = User.objects.create_user(username="ana", password="123")
        modulo = criar_modulo(1)
        progresso = ProgressoModulo.objects.create(usuario=usuario, modulo=modulo)
        self.assertIn("Módulo 1", str(progresso))

    def test_unique_together_usuario_modulo(self):
        """Um usuário não pode concluir o mesmo módulo duas vezes."""
        from django.db import IntegrityError
        usuario = User.objects.create_user(username="joao", password="123")
        modulo = criar_modulo(1)
        ProgressoModulo.objects.create(usuario=usuario, modulo=modulo)
        with self.assertRaises(IntegrityError):
            ProgressoModulo.objects.create(usuario=usuario, modulo=modulo)


# ==============================================================================
# 2. TESTES DE INTEGRAÇÃO — GET /api/educacao/modulos/
# ==============================================================================

class ListarModulosAPITest(TestCase):

    def setUp(self):
        self.url = reverse("listar-modulos")
        self.usuario = User.objects.create_user(username="carlos", password="senha123")

        self.modulo1 = criar_modulo(1, titulo="Entendendo sua conta de luz", ordem=1)
        self.modulo2 = criar_modulo(2, titulo="Os vilões do consumo", ordem=2)
        self.modulo3 = criar_modulo(3, titulo="Como economizar energia", ordem=3)

    def test_listagem_publica_retorna_200(self):
        """A rota de listagem de módulos é pública e não exige autenticação."""
        resposta = self.client.get(self.url)
        self.assertEqual(resposta.status_code, 200)
        self.assertTrue(resposta.json()["ok"])

    def test_listagem_retorna_todos_os_modulos_ativos(self):
        """Todos os módulos ativos devem aparecer na listagem."""
        resposta = self.client.get(self.url)
        dados = resposta.json()
        self.assertEqual(len(dados["modulos"]), 3)

    def test_listagem_nao_retorna_modulos_inativos(self):
        """Módulos com ativo=False não devem aparecer na listagem."""
        criar_modulo(modulo_id=9, titulo="Módulo Arquivado", ordem=9, ativo=False)
        resposta = self.client.get(self.url)
        dados = resposta.json()
        # Ainda 3 — o inativo não aparece
        self.assertEqual(len(dados["modulos"]), 3)

    def test_listagem_retorna_campos_obrigatorios(self):
        """Cada módulo deve conter os campos exigidos pelo front-end."""
        resposta = self.client.get(self.url)
        item = resposta.json()["modulos"][0]
        for campo in ("modulo_id", "titulo", "descricao", "duracao", "ordem", "concluido"):
            self.assertIn(campo, item, msg=f"Campo '{campo}' ausente na resposta.")

    def test_listagem_retorna_ordenada_por_ordem(self):
        """Os módulos devem vir em ordem crescente pelo campo 'ordem'."""
        resposta = self.client.get(self.url)
        ids = [m["modulo_id"] for m in resposta.json()["modulos"]]
        self.assertEqual(ids, sorted(ids))

    def test_campo_concluido_falso_para_usuario_anonimo(self):
        """Usuário não autenticado recebe concluido=False em todos os módulos."""
        resposta = self.client.get(self.url)
        for modulo in resposta.json()["modulos"]:
            self.assertFalse(modulo["concluido"])

    def test_campo_concluido_correto_para_usuario_logado(self):
        """Módulos concluídos pelo usuário logado devem ter concluido=True."""
        ProgressoModulo.objects.create(usuario=self.usuario, modulo=self.modulo1)

        self.client.login(username="carlos", password="senha123")
        resposta = self.client.get(self.url)

        modulos = {m["modulo_id"]: m["concluido"] for m in resposta.json()["modulos"]}
        self.assertTrue(modulos[1])   # concluído
        self.assertFalse(modulos[2])  # pendente
        self.assertFalse(modulos[3])  # pendente

    def test_progresso_de_um_usuario_nao_aparece_para_outro(self):
        """O campo 'concluido' é isolado por usuário — sem contaminação cruzada."""
        outro_usuario = User.objects.create_user(username="lucas", password="456")
        # Lucas conclui o módulo 1
        ProgressoModulo.objects.create(usuario=outro_usuario, modulo=self.modulo1)

        # Carlos loga e não deve ver o módulo 1 como concluído
        self.client.login(username="carlos", password="senha123")
        resposta = self.client.get(self.url)

        modulos = {m["modulo_id"]: m["concluido"] for m in resposta.json()["modulos"]}
        self.assertFalse(modulos[1])


# ==============================================================================
# 3. TESTES DE INTEGRAÇÃO — GET /api/educacao/progresso/
# ==============================================================================

class ListarProgressoAPITest(TestCase):

    def setUp(self):
        self.url = reverse("listar-progresso")
        self.usuario = User.objects.create_user(username="maria", password="senha123")
        self.modulo1 = criar_modulo(1, ordem=1)
        self.modulo2 = criar_modulo(2, ordem=2)

    def test_usuario_anonimo_recebe_lista_vazia(self):
        """Usuário não autenticado deve receber concluidos=[] sem erro."""
        resposta = self.client.get(self.url)
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.json()["concluidos"], [])

    def test_usuario_logado_sem_progresso_recebe_lista_vazia(self):
        """Usuário logado sem nenhum módulo concluído recebe lista vazia."""
        self.client.login(username="maria", password="senha123")
        resposta = self.client.get(self.url)
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.json()["concluidos"], [])

    def test_retorna_apenas_ids_dos_modulos_concluidos(self):
        """A rota deve retornar apenas os modulo_id concluídos pelo usuário."""
        ProgressoModulo.objects.create(usuario=self.usuario, modulo=self.modulo1)

        self.client.login(username="maria", password="senha123")
        resposta = self.client.get(self.url)

        self.assertEqual(resposta.status_code, 200)
        self.assertIn(1, resposta.json()["concluidos"])
        self.assertNotIn(2, resposta.json()["concluidos"])

    def test_progresso_e_isolado_entre_usuarios(self):
        """A rota nunca deve retornar progresso de outro usuário."""
        outro = User.objects.create_user(username="pedro", password="789")
        ProgressoModulo.objects.create(usuario=outro, modulo=self.modulo1)
        ProgressoModulo.objects.create(usuario=outro, modulo=self.modulo2)

        self.client.login(username="maria", password="senha123")
        resposta = self.client.get(self.url)

        self.assertEqual(resposta.json()["concluidos"], [])


# ==============================================================================
# 4. TESTES DE INTEGRAÇÃO — POST /api/educacao/progresso/concluir/
# ==============================================================================

class MarcarConcluidoAPITest(TestCase):

    def setUp(self):
        self.url = reverse("marcar-concluido")
        self.usuario = User.objects.create_user(username="beatriz", password="senha123")
        self.modulo1 = criar_modulo(1, ordem=1)
        self.modulo2 = criar_modulo(2, ordem=2)

    def _post(self, payload):
        return self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

    def test_usuario_anonimo_recebe_401(self):
        """Sem login, a API deve bloquear com 401."""
        resposta = self._post({"modulo_id": 1})
        self.assertEqual(resposta.status_code, 401)
        self.assertFalse(resposta.json()["ok"])

    def test_marcar_modulo_existente_como_concluido(self):
        """Usuário logado conclui um módulo válido — deve gravar no banco."""
        self.client.login(username="beatriz", password="senha123")
        resposta = self._post({"modulo_id": 1})

        self.assertEqual(resposta.status_code, 200)
        self.assertTrue(resposta.json()["ok"])
        self.assertFalse(resposta.json()["ja_concluido"])
        self.assertTrue(
            ProgressoModulo.objects.filter(usuario=self.usuario, modulo=self.modulo1).exists()
        )

    def test_marcar_mesmo_modulo_duas_vezes_e_idempotente(self):
        """Chamar a rota duas vezes não duplica o registro — ja_concluido=True na segunda."""
        self.client.login(username="beatriz", password="senha123")
        self._post({"modulo_id": 1})
        resposta2 = self._post({"modulo_id": 1})

        self.assertEqual(resposta2.status_code, 200)
        self.assertTrue(resposta2.json()["ja_concluido"])
        self.assertEqual(ProgressoModulo.objects.filter(usuario=self.usuario, modulo=self.modulo1).count(), 1)

    def test_modulo_id_ausente_retorna_400(self):
        """Body sem 'modulo_id' deve retornar 400 com mensagem de erro."""
        self.client.login(username="beatriz", password="senha123")
        resposta = self._post({})
        self.assertEqual(resposta.status_code, 400)
        self.assertFalse(resposta.json()["ok"])
        self.assertIn("modulo_id", resposta.json()["erro"])

    def test_modulo_inexistente_retorna_404(self):
        """modulo_id que não existe no banco deve retornar 404."""
        self.client.login(username="beatriz", password="senha123")
        resposta = self._post({"modulo_id": 999})
        self.assertEqual(resposta.status_code, 404)
        self.assertFalse(resposta.json()["ok"])

    def test_progresso_vinculado_ao_usuario_correto(self):
        """O registro de progresso deve ser vinculado ao usuário da sessão ativa."""
        self.client.login(username="beatriz", password="senha123")
        self._post({"modulo_id": 1})

        progresso = ProgressoModulo.objects.get(modulo=self.modulo1)
        self.assertEqual(progresso.usuario, self.usuario)

    def test_concluir_modulo_nao_afeta_outro_usuario(self):
        """Concluir um módulo não deve criar progresso para outros usuários."""
        outro = User.objects.create_user(username="felipe", password="abc")
        self.client.login(username="beatriz", password="senha123")
        self._post({"modulo_id": 1})

        self.assertFalse(
            ProgressoModulo.objects.filter(usuario=outro, modulo=self.modulo1).exists()
        )


# ==============================================================================
# 5. TESTES DA TRILHA — garantir que o usuário vê o próximo módulo
# ==============================================================================

class TrilhaModulosTest(TestCase):
    """
    Garante o comportamento da trilha: ao concluir um módulo,
    o usuário deve ser capaz de acessar o próximo.
    """

    def setUp(self):
        self.usuario = User.objects.create_user(username="sofia", password="senha123")
        self.url_concluir = reverse("marcar-concluido")
        self.url_modulos = reverse("listar-modulos")

        # Cria 3 módulos em sequência
        self.mod1 = criar_modulo(1, titulo="Módulo 1", ordem=1)
        self.mod2 = criar_modulo(2, titulo="Módulo 2", ordem=2)
        self.mod3 = criar_modulo(3, titulo="Módulo 3", ordem=3)

    def _concluir(self, modulo_id):
        return self.client.post(
            self.url_concluir,
            data=json.dumps({"modulo_id": modulo_id}),
            content_type="application/json",
        )

    def test_ao_iniciar_nenhum_modulo_esta_concluido(self):
        """Usuário recém-logado não deve ter nenhum módulo concluído."""
        self.client.login(username="sofia", password="senha123")
        resposta = self.client.get(self.url_modulos)
        for modulo in resposta.json()["modulos"]:
            self.assertFalse(modulo["concluido"])

    def test_apos_concluir_modulo1_apenas_ele_aparece_concluido(self):
        """Concluir o módulo 1 não deve marcar os outros como concluídos."""
        self.client.login(username="sofia", password="senha123")
        self._concluir(1)

        resposta = self.client.get(self.url_modulos)
        modulos = {m["modulo_id"]: m["concluido"] for m in resposta.json()["modulos"]}

        self.assertTrue(modulos[1])   # concluído
        self.assertFalse(modulos[2])  # próximo — ainda não concluído
        self.assertFalse(modulos[3])  # ainda não concluído

    def test_trilha_completa_todos_os_modulos_concluidos(self):
        """Ao concluir todos os módulos, todos devem aparecer como concluídos."""
        self.client.login(username="sofia", password="senha123")
        self._concluir(1)
        self._concluir(2)
        self._concluir(3)

        resposta = self.client.get(self.url_modulos)
        for modulo in resposta.json()["modulos"]:
            self.assertTrue(modulo["concluido"], msg=f"Módulo {modulo['modulo_id']} deveria estar concluído.")

    def test_progresso_persiste_entre_requests(self):
        """O progresso gravado em uma requisição deve estar disponível na próxima."""
        self.client.login(username="sofia", password="senha123")
        self._concluir(1)
        self._concluir(2)

        # Nova requisição ao endpoint de progresso
        url_progresso = reverse("listar-progresso")
        resposta = self.client.get(url_progresso)
        concluidos = resposta.json()["concluidos"]

        self.assertIn(1, concluidos)
        self.assertIn(2, concluidos)
        self.assertNotIn(3, concluidos)

    def test_proximos_modulos_identificaveis_pela_ordem(self):
        """Após concluir o módulo 1, o sistema deve poder identificar o módulo 2 como próximo."""
        self.client.login(username="sofia", password="senha123")
        self._concluir(1)

        resposta = self.client.get(self.url_modulos)
        modulos = resposta.json()["modulos"]

        # Encontra o primeiro módulo não concluído — deve ser o de ordem 2
        proximo = next((m for m in modulos if not m["concluido"]), None)
        self.assertIsNotNone(proximo)
        self.assertEqual(proximo["modulo_id"], 2)
