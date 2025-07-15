#!/usr/bin/env python3
"""
أمثلة الاستخدام المتقدمة للحاسبة الروحانية
==========================================

هذا الملف يوضح طرق استخدام متنوعة للحاسبة الروحانية
مع أمثلة عملية وحالات استخدام حقيقية.
"""

from spiritual_calculator import SpiritualCalculatorMain, CalculationMethod
import datetime


def demonstrate_advanced_abjad_calculations():
    """عرض حسابات الجُمّل المتقدمة."""
    print("=" * 60)
    print("تطبيقات حساب الجُمّل المتقدمة (Abjad Numerology Examples)")
    print("=" * 60)
    
    calculator = SpiritualCalculatorMain()
    
    # أمثلة متنوعة من النصوص
    test_texts = [
        "بسم الله الرحمن الرحيم",
        "لا إله إلا الله محمد رسول الله",
        "الحمد لله رب العالمين",
        "سبحان الله وبحمده سبحان الله العظيم",
        "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه",
        "محمد عبد الله ورسوله",
        "علي بن أبي طالب",
        "فاطمة الزهراء"
    ]
    
    methods = [
        (CalculationMethod.KABIR, "الكبير"),
        (CalculationMethod.SAGHIR, "الصغير"),
        (CalculationMethod.MUQATTA, "المقطع")
    ]
    
    for text in test_texts:
        print(f"\nتحليل النص: '{text}'")
        print("-" * 50)
        
        for method, method_name in methods:
            try:
                result = calculator.calculate_abjad_numerology(text, method)
                print(f"الطريقة {method_name}: {result.numerical_value} -> {result.reduced_value}")
                
                # عرض التفاصيل للطريقة الكبيرة فقط
                if method == CalculationMethod.KABIR:
                    breakdown = result.detailed_breakdown
                    print(f"  الكثافة الروحانية: {breakdown['spiritual_metrics']['spiritual_intensity']}")
                    print(f"  التردد الذبذبي: {breakdown['spiritual_metrics']['vibrational_frequency']} هرتز")
                    print(f"  الاتصال الإلهي: {breakdown['spiritual_metrics']['divine_connection']}")
                    print(f"  العنصر المرتبط: {breakdown['interpretation_details']['element']}")
                    print(f"  الكوكب الحاكم: {breakdown['interpretation_details']['planet']}")
                    
            except Exception as e:
                print(f"خطأ في حساب {method_name}: {e}")
        
        print()


