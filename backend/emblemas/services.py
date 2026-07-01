from decimal import Decimal, InvalidOperation

from .models import ConquistaUsuario, Emblema


CATALOGO_EMBLEMAS = {
    'simulacao_salva': {
        'nome': 'Primeira Simulação',
        'descricao': 'Reconhece o usuário que fez login e salvou uma simulação de consumo médio.',
        'criterio': 'Faça login e salve sua primeira simulação de consumo médio.',
        'imagem': '/Simulador_em_Acao.png',
    },
    'simulador_em_acao': {
        'nome': 'Simulador em Ação',
        'descricao': 'Reconhece o primeiro uso da Análise de Consumo.',
        'criterio': 'Use a Análise de Consumo pela primeira vez.',
        'imagem': '/Simulador_em_Acao.png',
    },
    'primeiro_modulo': {
        'nome': 'Primeiro Módulo',
        'descricao': 'Reconhece a conclusão do primeiro módulo educativo.',
        'criterio': 'Conclua qualquer módulo educativo.',
        'imagem': '/Primeiro_Modulo.png',
    },
    'mente_curiosa': {
        'nome': 'Mente Curiosa',
        'descricao': 'Reconhece a conclusão de um quiz.',
        'criterio': 'Conclua o quiz de qualquer módulo.',
        'imagem': '/Mente_Curiosa.png',
    },
    'quiz_perfeito': {
        'nome': 'Quiz Perfeito',
        'descricao': 'Reconhece o usuário que acertou todas as perguntas de um quiz.',
        'criterio': 'Acerte 100% das perguntas de um quiz.',
        'imagem': '/Quiz_Perfeito.png',
    },
    'consumo_em_queda': {
        'nome': 'Consumo em Queda',
        'descricao': 'Reconhece redução de consumo comparando o mês atual com o anterior.',
        'criterio': 'Tenha o mês mais recente com consumo menor que o anterior.',
        'imagem': '/Consumo_em_Queda.png',
    },
    'detetive_de_aparelhos': {
        'nome': 'Detetive de Aparelhos',
        'descricao': 'Reconhece a consulta ao catálogo de eletrodomésticos.',
        'criterio': 'Consulte a página de Eletrodomésticos.',
        'imagem': '/Detetive_de_Aparelhos.png',
    },
    'trilha_completa': {
        'nome': 'Trilha Completa',
        'descricao': 'Reconhece a conclusão de todos os módulos educativos.',
        'criterio': 'Conclua todos os módulos educativos.',
        'imagem': '/Trilha_Completa.png',
    },
}


def garantir_catalogo_emblemas():
    """Cria/atualiza o catálogo básico de emblemas da RF08."""
    emblemas = []
    for codigo, dados in CATALOGO_EMBLEMAS.items():
        emblema, _ = Emblema.objects.update_or_create(
            codigo=codigo,
            defaults={
                'nome': dados['nome'],
                'descricao': dados['descricao'],
                'criterio': dados['criterio'],
                'imagem': dados['imagem'],
                'ativo': True,
            },
        )
        emblemas.append(emblema)
    return emblemas


def serializar_emblema(emblema, conquistado=False, desbloqueado_em=None):
    return {
        'id': emblema.codigo,
        'codigo': emblema.codigo,
        'nome': emblema.nome,
        'descricao': emblema.descricao,
        'comoDesbloquear': emblema.criterio,
        'criterio': emblema.criterio,
        'imagem': emblema.imagem,
        'conquistado': conquistado,
        'desbloqueado_em': desbloqueado_em.isoformat() if desbloqueado_em else None,
    }


def desbloquear_emblema(usuario, codigo):
    """
    Desbloqueia um emblema para o usuário autenticado.
    Retorna (emblema, criado). Se o usuário não estiver logado ou o código for inválido,
    retorna (None, False).
    """
    if not usuario or not getattr(usuario, 'is_authenticated', False):
        return None, False

    garantir_catalogo_emblemas()

    try:
        emblema = Emblema.objects.get(codigo=codigo, ativo=True)
    except Emblema.DoesNotExist:
        return None, False

    conquista, criado = ConquistaUsuario.objects.get_or_create(
        usuario=usuario,
        emblema=emblema,
    )
    return emblema, criado


def desbloquear_varios(usuario, codigos):
    """Desbloqueia vários emblemas e retorna payload somente dos novos."""
    novos = []
    for codigo in codigos:
        emblema, criado = desbloquear_emblema(usuario, codigo)
        if emblema and criado:
            novos.append(serializar_emblema(emblema, conquistado=True))
    return novos


def listar_emblemas_do_usuario(usuario):
    garantir_catalogo_emblemas()

    conquistas_por_codigo = {}
    if usuario and getattr(usuario, 'is_authenticated', False):
        conquistas = (
            ConquistaUsuario.objects
            .filter(usuario=usuario, emblema__ativo=True)
            .select_related('emblema')
        )
        conquistas_por_codigo = {
            conquista.emblema.codigo: conquista
            for conquista in conquistas
        }

    emblemas = []
    desbloqueados = []
    for emblema in Emblema.objects.filter(ativo=True).order_by('id'):
        conquista = conquistas_por_codigo.get(emblema.codigo)
        conquistado = conquista is not None
        if conquistado:
            desbloqueados.append(emblema.codigo)
        emblemas.append(
            serializar_emblema(
                emblema,
                conquistado=conquistado,
                desbloqueado_em=conquista.desbloqueado_em if conquista else None,
            )
        )

    return {
        'emblemas': emblemas,
        'desbloqueados': desbloqueados,
    }


def houve_reducao_no_ultimo_mes(consumos):
    """Compara o mês atual com o mês anterior. Retorna True se o último for menor."""
    if not consumos or len(consumos) < 2:
        return False

    try:
        anterior = Decimal(str(consumos[-2]))
        atual = Decimal(str(consumos[-1]))
    except (InvalidOperation, TypeError, ValueError):
        return False

    return atual < anterior


def emblemas_por_consumos(usuario, consumos):
    codigos = []
    if houve_reducao_no_ultimo_mes(consumos):
        codigos.append('consumo_em_queda')
    return desbloquear_varios(usuario, codigos)
