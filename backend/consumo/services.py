from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from .models import Eletrodomestico
from .services import SimuladorRF05
from django.test import TestCase
class CalculoEnergeticoError(ValueError):
    pass

class MotorCalculoEnergetico:
    """
     Fórmulas:
    total_consumo_kwh = soma dos consumos em kWh
    consumo_medio_kwh = total_consumo_kwh / quantidade meses
    *grafico com os consumo do meses escolhidos
    """

    @staticmethod
    def calcular_media_mensal(consumos_mensais_kwh):
        if not isinstance(consumos_mensais_kwh, list) or len(consumos_mensais_kwh) not in [3, 6, 9]:
            raise CalculoEnergeticoError("O período de análise deve ser de 3, 6 ou 9 meses.")

        soma_consumo = Decimal("0")
        
        for consumo in consumos_mensais_kwh:
            try:
                valor = Decimal(str(consumo))
            except (InvalidOperation, TypeError):
                raise CalculoEnergeticoError("Os valores de consumo devem ser numéricos.")
            
            if valor < Decimal("10"):
                raise CalculoEnergeticoError("O consumo mínimo aceito é de 10 kWh.")
            if valor > Decimal("999"):
                 raise CalculoEnergeticoError("O consumo máximo aceito é de 999 kWh.")
            
            soma_consumo += valor
            
        quantidade_meses = Decimal(len(consumos_mensais_kwh))
        consumo_medio = soma_consumo / quantidade_meses

        return {
            "meses_analisados": len(consumos_mensais_kwh),
            "consumo_total_kwh": soma_consumo.quantize(Decimal("0.01")),
            "consumo_medio_mensal_kwh": consumo_medio.quantize(Decimal("0.01")),
        }
    
    @staticmethod
    def calcular_consumo_eletrodomestico(
        potencia_watts,
        tempo_minutos,
        tarifa_kwh=Decimal("0.85")
    ):
        """
        calcula o consumo estimado de um eletrodoméstico

        fórmulas:
        consumo_kwh = potência em watts * tempo em horas / 1000
        custo_reais = consumo_kwh * tarifa_kwh

        exemplo:
        Chuveiro de 5500W por 10 minutos:
        5500 * 0.166 / 1000 = 0.916 kWh
        0.916 * 0.85 = R$ 0.78 aproximadamente
        """
        try:
            potencia = Decimal(str(potencia_watts))
            minutos = Decimal(str(tempo_minutos))
            tarifa = Decimal(str(tarifa_kwh))
        except (InvalidOperation, TypeError):
            raise CalculoEnergeticoError(
                "Potência, tempo de uso e tarifa devem ser valores numéricos."
            )

        if potencia <= 0:
            raise CalculoEnergeticoError("A potência deve ser maior que zero.")

        if minutos <= 0:
            raise CalculoEnergeticoError("O tempo de uso deve ser maior que zero.")

        if tarifa <= 0:
            raise CalculoEnergeticoError("A tarifa deve ser maior que zero.")

        tempo_horas = minutos / Decimal("60")
        consumo_kwh = potencia * tempo_horas / Decimal("1000")
        custo_reais = consumo_kwh * tarifa

        return {
            "consumo_estimado_kwh": consumo_kwh.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            ),
            "custo_estimado_reais": custo_reais.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            ),
            "tarifa_utilizada": tarifa.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            ),
            "bandeira_tarifaria": "verde",
            "observacao": "Valor estimado considerando bandeira verde. Os valores podem variar conforme a bandeira tarifária."
        }
    

class SimuladorRF05:
    @staticmethod
    def gerar_analise_e_recomendacoes(consumo_real_kwh, ids_eletrodomesticos):
        #buscar os aparelhos selecionados no banco de dados
        aparelhos = Eletrodomestico.objects.filter(id__in=ids_eletrodomesticos)
        
        consumo_estimado_mensal = Decimal("0.0")
        aparelhos_para_reduzir = [] # Lista para guardar aparelhos que podem ser otimizados

        # Calcular o consumo estimado de todos os aparelhos juntos
        for aparelho in aparelhos:
            # Fórmula: (Watts * Minutos * 30 dias) / 60000
            kwh_mensal = (Decimal(aparelho.potencia_media_watts) * Decimal(aparelho.tempo_medio_uso_minutos) * Decimal("30")) / Decimal("60000")
            consumo_estimado_mensal += kwh_mensal
            
            # Regra de Exceção: Blindar a Geladeira/Refrigerador (IDs 1 e 2) e Roteador (ID 22)
            if aparelho.id not in [1, 2, 22]:
                aparelhos_para_reduzir.append({
                    "nome": aparelho.nome,
                    "potencia": Decimal(aparelho.potencia_media_watts),
                    "kwh_mensal": kwh_mensal
                })

        #achar excesso
        excesso_kwh = Decimal(consumo_real_kwh) - consumo_estimado_mensal

        # 5. Gerar o Status e as Recomendações
        if excesso_kwh <= 0:
            return {
                "status_consumo": "dentro_do_ideal",
                "recomendacao": "Excelente! O seu consumo real está compatível (ou menor) que a estimativa dos seus aparelhos. Continue assim!"
            }
            
        else:
            
            dicas = SimuladorRF05._calcular_metas_de_reducao(excesso_kwh, aparelhos_para_reduzir)
            
            return {
                "status_consumo": "acima_do_ideal",
                "recomendacao": f"Notamos um excesso de aproximadamente {excesso_kwh:.0f} kWh. Para equilibrar sua conta, tente as seguintes metas diárias:\n" + dicas
            }

    @staticmethod
    def _calcular_metas_de_reducao(excesso_kwh, aparelhos_para_reduzir):
        """
        Engenharia reversa: Transforma os kWh excedentes em minutos para reduzir.
        """
        if not aparelhos_para_reduzir:
            return "Verifique se não existem luzes acesas ou equipamentos em stand-by consumindo energia extra."

        # Ordenar os aparelhos de maior potencia 
        aparelhos_ordenados = sorted(aparelhos_para_reduzir, key=lambda x: x["potencia"], reverse=True)
        
        #começar pelo de maior potencia
        vilao = aparelhos_ordenados[0]
        
        # Fórmula inversa para descobrir os minutos diários correspondentes a uma fatia do excesso
        # Vamos tentar sugerir abater 30% do excesso só no aparelho vilão
        meta_kwh_mensal = excesso_kwh * Decimal("0.30")
        minutos_diarios_reducao = (meta_kwh_mensal * Decimal("60000")) / (vilao["potencia"] * Decimal("30"))
        
        # Arredondar para ficar simpático (ex: 12.4 min -> 10 min, 15 min)
        minutos_arredondados = int(minutos_diarios_reducao / 5) * 5 
        if minutos_arredondados == 0:
            minutos_arredondados = 5

        return f"- Reduza cerca de {minutos_arredondados} minutos por dia do uso do(a) {vilao['nome']}."