def demonstrate_comprehensive_jafr_analysis():
    """عرض تحليلات الجفر الشاملة."""
    print("=" * 60)
    print("تطبيقات حسابات الجفر الشاملة (Comprehensive Jafr Analysis)")
    print("=" * 60)
    
    calculator = SpiritualCalculatorMain()
    
    # ملفات شخصية متنوعة
    profiles = [
        ("محمد أحمد", "عائشة محمد", datetime.datetime(1990, 3, 21)),
        ("علي حسن", "فاطمة علي", datetime.datetime(1985, 7, 15)),
        ("عبد الرحمن محمد", "خديجة أحمد", datetime.datetime(1978, 11, 8)),
        ("حسن علي", "زينب حسن", datetime.datetime(1995, 1, 25)),
        ("عمر عبد الله", "أم كلثوم عمر", datetime.datetime(1982, 9, 12))
    ]
    
    for name, mother_name, birth_date in profiles:
        print(f"\nتحليل الجفر الشامل لـ: {name} بن {mother_name}")
        print(f"تاريخ الميلاد: {birth_date.strftime('%Y-%m-%d')}")
        print("-" * 60)
        
        try:
            result = calculator.calculate_jafr_analysis(name, mother_name, birth_date)
            breakdown = result.detailed_breakdown
            
            print(f"القيمة المركبة: {result.numerical_value}")
            print(f"الرقم المختزل: {result.reduced_value}")
            print(f"قيمة الاسم: {breakdown['name_value']}")
            print(f"قيمة اسم الأم: {breakdown['mother_value']}")
            print(f"قيمة التاريخ: {breakdown['date_values']['total_date_value']}")
            
            # المؤشرات الروحانية
            indicators = breakdown['spiritual_indicators']
            print(f"\nالمؤشرات الروحانية:")
            print(f"  المسار الروحي: {indicators['destiny_path']}")
            print(f"  التحدي الحياتي: {indicators['life_challenge']}")
            print(f"  الهبة الروحانية: {indicators['spiritual_gift']}")
            print(f"  القوة الروحانية: {indicators['spiritual_strength']['level']}")
            print(f"  نوع القوة: {indicators['spiritual_strength']['type']}")
            
            # الطاقة الكوكبية
            planetary = indicators['planetary_energy']
            print(f"\nالطاقة الكوكبية:")
            print(f"  الكوكب: {planetary['planet']}")
            print(f"  الطاقة: {planetary['energy']}")
            print(f"  العنصر: {planetary['element']}")
            
            # الأنماط العددية
            patterns = breakdown['jafr_patterns']
            print(f"\nالأنماط العددية:")
            print(f"  الجذر الرقمي: {patterns['digital_root']}")
            print(f"  النمط السباعي: {patterns['modular_patterns']['mod_7']}")
            print(f"  النمط القرآني: {patterns['modular_patterns']['mod_19']}")
            print(f"  النمط التسعيني: {patterns['modular_patterns']['mod_99']}")
            
            # المحاذاة المقدسة
            if indicators.get('sacred_alignment'):
                print(f"\nالمحاذاة المقدسة:")
                for sacred_num, alignment in indicators['sacred_alignment'].items():
                    print(f"  الرقم {sacred_num}: {alignment}")
            
        except Exception as e:
            print(f"خطأ في تحليل الجفر: {e}")
        
        print()


def demonstrate_advanced_spiritual_tower():
    """عرض تحليلات البرج الروحاني المتقدمة."""
    print("=" * 60)
    print("تطبيقات البرج الروحاني المتقدمة (Advanced Spiritual Tower)")
    print("=" * 60)
    
    calculator = SpiritualCalculatorMain()
    
    # بيانات ولادة متنوعة مع مواقع مختلفة
    birth_data = [
        {
            'name': 'أحمد محمد',
            'birth_date': datetime.datetime(1990, 5, 15),
            'birth_time': datetime.time(14, 30),
            'location': 'مكة المكرمة',
            'coordinates': (21.4225, 39.8262)
        },
        {
            'name': 'فاطمة علي',
            'birth_date': datetime.datetime(1985, 11, 8),
            'birth_time': datetime.time(6, 45),
            'location': 'المدينة المنورة',
            'coordinates': (24.4539, 39.6034)
        },
        {
            'name': 'علي حسن',
            'birth_date': datetime.datetime(1978, 3, 21),
            'birth_time': datetime.time(18, 20),
            'location': 'القدس الشريف',
            'coordinates': (31.7683, 35.2137)
        },
        {
            'name': 'عبد الرحمن أحمد',
            'birth_date': datetime.datetime(1992, 9, 3),
            'birth_time': datetime.time(10, 15),
            'location': 'دمشق',
            'coordinates': (33.5138, 36.2765)
        },
        {
            'name': 'زينب محمد',
            'birth_date': datetime.datetime(1987, 12, 25),
            'birth_time': datetime.time(22, 10),
            'location': 'بغداد',
            'coordinates': (33.3152, 44.3661)
        }
    ]
    
    for data in birth_data:
        print(f"\nتحليل البرج الروحاني لـ: {data['name']}")
        print(f"مكان الولادة: {data['location']}")
        print(f"تاريخ الولادة: {data['birth_date'].strftime('%Y-%m-%d')}")
        print(f"وقت الولادة: {data['birth_time'].strftime('%H:%M')}")
        print("-" * 60)
        
        try:
            lat, lon = data['coordinates']
            result = calculator.calculate_spiritual_tower(
                data['birth_date'], data['birth_time'], lat, lon
            )
            
            # البيت الفلكي
            house_info = result['house_info']
            print(f"البيت الفلكي: {result['spiritual_house']} - {house_info['name']}")
            print(f"معنى البيت: {house_info['meaning']}")
            print(f"عنصر البيت: {house_info['element']}")
            
            # البرج الطالع
            zodiac_info = result['zodiac_info']
            print(f"\nالبرج الطالع: {zodiac_info['name']}")
            print(f"عنصر البرج: {zodiac_info['element']}")
            print(f"طبيعة البرج: {zodiac_info['quality']}")
            print(f"الحاكم: {zodiac_info['ruler']}")
            
            # الكوكب المهيمن
            planetary = result['planetary_influence']
            print(f"\nالكوكب المهيمن: {result['dominant_planet']}")
            print(f"التأثير: {planetary['influence']}")
            print(f"اليوم المقدس: {planetary['day']}")
            print(f"المعدن: {planetary['metal']}")
            print(f"الحجر الكريم: {planetary['stone']}")
            
            # القوى الروحانية
            print(f"\nالقوى الروحانية:")
            print(f"  الرقم الروحاني: {result['spiritual_number']}")
            print(f"  القوة السماوية: {result['celestial_strength']}")
            print(f"  العنصر المهيمن: {result['dominant_element']}")
            print(f"  درجة الطالع: {result['ascendant_degree']}°")
            
            # معلومات الولادة
            birth_info = result['birth_info']
            print(f"\nمعلومات الولادة:")
            print(f"  يوم الأسبوع: {birth_info['weekday']}")
            print(f"  يوم السنة: {result['coordinates']['day_of_year']}")
            print(f"  زاوية الساعة: {result['coordinates']['hour_angle']}°")
            
        except Exception as e:
            print(f"خطأ في حساب البرج الروحاني: {e}")
        
        print()


