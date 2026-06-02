from decimal import Decimal
from django.test import SimpleTestCase
from .services import MotorCalculoEnergetico, CalculoEnergeticoError

class MotorCalculoEnergeticoTest(SimpleTestCase):
    def test_calcula_consumo_de_um_eletrodomestico(self):
        resultado = MotorCalculoEnergetico.calcular_item(
            eletrodomestico={
                "nome": "Chuveiro",
                "potencia_watts": 5500,
                "horas_uso_dia": 0.5,
                "dias_uso_mes": 30,
            },
            tarifa_kwh=0.85,
        )

        self.assertEqual(resultado["consumo_mensal_kwh"], Decimal("82.5000"))
        self.assertEqual(resultado["custo_mensal_estimado"], Decimal("70.13"))

    def test_calcula_consumo_medio_de_varios_eletrodomesticos(self):
        resultado = MotorCalculoEnergetico.calcular_consumo_medio(
            eletrodomesticos=[
                {
                    "nome": "Chuveiro",
                    "potencia_watts": 5500,
                    "horas_uso_dia": 0.5,
                    "dias_uso_mes": 30,
                },
                {
                    "nome": "Geladeira",
                    "potencia_watts": 150,
                    "horas_uso_dia": 24,
                    "dias_uso_mes": 30,
                },
            ],
            tarifa_kwh=0.85,
        )

        self.assertEqual(resultado["quantidade_eletrodomesticos"], 2)
        self.assertEqual(resultado["total_consumo_mensal_kwh"], Decimal("190.5000"))
        self.assertEqual(resultado["consumo_medio_mensal_kwh"], Decimal("95.2500"))
        self.assertEqual(resultado["total_custo_mensal"], Decimal("161.93"))

    def test_nao_permite_lista_vazia(self):
        with self.assertRaises(CalculoEnergeticoError):
            MotorCalculoEnergetico.calcular_consumo_medio(
                eletrodomesticos=[],
                tarifa_kwh=0.85,
            )

    def test_nao_permite_horas_maior_que_24(self):
        with self.assertRaises(CalculoEnergeticoError):
            MotorCalculoEnergetico.calcular_item(
                eletrodomestico={
                    "nome": "Geladeira",
                    "potencia_watts": 150,
                    "horas_uso_dia": 25,
                    "dias_uso_mes": 30,
                },
                tarifa_kwh=0.85,
            )