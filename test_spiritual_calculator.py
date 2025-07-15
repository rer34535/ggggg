#!/usr/bin/env python3
"""
اختبارات شاملة للحاسبة الروحانية
==============================

مجموعة اختبارات شاملة للتحقق من دقة ووظائف
جميع طرق الحسابات الروحانية.
"""

import unittest
import datetime
from spiritual_calculator import (
    SpiritualCalculatorMain, ArabicTextProcessor, CalculationMethod,
    SpiritualTowerCalculator, AbjadNumerologyCalculator, JafrCalculator
)


class TestArabicTextProcessor(unittest.TestCase):
    """اختبارات معالج النصوص العربية."""
    
    def setUp(self):
        self.processor = ArabicTextProcessor()
    
    def test_validate_arabic_text_valid(self):
        """اختبار التحقق من النصوص العربية الصحيحة."""
        valid_texts = [
            "محمد", 
            "فاطمة الزهراء", 
            "بسم الله الرحمن الرحيم",
            "لا إله إلا الله",
            "الحمد لله رب العالمين"
        ]
        for text in valid_texts:
            with self.subTest(text=text):
                self.assertTrue(self.processor.validate_arabic_text(text))
    
    def test_validate_arabic_text_invalid(self):
        """اختبار التحقق من النصوص غير الصحيحة."""
        invalid_texts = [
            "Mohammed", 
            "123", 
            "محمد123", 
            "",
            "   ",
            "English text",
            "مرحبا Hello"
        ]
        for text in invalid_texts:
            with self.subTest(text=text):
                self.assertFalse(self.processor.validate_arabic_text(text))
    
    def test_clean_arabic_text(self):
        """اختبار تنظيف النصوص العربية."""
        test_cases = [
            ("مُحَمَّد", "محمد"),
            ("  فاطمة  ", "فاطمة"),
            ("بِسْمِ اللَّهِ", "بسم الله"),
            ("الْحَمْدُ لِلَّهِ", "الحمد لله")
        ]
        for input_text, expected in test_cases:
            with self.subTest(input_text=input_text):
                result = self.processor.clean_arabic_text(input_text)
                self.assertEqual(result, expected)
    
    def test_calculate_abjad_value_kabir(self):
        """اختبار حساب الجُمّل بالطريقة الكبيرة."""
        # اختبار قيم معروفة
        test_cases = [
            ("محمد", 40 + 8 + 40 + 4),  # م + ح + م + د
            ("الله", 1 + 30 + 30 + 5),   # ا + ل + ل + ه
            ("علي", 70 + 30 + 10),       # ع + ل + ي
        ]
        
        for text, expected_value in test_cases:
            with self.subTest(text=text):
                value, breakdown = self.processor.calculate_abjad_value(text, CalculationMethod.KABIR)
                self.assertEqual(value, expected_value)
                self.assertEqual(len(breakdown), len(text))
    
    def test_calculate_abjad_value_saghir(self):
        """اختبار حساب الجُمّل بالطريقة الصغيرة."""
        value, breakdown = self.processor.calculate_abjad_value("محمد", CalculationMethod.SAGHIR)
        expected_value = 4 + 8 + 4 + 4  # م + ح + م + د (قيم صغيرة)
        self.assertEqual(value, expected_value)
        self.assertEqual(len(breakdown), 4)
    
    def test_calculate_abjad_value_muqatta(self):
        """اختبار حساب الجُمّل بالطريقة المقطعة."""
        value, breakdown = self.processor.calculate_abjad_value("محمد", CalculationMethod.MUQATTA)
        expected_value = 13 + 8 + 13 + 4  # م + ح + م + د (قيم مقطعة)
        self.assertEqual(value, expected_value)
        self.assertEqual(len(breakdown), 4)