def demonstrate_comprehensive_spiritual_profile():
    """عرض الملف الروحاني الشامل."""
    print("=" * 60)
    print("الملف الروحاني الشامل (Comprehensive Spiritual Profile)")
    print("=" * 60)
    
    calculator = SpiritualCalculatorMain()
    
    # بيانات شخصية كاملة
    profile = {
        'name': 'محمد عبد الرحمن',
        'mother_name': 'فاطمة أحمد',
        'birth_date': datetime.datetime(1987, 7, 14),
        'birth_time': datetime.time(9, 30),
        'birth_location': 'القاهرة',
        'coordinates': (30.0444, 31.2357)
    }
    
    print(f"الملف الروحاني الشامل لـ: {profile['name']} بن {profile['mother_name']}")
    print(f"مولود في: {profile['birth_location']}")
    print(f"التاريخ: {profile['birth_date'].strftime('%Y-%m-%d')}")
    print(f"الوقت: {profile['birth_time'].strftime('%H:%M')}")
    print("=" * 60)
    
    try:
        # 1. تحليل حساب الجُمّل
        print("\n1. تحليل حساب الجُمّل:")
        print("-" * 40)
        abjad_result = calculator.calculate_abjad_numerology(profile['name'], CalculationMethod.KABIR)
        print(f"قيمة الاسم العددية: {abjad_result.numerical_value}")
        print(f"الرقم المختزل: {abjad_result.reduced_value}")
        
        abjad_breakdown = abjad_result.detailed_breakdown
        interpretation = abjad_breakdown['interpretation_details']
        print(f"المعنى الأساسي: {interpretation['meaning']}")
        print(f"الصفات: {', '.join(interpretation['traits'])}")
        print(f"العنصر: {interpretation['element']}")
        print(f"الكوكب: {interpretation['planet']}")
        
        metrics = abjad_breakdown['spiritual_metrics']
        print(f"الكثافة الروحانية: {metrics['spiritual_intensity']}")
        print(f"التردد الذبذبي: {metrics['vibrational_frequency']} هرتز")
        print(f"الاتصال الإلهي: {metrics['divine_connection']}")
        
        # 2. تحليل الجفر الشريف
        print("\n2. تحليل الجفر الشريف:")
        print("-" * 40)
        jafr_result = calculator.calculate_jafr_analysis(
            profile['name'], profile['mother_name'], profile['birth_date']
        )
        print(f"القيمة المركبة: {jafr_result.numerical_value}")
        print(f"الرقم المختزل: {jafr_result.reduced_value}")
        
        jafr_breakdown = jafr_result.detailed_breakdown
        indicators = jafr_breakdown['spiritual_indicators']
        print(f"المسار الروحي: {indicators['destiny_path']}")
        print(f"الهبة الروحانية: {indicators['spiritual_gift']}")
        print(f"التحدي الحياتي: {indicators['life_challenge']}")
        
        strength = indicators['spiritual_strength']
        print(f"القوة الروحانية: {strength['level']}")
        print(f"نوع القوة: {strength['type']}")
        print(f"النسبة المئوية: {strength['percentage']:.1f}%")
        
        # 3. تحليل البرج الروحاني
        print("\n3. تحليل البرج الروحاني:")
        print("-" * 40)
        lat, lon = profile['coordinates']
        tower_result = calculator.calculate_spiritual_tower(
            profile['birth_date'], profile['birth_time'], lat, lon
        )
        
        house_info = tower_result['house_info']
        zodiac_info = tower_result['zodiac_info']
        planetary = tower_result['planetary_influence']
        
        print(f"البيت الفلكي: {tower_result['spiritual_house']} - {house_info['name']}")
        print(f"البرج الطالع: {zodiac_info['name']} ({zodiac_info['element']})")
        print(f"الكوكب المهيمن: {tower_result['dominant_planet']}")
        print(f"التأثير الكوكبي: {planetary['influence']}")
        print(f"الرقم الروحاني: {tower_result['spiritual_number']}")
        print(f"القوة السماوية: {tower_result['celestial_strength']}")
        
        # 4. التحليل المركب والتوصيات
        print("\n4. التحليل المركب والتوصيات:")
        print("-" * 40)
        
        # حساب الرقم المركب
        combined_number = (abjad_result.reduced_value + jafr_result.reduced_value + 
                          tower_result['spiritual_number']) % 9 + 1
        
        # التفسيرات المركبة
        combined_interpretations = {
            1: "شخصية قيادية مبدعة مع طاقة روحانية عالية واتصال قوي بالعوالم العلوية",
            2: "شخصية متوازنة تميل للتعاون والدبلوماسية مع حدس قوي وحساسية روحانية",
            3: "شخصية فنية مبدعة مع قدرات تواصلية قوية وطاقة إبداعية متدفقة",
            4: "شخصية عملية منظمة مع استقرار روحاني وقدرة على البناء والتأسيس",
            5: "شخصية حرة مغامرة مع طاقة تغيير إيجابية وقدرة على التكيف والتطور",
            6: "شخصية خدومة محبة مع مسؤولية روحانية وقدرة على الشفاء والعطاء",
            7: "شخصية روحانية حكيمة مع بصيرة عميقة واتصال قوي بالعوالم الخفية",
            8: "شخصية قوية ناجحة مع قدرات قيادية مادية وطاقة إنجاز عالية",
            9: "شخصية إنسانية عطوفة مع رسالة روحانية عالية وقدرة على التأثير الإيجابي"
        }
        
        print(f"الرقم المركب: {combined_number}")
        print(f"التفسير المركب: {combined_interpretations[combined_number]}")
        
        # التوصيات الروحانية
        print(f"\nالتوصيات الروحانية:")
        
        if abjad_result.reduced_value in [1, 8]:
            print("• ركز على تطوير القيادة الروحانية والتأثير الإيجابي")
        if jafr_result.reduced_value in [7, 9]:
            print("• اهتم بالممارسات التأملية والروحانية العميقة")
        if tower_result['spiritual_number'] in [3, 6]:
            print("• استثمر في الأنشطة الإبداعية والخدمية")
        
        print("• احرص على التوازن بين الجوانب المادية والروحانية")
        print("• استخدم الأرقام المحظوظة في القرارات المهمة")
        print("• تأمل في معاني الأرقام الشخصية لفهم رسالتك الحياتية")
        
        # الأرقام المحظوظة
        lucky_numbers = [abjad_result.reduced_value, jafr_result.reduced_value, 
                        tower_result['spiritual_number'], combined_number]
        print(f"• أرقامك المحظوظة: {', '.join(map(str, set(lucky_numbers)))}")
        
        # الأوقات المناسبة
        planetary_day = planetary['day']
        print(f"• يومك المقدس: {planetary_day}")
        print(f"• معدنك المقدس: {planetary['metal']}")
        print(f"• حجرك الكريم: {planetary['stone']}")
        
        # 5. تصدير التقرير الشامل
        print("\n5. تصدير التقرير:")
        print("-" * 40)
        export_filename = f"comprehensive_analysis_{profile['name'].replace(' ', '_')}"
        json_file = calculator.export_results('json', export_filename)
        print(f"تم حفظ التقرير الشامل في: {json_file}")
        
    except Exception as e:
        print(f"خطأ في التحليل الشامل: {e}")


