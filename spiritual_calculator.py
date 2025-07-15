#!/usr/bin/env python3
"""
برنامج الحسابات الروحانية المتقدم والدقيق
=======================================

تطبيق شامل ودقيق للحسابات الروحانية والفلكية مع التحليلات الصحيحة
يشمل تحليل البرج الروحاني، حساب الجُمّل، وحسابات الجفر الشريف

المؤلف: فريق الحسابات الروحانية
الإصدار: 2.0.0 (محدث ودقيق)
الترخيص: MIT
"""

import numpy as np
import datetime
from typing import Dict, List, Tuple, Optional, Union
import re
import json
import csv
from dataclasses import dataclass
from enum import Enum
import math


class CalculationMethod(Enum):
    """تعداد لطرق الحساب المختلفة."""
    KABIR = "kabir"      # الحساب الكبير
    SAGHIR = "saghir"    # الحساب الصغير
    MUQATTA = "muqatta"  # الحساب المقطع


class CalendarType(Enum):
    """تعداد لأنواع التقويم."""
    GREGORIAN = "gregorian"  # الميلادي
    HIJRI = "hijri"         # الهجري


@dataclass
class SpiritualResult:
    """فئة بيانات لتخزين نتائج الحسابات الروحانية."""
    method: str
    input_data: Dict
    numerical_value: int
    reduced_value: int
    interpretation: str
    detailed_breakdown: Dict
    timestamp: datetime.datetime


class ArabicTextProcessor:
    """فئة لمعالجة النصوص العربية والأحرف."""
    
    # قيم الأحرف العربية العددية للطرق المختلفة (وفق المصادر الأصيلة)
    ABJAD_VALUES = {
        'kabir': {
            # الحروف الأبجدية بترتيب أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ
            'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
            'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
            'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
            'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
        },
        'saghir': {
            # الحساب الصغير - تقليل القيم إلى أرقام مفردة
            'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
            'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
            'ي': 1, 'ك': 2, 'ل': 3, 'م': 4, 'ن': 5, 'س': 6, 'ع': 7, 'ف': 8, 'ص': 9,
            'ق': 1, 'ر': 2, 'ش': 3, 'ت': 4, 'ث': 5, 'خ': 6, 'ذ': 7, 'ض': 8, 'ظ': 9, 'غ': 1
        },
        'muqatta': {
            # الحساب المقطع - ترقيم متسلسل من 1-28
            'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
            'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
            'ي': 10, 'ك': 11, 'ل': 12, 'م': 13, 'ن': 14, 'س': 15, 'ع': 16, 'ف': 17, 'ص': 18,
            'ق': 19, 'ر': 20, 'ش': 21, 'ت': 22, 'ث': 23, 'خ': 24, 'ذ': 25, 'ض': 26, 'ظ': 27, 'غ': 28
        }
    }
    
    @staticmethod
    def validate_arabic_text(text: str) -> bool:
        """التحقق من صحة النص العربي."""
        if not text or not text.strip():
            return False
        # نمط للأحرف العربية والمسافات
        arabic_pattern = re.compile(r'^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$')
        return bool(arabic_pattern.match(text.strip()))
    
    @staticmethod
    def clean_arabic_text(text: str) -> str:
        """تنظيف وتطبيع النص العربي."""
        # إزالة التشكيل والتطبيع
        text = re.sub(r'[\u064B-\u0652\u0670\u0640]', '', text)
        # إزالة المسافات الزائدة
        text = re.sub(r'\s+', ' ', text.strip())
        return text
    
    @classmethod
    def calculate_abjad_value(cls, text: str, method: CalculationMethod) -> Tuple[int, List[Dict]]:
        """حساب القيمة العددية للنص وفق طريقة الجُمّل المحددة."""
        if not cls.validate_arabic_text(text):
            raise ValueError("النص يجب أن يحتوي على أحرف عربية فقط")
        
        cleaned_text = cls.clean_arabic_text(text)
        values_dict = cls.ABJAD_VALUES[method.value]
        
        total_value = 0
        letter_breakdown = []
        
        for char in cleaned_text:
            if char in values_dict:
                char_value = values_dict[char]
                total_value += char_value
                letter_breakdown.append({
                    'letter': char,
                    'value': char_value,
                    'position': len(letter_breakdown) + 1
                })
        
        return total_value, letter_breakdown


