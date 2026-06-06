from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

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