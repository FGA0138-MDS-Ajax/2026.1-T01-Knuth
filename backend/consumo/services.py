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