class SpiritualTowerCalculator:
    """حاسبة البرج الروحاني (البرج الفلكي الباطني) وفق علم الهيئة الأصيل."""
    
    def __init__(self):
        # البيوت الفلكية الاثني عشر وفق علم التنجيم الإسلامي
        self.celestial_houses = {
            1: {"name": "بيت الذات والحياة", "meaning": "الشخصية والمظهر والحيوية العامة", "element": "نار"},
            2: {"name": "بيت المال والممتلكات", "meaning": "الثروة والموارد والقيم المادية", "element": "أرض"},
            3: {"name": "بيت الإخوة والتواصل", "meaning": "الأشقاء والتعلم والرسائل", "element": "هواء"},
            4: {"name": "بيت البيت والجذور", "meaning": "العائلة والوطن والأصول", "element": "ماء"},
            5: {"name": "بيت الحب والإبداع", "meaning": "الرومانسية والأطفال والفنون", "element": "نار"},
            6: {"name": "بيت الصحة والعمل", "meaning": "الخدمة والصحة والروتين اليومي", "element": "أرض"},
            7: {"name": "بيت الشراكة والزواج", "meaning": "العلاقات والشراكات والأعداء المكشوفين", "element": "هواء"},
            8: {"name": "بيت التحول والأسرار", "meaning": "الموت والولادة الجديدة والميراث", "element": "ماء"},
            9: {"name": "بيت الفلسفة والسفر", "meaning": "التعليم العالي والسفر البعيد والدين", "element": "نار"},
            10: {"name": "بيت المهنة والسمعة", "meaning": "المكانة الاجتماعية والمهنة والشهرة", "element": "أرض"},
            11: {"name": "بيت الأصدقاء والأماني", "meaning": "الأصدقاء والآمال والمجموعات", "element": "هواء"},
            12: {"name": "بيت الأسرار والروحانية", "meaning": "الأعداء الخفيين والروحانية والتضحية", "element": "ماء"}
        }
        
        # الكواكب السبعة الكلاسيكية وتأثيراتها
        self.planetary_influences = {
            'الشمس': {
                'number': 1, 'element': 'نار', 'quality': 'قيادة وإشراق وحيوية',
                'day': 'الأحد', 'metal': 'ذهب', 'stone': 'ياقوت أصفر',
                'influence': 'القوة والسلطة والكرامة والنجاح'
            },
            'القمر': {
                'number': 2, 'element': 'ماء', 'quality': 'حدس وعاطفة وتقلب',
                'day': 'الاثنين', 'metal': 'فضة', 'stone': 'لؤلؤ',
                'influence': 'العواطف والحدس والأمومة والذاكرة'
            },
            'المريخ': {
                'number': 3, 'element': 'نار', 'quality': 'قوة وشجاعة وحرب',
                'day': 'الثلاثاء', 'metal': 'حديد', 'stone': 'ياقوت أحمر',
                'influence': 'الشجاعة والقتال والطاقة والغضب'
            },
            'عطارد': {
                'number': 4, 'element': 'هواء', 'quality': 'ذكاء وتواصل وتجارة',
                'day': 'الأربعاء', 'metal': 'زئبق', 'stone': 'زمرد',
                'influence': 'الذكاء والتواصل والتجارة والكتابة'
            },
            'المشتري': {
                'number': 5, 'element': 'نار', 'quality': 'حكمة وتوسع وعدالة',
                'day': 'الخميس', 'metal': 'قصدير', 'stone': 'ياقوت أزرق',
                'influence': 'الحكمة والعدالة والتوسع والحظ'
            },
            'الزهرة': {
                'number': 6, 'element': 'أرض', 'quality': 'جمال وحب وفن',
                'day': 'الجمعة', 'metal': 'نحاس', 'stone': 'زمرد',
                'influence': 'الحب والجمال والفن والمتعة'
            },
            'زحل': {
                'number': 7, 'element': 'أرض', 'quality': 'انضباط وصبر وحكمة',
                'day': 'السبت', 'metal': 'رصاص', 'stone': 'عقيق أسود',
                'influence': 'الانضباط والصبر والحكمة والقيود'
            }
        }
        
        # الأبراج الفلكية الاثني عشر
        self.zodiac_signs = {
            1: {"name": "الحمل", "element": "نار", "quality": "كاردينال", "ruler": "المريخ"},
            2: {"name": "الثور", "element": "أرض", "quality": "ثابت", "ruler": "الزهرة"},
            3: {"name": "الجوزاء", "element": "هواء", "quality": "متحول", "ruler": "عطارد"},
            4: {"name": "السرطان", "element": "ماء", "quality": "كاردينال", "ruler": "القمر"},
            5: {"name": "الأسد", "element": "نار", "quality": "ثابت", "ruler": "الشمس"},
            6: {"name": "العذراء", "element": "أرض", "quality": "متحول", "ruler": "عطارد"},
            7: {"name": "الميزان", "element": "هواء", "quality": "كاردينال", "ruler": "الزهرة"},
            8: {"name": "العقرب", "element": "ماء", "quality": "ثابت", "ruler": "المريخ"},
            9: {"name": "القوس", "element": "نار", "quality": "متحول", "ruler": "المشتري"},
            10: {"name": "الجدي", "element": "أرض", "quality": "كاردينال", "ruler": "زحل"},
            11: {"name": "الدلو", "element": "هواء", "quality": "ثابت", "ruler": "زحل"},
            12: {"name": "الحوت", "element": "ماء", "quality": "متحول", "ruler": "المشتري"}
        }
    
    def calculate_celestial_coordinates(self, birth_date: datetime.datetime, 
                                      birth_time: datetime.time,
                                      latitude: float, longitude: float) -> Dict:
        """حساب الإحداثيات السماوية والمحاذاة الفلكية."""
        
        # التحقق من صحة الإحداثيات
        if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
            raise ValueError("الإحداثيات الجغرافية غير صحيحة")
        
        # حساب يوم السنة
        day_of_year = birth_date.timetuple().tm_yday
        
        # حساب زاوية الساعة (Hour Angle)
        hour_decimal = birth_time.hour + birth_time.minute/60.0 + birth_time.second/3600.0
        hour_angle = hour_decimal * 15.0  # تحويل إلى درجات
        
        # حساب البيت الفلكي بناءً على الوقت والموقع
        # استخدام خوارزمية مبسطة لحساب البيت الطالع
        ascendant_degree = (hour_angle + longitude/4 + day_of_year * 0.9856) % 360
        spiritual_house = int((ascendant_degree / 30) % 12) + 1
        
        # حساب البرج الطالع
        zodiac_sign = int((day_of_year + hour_angle/15) % 12) + 1
        
        # تحديد الكوكب المهيمن بناءً على اليوم والساعة
        weekday = birth_date.weekday()  # 0=الاثنين, 6=الأحد
        planet_names = ['القمر', 'المريخ', 'عطارد', 'المشتري', 'الزهرة', 'زحل', 'الشمس']
        dominant_planet = planet_names[weekday]
        
        # حساب الرقم الروحاني
        spiritual_number = self._calculate_spiritual_number(birth_date, birth_time)
        
        # حساب القوة السماوية
        celestial_strength = self._calculate_celestial_strength(day_of_year, hour_angle, latitude)
        
        # تحديد العنصر المهيمن
        dominant_element = self._calculate_dominant_element(spiritual_house, zodiac_sign)
        
        return {
            'spiritual_house': spiritual_house,
            'house_info': self.celestial_houses[spiritual_house],
            'zodiac_sign': zodiac_sign,
            'zodiac_info': self.zodiac_signs[zodiac_sign],
            'dominant_planet': dominant_planet,
            'planetary_influence': self.planetary_influences[dominant_planet],
            'spiritual_number': spiritual_number,
            'celestial_strength': celestial_strength,
            'dominant_element': dominant_element,
            'ascendant_degree': round(ascendant_degree, 2),
            'coordinates': {
                'latitude': latitude,
                'longitude': longitude,
                'day_of_year': day_of_year,
                'hour_angle': round(hour_angle, 2)
            },
            'birth_info': {
                'date': birth_date.strftime('%Y-%m-%d'),
                'time': birth_time.strftime('%H:%M:%S'),
                'weekday': ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'][weekday]
            }
        }
    
    def _calculate_spiritual_number(self, birth_date: datetime.datetime, birth_time: datetime.time) -> int:
        """حساب الرقم الروحاني."""
        total = (birth_date.day + birth_date.month + birth_date.year + 
                birth_time.hour + birth_time.minute)
        return self._reduce_to_single_digit(total)
    
    def _reduce_to_single_digit(self, number: int) -> int:
        """تقليل الرقم إلى رقم مفرد (1-9)."""
        while number > 9:
            number = sum(int(digit) for digit in str(number))
        return number if number > 0 else 9
    
    def _calculate_celestial_strength(self, day_of_year: int, hour_angle: float, latitude: float) -> str:
        """حساب القوة السماوية بناءً على البيانات الفلكية."""
        # حساب القوة بناءً على عوامل متعددة
        seasonal_factor = abs(math.sin(math.radians(day_of_year * 360 / 365)))
        time_factor = abs(math.sin(math.radians(hour_angle)))
        location_factor = abs(math.cos(math.radians(latitude)))
        
        strength_value = (seasonal_factor + time_factor + location_factor) / 3 * 100
        
        if strength_value >= 80:
            return "قوة سماوية عالية جداً - تأثير كوكبي قوي"
        elif strength_value >= 60:
            return "قوة سماوية عالية - تأثير كوكبي واضح"
        elif strength_value >= 40:
            return "قوة سماوية متوسطة - تأثير كوكبي معتدل"
        elif strength_value >= 20:
            return "قوة سماوية منخفضة - تأثير كوكبي ضعيف"
        else:
            return "قوة سماوية ضعيفة - تأثير كوكبي محدود"
    
    def _calculate_dominant_element(self, house: int, zodiac: int) -> str:
        """تحديد العنصر المهيمن."""
        house_element = self.celestial_houses[house]['element']
        zodiac_element = self.zodiac_signs[zodiac]['element']
        
        if house_element == zodiac_element:
            return f"{house_element} (مضاعف - تأثير قوي)"
        else:
            return f"{house_element} و {zodiac_element} (مختلط)"