class TestSpiritualTowerCalculator(unittest.TestCase):
    """اختبارات حاسبة البرج الروحاني."""
    
    def setUp(self):
        self.calculator = SpiritualTowerCalculator()
    
    def test_calculate_celestial_coordinates(self):
        """اختبار حساب الإحداثيات السماوية."""
        birth_date = datetime.datetime(1990, 5, 15)
        birth_time = datetime.time(14, 30)
        latitude, longitude = 31.7683, 35.2137  # القدس
        
        result = self.calculator.calculate_celestial_coordinates(
            birth_date, birth_time, latitude, longitude
        )
        
        # التحقق من هيكل النتيجة
        required_keys = [
            'spiritual_house', 'house_info', 'zodiac_sign', 'zodiac_info',
            'dominant_planet', 'planetary_influence', 'spiritual_number', 
            'celestial_strength', 'dominant_element', 'ascendant_degree',
            'coordinates', 'birth_info'
        ]
        for key in required_keys:
            self.assertIn(key, result)
        
        # التحقق من نطاقات القيم
        self.assertIn(result['spiritual_house'], range(1, 13))
        self.assertIn(result['zodiac_sign'], range(1, 13))
        self.assertIn(result['spiritual_number'], range(1, 10))
        self.assertIsInstance(result['ascendant_degree'], float)
        self.assertGreaterEqual(result['ascendant_degree'], 0)
        self.assertLess(result['ascendant_degree'], 360)
    
    def test_invalid_coordinates(self):
        """اختبار الإحداثيات غير الصحيحة."""
        birth_date = datetime.datetime(1990, 5, 15)
        birth_time = datetime.time(14, 30)
        
        # إحداثيات غير صحيحة
        invalid_coords = [
            (200, 200),   # خارج النطاق
            (-100, 400),  # خارج النطاق
            (95, 185)     # خارج النطاق
        ]
        
        for lat, lon in invalid_coords:
            with self.subTest(lat=lat, lon=lon):
                with self.assertRaises(ValueError):
                    self.calculator.calculate_celestial_coordinates(
                        birth_date, birth_time, lat, lon
                    )
    
    def test_reduce_to_single_digit(self):
        """اختبار تقليل الأرقام إلى رقم مفرد."""
        test_cases = [
            (123, 6),   # 1+2+3 = 6
            (999, 9),   # 9+9+9 = 27, 2+7 = 9
            (0, 9),     # حالة خاصة
            (9, 9),     # رقم مفرد بالفعل
            (1234, 1),  # 1+2+3+4 = 10, 1+0 = 1
        ]
        for input_val, expected in test_cases:
            with self.subTest(input_val=input_val):
                result = self.calculator._reduce_to_single_digit(input_val)
                self.assertEqual(result, expected)


class TestAbjadNumerologyCalculator(unittest.TestCase):
    """اختبارات حاسبة علم الأرقام الأبجدية."""
    
    def setUp(self):
        self.calculator = AbjadNumerologyCalculator()
    
    def test_calculate_comprehensive_analysis(self):
        """اختبار التحليل الشامل للأبجدية."""
        result = self.calculator.calculate_comprehensive_analysis("محمد", CalculationMethod.KABIR)
        
        # التحقق من هيكل النتيجة
        self.assertEqual(result.method, "حساب الجُمّل (kabir)")
        self.assertIsInstance(result.numerical_value, int)
        self.assertIn(result.reduced_value, range(1, 10))
        self.assertIsInstance(result.interpretation, str)
        self.assertIn('detailed_breakdown', result.__dict__)
        
        # التحقق من التفاصيل
        breakdown = result.detailed_breakdown
        required_keys = [
            'original_text', 'method_used', 'total_numerical_value',
            'reduced_value', 'letter_breakdown', 'spiritual_metrics',
            'energy_signature', 'compatibility_numbers', 'interpretation_details'
        ]
        for key in required_keys:
            self.assertIn(key, breakdown)
    
    def test_invalid_text_raises_error(self):
        """اختبار أن النص غير الصحيح يثير خطأ مناسب."""
        invalid_texts = ["Invalid123", "English", "123", ""]
        
        for text in invalid_texts:
            with self.subTest(text=text):
                with self.assertRaises(ValueError):
                    self.calculator.calculate_comprehensive_analysis(text, CalculationMethod.KABIR)
    
    def test_spiritual_metrics_calculation(self):
        """اختبار حساب المقاييس الروحانية."""
        metrics = self.calculator._calculate_spiritual_metrics("محمد", 92, 2)
        
        required_keys = [
            'text_length', 'average_letter_value', 'spiritual_intensity', 
            'vibrational_frequency', 'chakra_alignment', 'sacred_ratio',
            'divine_connection'
        ]
        for key in required_keys:
            self.assertIn(key, metrics)
        
        # التحقق من القيم
        self.assertIsInstance(metrics['text_length'], int)
        self.assertIsInstance(metrics['average_letter_value'], float)
        self.assertIsInstance(metrics['vibrational_frequency'], int)
        self.assertGreater(metrics['vibrational_frequency'], 0)
        self.assertLessEqual(metrics['vibrational_frequency'], 433)
    
    def test_energy_signature_calculation(self):
        """اختبار حساب التوقيع الطاقي."""
        signature = self.calculator._calculate_energy_signature(92, 2)
        
        required_keys = [
            'primary_energy', 'secondary_energy', 'energy_balance',
            'manifestation_power', 'harmonic_resonance'
        ]
        for key in required_keys:
            self.assertIn(key, signature)
        
        # التحقق من القيم
        self.assertIsInstance(signature['energy_balance'], float)
        self.assertGreaterEqual(signature['energy_balance'], 0)
        self.assertLessEqual(signature['energy_balance'], 1)
        self.assertIn(signature['manifestation_power'], range(1, 11))


