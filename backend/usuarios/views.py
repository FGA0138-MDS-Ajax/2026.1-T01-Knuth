import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.conf import settings


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
                    "nome": usuario.first_name,
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


@csrf_exempt
@require_POST
def fazer_logout(request):
    logout(request)
    return JsonResponse(
        {"ok": True, "mensagem": "Logout realizado com sucesso."},
        status=200,
    )



@csrf_exempt
@require_POST
def esqueci_senha(request):
    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip()
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({"detail": "Requisição inválida."}, status=400)
    
    if not email:
        return JsonResponse({"detail": "Informe um email."}, status=400)
    

    usuario = User.objects.filter(email__iexact=email, is_active=True).first()
    if usuario:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"/esqueceu-sua-senha/{uid}/{token}"

        send_mail(
            titulo="Recuperação de senha - EducaEnergia",
            mensagem=f"Clique no link para redefinir sua senha: {reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

    return JsonResponse(
        {"detail": "Se o e-mail existir em nossa base, você receberá as instruções em breve."},
        status=200,
    )


@csrf_exempt
@require_POST
def reseta_senha(request):
    try:
        data = json.loads(request.body)
        uidb64 = data.get("uid")
        token = data.get("token")
        new_password = data.get("password")
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({"detail": "Requisição inválida."}, status=400)

    if not uidb64 or not token or not new_password:
        return JsonResponse({"detail": "Dados incompletos."}, status=400)

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        usuario = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        usuario = None

    if usuario is None or not default_token_generator.check_token(usuario, token):
        return JsonResponse({"detail": "Link inválido ou expirado."}, status=400)

    try:
        validate_password(new_password, usuario=usuario)
    except ValidationError as e:
        return JsonResponse({"detail": list(e.messages)}, status=400)

    usuario.set_password(new_password)
    usuario.save()

    return JsonResponse({"detail": "Senha alterada com sucesso!"}, status=200)