class AbjadNumerologyCalculator:
    """حاسبة علم الأرقام الأبجدية (حساب الجُمّل) وفق المصادر الأصيلة."""
    
    def __init__(self):
        self.processor = ArabicTextProcessor()
        
        # التفسيرات الروحانية للأرقام المفردة وفق علم الأرقام الإسلامي
        self.interpretations = {
            1: {
                'meaning': 'الوحدة والقيادة - رقم الله الواحد',
                'traits': ['قيادي', 'مبدع', 'مستقل', 'رائد'],
                'spiritual': 'طاقة الخلق والبداية، اتصال بالوحدانية الإلهية',
                'element': 'نار',
                'planet': 'الشمس'
            },
            2: {
                'meaning': 'التعاون والشراكة - رقم التوازن',
                'traits': ['متعاون', 'دبلوماسي', 'حساس', 'متوازن'],
                'spiritual': 'طاقة التوازن والانسجام، الثنائية في الخلق',
                'element': 'ماء',
                'planet': 'القمر'
            },
            3: {
                'meaning': 'الإبداع والتعبير - رقم التثليث المقدس',
                'traits': ['مبدع', 'فني', 'متواصل', 'متفائل'],
                'spiritual': 'طاقة الإبداع والتجلي، الثالوث الكوني',
                'element': 'هواء',
                'planet': 'المشتري'
            },
            4: {
                'meaning': 'الاستقرار والعمل - رقم الأركان الأربعة',
                'traits': ['منظم', 'عملي', 'مثابر', 'موثوق'],
                'spiritual': 'طاقة البناء والاستقرار، الأركان الأربعة للكون',
                'element': 'أرض',
                'planet': 'عطارد'
            },
            5: {
                'meaning': 'الحرية والتغيير - رقم الحواس الخمس',
                'traits': ['حر', 'مغامر', 'فضولي', 'متحرر'],
                'spiritual': 'طاقة التحرر والاستكشاف، الحواس الخمس',
                'element': 'نار',
                'planet': 'المريخ'
            },
            6: {
                'meaning': 'المسؤولية والحب - رقم الكمال',
                'traits': ['مسؤول', 'محب', 'خدوم', 'عائلي'],
                'spiritual': 'طاقة الحب والخدمة، الكمال في الخلق',
                'element': 'أرض',
                'planet': 'الزهرة'
            },
            7: {
                'meaning': 'الروحانية والحكمة - الرقم المقدس',
                'traits': ['روحاني', 'حكيم', 'باحث', 'متأمل'],
                'spiritual': 'طاقة الروحانية والمعرفة، الرقم المقدس في الأديان',
                'element': 'ماء',
                'planet': 'زحل'
            },
            8: {
                'meaning': 'القوة والنجاح - رقم اللانهاية',
                'traits': ['قوي', 'ناجح', 'طموح', 'مادي'],
                'spiritual': 'طاقة القوة والإنجاز، اللانهاية الأفقية',
                'element': 'أرض',
                'planet': 'زحل'
            },
            9: {
                'meaning': 'الإنسانية والكمال - رقم الكمال الروحي',
                'traits': ['إنساني', 'عطوف', 'حكيم', 'مكتمل'],
                'spiritual': 'طاقة الكمال والعطاء، نهاية الدورة الرقمية',
                'element': 'نار',
                'planet': 'المريخ'
            }
        }
        
        # الشاكرات السبع وارتباطها بالأرقام
        self.chakras = {
            1: "شاكرا الجذر (مولادهارا) - الأمان والاستقرار - أحمر",
            2: "شاكرا العجز (سفاديشتانا) - الإبداع والجنسانية - برتقالي",
            3: "شاكرا الضفيرة الشمسية (مانيبورا) - القوة الشخصية - أصفر",
            4: "شاكرا القلب (أناهاتا) - الحب والرحمة - أخضر",
            5: "شاكرا الحلق (فيشودا) - التعبير والتواصل - أزرق",
            6: "شاكرا العين الثالثة (أجنا) - الحدس والبصيرة - نيلي",
            7: "شاكرا التاج (ساهاسرارا) - الروحانية والوعي - بنفسجي"
        }
    
    def calculate_comprehensive_analysis(self, text: str, 
                                       method: CalculationMethod) -> SpiritualResult:
        """إجراء تحليل شامل لعلم الأرقام الأبجدية."""
        if not self.processor.validate_arabic_text(text):
            raise ValueError("النص يجب أن يحتوي على أحرف عربية فقط")
        
        total_value, letter_breakdown = self.processor.calculate_abjad_value(text, method)
        reduced_value = self._reduce_to_single_digit(total_value)
        
        # حساب المقاييس الروحانية الإضافية
        spiritual_metrics = self._calculate_spiritual_metrics(text, total_value, reduced_value)
        
        # حساب التوقيع الطاقي
        energy_signature = self._calculate_energy_signature(total_value, reduced_value)
        
        # حساب الأرقام المتوافقة
        compatibility_numbers = self._calculate_compatibility_numbers(reduced_value)
        
        # التحليل التفصيلي
        detailed_breakdown = {
            'original_text': text,
            'method_used': method.value,
            'total_numerical_value': total_value,
            'reduced_value': reduced_value,
            'letter_breakdown': letter_breakdown,
            'spiritual_metrics': spiritual_metrics,
            'energy_signature': energy_signature,
            'compatibility_numbers': compatibility_numbers,
            'interpretation_details': self.interpretations[reduced_value],
            'chakra_alignment': self.chakras.get(reduced_value, self.chakras[7])
        }
        
        interpretation = self._generate_detailed_interpretation(reduced_value, spiritual_metrics)
        
        return SpiritualResult(
            method=f"حساب الجُمّل ({method.value})",
            input_data={'text': text, 'method': method.value},
            numerical_value=total_value,
            reduced_value=reduced_value,
            interpretation=interpretation,
            detailed_breakdown=detailed_breakdown,
            timestamp=datetime.datetime.now()
        )
    
    def _reduce_to_single_digit(self, number: int) -> int:
        """تقليل الرقم إلى رقم مفرد (1-9)."""
        while number > 9:
            number = sum(int(digit) for digit in str(number))
        return number if number > 0 else 9
    
    def _calculate_spiritual_metrics(self, text: str, total_value: int, reduced_value: int) -> Dict:
        """حساب المقاييس الروحانية الإضافية."""
        text_length = len(text.replace(' ', ''))
        
        # حساب الكثافة الروحانية
        if total_value >= 2000:
            intensity = "كثافة روحانية عالية جداً - طاقة كونية قوية"
        elif total_value >= 1000:
            intensity = "كثافة روحانية عالية - اتصال روحي قوي"
        elif total_value >= 500:
            intensity = "كثافة روحانية متوسطة عالية - طاقة متوازنة"
        elif total_value >= 100:
            intensity = "كثافة روحانية متوسطة - طاقة معتدلة"
        else:
            intensity = "كثافة روحانية منخفضة - طاقة هادئة"
        
        # حساب التردد الذبذبي (وفق تردد 432 هرتز المقدس)
        vibrational_frequency = (total_value % 432) + 1
        
        # تحديد محاذاة الشاكرا
        chakra_index = reduced_value if reduced_value <= 7 else (reduced_value % 7) + 1
        chakra_alignment = self.chakras[chakra_index]
        
        return {
            'text_length': text_length,
            'average_letter_value': round(total_value / text_length, 2) if text_length > 0 else 0,
            'spiritual_intensity': intensity,
            'vibrational_frequency': vibrational_frequency,
            'chakra_alignment': chakra_alignment,
            'sacred_ratio': round(total_value / 1.618, 2),  # النسبة الذهبية
            'divine_connection': self._calculate_divine_connection(total_value)
        }
    
    def _calculate_divine_connection(self, value: int) -> str:
        """حساب الاتصال الإلهي بناءً على الأرقام المقدسة."""
        sacred_numbers = [99, 786, 1001, 1111, 1313, 1414, 1515, 1616, 1717, 1818, 1919]
        
        for sacred in sacred_numbers:
            if value % sacred == 0:
                return f"اتصال مقدس مباشر - مضاعف للرقم {sacred}"
            elif abs(value - sacred) <= 10:
                return f"اتصال مقدس قريب - قريب من الرقم {sacred}"
        
        # فحص الأرقام الأولية المقدسة
        if self._is_prime(value) and value > 100:
            return "رقم أولي مقدس - طاقة نقية غير قابلة للتجزئة"
        
        return "اتصال روحاني عام - ضمن الطيف الكوني"
    
    def _is_prime(self, n: int) -> bool:
        """فحص ما إذا كان الرقم أولياً."""
        if n < 2:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True
    
    def _calculate_energy_signature(self, total_value: int, reduced_value: int) -> Dict:
        """حساب التوقيع الطاقي بناءً على الأنماط العددية."""
        # تحديد الطاقة الأساسية
        primary_energies = {
            1: "طاقة النار - الخلق والقيادة",
            2: "طاقة الماء - التدفق والتكيف", 
            3: "طاقة الهواء - التواصل والحركة",
            4: "طاقة الأرض - الاستقرار والبناء"
        }
        primary_energy = primary_energies[(reduced_value % 4) + 1]
        
        # تحديد الطاقة الثانوية
        secondary_energies = {
            0: "طاقة الخلق - البداية والإبداع",
            1: "طاقة الحفظ - الاستمرارية والحماية",
            2: "طاقة التحول - التغيير والتطور"
        }
        secondary_energy = secondary_energies[reduced_value % 3]
        
        # حساب توازن الطاقة
        binary_pattern = bin(total_value)[2:]
        energy_balance = len([c for c in binary_pattern if c == '1']) / len(binary_pattern)
        
        # قوة التجلي
        manifestation_power = min((total_value % 10) + 1, 10)
        
        return {
            'primary_energy': primary_energy,
            'secondary_energy': secondary_energy,
            'energy_balance': round(energy_balance, 3),
            'manifestation_power': manifestation_power,
            'harmonic_resonance': self._calculate_harmonic_resonance(total_value)
        }
    
    def _calculate_harmonic_resonance(self, value: int) -> str:
        """حساب الرنين التوافقي."""
        # الترددات التوافقية المقدسة
        harmonics = {
            432: "تردد الكون - الرنين الطبيعي",
            528: "تردد الحب - طاقة الشفاء",
            639: "تردد العلاقات - الانسجام الاجتماعي",
            741: "تردد التطهير - التنظيف الطاقي",
            852: "تردد الحدس - البصيرة الروحية",
            963: "تردد الوحدة - الاتصال الإلهي"
        }
        
        closest_harmonic = min(harmonics.keys(), key=lambda x: abs(x - (value % 1000)))
        return f"{harmonics[closest_harmonic]} ({closest_harmonic} هرتز)"
    
    def _calculate_compatibility_numbers(self, reduced_value: int) -> List[int]:
        """حساب الأرقام المتوافقة."""
        compatible = []
        
        # الأرقام المتوافقة وفق علم الأرقام الكلاسيكي
        compatibility_matrix = {
            1: [1, 5, 7, 9],
            2: [2, 4, 6, 8],
            3: [3, 6, 9],
            4: [2, 4, 6, 8],
            5: [1, 5, 7, 9],
            6: [2, 3, 6, 9],
            7: [1, 5, 7, 9],
            8: [2, 4, 6, 8],
            9: [1, 3, 6, 9]
        }
        
        return compatibility_matrix.get(reduced_value, [reduced_value])
    
    def _generate_detailed_interpretation(self, reduced_value: int, 
                                        spiritual_metrics: Dict) -> str:
        """توليد تفسير مفصل."""
        interpretation_data = self.interpretations[reduced_value]
        
        interpretation = f"""
تحليل حساب الجُمّل المفصل:

الرقم المختزل: {reduced_value}
المعنى الأساسي: {interpretation_data['meaning']}

الصفات الشخصية: {', '.join(interpretation_data['traits'])}

التفسير الروحاني: {interpretation_data['spiritual']}

العنصر المرتبط: {interpretation_data['element']}
الكوكب الحاكم: {interpretation_data['planet']}

الكثافة الروحانية: {spiritual_metrics['spiritual_intensity']}
التردد الذبذبي: {spiritual_metrics['vibrational_frequency']} هرتز
محاذاة الشاكرا: {spiritual_metrics['chakra_alignment']}

الاتصال الإلهي: {spiritual_metrics['divine_connection']}

هذا الرقم يحمل طاقة خاصة تتصل بالسجلات الأكاشية وتفتح بوابات الفهم الروحي العميق.
كل حرف في اسمك له ذبذبة كونية تؤثر على مسار حياتك وشخصيتك الروحية.
        """
        return interpretation.strip()