def demonstrate_batch_processing():
    """عرض المعالجة المجمعة للأسماء."""
    print("=" * 60)
    print("المعالجة المجمعة للأسماء (Batch Processing)")
    print("=" * 60)
    
    calculator = SpiritualCalculatorMain()
    
    # قائمة أسماء متنوعة
    names_list = [
        "محمد", "أحمد", "علي", "حسن", "حسين", "عبد الله", "عبد الرحمن",
        "فاطمة", "عائشة", "خديجة", "زينب", "مريم", "أم كلثوم", "رقية",
        "عمر", "عثمان", "أبو بكر", "خالد", "سعد", "طلحة", "الزبير"
    ]
    
    print("معالجة قائمة الأسماء بطريقة الجُمّل الكبير:")
    print("-" * 60)
    
    results_summary = []
    
    for name in names_list:
        try:
            result = calculator.calculate_abjad_numerology(name, CalculationMethod.KABIR)
            breakdown = result.detailed_breakdown
            
            results_summary.append({
                'name': name,
                'value': result.numerical_value,
                'reduced': result.reduced_value,
                'element': breakdown['interpretation_details']['element'],
                'planet': breakdown['interpretation_details']['planet'],
                'intensity': breakdown['spiritual_metrics']['spiritual_intensity']
            })
            
            print(f"{name:15} -> {result.numerical_value:4d} -> {result.reduced_value} ({breakdown['interpretation_details']['element']})")
            
        except Exception as e:
            print(f"{name:15} -> خطأ: {e}")
    
    # التحليل الإحصائي
    print(f"\nالتحليل الإحصائي:")
    print("-" * 40)
    
    if results_summary:
        values = [r['value'] for r in results_summary]
        reduced_values = [r['reduced'] for r in results_summary]
        
        print(f"عدد الأسماء المعالجة: {len(results_summary)}")
        print(f"متوسط القيم: {sum(values) / len(values):.2f}")
        print(f"أعلى قيمة: {max(values)} ({[r['name'] for r in results_summary if r['value'] == max(values)][0]})")
        print(f"أقل قيمة: {min(values)} ({[r['name'] for r in results_summary if r['value'] == min(values)][0]})")
        
        # الأرقام المختزلة الأكثر شيوعاً
        from collections import Counter
        reduced_counter = Counter(reduced_values)
        most_common = reduced_counter.most_common(3)
        
        print(f"\nالأرقام المختزلة الأكثر شيوعاً:")
        for value, count in most_common:
            print(f"  الرقم {value}: {count} مرات")
        
        # توزيع العناصر
        elements = [r['element'] for r in results_summary]
        element_counter = Counter(elements)
        print(f"\nتوزيع العناصر:")
        for element, count in element_counter.items():
            print(f"  {element}: {count} أسماء")
        
        # توزيع الكواكب
        planets = [r['planet'] for r in results_summary]
        planet_counter = Counter(planets)
        print(f"\nتوزيع الكواكب الحاكمة:")
        for planet, count in planet_counter.items():
            print(f"  {planet}: {count} أسماء")


