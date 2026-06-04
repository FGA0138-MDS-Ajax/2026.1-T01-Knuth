from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

class CalculoEnergeticoError(ValueError):
    pass

class MotorCalculoEnergetico:
    """
    consumo_mensal_kwh = (potencia_watts / 1000) * horas_uso_dia * dias_uso_mes
    custo_estimado = consumo_mensal_kwh * tarifa_kwh
    """
    @staticmethod
    def _decimal(valor, campo):
        try:
            return Decimal(str(valor))
        except (InvalidOperation, TypeError):
            raise CalculoEnergeticoError(f"O campo '{campo}' deve ser numérico.")

    @staticmethod
    def calcular_item(eletrodomestico, tarifa_kwh, dias_padrao=30):
        nome = (
            eletrodomestico.get("nome")
            or eletrodomestico.get("nome_eletrodomestico")
            or eletrodomestico.get("aparelho")
            or "Eletrodoméstico"
        )

        potencia_watts = MotorCalculoEnergetico._decimal(
            eletrodomestico.get("potencia_watts"),
            "potencia_watts"
        )

        horas_uso_dia = MotorCalculoEnergetico._decimal(
            eletrodomestico.get("horas_uso_dia"),
            "horas_uso_dia"
        )

        dias_uso_mes = MotorCalculoEnergetico._decimal(
            eletrodomestico.get("dias_uso_mes", dias_padrao),
            "dias_uso_mes"
        )

        tarifa_kwh = MotorCalculoEnergetico._decimal(
            tarifa_kwh,
            "tarifa_kwh"
        )

        if potencia_watts <= 0:
            raise CalculoEnergeticoError("A potência em watts deve ser maior que zero.")

        if horas_uso_dia <= 0 or horas_uso_dia > 24:
            raise CalculoEnergeticoError(
                "As horas de uso por dia devem ser maiores que zero e no máximo 24."
            )

        if dias_uso_mes <= 0 or dias_uso_mes > 31:
            raise CalculoEnergeticoError(
                "Os dias de uso no mês devem ser maiores que zero e no máximo 31."
            )

        if tarifa_kwh < 0:
            raise CalculoEnergeticoError("A tarifa por kWh não pode ser negativa.")

        consumo_diario_kwh = (potencia_watts / Decimal("1000")) * horas_uso_dia
        consumo_mensal_kwh = consumo_diario_kwh * dias_uso_mes
        custo_mensal_estimado = consumo_mensal_kwh * tarifa_kwh

        return {
            "nome": nome,
            "potencia_watts": potencia_watts.quantize(Decimal("0.01")),
            "horas_uso_dia": horas_uso_dia.quantize(Decimal("0.01")),
            "dias_uso_mes": int(dias_uso_mes),
            "consumo_diario_kwh": consumo_diario_kwh.quantize(Decimal("0.0001")),
            "consumo_mensal_kwh": consumo_mensal_kwh.quantize(Decimal("0.0001")),
            "custo_mensal_estimado": custo_mensal_estimado.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            ),
        }

    @staticmethod
    def calcular_consumo_medio(eletrodomesticos, tarifa_kwh, dias_padrao=30):
        if not isinstance(eletrodomesticos, list) or len(eletrodomesticos) == 0:
            raise CalculoEnergeticoError(
                "Informe uma lista de eletrodomésticos para calcular o consumo."
            )

        itens_calculados = [
            MotorCalculoEnergetico.calcular_item(
                eletrodomestico=item,
                tarifa_kwh=tarifa_kwh,
                dias_padrao=dias_padrao,
            )
            for item in eletrodomesticos
        ]

        total_consumo_mensal_kwh = sum(
            item["consumo_mensal_kwh"] for item in itens_calculados
        )

        total_custo_mensal = sum(
            item["custo_mensal_estimado"] for item in itens_calculados
        )

        quantidade = Decimal(len(itens_calculados))

        consumo_medio_mensal_kwh = total_consumo_mensal_kwh / quantidade
        custo_medio_mensal = total_custo_mensal / quantidade

        eletrodomestico_maior_consumo = max(
            itens_calculados,
            key=lambda item: item["consumo_mensal_kwh"]
        )

        return {
            "quantidade_eletrodomesticos": len(itens_calculados),
            "total_consumo_mensal_kwh": total_consumo_mensal_kwh.quantize(Decimal("0.0001")),
            "consumo_medio_mensal_kwh": consumo_medio_mensal_kwh.quantize(Decimal("0.0001")),
            "total_custo_mensal": total_custo_mensal.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            ),
            "custo_medio_mensal": custo_medio_mensal.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            ),
            "eletrodomestico_maior_consumo": eletrodomestico_maior_consumo,
            "itens": itens_calculados,
        }