class TestJafrCalculator(unittest.TestCase):
    """اختبارات حاسبة الجفر."""
    
    def setUp(self):
        self.calculator = JafrCalculator()
    
    def test_calculate_jafr_analysis(self):
        """اختبار التحليل الشامل للجفر."""
        birth_date = datetime.datetime(1990, 5, 15)
        result = self.calculator.calculate_jafr_analysis("أحمد", "فاطمة", birth_date)
        
        # التحقق من هيكل النتيجة
        self.assertEqual(result.method, "تحليل الجفر الشريف")
        self.assertIsInstance(result.numerical_value, int)
        self.assertIn(result.reduced_value, range(1, 10))
        self.assertIsInstance(result.interpretation, str)
        
        # التحقق من التفاصيل
        breakdown = result.detailed_breakdown
        required_keys = [
            'name', 'mother_name', 'birth_date', 'name_value', 'mother_value',
            'date_values', 'combined_value', 'jafr_patterns', 'spiritual_indicators'
        ]
        for key in required_keys:
            self.assertIn(key, breakdown)
    
    def test_invalid_names_raise_error(self):
        """اختبار أن الأسماء غير الصحيحة تثير أخطاء مناسبة."""
        birth_date = datetime.datetime(1990, 5, 15)
        
        invalid_cases = [
            ("Ahmed", "فاطمة"),    # اسم إنجليزي
            ("أحمد", "Fatima"),    # اسم أم إنجليزي
            ("", "فاطمة"),         # اسم فارغ
            ("أحمد", "")           # اسم أم فارغ
        ]
        
        for name, mother_name in invalid_cases:
            with self.subTest(name=name, mother_name=mother_name):
                with self.assertRaises(ValueError):
                    self.calculator.calculate_jafr_analysis(name, mother_name, birth_date)
    
    def test_jafr_patterns_generation(self):
        """اختبار توليد أنماط الجفر."""
        patterns = self.calculator._generate_comprehensive_jafr_patterns(1234)
        
        required_keys = [
            'fibonacci_spiritual', 'sacred_numbers', 'prophetic_numbers', 
            'divine_attributes', 'quranic_numbers', 'digital_root', 
            'modular_patterns', 'geometric_patterns'
        ]
        for key in required_keys:
            self.assertIn(key, patterns)
        
        # التحقق من الأنماط المعيارية
        modular = patterns['modular_patterns']
        self.assertIn('mod_7', modular)
        self.assertIn('mod_19', modular)
        self.assertIn('mod_99', modular)
        
        # التحقق من القيم
        self.assertIn(modular['mod_7'], range(0, 7))
        self.assertIn(modular['mod_19'], range(0, 19))
        self.assertIn(modular['mod_99'], range(0, 99))
    
    def test_digital_root_calculation(self):
        """اختبار حساب الجذر الرقمي."""
        test_cases = [
            (123, 6),    # 1+2+3 = 6
            (999, 9),    # 9+9+9 = 27, 2+7 = 9
            (1234, 1),   # 1+2+3+4 = 10, 1+0 = 1
            (5, 5),      # رقم مفرد بالفعل
            (0, 0)       # صفر
        ]
        for input_val, expected in test_cases:
            with self.subTest(input_val=input_val):
                result = self.calculator._calculate_digital_root(input_val)
                self.assertEqual(result, expected)
    
    def test_geometric_patterns(self):
        """اختبار الأنماط الهندسية."""
        # اختبار الأرقام المثلثية
        triangular_numbers = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55]
        for num in triangular_numbers:
            self.assertTrue(self.calculator._is_triangular_number(num))
        
        # اختبار المربعات الكاملة
        perfect_squares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
        for num in perfect_squares:
            self.assertTrue(self.calculator._is_perfect_square(num))
        
        # اختبار الأرقام الخماسية
        pentagonal_numbers = [1, 5, 12, 22, 35, 51, 70, 92, 117, 145]
        for num in pentagonal_numbers:
            self.assertTrue(self.calculator._is_pentagonal_number(num))


