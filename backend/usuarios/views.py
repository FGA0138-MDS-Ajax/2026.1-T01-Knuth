import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


@csrf_exempt
@require_POST
def fazer_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body) #pacote do front
            usuario_digitado = data.get('username')
            #email = data.get("email")
            senha = data.get("senha") or data.get("password")

            if not usuario_digitado or not senha:
                return JsonResponse(
                    {"ok": False, "erro": "Nome de usuario e senha são obrigatórios."},
                    status=400
                )
            usuario = authenticate(username=usuario_digitado, password=senha)

            if usuario is None:
                return JsonResponse(
                    {"ok": False, "erro": "Nome de usuário ou senha inválidos."},
                    status=401
                )
            login(request, usuario)

            return JsonResponse({
                "ok": True,
                "mensagem": "Login realizado com sucesso.",
                "usuario": {
                    "id": usuario.id,
                    "username": usuario.username, # Ajustado para mostrar o username real
                    "email": usuario.email,
                }
            }, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse(
                {"ok": False, "erro": "JSON inválido. Falha na comunicação."},
                status=400
            )

    # Se tentarem acessar a URL direto pela barra do navegador (GET)
    return JsonResponse({"ok": False, "erro": "Método não permitido. Use POST."}, 
                        status=405)


@csrf_exempt
@require_POST
def cadastrar_usuario(request):
    try:
        data = json.loads(request.body)

        nome = data.get("nome") or data.get("name") or ""
        email = data.get("email")
        senha = data.get("senha") or data.get("password")

        if not email or not senha:
            return JsonResponse(
                {"ok": False, "erro": "E-mail e senha são obrigatórios."},
                status=400
            )

        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"ok": False, "erro": "Já existe um usuário com este e-mail."},
                status=400
            )

        usuario = User.objects.create_user(
            username=email,
            email=email,
            password=senha,
            first_name=nome
        )

        return JsonResponse(
            {
                "ok": True,
                "mensagem": "Usuário cadastrado com sucesso.",
                "usuario": {
                    "id": usuario.id,
                    "nome": usuario.first_name,
                    "email": usuario.email,
                }
            },
            status=201
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {"ok": False, "erro": "JSON inválido."},
            status=400
        )