def demonstrate_validation_and_error_handling():
    """عرض التحقق من صحة البيانات ومعالجة الأخطاء."""
    print("=" * 60)
    print("التحقق من صحة البيانات ومعالجة الأخطاء")
    print("=" * 60)
    
    calculator = SpiritualCalculatorMain()
    
    # اختبار حالات الخطأ المختلفة
    error_tests = [
        {
            'description': 'نص غير عربي في حساب الجُمّل',
            'function': lambda: calculator.calculate_abjad_numerology("English123", CalculationMethod.KABIR),
            'expected_error': 'النص يجب أن يحتوي على أحرف عربية فقط'
        },
        {
            'description': 'نص فارغ في حساب الجُمّل',
            'function': lambda: calculator.calculate_abjad_numerology("", CalculationMethod.KABIR),
            'expected_error': 'نص فارغ'
        },
        {
            'description': 'اسم غير عربي في الجفر',
            'function': lambda: calculator.calculate_jafr_analysis("Ahmed", "فاطمة", datetime.datetime(1990, 1, 1)),
            'expected_error': 'أسماء غير عربية'
        },
        {
            'description': 'إحداثيات غير صحيحة في البرج الروحاني',
            'function': lambda: calculator.calculate_spiritual_tower(
                datetime.datetime(1990, 1, 1), datetime.time(12, 0), 200, 200
            ),
            'expected_error': 'إحداثيات غير صحيحة'
        },
        {
            'description': 'تاريخ غير صحيح',
            'function': lambda: calculator.calculate_jafr_analysis(
                "أحمد", "فاطمة", datetime.datetime(1800, 1, 1)
            ),
            'expected_error': 'تاريخ قديم جداً'
        }
    ]
    
    for test in error_tests:
        print(f"\nاختبار: {test['description']}")
        print("-" * 40)
        
        try:
            result = test['function']()
            print(f"⚠️  لم يحدث خطأ متوقع! النتيجة: {result}")
            
        except ValueError as e:
            print(f"✅ تم التعامل مع الخطأ بنجاح: {e}")
            
        except Exception as e:
            print(f"❌ خطأ غير متوقع: {type(e).__name__}: {e}")
    
    # اختبار النصوص العربية الصحيحة
    print(f"\nاختبار النصوص العربية الصحيحة:")
    print("-" * 40)
    
    valid_texts = [
        "محمد",
        "بسم الله",
        "الحمد لله",
        "سبحان الله",
        "أستغفر الله"
    ]
    
    for text in valid_texts:
        try:
            result = calculator.calculate_abjad_numerology(text, CalculationMethod.KABIR)
            print(f"✅ '{text}': {result.numerical_value} -> {result.reduced_value}")
        except Exception as e:
            print(f"❌ '{text}': خطأ - {e}")


def main():
    """الدالة الرئيسية لتشغيل جميع الأمثلة."""
    print("برنامج الحسابات الروحانية المتقدم والدقيق - أمثلة الاستخدام")
    print("Advanced & Accurate Spiritual Calculations - Usage Examples")
    print("=" * 80)
    
    # تشغيل جميع الأمثلة
    demonstrations = [
        demonstrate_advanced_abjad_calculations,
        demonstrate_comprehensive_jafr_analysis,
        demonstrate_advanced_spiritual_tower,
        demonstrate_comprehensive_spiritual_profile,
        demonstrate_batch_processing,
        demonstrate_validation_and_error_handling
    ]
    
    for demo in demonstrations:
        try:
            demo()
            print("\n" + "=" * 80 + "\n")
            
        except Exception as e:
            print(f"خطأ في تشغيل المثال: {e}")
            print("\n" + "=" * 80 + "\n")
    
    print("انتهت جميع الأمثلة بنجاح!")
    print("All examples completed successfully!")
    print("\nملاحظة: هذه الحسابات للاسترشاد والتأمل، والله أعلم بالغيب.")


if __name__ == "__main__":
    main()