class TestSpiritualCalculatorMain(unittest.TestCase):
    """اختبارات المنسق الرئيسي للحاسبة."""
    
    def setUp(self):
        self.calculator = SpiritualCalculatorMain()
    
    def test_calculate_abjad_numerology_integration(self):
        """اختبار تكامل حساب الأبجدية."""
        result = self.calculator.calculate_abjad_numerology("محمد", CalculationMethod.KABIR)
        
        self.assertIsNotNone(result)
        self.assertEqual(len(self.calculator.results_history), 1)
        self.assertEqual(self.calculator.results_history[0], result)
    
    def test_calculate_jafr_analysis_integration(self):
        """اختبار تكامل تحليل الجفر."""
        birth_date = datetime.datetime(1990, 5, 15)
        result = self.calculator.calculate_jafr_analysis("أحمد", "فاطمة", birth_date)
        
        self.assertIsNotNone(result)
        self.assertEqual(len(self.calculator.results_history), 1)
        self.assertEqual(self.calculator.results_history[0], result)
    
    def test_calculate_spiritual_tower_integration(self):
        """اختبار تكامل البرج الروحاني."""
        birth_date = datetime.datetime(1990, 5, 15)
        birth_time = datetime.time(14, 30)
        
        result = self.calculator.calculate_spiritual_tower(
            birth_date, birth_time, 31.7683, 35.2137
        )
        
        self.assertIsNotNone(result)
        self.assertEqual(len(self.calculator.results_history), 1)
    
    def test_export_results_json(self):
        """اختبار تصدير النتائج بتنسيق JSON."""
        # إضافة بعض النتائج للاختبار
        self.calculator.calculate_abjad_numerology("محمد", CalculationMethod.KABIR)
        
        filename = self.calculator.export_results('json', 'test_export')
        self.assertTrue(filename.endswith('.json'))
        
        # تنظيف
        import os
        if os.path.exists(filename):
            os.remove(filename)
    
    def test_get_calculation_summary(self):
        """اختبار توليد ملخص الحسابات."""
        # في البداية لا توجد حسابات
        summary = self.calculator.get_calculation_summary()
        self.assertIn('message', summary)
        
        # إضافة حساب
        self.calculator.calculate_abjad_numerology("محمد", CalculationMethod.KABIR)
        
        summary = self.calculator.get_calculation_summary()
        self.assertEqual(summary['total_calculations'], 1)
        self.assertIn('methods_used', summary)
        self.assertIn('spiritual_insights', summary)


class TestCalculationAccuracy(unittest.TestCase):
    """اختبارات دقة الحسابات مقابل القيم المعروفة."""
    
    def test_known_abjad_values(self):
        """اختبار مقابل قيم الجُمّل المعروفة."""
        processor = ArabicTextProcessor()
        
        # اختبار حسابات معروفة
        test_cases = [
            ("الله", CalculationMethod.KABIR, 66),      # ا(1) + ل(30) + ل(30) + ه(5)
            ("محمد", CalculationMethod.KABIR, 92),      # م(40) + ح(8) + م(40) + د(4)
            ("بسم", CalculationMethod.KABIR, 102),      # ب(2) + س(60) + م(40)
            ("علي", CalculationMethod.KABIR, 110),      # ع(70) + ل(30) + ي(10)
            ("فاطمة", CalculationMethod.KABIR, 135),    # ف(80) + ا(1) + ط(9) + م(40) + ه(5)
        ]
        
        for text, method, expected_value in test_cases:
            with self.subTest(text=text, method=method.value):
                value, _ = processor.calculate_abjad_value(text, method)
                self.assertEqual(value, expected_value, 
                               f"فشل في '{text}' بالطريقة {method.value}")
    
    def test_consistency_across_methods(self):
        """اختبار الاتساق عبر عدة تشغيلات."""
        calculator = SpiritualCalculatorMain()
        
        # تشغيل نفس الحساب عدة مرات
        results = []
        for _ in range(5):
            result = calculator.calculate_abjad_numerology("محمد", CalculationMethod.KABIR)
            results.append(result.numerical_value)
        
        # جميع النتائج يجب أن تكون متطابقة
        self.assertTrue(all(r == results[0] for r in results))
    
    def test_known_spiritual_tower_calculations(self):
        """اختبار حسابات البرج الروحاني المعروفة."""
        calculator = SpiritualCalculatorMain()
        
        # تواريخ ومواقع معروفة
        test_cases = [
            {
                'date': datetime.datetime(1990, 1, 1),
                'time': datetime.time(12, 0),
                'lat': 0.0,
                'lon': 0.0
            },
            {
                'date': datetime.datetime(2000, 6, 21),  # الانقلاب الصيفي
                'time': datetime.time(12, 0),
                'lat': 23.5,  # مدار السرطان
                'lon': 0.0
            }
        ]
        
        for case in test_cases:
            with self.subTest(case=case):
                result = calculator.calculate_spiritual_tower(
                    case['date'], case['time'], case['lat'], case['lon']
                )
                
                # التحقق من القيم المنطقية
                self.assertIn(result['spiritual_house'], range(1, 13))
                self.assertIn(result['zodiac_sign'], range(1, 13))
                self.assertIn(result['spiritual_number'], range(1, 10))


