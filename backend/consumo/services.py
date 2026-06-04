from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

class CalculoEnergeticoError(ValueError):
    pass

class MotorCalculoEnergetico:
    """
     Fórmulas:
    total_consumo_kwh = soma dos consumos em kWh
    consumo_medio_kwh = total_consumo_kwh / quantidade de eletrodomésticos
    custo_total_estimado = total_consumo_kwh * tarifa_kwh
    custo_medio_estimado = custo_total_estimado / quantidade de eletrodomésticos
    """

    @staticmethod
    def _decimal(valor, campo):
        try:
            return Decimal(str(valor))
        except (InvalidOperation, TypeError):
            raise CalculoEnergeticoError(f"O campo '{campo}' deve ser numérico.")

    @staticmethod
    def calcular_item(eletrodomestico, tarifa_kwh=None):
        nome = (
            eletrodomestico.get("nome")
            or eletrodomestico.get("nome_eletrodomestico")
            or eletrodomestico.get("aparelho")
            or "Eletrodoméstico"
        )

        consumo_kwh = MotorCalculoEnergetico._decimal(
            eletrodomestico.get("consumo_kwh"),
            "consumo_kwh"
        )

        if consumo_kwh < 0:
            raise CalculoEnergeticoError("O consumo em kWh não pode ser negativo.")

        resultado = {
            "nome": nome,
            "consumo_kwh": consumo_kwh.quantize(Decimal("0.0001")),
        }

        if tarifa_kwh not in (None, "", 0, "0"):
            tarifa_kwh = MotorCalculoEnergetico._decimal(tarifa_kwh, "tarifa_kwh")

            if tarifa_kwh < 0:
                raise CalculoEnergeticoError("A tarifa por kWh não pode ser negativa.")

            custo_estimado = consumo_kwh * tarifa_kwh

            resultado["tarifa_kwh"] = tarifa_kwh.quantize(Decimal("0.0001"))
            resultado["custo_estimado"] = custo_estimado.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            )

        return resultado

    @staticmethod
    def calcular_consumo_medio(eletrodomesticos, tarifa_kwh=None):
        if not isinstance(eletrodomesticos, list) or len(eletrodomesticos) == 0:
            raise CalculoEnergeticoError(
                "Informe uma lista de eletrodomésticos para calcular o consumo médio."
            )

        itens_calculados = [
            MotorCalculoEnergetico.calcular_item(
                eletrodomestico=item,
                tarifa_kwh=tarifa_kwh
            )
            for item in eletrodomesticos
        ]

        total_consumo_kwh = sum(
            item["consumo_kwh"] for item in itens_calculados
        )

        quantidade = Decimal(len(itens_calculados))
        consumo_medio_kwh = total_consumo_kwh / quantidade

        eletrodomestico_maior_consumo = max(
            itens_calculados,
            key=lambda item: item["consumo_kwh"]
        )

        resultado = {
            "quantidade_eletrodomesticos": len(itens_calculados),
            "total_consumo_kwh": total_consumo_kwh.quantize(Decimal("0.0001")),
            "consumo_medio_kwh": consumo_medio_kwh.quantize(Decimal("0.0001")),
            "eletrodomestico_maior_consumo": eletrodomestico_maior_consumo,
            "itens": itens_calculados,
        }

        if tarifa_kwh not in (None, "", 0, "0"):
            tarifa_kwh = MotorCalculoEnergetico._decimal(tarifa_kwh, "tarifa_kwh")

            total_custo_estimado = total_consumo_kwh * tarifa_kwh
            custo_medio_estimado = total_custo_estimado / quantidade

            resultado["tarifa_kwh"] = tarifa_kwh.quantize(Decimal("0.0001"))
            resultado["total_custo_estimado"] = total_custo_estimado.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            )
            resultado["custo_medio_estimado"] = custo_medio_estimado.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            )

        return resultado
