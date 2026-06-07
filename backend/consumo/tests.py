from decimal import Decimal
from django.test import SimpleTestCase
from .services import MotorCalculoEnergetico, CalculoEnergeticoError

class MotorCalculoEnergeticoTest(SimpleTestCase):
    def test_calcula_media_de_3_meses_corretamente(self):
        resultado = MotorCalculoEnergetico.calcular_media_mensal([100, 150, 200])
        
        self.assertEqual(resultado["meses_analisados"], 3)
        self.assertEqual(resultado["consumo_total_kwh"], Decimal("450.00"))
        self.assertEqual(resultado["consumo_medio_mensal_kwh"], Decimal("150.00"))

    def test_erro_se_nao_for_3_6_ou_9_meses(self):
        with self.assertRaisesMessage(CalculoEnergeticoError, "O período de análise deve ser de 3, 6 ou 9 meses."):
            MotorCalculoEnergetico.calcular_media_mensal([100, 150]) # Enviando apenas 2 meses

    def test_erro_se_consumo_for_menor_que_10(self):
        with self.assertRaisesMessage(CalculoEnergeticoError, "O consumo mínimo aceito é de 10 kWh."):
            MotorCalculoEnergetico.calcular_media_mensal([5, 150, 200])

    def test_erro_se_consumo_for_maior_que_999(self):
        with self.assertRaisesMessage(CalculoEnergeticoError, "O consumo máximo aceito é de 999 kWh."):
            MotorCalculoEnergetico.calcular_media_mensal([1500, 150, 200])