class TestAdvancedFeatures(unittest.TestCase):
    """اختبارات الميزات المتقدمة."""
    
    def setUp(self):
        self.calculator = SpiritualCalculatorMain()
    
    def test_comprehensive_spiritual_profile(self):
        """اختبار الملف الروحاني الشامل."""
        # إجراء حسابات متعددة
        self.calculator.calculate_abjad_numerology("محمد", CalculationMethod.KABIR)
        
        birth_date = datetime.datetime(1990, 5, 15)
        self.calculator.calculate_jafr_analysis("أحمد", "فاطمة", birth_date)
        
        birth_time = datetime.time(14, 30)
        self.calculator.calculate_spiritual_tower(birth_date, birth_time, 31.7683, 35.2137)
        
        # التحقق من الملخص
        summary = self.calculator.get_calculation_summary()
        self.assertEqual(summary['total_calculations'], 3)
        self.assertIn('spiritual_insights', summary)
    
    def test_batch_processing_simulation(self):
        """اختبار محاكاة المعالجة المجمعة."""
        names = ["محمد", "أحمد", "علي", "فاطمة", "عائشة"]
        results = []
        
        for name in names:
            try:
                result = self.calculator.calculate_abjad_numerology(name, CalculationMethod.KABIR)
                results.append({
                    'name': name,
                    'value': result.numerical_value,
                    'reduced': result.reduced_value
                })
            except Exception as e:
                self.fail(f"فشل في معالجة الاسم '{name}': {e}")
        
        # التحقق من النتائج
        self.assertEqual(len(results), len(names))
        for result in results:
            self.assertIn('name', result)
            self.assertIn('value', result)
            self.assertIn('reduced', result)
            self.assertIn(result['reduced'], range(1, 10))


def run_all_tests():
    """تشغيل جميع مجموعات الاختبارات."""
    print("تشغيل اختبارات برنامج الحسابات الروحانية المتقدم...")
    print("=" * 60)
    
    # إنشاء مجموعة الاختبارات
    test_suite = unittest.TestSuite()
    
    # إضافة فئات الاختبارات
    test_classes = [
        TestArabicTextProcessor,
        TestSpiritualTowerCalculator,
        TestAbjadNumerologyCalculator,
        TestJafrCalculator,
        TestSpiritualCalculatorMain,
        TestCalculationAccuracy,
        TestAdvancedFeatures
    ]
    
    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        test_suite.addTests(tests)
    
    # تشغيل الاختبارات
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    # طباعة الملخص
    print("\n" + "=" * 60)
    print(f"تم تشغيل {result.testsRun} اختبار")
    print(f"نجح: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"فشل: {len(result.failures)}")
    print(f"أخطاء: {len(result.errors)}")
    
    if result.failures:
        print("\nالاختبارات الفاشلة:")
        for test, traceback in result.failures:
            print(f"- {test}")
    
    if result.errors:
        print("\nأخطاء الاختبارات:")
        for test, traceback in result.errors:
            print(f"- {test}")
    
    # تقييم النجاح الإجمالي
    success_rate = (result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100
    print(f"\nمعدل النجاح: {success_rate:.1f}%")
    
    if success_rate >= 95:
        print("✅ ممتاز! جميع الاختبارات تقريباً نجحت")
    elif success_rate >= 80:
        print("✅ جيد! معظم الاختبارات نجحت")
    elif success_rate >= 60:
        print("⚠️ مقبول! يحتاج إلى تحسينات")
    else:
        print("❌ ضعيف! يحتاج إلى مراجعة شاملة")
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)