class JafrCalculator:
    """حاسبة الجفر الشريف وفق المنهج الأصيل للإمام علي والإمام الصادق."""
    
    def __init__(self):
        self.processor = ArabicTextProcessor()
        
        # المتتاليات العددية المقدسة في الجفر
        self.jafr_sequences = {
            'fibonacci_spiritual': [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610],
            'sacred_numbers': [3, 7, 12, 19, 28, 40, 72, 99, 114, 786, 1001],
            'prophetic_numbers': [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
            'divine_attributes': [99, 786, 1001, 1111, 1313, 1414, 1515, 1616, 1717, 1818, 1919],
            'quranic_numbers': [1, 6, 19, 74, 114, 286, 6236, 6348]
        }
        
        # التفسيرات التقليدية للجفر
        self.traditional_interpretations = {
            'destiny_paths': [
                "طريق العلم والحكمة - مسار العلماء والحكماء",
                "طريق القوة والسلطان - مسار القادة والحكام", 
                "طريق الحب والجمال - مسار الفنانين والعشاق",
                "طريق الصبر والتحمل - مسار المجاهدين والصابرين",
                "طريق الإبداع والفن - مسار المبدعين والشعراء",
                "طريق الخدمة والعطاء - مسار الخادمين والمتصدقين",
                "طريق الروحانية والتصوف - مسار الأولياء والصوفية",
                "طريق التجارة والمال - مسار التجار والاقتصاديين",
                "طريق القيادة والريادة - مسار الرواد والمصلحين"
            ],
            'life_challenges': [
                "تحدي الصبر والثبات - اختبار الإرادة والعزيمة",
                "تحدي الحكمة والتمييز - اختبار الفهم والبصيرة",
                "تحدي القوة والشجاعة - اختبار الجرأة والإقدام", 
                "تحدي الحب والتسامح - اختبار القلب والرحمة",
                "تحدي الإبداع والابتكار - اختبار الخيال والإبداع",
                "تحدي العدالة والإنصاف - اختبار الضمير والأخلاق",
                "تحدي الروحانية والتطهر - اختبار النفس والروح",
                "تحدي المسؤولية والأمانة - اختبار الالتزام والوفاء"
            ],
            'spiritual_gifts': [
                "هبة البصيرة والحدس - القدرة على رؤية الخفايا",
                "هبة الشفاء والطاقة - القدرة على العلاج والتأثير",
                "هبة الحكمة والفهم - القدرة على الإدراك العميق",
                "هبة القيادة والتأثير - القدرة على الإرشاد والتوجيه",
                "هبة الإبداع والفن - القدرة على الخلق والإبداع",
                "هبة التواصل والإقناع - القدرة على التأثير بالكلمة",
                "هبة الصبر والتحمل - القدرة على المقاومة والثبات",
                "هبة الحب والرحمة - القدرة على العطاء والحنان"
            ]
        }
        
        # الأسماء الحسنى وقيمها العددية
        self.divine_names = {
            'الله': 66, 'الرحمن': 329, 'الرحيم': 289, 'الملك': 90, 'القدوس': 170,
            'السلام': 131, 'المؤمن': 136, 'المهيمن': 145, 'العزيز': 94, 'الجبار': 206
        }
    
    def calculate_jafr_analysis(self, name: str, mother_name: str, 
                               birth_date: datetime.datetime) -> SpiritualResult:
        """إجراء تحليل شامل للجفر الشريف."""
        if not (self.processor.validate_arabic_text(name) and 
                self.processor.validate_arabic_text(mother_name)):
            raise ValueError("الأسماء يجب أن تحتوي على أحرف عربية فقط")
        
        # حساب القيم الأساسية
        name_value, name_breakdown = self.processor.calculate_abjad_value(name, CalculationMethod.KABIR)
        mother_value, mother_breakdown = self.processor.calculate_abjad_value(mother_name, CalculationMethod.KABIR)
        
        # حساب القيم المرتبطة بالتاريخ
        date_values = self._calculate_comprehensive_date_values(birth_date)
        
        # تطبيق صيغة الجفر التقليدية
        combined_value = self._apply_traditional_jafr_formula(name_value, mother_value, date_values)
        
        # توليد الأنماط والمتتاليات
        jafr_patterns = self._generate_comprehensive_jafr_patterns(combined_value)
        
        # حساب المؤشرات الروحانية
        spiritual_indicators = self._calculate_comprehensive_spiritual_indicators(
            name_value, mother_value, date_values, combined_value
        )
        
        # التحليل المفصل
        detailed_breakdown = {
            'name': name,
            'mother_name': mother_name,
            'birth_date': birth_date.isoformat(),
            'name_value': name_value,
            'mother_value': mother_value,
            'date_values': date_values,
            'combined_value': combined_value,
            'name_breakdown': name_breakdown,
            'mother_breakdown': mother_breakdown,
            'jafr_patterns': jafr_patterns,
            'spiritual_indicators': spiritual_indicators,
            'traditional_meanings': self._get_comprehensive_traditional_meanings(combined_value),
            'divine_connections': self._analyze_divine_connections(combined_value)
        }
        
        interpretation = self._generate_comprehensive_jafr_interpretation(
            spiritual_indicators, jafr_patterns, combined_value
        )
        
        return SpiritualResult(
            method="تحليل الجفر الشريف",
            input_data={
                'name': name, 
                'mother_name': mother_name, 
                'birth_date': birth_date.isoformat()
            },
            numerical_value=combined_value,
            reduced_value=self._reduce_to_single_digit(combined_value),
            interpretation=interpretation,
            detailed_breakdown=detailed_breakdown,
            timestamp=datetime.datetime.now()
        )
    
    def _calculate_comprehensive_date_values(self, birth_date: datetime.datetime) -> Dict:
        """حساب القيم الشاملة للتاريخ."""
        # القيم الأساسية
        day_value = birth_date.day
        month_value = birth_date.month
        year_value = birth_date.year
        
        # قيم إضافية
        day_of_year = birth_date.timetuple().tm_yday
        week_number = birth_date.isocalendar()[1]
        weekday = birth_date.weekday() + 1  # 1-7
        
        # حساب القيم المركبة
        basic_sum = day_value + month_value + year_value
        advanced_sum = day_of_year + week_number + weekday
        
        return {
            'day': day_value,
            'month': month_value,
            'year': year_value,
            'day_of_year': day_of_year,
            'week_number': week_number,
            'weekday': weekday,
            'basic_sum': basic_sum,
            'advanced_sum': advanced_sum,
            'total_date_value': basic_sum + advanced_sum
        }
    
    def _apply_traditional_jafr_formula(self, name_value: int, mother_value: int, 
                                      date_values: Dict) -> int:
        """تطبيق صيغة الجفر التقليدية."""
        # الصيغة الأساسية
        base_combination = name_value + mother_value + date_values['total_date_value']
        
        # تطبيق المضاعفات المقدسة وفق التقليد
        if base_combination % 19 == 0:  # رقم 19 المقدس في القرآن
            return base_combination * 19
        elif base_combination % 7 == 0:  # الرقم المقدس 7
            return base_combination * 7
        elif base_combination % 3 == 0:  # رقم التثليث
            return base_combination * 3
        else:
            # تطبيق صيغة الجفر المتقدمة
            return base_combination + (name_value * mother_value) // 100
    
    def _generate_comprehensive_jafr_patterns(self, combined_value: int) -> Dict:
        """توليد الأنماط الشاملة للجفر."""
        patterns = {}
        
        # فحص المتتاليات المقدسة
        for sequence_name, sequence in self.jafr_sequences.items():
            closest_match = min(sequence, key=lambda x: abs(x - (combined_value % 10000)))
            distance = abs(closest_match - (combined_value % 10000))
            patterns[sequence_name] = {
                'closest_match': closest_match,
                'distance': distance,
                'significance': self._interpret_sequence_match(sequence_name, closest_match, distance)
            }
        
        # الأنماط المشتقة
        patterns['digital_root'] = self._calculate_digital_root(combined_value)
        patterns['modular_patterns'] = {
            'mod_7': combined_value % 7,
            'mod_12': combined_value % 12,
            'mod_19': combined_value % 19,
            'mod_28': combined_value % 28,
            'mod_99': combined_value % 99,
            'mod_786': combined_value % 786
        }
        
        # الأنماط الهندسية
        patterns['geometric_patterns'] = self._calculate_geometric_patterns(combined_value)
        
        return patterns
    
    def _calculate_geometric_patterns(self, value: int) -> Dict:
        """حساب الأنماط الهندسية."""
        return {
            'triangular_number': self._is_triangular_number(value),
            'square_number': self._is_perfect_square(value),
            'pentagonal_number': self._is_pentagonal_number(value),
            'fibonacci_relation': self._check_fibonacci_relation(value)
        }
    
    def _is_triangular_number(self, n: int) -> bool:
        """فحص ما إذا كان الرقم مثلثياً."""
        # الرقم المثلثي: n = k(k+1)/2
        k = int((-1 + math.sqrt(1 + 8*n)) / 2)
        return k * (k + 1) // 2 == n
    
    def _is_perfect_square(self, n: int) -> bool:
        """فحص ما إذا كان الرقم مربعاً كاملاً."""
        root = int(math.sqrt(n))
        return root * root == n
    
    def _is_pentagonal_number(self, n: int) -> bool:
        """فحص ما إذا كان الرقم خماسياً."""
        # الرقم الخماسي: n = k(3k-1)/2
        k = int((1 + math.sqrt(1 + 24*n)) / 6)
        return k * (3*k - 1) // 2 == n
    
    def _check_fibonacci_relation(self, n: int) -> str:
        """فحص العلاقة مع متتالية فيبوناتشي."""
        fib_sequence = self.jafr_sequences['fibonacci_spiritual']
        
        if n in fib_sequence:
            return f"رقم فيبوناتشي مباشر - الموضع {fib_sequence.index(n) + 1}"
        
        # فحص النسبة الذهبية
        golden_ratio = 1.618033988749
        for fib in fib_sequence:
            if abs(n - fib * golden_ratio) < 1:
                return f"مرتبط بالنسبة الذهبية - قريب من {fib} × φ"
        
        return "لا توجد علاقة مباشرة مع فيبوناتشي"
    
    def _calculate_digital_root(self, number: int) -> int:
        """حساب الجذر الرقمي وفق طريقة الجفر."""
        while number >= 10:
            number = sum(int(digit) for digit in str(number))
        return number
    
    def _interpret_sequence_match(self, sequence_name: str, match_value: int, distance: int) -> str:
        """تفسير مطابقة المتتاليات."""
        interpretations = {
            'fibonacci_spiritual': f"اتصال بالتسلسل الروحي الذهبي - طاقة النمو الطبيعي",
            'sacred_numbers': f"رنين مع الأرقام المقدسة - بركة روحانية",
            'prophetic_numbers': f"اتصال بالأرقام النبوية - هداية إلهية",
            'divine_attributes': f"تجلي الأسماء الحسنى - رحمة إلهية",
            'quranic_numbers': f"ارتباط بالأرقام القرآنية - نور إلهي"
        }
        
        base_interpretation = interpretations.get(sequence_name, f"نمط خاص")
        
        if distance == 0:
            return f"{base_interpretation} - مطابقة تامة للرقم {match_value}"
        elif distance <= 5:
            return f"{base_interpretation} - قريب جداً من الرقم {match_value}"
        elif distance <= 20:
            return f"{base_interpretation} - قريب من الرقم {match_value}"
        else:
            return f"{base_interpretation} - تأثير ضعيف من الرقم {match_value}"
    
    def _calculate_comprehensive_spiritual_indicators(self, name_value: int, mother_value: int, 
                                                    date_values: Dict, combined_value: int) -> Dict:
        """حساب المؤشرات الروحانية الشاملة."""
        indicators = {}
        
        # حساب مسار القدر
        destiny_index = combined_value % len(self.traditional_interpretations['destiny_paths'])
        indicators['destiny_path'] = self.traditional_interpretations['destiny_paths'][destiny_index]
        
        # حساب التحدي الحياتي
        challenge_index = name_value % len(self.traditional_interpretations['life_challenges'])
        indicators['life_challenge'] = self.traditional_interpretations['life_challenges'][challenge_index]
        
        # حساب الهبة الروحانية
        gift_index = mother_value % len(self.traditional_interpretations['spiritual_gifts'])
        indicators['spiritual_gift'] = self.traditional_interpretations['spiritual_gifts'][gift_index]
        
        # حساب القوة الروحانية
        indicators['spiritual_strength'] = self._calculate_detailed_spiritual_strength(combined_value)
        
        # حساب المحاذاة مع الأرقام المقدسة
        indicators['sacred_alignment'] = self._calculate_detailed_sacred_alignment(combined_value)
        
        # حساب الطاقة الكوكبية
        indicators['planetary_energy'] = self._calculate_planetary_energy(date_values['weekday'])
        
        # حساب الموسم الروحاني
        indicators['spiritual_season'] = self._calculate_spiritual_season(date_values['day_of_year'])
        
        return indicators
    
    def _calculate_detailed_spiritual_strength(self, value: int) -> Dict:
        """حساب القوة الروحانية المفصلة."""
        strength_value = value % 1000
        
        # تحديد المستوى
        if strength_value >= 800:
            level = "قوة روحانية عالية جداً - اتصال مباشر بالعوالم العلوية"
        elif strength_value >= 600:
            level = "قوة روحانية عالية - تأثير قوي في العالم الروحي"
        elif strength_value >= 400:
            level = "قوة روحانية متوسطة عالية - قدرات روحية واضحة"
        elif strength_value >= 200:
            level = "قوة روحانية متوسطة - إمكانيات روحية جيدة"
        else:
            level = "قوة روحانية كامنة - تحتاج إلى تطوير وتنمية"
        
        # تحديد النوع
        strength_type = {
            0: "قوة الحكمة والمعرفة",
            1: "قوة الشفاء والطاقة",
            2: "قوة البصيرة والحدس",
            3: "قوة التأثير والقيادة",
            4: "قوة الحماية والدفاع",
            5: "قوة الإبداع والخلق",
            6: "قوة الحب والرحمة",
            7: "قوة التطهير والتنقية",
            8: "قوة التحول والتغيير",
            9: "قوة الاتصال الإلهي"
        }[strength_value % 10]
        
        return {
            'level': level,
            'type': strength_type,
            'numerical_value': strength_value,
            'percentage': min(strength_value / 10, 100)
        }
    
    def _calculate_detailed_sacred_alignment(self, value: int) -> Dict:
        """حساب المحاذاة المفصلة مع الأرقام المقدسة."""
        alignments = {}
        sacred_nums = self.jafr_sequences['sacred_numbers'] + self.jafr_sequences['divine_attributes']
        
        for sacred_num in sacred_nums:
            remainder = value % sacred_num
            if remainder == 0:
                alignments[sacred_num] = "محاذاة كاملة - تأثير مباشر"
            elif remainder <= sacred_num * 0.1:
                alignments[sacred_num] = "محاذاة قوية جداً - تأثير واضح"
            elif remainder <= sacred_num * 0.2:
                alignments[sacred_num] = "محاذاة قوية - تأثير ملحوظ"
            elif remainder <= sacred_num * 0.3:
                alignments[sacred_num] = "محاذاة متوسطة - تأثير معتدل"
        
        return alignments if alignments else {"عام": "محاذاة عامة مع الطيف الكوني"}
    
    def _calculate_planetary_energy(self, weekday: int) -> Dict:
        """حساب الطاقة الكوكبية بناءً على يوم الولادة."""
        planetary_days = {
            1: {"planet": "القمر", "energy": "طاقة العواطف والحدس", "element": "ماء"},
            2: {"planet": "المريخ", "energy": "طاقة القوة والشجاعة", "element": "نار"},
            3: {"planet": "عطارد", "energy": "طاقة الذكاء والتواصل", "element": "هواء"},
            4: {"planet": "المشتري", "energy": "طاقة الحكمة والتوسع", "element": "نار"},
            5: {"planet": "الزهرة", "energy": "طاقة الحب والجمال", "element": "أرض"},
            6: {"planet": "زحل", "energy": "طاقة الانضباط والحكمة", "element": "أرض"},
            7: {"planet": "الشمس", "energy": "طاقة القيادة والإشراق", "element": "نار"}
        }
        
        return planetary_days[weekday]
    
    def _calculate_spiritual_season(self, day_of_year: int) -> str:
        """حساب الموسم الروحاني."""
        if 80 <= day_of_year <= 171:  # الربيع الروحاني
            return "موسم النمو الروحي - طاقة التجديد والبداية"
        elif 172 <= day_of_year <= 263:  # الصيف الروحاني
            return "موسم القوة الروحية - طاقة الازدهار والنشاط"
        elif 264 <= day_of_year <= 354:  # الخريف الروحاني
            return "موسم الحصاد الروحي - طاقة الحكمة والنضج"
        else:  # الشتاء الروحاني
            return "موسم التأمل الروحي - طاقة التطهير والتنقية"
    
    def _get_comprehensive_traditional_meanings(self, combined_value: int) -> Dict:
        """الحصول على المعاني التقليدية الشاملة."""
        return {
            'numerical_significance': f"الرقم {combined_value} يحمل طاقة خاصة في علم الجفر الشريف",
            'elemental_association': self._get_detailed_elemental_association(combined_value % 4),
            'temporal_influence': self._get_detailed_temporal_influence(combined_value % 7),
            'spiritual_level': self._get_detailed_spiritual_level(combined_value % 9),
            'cosmic_connection': self._get_cosmic_connection(combined_value)
        }
    
    def _get_detailed_elemental_association(self, index: int) -> Dict:
        """الحصول على الارتباط العنصري المفصل."""
        elements = [
            {
                "name": "النار",
                "qualities": ["الحماس", "القيادة", "الإبداع", "الطاقة"],
                "influence": "طاقة الفعل والحماس والقيادة الروحية",
                "season": "الصيف",
                "direction": "الجنوب"
            },
            {
                "name": "الماء", 
                "qualities": ["العاطفة", "الحدس", "التدفق", "التكيف"],
                "influence": "طاقة العاطفة والحدس والشفاء الروحي",
                "season": "الشتاء",
                "direction": "الغرب"
            },
            {
                "name": "الهواء",
                "qualities": ["الفكر", "التواصل", "الحرية", "التغيير"],
                "influence": "طاقة الفكر والتواصل والحرية الروحية",
                "season": "الربيع",
                "direction": "الشرق"
            },
            {
                "name": "الأرض",
                "qualities": ["الاستقرار", "العملية", "الصبر", "البناء"],
                "influence": "طاقة الاستقرار والعملية والبناء الروحي",
                "season": "الخريف", 
                "direction": "الشمال"
            }
        ]
        return elements[index]
    
    def _get_detailed_temporal_influence(self, index: int) -> Dict:
        """الحصول على التأثير الزمني المفصل."""
        influences = [
            {"day": "السبت", "planet": "زحل", "energy": "طاقة الحكمة والانضباط", "color": "أسود"},
            {"day": "الأحد", "planet": "الشمس", "energy": "طاقة القيادة والإشراق", "color": "ذهبي"},
            {"day": "الاثنين", "planet": "القمر", "energy": "طاقة العاطفة والحدس", "color": "فضي"},
            {"day": "الثلاثاء", "planet": "المريخ", "energy": "طاقة القوة والشجاعة", "color": "أحمر"},
            {"day": "الأربعاء", "planet": "عطارد", "energy": "طاقة الذكاء والتواصل", "color": "أخضر"},
            {"day": "الخميس", "planet": "المشتري", "energy": "طاقة الحكمة والتوسع", "color": "أزرق"},
            {"day": "الجمعة", "planet": "الزهرة", "energy": "طاقة الحب والجمال", "color": "وردي"}
        ]
        return influences[index]
    
    def _get_detailed_spiritual_level(self, index: int) -> Dict:
        """الحصول على المستوى الروحي المفصل."""
        levels = [
            {"level": "المستوى المادي", "description": "التركيز على الأمور الدنيوية والمادية", "chakra": "الجذر"},
            {"level": "المستوى العاطفي", "description": "التركيز على المشاعر والعلاقات", "chakra": "العجز"},
            {"level": "المستوى الذهني", "description": "التركيز على الفكر والمنطق", "chakra": "الضفيرة الشمسية"},
            {"level": "المستوى الحدسي", "description": "التركيز على الحدس والبصيرة", "chakra": "القلب"},
            {"level": "المستوى الروحي", "description": "التركيز على الروحانية والتطور", "chakra": "الحلق"},
            {"level": "المستوى الكوني", "description": "التركيز على الوعي الكوني", "chakra": "العين الثالثة"},
            {"level": "المستوى الإلهي", "description": "التركيز على الاتصال الإلهي", "chakra": "التاج"},
            {"level": "المستوى المطلق", "description": "التركيز على الوحدة المطلقة", "chakra": "فوق التاج"},
            {"level": "المستوى الوحداني", "description": "التركيز على الفناء في الله", "chakra": "الوحدة الكاملة"}
        ]
        return levels[index]
    
    def _get_cosmic_connection(self, value: int) -> str:
        """الحصول على الاتصال الكوني."""
        cosmic_value = value % 2160  # دورة الاعتدال الربيعي
        
        if cosmic_value < 360:
            return "اتصال بعصر الحمل - طاقة القيادة والريادة"
        elif cosmic_value < 720:
            return "اتصال بعصر الثور - طاقة الاستقرار والبناء"
        elif cosmic_value < 1080:
            return "اتصال بعصر الجوزاء - طاقة التواصل والمعرفة"
        elif cosmic_value < 1440:
            return "اتصال بعصر السرطان - طاقة العاطفة والحماية"
        elif cosmic_value < 1800:
            return "اتصال بعصر الأسد - طاقة الإبداع والقيادة"
        else:
            return "اتصال بعصر العذراء - طاقة الخدمة والكمال"
    
    def _analyze_divine_connections(self, value: int) -> Dict:
        """تحليل الاتصالات الإلهية."""
        connections = {}
        
        # فحص الاتصال بالأسماء الحسنى
        for name, name_value in self.divine_names.items():
            if value % name_value == 0:
                connections[name] = f"اتصال مباشر - مضاعف لقيمة اسم {name}"
            elif abs(value - name_value) <= 10:
                connections[name] = f"اتصال قريب - قريب من قيمة اسم {name}"
        
        # فحص الأرقام القرآنية
        quranic_nums = self.jafr_sequences['quranic_numbers']
        for qnum in quranic_nums:
            if value % qnum == 0:
                connections[f"قرآني_{qnum}"] = f"اتصال قرآني - مضاعف للرقم {qnum}"
        
        return connections if connections else {"عام": "اتصال عام بالطيف الإلهي"}
    
    def _reduce_to_single_digit(self, number: int) -> int:
        """تقليل الرقم إلى رقم مفرد."""
        while number > 9:
            number = sum(int(digit) for digit in str(number))
        return number if number > 0 else 9
    
    def _generate_comprehensive_jafr_interpretation(self, spiritual_indicators: Dict, 
                                                  jafr_patterns: Dict, combined_value: int) -> str:
        """توليد تفسير شامل للجفر."""
        interpretation = f"""
تحليل الجفر الشريف الشامل:

القيمة المركبة: {combined_value}
الجذر الرقمي: {jafr_patterns['digital_root']}

المسار الروحي: {spiritual_indicators['destiny_path']}
التحدي الحياتي: {spiritual_indicators['life_challenge']}
الهبة الروحانية: {spiritual_indicators['spiritual_gift']}

القوة الروحانية: {spiritual_indicators['spiritual_strength']['level']}
نوع القوة: {spiritual_indicators['spiritual_strength']['type']}

الطاقة الكوكبية: {spiritual_indicators['planetary_energy']['planet']} - {spiritual_indicators['planetary_energy']['energy']}
الموسم الروحاني: {spiritual_indicators['spiritual_season']}

الأنماط العددية المقدسة:
- النمط السباعي: {jafr_patterns['modular_patterns']['mod_7']} (الكمال الروحي)
- النمط التسعيني: {jafr_patterns['modular_patterns']['mod_99']} (الأسماء الحسنى)
- النمط القرآني: {jafr_patterns['modular_patterns']['mod_19']} (الرقم القرآني)

المحاذاة المقدسة:
{chr(10).join([f"- {k}: {v}" for k, v in spiritual_indicators.get('sacred_alignment', {}).items()])}

هذا التحليل يكشف عن الطبقات العميقة لمصيرك الروحي ومسارك في هذه الحياة.
كل رقم في الجفر الشريف له معنى خاص يتصل بالسجلات الأكاشية والحكمة الإلهية.
الأرقام ليست مجرد أعداد، بل مفاتيح لفهم أسرار الوجود والقدر المكتوب.

والله أعلم بالغيب، وهذا للاسترشاد والتأمل في عظمة الخلق.
        """
        return interpretation.strip()


class SpiritualCalculatorMain:
    """الفئة الرئيسية لتنسيق جميع الحسابات الروحانية."""
    
    def __init__(self):
        self.tower_calculator = SpiritualTowerCalculator()
        self.abjad_calculator = AbjadNumerologyCalculator()
        self.jafr_calculator = JafrCalculator()
        self.results_history = []
    
    def calculate_spiritual_tower(self, birth_date: datetime.datetime,
                                birth_time: datetime.time,
                                latitude: float, longitude: float) -> Dict:
        """حساب تحليل البرج الروحاني."""
        try:
            result = self.tower_calculator.calculate_celestial_coordinates(
                birth_date, birth_time, latitude, longitude
            )
            
            # إنشاء التفسير الشامل
            interpretation = self._generate_tower_interpretation(result)
            
            spiritual_result = SpiritualResult(
                method="تحليل البرج الروحاني",
                input_data={
                    'birth_date': birth_date.isoformat(),
                    'birth_time': birth_time.isoformat(),
                    'latitude': latitude,
                    'longitude': longitude
                },
                numerical_value=result['spiritual_number'],
                reduced_value=result['spiritual_number'],
                interpretation=interpretation,
                detailed_breakdown=result,
                timestamp=datetime.datetime.now()
            )
            
            self.results_history.append(spiritual_result)
            return result
            
        except Exception as e:
            raise ValueError(f"خطأ في حساب البرج الروحاني: {str(e)}")
    
    def _generate_tower_interpretation(self, result: Dict) -> str:
        """توليد تفسير شامل للبرج الروحاني."""
        house_info = result['house_info']
        zodiac_info = result['zodiac_info']
        planetary_info = result['planetary_influence']
        
        interpretation = f"""
تحليل البرج الروحاني الشامل:

البيت الفلكي: {result['spiritual_house']} - {house_info['name']}
المعنى: {house_info['meaning']}
العنصر: {house_info['element']}

البرج الطالع: {zodiac_info['name']}
طبيعة البرج: {zodiac_info['quality']}
الكوكب الحاكم: {zodiac_info['ruler']}

الكوكب المهيمن: {result['dominant_planet']}
التأثير الكوكبي: {planetary_info['influence']}
اليوم المقدس: {planetary_info['day']}
المعدن المرتبط: {planetary_info['metal']}
الحجر الكريم: {planetary_info['stone']}

الرقم الروحاني: {result['spiritual_number']}
القوة السماوية: {result['celestial_strength']}
العنصر المهيمن: {result['dominant_element']}

درجة الطالع: {result['ascendant_degree']}°
يوم الولادة: {result['birth_info']['weekday']}

هذا التحليل يكشف عن طبيعتك الفلكية الحقيقية وتأثير النجوم على شخصيتك ومصيرك.
كل كوكب له تأثير خاص على حياتك، وكل بيت فلكي يحكم جانباً من جوانب وجودك.
        """
        return interpretation.strip()
    
    def calculate_abjad_numerology(self, text: str, 
                                 method: CalculationMethod = CalculationMethod.KABIR) -> SpiritualResult:
        """حساب تحليل علم الأرقام الأبجدية."""
        try:
            result = self.abjad_calculator.calculate_comprehensive_analysis(text, method)
            self.results_history.append(result)
            return result
            
        except Exception as e:
            raise ValueError(f"خطأ في حساب الجُمّل: {str(e)}")
    
    def calculate_jafr_analysis(self, name: str, mother_name: str,
                              birth_date: datetime.datetime) -> SpiritualResult:
        """حساب تحليل الجفر."""
        try:
            result = self.jafr_calculator.calculate_jafr_analysis(name, mother_name, birth_date)
            self.results_history.append(result)
            return result
            
        except Exception as e:
            raise ValueError(f"خطأ في حساب الجفر: {str(e)}")
    
    def export_results(self, format_type: str = 'json', filename: str = None) -> str:
        """تصدير نتائج الحسابات بالتنسيق المحدد."""
        if not self.results_history:
            raise ValueError("لا توجد نتائج للتصدير")
        
        if filename is None:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"spiritual_calculations_{timestamp}"
        
        if format_type.lower() == 'json':
            return self._export_to_json(filename)
        elif format_type.lower() == 'csv':
            return self._export_to_csv(filename)
        else:
            raise ValueError("نوع التصدير غير مدعوم. استخدم 'json' أو 'csv'")
    
    def _export_to_json(self, filename: str) -> str:
        """تصدير النتائج بتنسيق JSON."""
        export_data = []
        for result in self.results_history:
            export_data.append({
                'method': result.method,
                'input_data': result.input_data,
                'numerical_value': result.numerical_value,
                'reduced_value': result.reduced_value,
                'interpretation': result.interpretation,
                'detailed_breakdown': result.detailed_breakdown,
                'timestamp': result.timestamp.isoformat()
            })
        
        filename_with_ext = f"{filename}.json"
        with open(filename_with_ext, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, ensure_ascii=False, indent=2)
        
        return filename_with_ext
    
    def _export_to_csv(self, filename: str) -> str:
        """تصدير النتائج بتنسيق CSV."""
        filename_with_ext = f"{filename}.csv"
        
        with open(filename_with_ext, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # كتابة الرأس
            writer.writerow(['الطريقة', 'القيمة العددية', 'الرقم المختزل', 
                           'التفسير', 'الطابع الزمني'])
            
            # كتابة البيانات
            for result in self.results_history:
                writer.writerow([
                    result.method,
                    result.numerical_value,
                    result.reduced_value,
                    result.interpretation.replace('\n', ' | '),
                    result.timestamp.isoformat()
                ])
        
        return filename_with_ext
    
    def get_calculation_summary(self) -> Dict:
        """الحصول على ملخص جميع الحسابات المنجزة."""
        if not self.results_history:
            return {"message": "لم يتم إجراء أي حسابات بعد"}
        
        summary = {
            'total_calculations': len(self.results_history),
            'methods_used': list(set(result.method for result in self.results_history)),
            'average_numerical_value': np.mean([result.numerical_value for result in self.results_history]),
            'most_common_reduced_value': self._get_most_common_reduced_value(),
            'calculation_timespan': {
                'first_calculation': min(result.timestamp for result in self.results_history).isoformat(),
                'last_calculation': max(result.timestamp for result in self.results_history).isoformat()
            },
            'spiritual_insights': self._generate_summary_insights()
        }
        
        return summary
    
    def _get_most_common_reduced_value(self) -> int:
        """الحصول على الرقم المختزل الأكثر شيوعاً."""
        reduced_values = [result.reduced_value for result in self.results_history]
        return max(set(reduced_values), key=reduced_values.count)
    
    def _generate_summary_insights(self) -> str:
        """توليد رؤى ملخصة للحسابات."""
        if len(self.results_history) < 3:
            return "يحتاج إلى المزيد من الحسابات لتوليد رؤى شاملة"
        
        most_common = self._get_most_common_reduced_value()
        avg_value = np.mean([result.numerical_value for result in self.results_history])
        
        insights = f"""
الرقم المهيمن في حساباتك: {most_common}
متوسط القيم العددية: {avg_value:.2f}

هذا يشير إلى أن شخصيتك الروحية تميل نحو طاقة الرقم {most_common}.
الأنماط العددية في حساباتك تكشف عن اتساق في طبيعتك الروحية.
        """
        return insights.strip()


# دوال الاختبار والأمثلة
def run_comprehensive_examples():
    """تشغيل أمثلة شاملة لإظهار وظائف البرنامج."""
    print("=== برنامج الحسابات الروحانية المتقدم والدقيق ===\n")
    
    calculator = SpiritualCalculatorMain()
    
    try:
        # مثال 1: حساب الجُمّل المتقدم
        print("1. حساب الجُمّل المتقدم:")
        print("-" * 30)
        abjad_result = calculator.calculate_abjad_numerology("محمد رسول الله", CalculationMethod.KABIR)
        print(f"النص: {abjad_result.input_data['text']}")
        print(f"القيمة العددية: {abjad_result.numerical_value}")
        print(f"الرقم المختزل: {abjad_result.reduced_value}")
        
        # عرض التفاصيل الروحانية
        breakdown = abjad_result.detailed_breakdown
        print(f"الكثافة الروحانية: {breakdown['spiritual_metrics']['spiritual_intensity']}")
        print(f"التردد الذبذبي: {breakdown['spiritual_metrics']['vibrational_frequency']} هرتز")
        print(f"محاذاة الشاكرا: {breakdown['spiritual_metrics']['chakra_alignment']}")
        print()
        
        # مثال 2: تحليل الجفر الشامل
        print("2. تحليل الجفر الشامل:")
        print("-" * 30)
        birth_date = datetime.datetime(1990, 5, 15)
        jafr_result = calculator.calculate_jafr_analysis("أحمد محمد", "فاطمة علي", birth_date)
        print(f"الاسم: {jafr_result.input_data['name']}")
        print(f"اسم الأم: {jafr_result.input_data['mother_name']}")
        print(f"القيمة المركبة: {jafr_result.numerical_value}")
        
        # عرض المؤشرات الروحانية
        indicators = jafr_result.detailed_breakdown['spiritual_indicators']
        print(f"المسار الروحي: {indicators['destiny_path']}")
        print(f"الهبة الروحانية: {indicators['spiritual_gift']}")
        print(f"القوة الروحانية: {indicators['spiritual_strength']['level']}")
        print()
        
        # مثال 3: البرج الروحاني المتقدم
        print("3. البرج الروحاني المتقدم:")
        print("-" * 30)
        birth_time = datetime.time(14, 30)
        tower_result = calculator.calculate_spiritual_tower(
            birth_date, birth_time, 31.7683, 35.2137  # إحداثيات القدس
        )
        print(f"البيت الفلكي: {tower_result['spiritual_house']} - {tower_result['house_info']['name']}")
        print(f"البرج الطالع: {tower_result['zodiac_info']['name']}")
        print(f"الكوكب المهيمن: {tower_result['dominant_planet']}")
        print(f"التأثير الكوكبي: {tower_result['planetary_influence']['influence']}")
        print(f"القوة السماوية: {tower_result['celestial_strength']}")
        print()
        
        # تصدير النتائج
        print("4. تصدير النتائج:")
        print("-" * 30)
        json_file = calculator.export_results('json', 'comprehensive_analysis')
        print(f"تم تصدير النتائج إلى: {json_file}")
        
        # ملخص الحسابات
        summary = calculator.get_calculation_summary()
        print(f"\nملخص الحسابات:")
        print(f"إجمالي الحسابات: {summary['total_calculations']}")
        print(f"الرقم المهيمن: {summary['most_common_reduced_value']}")
        print(f"الرؤى الروحانية: {summary['spiritual_insights']}")
        
    except Exception as e:
        print(f"خطأ في التشغيل: {str(e)}")


if __name__ == "__main__":
    run_comprehensive_examples()